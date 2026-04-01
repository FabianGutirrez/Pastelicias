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
    const [isDatabaseEmpty, setIsDatabaseEmpty] = useState(false);

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
            fetchData(); 
        } catch (error: any) {
            console.error('Error:', error);
            showToast(`Error: ${error.message}`, 'error');
        }
    };

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
                setIsDatabaseEmpty(true);
            }

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

            const { data: zonesData, error: zonesError } = await supabase
                .from('delivery_zones')
                .select('*')
                .order('price', { ascending: true });
            
            if (zonesError) throw zonesError;
            if (zonesData && zonesData.length > 0) setDeliveryZones(zonesData);

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
        localStorage.setItem('pastelicia_cart', JSON.stringify(cartItems));
        localStorage.setItem('pastelicia_analytics', JSON.stringify(analyticsData));
    }, [cartItems, analyticsData]);

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
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        try {
            const { created_at, ...updateData }: any = updatedProduct;
            const { error } = await supabase.from('products').upsert(updateData, { onConflict: 'id' });
            if (error) throw error;
            showToast('Cambios guardados', 'success');
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
            fetchData();
        }
    };

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

    const renderPage = () => {
        if (isLoadingData) return <div className="h-screen flex items-center justify-center text-white">Cargando...</div>;
        switch (page) {
            case '#catalog': return <CatalogPage products={products} onCustomizeClick={setSelectedProduct} />;
            case '#admin': return (
                <AdminPage 
                    products={products}
                    customizationOptions={customizationOptions}
                    deliveryZones={deliveryZones}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={async (id) => {
                         const { error } = await supabase.from('products').delete().eq('id', id);
                         if (!error) setProducts(prev => prev.filter(p => p.id !== id));
                    }}
                    onAddProduct={async (p) => {
                        const newId = products.length > 0 ? Math.max(...products.map(pr => pr.id)) + 1 : 1;
                        const newP = { ...p, id: newId };
                        const { error } = await supabase.from('products').insert([newP]);
                        if (!error) setProducts(prev => [...prev, newP]);
                    }}
                    onUpdateCustomizationOptions={async (o) => {
                        await supabase.from('customizations').upsert({ id: 1, ...o });
                        setCustomizationOptions(o);
                    }}
                    onUpdateDeliveryZones={async (z) => {
                        await supabase.from('delivery_zones').upsert(z);
                        setDeliveryZones(z);
                    }}
                    analyticsData={analyticsData}
                    currentUserRole={currentUserRole}
                    siteLogo={siteLogo}
                    onUpdateLogo={async (l) => {
                        await supabase.from('configuracion').upsert({ id: 1, logo_url: l });
                        setSiteLogo(l);
                    }}
                />
            );
            case '#confirmation': return <ConfirmationPage orderDetails={confirmedOrder} />;
            case '#contact': return <ContactPage />;
            case '#login': return <LoginScreen onLogin={() => window.location.hash = '#admin'} />;
            default: return <HomePage products={products.filter(p => p.isFeatured)} onCustomizeClick={setSelectedProduct} />;
        }
    };

    return (
        <div className="bg-cream min-h-screen text-cocoa-brown flex flex-col">
            {isDatabaseEmpty && currentUserRole !== 'customer' && (
                <div className="bg-rose-gold text-white p-2 text-center text-sm font-bold animate-pulse z-50">
                    Base de datos vacía. 
                    <button onClick={syncConstantsToSupabase} className="ml-3 underline bg-white/20 px-2 py-1 rounded">
                        Subir productos ahora
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
            
            <footer className="bg-[#1a1412] pt-20 pb-10 text-cream border-t border-rose-gold/10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                            <div className="flex flex-col items-center md:items-start gap-4">
                                <div className="w-20 h-20 bg-cream/10 backdrop-blur-md rounded-3xl p-3 border border-cream/20 shadow-2xl">
                                    <img src={siteLogo} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-rose-gold tracking-tight">Pastelicia</h3>
                                    <p className="text-[10px] font-bold text-cream/30 uppercase tracking-[0.3em] mt-1 italic">Excelencia en Alta Repostería</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-cream/70 leading-relaxed max-w-sm text-sm">
                                    En <span className="text-rose-gold font-bold">Pastelicia</span>, transformamos ingredientes premium en obras de arte comestibles.
                                </p>
                            </div>
                        </div>
                        <div className="text-center">
                            <h4 className="text-lg font-bold font-serif text-rose-gold mb-6">Navegación</h4>
                            <nav className="flex flex-col space-y-4 text-cream/80">
                                <a href="#" className="hover:text-rose-gold transition-colors text-sm">Inicio</a>
                                <a href="#catalog" className="hover:text-rose-gold transition-colors text-sm">Catálogo</a>
                                <a href="#contact" className="hover:text-rose-gold transition-colors text-sm">Contacto</a>
                            </nav>
                        </div>
                        <div className="text-center md:text-right">
                             <h4 className="text-lg font-bold font-serif text-rose-gold mb-6">Conecta con nosotros</h4>
                             <div className="flex justify-center md:justify-end space-x-6">
                                 <a href="#" className="w-12 h-12 bg-cream/5 rounded-2xl flex items-center justify-center hover:bg-rose-gold transition-all border border-cream/10"><InstagramIcon /></a>
                                 <a href="#" className="w-12 h-12 bg-cream/5 rounded-2xl flex items-center justify-center hover:bg-rose-gold transition-all border border-cream/10"><FacebookIcon /></a>
                                 <a href="#" className="w-12 h-12 bg-cream/5 rounded-2xl flex items-center justify-center hover:bg-rose-gold transition-all border border-cream/10"><WhatsappIcon /></a>
                             </div>
                        </div>
                    </div>
                    <div className="mt-20 pt-8 border-t border-cream/5 text-center text-cream/20 text-[10px] tracking-[0.2em] uppercase font-bold">
                         <p>&copy; {new Date().getFullYear()} Pastelicia. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>

            {selectedProduct && (
                <ProductModal 
                    product={selectedProduct} 
                    allProducts={products}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={(p, t, c, s) => {
                        const newItem: CartItem = { id: `${p.id}-${Date.now()}`, product: p, selectedTier: t, customizations: c, selectedSubProducts: s };
                        setCartItems(prev => [...prev, newItem]);
                        setSelectedProduct(null);
                        showToast(`¡${p.name} añadido!`);
                    }}
                    customizationOptions={customizationOptions}
                />
            )}
            <CartSidebar 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
                cartItems={cartItems} 
                deliveryZones={deliveryZones}
                onRemoveItem={(id) => setCartItems(prev => prev.filter(i => i.id !== id))}
                onConfirmOrder={(order) => { setConfirmedOrder(order); setCartItems([]); setIsCartOpen(false); window.location.hash = '#confirmation'; }}
                cartItemCount={cartItems.length}
            />
            <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} />
        </div>
    );
};

export default App;