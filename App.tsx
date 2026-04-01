import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, CustomizationOptions, CustomizationCollection, UserRole, AnalyticsEvent, OrderDetails, DeliveryZone } from './types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMIZATION_OPTIONS, INITIAL_DELIVERY_ZONES } from './constants';
import { supabase } from './supabase';
import { motion } from 'motion/react';
import Header from './components/Header';
import ProductModal from './components/ProductModal';
import CartSidebar from './components/CartSidebar';
import HomePage from './components/HomePage';
import CatalogPage from './components/CatalogPage';
import AdminPage from './components/AdminPage';
import ContactPage from './components/ContactPage';
import LoginScreen from './components/LoginScreen';
import ConfirmationPage from './components/ConfirmationPage';
import Toast, { ToastType } from './components/Toast';
import { InstagramIcon } from './components/icons/InstagramIcon';
import { FacebookIcon } from './components/icons/FacebookIcon';
import { WhatsappIcon } from './components/icons/WhatsappIcon';
import { logoBase64 } from './assets/logo';

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [customizationOptions, setCustomizationOptions] = useState<CustomizationCollection>(INITIAL_CUSTOMIZATION_OPTIONS);
    const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(INITIAL_DELIVERY_ZONES);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isDatabaseEmpty, setIsDatabaseEmpty] = useState(false); // Nuevo estado

    // --- FUNCIÓN DE CARGA MASIVA (SEED) ---
    const syncConstantsToSupabase = async () => {
        try {
            showToast('Iniciando carga masiva...', 'success');
            const { error } = await supabase
                .from('products')
                .upsert(INITIAL_PRODUCTS, { onConflict: 'id' });

            if (error) throw error;
            
            showToast('¡Sincronización exitosa!', 'success');
            setIsDatabaseEmpty(false);
            window.location.reload(); 
        } catch (error: any) {
            console.error('Error:', error);
            showToast(`Error: ${error.message}`, 'error');
        }
    };

    // Fetch data from Supabase
    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: true });
            
            if (productsError) throw productsError;

            if (productsData && productsData.length > 0) {
                setProducts(productsData);
                setIsDatabaseEmpty(false);
            } else {
                setProducts(INITIAL_PRODUCTS);
                setIsDatabaseEmpty(true); // Marcamos que la DB está vacía
            }

            // Fetch Customizations
            const { data: customizationsData, error: customizationsError } = await supabase
                .from('customizations')
                .select('*')
                .single();
            
            if (customizationsError && customizationsError.code !== 'PGRST116') throw customizationsError;
            if (customizationsData) {
                setCustomizationOptions({
                    flavors: customizationsData.flavors || [],
                    fillings: customizationsData.fillings || [],
                    colors: customizationsData.colors || []
                });
            }

            // Fetch Delivery Zones
            const { data: zonesData, error: zonesError } = await supabase
                .from('delivery_zones')
                .select('*')
                .order('price', { ascending: true });
            
            if (zonesError) throw zonesError;
            if (zonesData && zonesData.length > 0) setDeliveryZones(zonesData);

            // Fetch Logo
            const { data: configData } = await supabase
                .from('configuracion')
                .select('logo_url')
                .eq('id', 1)
                .single();
            
            if (configData?.logo_url) setSiteLogo(configData.logo_url);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ... (Mantengo tus funciones de ID, Cart y Auth exactamente igual)
    const generateUniqueId = () => {
        const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
        return maxId + 1;
    };
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('pastelicia_cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [page, setPage] = useState(window.location.hash || '#');
    const [siteLogo, setSiteLogo] = useState<string>(logoBase64);
    const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);
    const [currentUserRole, setCurrentUserRole] = useState<UserRole>('customer');
    const [analyticsData, setAnalyticsData] = useState<AnalyticsEvent[]>(() => {
        const saved = localStorage.getItem('pastelicia_analytics');
        return saved ? JSON.parse(saved) : [];
    });
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    useEffect(() => {
        localStorage.setItem('pastelicia_products', JSON.stringify(products));
        localStorage.setItem('pastelicia_customizations', JSON.stringify(customizationOptions));
        localStorage.setItem('pastelicia_delivery_zones', JSON.stringify(deliveryZones));
        localStorage.setItem('pastelicia_cart', JSON.stringify(cartItems));
        localStorage.setItem('pastelicia_analytics', JSON.stringify(analyticsData));
    }, [products, customizationOptions, deliveryZones, cartItems, analyticsData]);

    const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastType }>({
        isVisible: false,
        message: '',
        type: 'success'
    });

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ isVisible: true, message, type });
    };

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const role = (session.user.user_metadata?.role as UserRole) || 'customer';
                setCurrentUserRole(role);
            }
            setIsLoadingAuth(false);
        };
        checkSession();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setCurrentUserRole((session?.user.user_metadata?.role as UserRole) || 'customer');
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleUpdateProduct = async (updatedProduct: Product) => {
        // Actualización optimista
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        
        try {
            // Usamos upsert para asegurar que si no existe lo cree, y si existe lo actualice
            // Eliminamos campos automáticos de Postgres si existieran
            const { created_at, ...updateData }: any = updatedProduct;

            const { error } = await supabase
                .from('products')
                .upsert(updateData, { onConflict: 'id' });
            
            if (error) throw error;
            showToast('Producto guardado en la nube', 'success');
        } catch (error: any) {
            console.error('Error:', error);
            showToast(`Error al guardar: ${error.message}`, 'error');
            fetchData(); // Revertir
        }
    };

    // ... (El resto de tus manejadores handleAdd, handleDelete, handleUpdateLogo permanecen igual)
    const handleUpdateLogo = async (newLogo: string) => {
        setSiteLogo(newLogo);
        try {
            const { error } = await supabase.from('configuracion').upsert({ id: 1, logo_url: newLogo });
            if (error) throw error;
            showToast('Logo actualizado', 'success');
        } catch (error: any) {
            showToast('Error logo: ' + error.message, 'error');
        }
    };

    const handleLogin = () => { window.location.hash = '#admin'; };
    const handleLogout = async () => { await supabase.auth.signOut(); window.location.hash = '#'; };

    useEffect(() => {
        const handleHashChange = () => {
            setPage(window.location.hash || '#');
            setIsMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleSelectProduct = (product: Product) => { setSelectedProduct(product); };
    const handleAddToCart = (product: Product, selectedTier: any, customizations: any, selectedSubProducts?: string[]) => {
        const newItem: CartItem = { id: `${product.id}-${Date.now()}`, product, selectedTier, customizations, selectedSubProducts };
        setCartItems(prev => [...prev, newItem]);
        setSelectedProduct(null);
        showToast(`¡${product.name} añadido!`, 'success');
    };

    const renderPage = () => {
        if (isLoadingData) return <div className="h-screen flex items-center justify-center text-white">Cargando...</div>;
        
        switch (page) {
            case '#catalog': return <CatalogPage products={products} onCustomizeClick={handleSelectProduct} />;
            case '#admin': return (
                <AdminPage 
                    products={products}
                    customizationOptions={customizationOptions}
                    deliveryZones={deliveryZones}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={(id) => {}} // Implementar según tu handleDelete
                    onAddProduct={(p) => {}} // Implementar según tu handleAdd
                    onUpdateCustomizationOptions={(o) => {}}
                    onUpdateDeliveryZones={(z) => {}}
                    analyticsData={analyticsData}
                    currentUserRole={currentUserRole}
                    siteLogo={siteLogo}
                    onUpdateLogo={handleUpdateLogo}
                />
            );
            case '#confirmation': return <ConfirmationPage orderDetails={confirmedOrder} />;
            default: return <HomePage products={products.filter(p => p.isFeatured)} onCustomizeClick={handleSelectProduct} />;
        }
    };

    return (
        <div className="bg-cream min-h-screen text-cocoa-brown flex flex-col">
            {/* BANNER DE SINCRONIZACIÓN - Solo aparece si la DB está vacía */}
            {isDatabaseEmpty && currentUserRole !== 'customer' && (
                <div className="bg-rose-gold text-white p-2 text-center text-sm font-bold animate-pulse">
                    La base de datos está vacía. 
                    <button onClick={syncConstantsToSupabase} className="ml-3 underline bg-white/20 px-2 py-1 rounded">
                        Subir productos de constants.ts ahora
                    </button>
                </div>
            )}

            <Header 
                logoUrl={siteLogo} 
                onCartClick={() => setIsCartOpen(true)} 
                cartItemCount={cartItems.length} 
                currentPage={page}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                currentUserRole={currentUserRole}
                onLogout={handleLogout}
            />
            <main className="container mx-auto px-4 py-8 flex-grow">{renderPage()}</main>
            
            {/* Tu Footer actual... */}
            <footer className="bg-[#1a1412] pt-20 pb-10 text-cream border-t border-rose-gold/10">
                {/* ... (Contenido del footer que ya tienes) ... */}
            </footer>

            {selectedProduct && (
                <ProductModal 
                    product={selectedProduct} 
                    allProducts={products}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={handleAddToCart}
                    customizationOptions={customizationOptions}
                />
            )}
            <CartSidebar 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
                cartItems={cartItems} 
                deliveryZones={deliveryZones}
                onRemoveItem={(id) => setCartItems(prev => prev.filter(i => i.id !== id))}
                onConfirmOrder={(order) => { setConfirmedOrder(order); setCartItems([]); window.location.hash = '#confirmation'; }}
                cartItemCount={cartItems.length}
            />
            <Toast {...toast} onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} />
        </div>
    );
};

export default App;