import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, CustomizationOptions, CustomizationCollection, UserRole, AnalyticsEvent, OrderDetails } from './types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMIZATION_OPTIONS } from './constants';
import { supabase } from './supabase';
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

// Generador de IDs para la sesión
let lastId = INITIAL_PRODUCTS.reduce((max, p) => Math.max(max, p.id), 0);
const generateUniqueId = () => ++lastId;

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [customizationOptions, setCustomizationOptions] = useState<CustomizationCollection>(INITIAL_CUSTOMIZATION_OPTIONS);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [page, setPage] = useState(window.location.hash || '#');
    const [siteLogo, setSiteLogo] = useState<string>(logoBase64);
    const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);
    
    const [currentUserRole, setCurrentUserRole] = useState<UserRole>('customer');
    const [analyticsData, setAnalyticsData] = useState<AnalyticsEvent[]>([]);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastType }>({
        isVisible: false,
        message: '',
        type: 'success'
    });

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ isVisible: true, message, type });
    };

    // EFECTO PRINCIPAL: Carga de Sesión y Configuración Global
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // 1. Verificar Sesión de Usuario
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const role = (session.user.user_metadata?.role as UserRole) || 'customer';
                    setCurrentUserRole(role);
                } else {
                    setCurrentUserRole('customer');
                }

                // 2. Cargar Logo desde Tabla Pública (Persistencia Real)
                const { data: configData, error: configError } = await supabase
                    .from('configuracion')
                    .select('logo_url')
                    .eq('id', 1)
                    .single();

                if (configData?.logo_url) {
                    setSiteLogo(configData.logo_url);
                } else if (configError) {
                    console.warn("No se encontró registro en 'configuracion', usando logo por defecto.");
                }
            } catch (err) {
                console.error("Error en la carga inicial:", err);
            } finally {
                setIsLoadingAuth(false);
            }
        };

        loadInitialData();

        // Escuchar cambios en la autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const role = (session.user.user_metadata?.role as UserRole) || 'customer';
                setCurrentUserRole(role);
            } else {
                setCurrentUserRole('customer');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // FUNCIÓN CORREGIDA: Actualizar Logo en toda la plataforma
    const handleUpdateLogo = async (newLogoUrl: string) => {
        // Actualización visual inmediata
        setSiteLogo(newLogoUrl);
        
        try {
            // Guardar en la tabla pública para que todos lo vean
            const { error } = await supabase
                .from('configuracion')
                .update({ logo_url: newLogoUrl })
                .eq('id', 1);

            if (error) throw error;
            showToast('Logo actualizado globalmente', 'success');
        } catch (error: any) {
            console.error("Error al persistir logo:", error.message);
            showToast('Error al guardar en la base de datos', 'error');
        }
    };

    const handleLogin = (_role: UserRole) => {
        window.location.hash = '#admin'; 
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setCurrentUserRole('customer');
        window.location.hash = '#'; 
    };

    const logAnalyticsEvent = (event: Omit<AnalyticsEvent, 'timestamp'>) => {
        setAnalyticsData(prev => [...prev, { ...event, timestamp: new Date() }]);
    };

    useEffect(() => {
        const handleHashChange = () => {
            setPage(window.location.hash || '#');
            setIsMenuOpen(false);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        const body = document.body;
        if (isCartOpen || selectedProduct || isMenuOpen) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }
        return () => { body.style.overflow = 'auto'; };
    }, [isCartOpen, selectedProduct, isMenuOpen]);

    const handleSelectProduct = (product: Product) => {
        logAnalyticsEvent({ type: 'view', productId: product.id });
        setSelectedProduct(product);
    };

    const handleCloseModal = () => setSelectedProduct(null);
    const handleToggleCart = () => setIsCartOpen(prev => !prev);

    const handleAddToCart = (product: Product, selectedTier: { quantity: number; price: number; label: string; }, customizations: CustomizationOptions, selectedSubProducts?: string[]) => {
        const newItem: CartItem = {
            id: `${product.id}-${selectedTier.quantity}-${Date.now()}`,
            product, 
            selectedTier, 
            customizations,
            selectedSubProducts
        };
        logAnalyticsEvent({ type: 'addToCart', productId: product.id });
        setCartItems(prevItems => [...prevItems, newItem]);
        setSelectedProduct(null);
        showToast(`¡${product.name} añadido al carrito!`, 'success');
    };
    
    const handleRemoveFromCart = (itemId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const handleConfirmOrder = (orderDetails: OrderDetails) => {
        logAnalyticsEvent({ type: 'order', items: orderDetails.items, total: orderDetails.total });
        setConfirmedOrder(orderDetails);
        setCartItems([]);
        setIsCartOpen(false);
        window.location.hash = '#confirmation';
    };

    const cartItemCount = useMemo(() => {
      return cartItems.reduce((total, item) => total + item.selectedTier.quantity, 0);
    }, [cartItems]);
    
    const featuredProducts = useMemo(() => products.filter(p => p.isFeatured), [products]);

    const handleAddProduct = (product: Omit<Product, 'id'>) => {
        setProducts(prev => [...prev, { ...product, id: generateUniqueId() }]);
    };
    const handleUpdateProduct = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };
    const handleDeleteProduct = (productId: number) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    };
    const handleUpdateCustomizationOptions = (newOptions: CustomizationCollection) => {
        setCustomizationOptions(newOptions);
    };

    const renderPage = () => {
        if (page === '#admin' && currentUserRole === 'customer') {
            window.location.hash = '#login';
            return <LoginScreen onLogin={handleLogin} />;
        }
        
        switch (page) {
            case '#login': return <LoginScreen onLogin={handleLogin} />;
            case '#catalog': return <CatalogPage products={products} onCustomizeClick={handleSelectProduct} />;
            case '#contact': return <ContactPage />;
            case '#confirmation': return <ConfirmationPage orderDetails={confirmedOrder} />;
            case '#admin':
                return <AdminPage 
                            products={products}
                            customizationOptions={customizationOptions}
                            onAddProduct={handleAddProduct}
                            onUpdateProduct={handleUpdateProduct}
                            onDeleteProduct={handleDeleteProduct}
                            onUpdateCustomizationOptions={handleUpdateCustomizationOptions}
                            analyticsData={analyticsData}
                            currentUserRole={currentUserRole}
                            siteLogo={siteLogo}
                            onUpdateLogo={handleUpdateLogo}
                       />;
            case '#':
            case '#/':
            default:
                return <HomePage products={featuredProducts} onCustomizeClick={handleSelectProduct} />;
        }
    };

    if (isLoadingAuth) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-gold"></div>
            </div>
        );
    }

    return (
        <div className="bg-cream min-h-screen text-cocoa-brown flex flex-col">
            <Header 
                logoUrl={siteLogo}
                onCartClick={handleToggleCart} 
                cartItemCount={cartItemCount} 
                currentPage={page}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                currentUserRole={currentUserRole}
                onLogout={handleLogout}
            />
            <main className="container mx-auto px-4 py-8 flex-grow">
                {renderPage()}
            </main>
            <footer className="bg-blush-pink mt-16">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <img src={siteLogo} alt="Pastelicias Logo" className="h-20 w-auto mb-4" />
                            <p className="text-cocoa-brown/80">Repostería de diseño para tus momentos más especiales.</p>
                        </div>
                        <div className="text-center">
                            <h4 className="font-bold font-serif text-cocoa-brown mb-3">Navegación</h4>
                            <nav className="flex flex-col space-y-2 text-cocoa-brown/90">
                                <a href="#" className="hover:underline">Inicio</a>
                                <a href="#catalog" className="hover:underline">Catálogo</a>
                                <a href="#contact" className="hover:underline">Contacto</a>
                            </nav>
                        </div>
                        <div className="text-center md:text-right">
                             <h4 className="font-bold font-serif text-cocoa-brown mb-3">Síguenos</h4>
                             <div className="flex justify-center md:justify-end space-x-4">
                                 <a href="#" className="text-cocoa-brown hover:text-muted-mauve transition-colors"><InstagramIcon /></a>
                                 <a href="#" className="text-cocoa-brown hover:text-muted-mauve transition-colors"><FacebookIcon /></a>
                                 <a href="#" className="text-cocoa-brown hover:text-muted-mauve transition-colors"><WhatsappIcon /></a>
                             </div>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-rose-gold/50 text-center text-cocoa-brown/70 text-sm">
                         <p>&copy; 2026 Pastelicias. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
            {selectedProduct && (
                <ProductModal 
                    product={selectedProduct} 
                    allProducts={products}
                    onClose={handleCloseModal}
                    onAddToCart={handleAddToCart}
                    customizationOptions={customizationOptions}
                />
            )}
            <CartSidebar 
                isOpen={isCartOpen}
                onClose={handleToggleCart}
                cartItems={cartItems}
                onRemoveItem={handleRemoveFromCart}
                onConfirmOrder={handleConfirmOrder}
                cartItemCount={cartItemCount}
            />
            <Toast 
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
};

export default App;