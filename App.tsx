
import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, CustomizationOptions, CustomizationCollection, UserRole, AnalyticsEvent, OrderDetails, DeliveryZone } from './types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMIZATION_OPTIONS, INITIAL_DELIVERY_ZONES } from './constants';
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

// Simple ID generator to ensure uniqueness during the session
let lastId = INITIAL_PRODUCTS.reduce((max, p) => Math.max(max, p.id), 0);
const generateUniqueId = () => ++lastId;

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem('pastelicias_products');
        return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    });
    const [customizationOptions, setCustomizationOptions] = useState<CustomizationCollection>(() => {
        const saved = localStorage.getItem('pastelicias_customizations');
        return saved ? JSON.parse(saved) : INITIAL_CUSTOMIZATION_OPTIONS;
    });
    const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => {
        const saved = localStorage.getItem('pastelicias_delivery_zones');
        return saved ? JSON.parse(saved) : INITIAL_DELIVERY_ZONES;
    });
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('pastelicias_cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [page, setPage] = useState(window.location.hash || '#');
    const [siteLogo, setSiteLogo] = useState<string>(() => {
        const saved = localStorage.getItem('pastelicias_logo');
        return saved || logoBase64;
    });
    const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);
    
    // Default role is 'customer'. Login is only for admin roles.
    const [currentUserRole, setCurrentUserRole] = useState<UserRole>('customer');
    const [analyticsData, setAnalyticsData] = useState<AnalyticsEvent[]>(() => {
        const saved = localStorage.getItem('pastelicias_analytics');
        return saved ? JSON.parse(saved) : [];
    });
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('pastelicias_products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('pastelicias_customizations', JSON.stringify(customizationOptions));
    }, [customizationOptions]);

    useEffect(() => {
        localStorage.setItem('pastelicias_delivery_zones', JSON.stringify(deliveryZones));
    }, [deliveryZones]);

    useEffect(() => {
        localStorage.setItem('pastelicias_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('pastelicias_logo', siteLogo);
    }, [siteLogo]);

    useEffect(() => {
        localStorage.setItem('pastelicias_analytics', JSON.stringify(analyticsData));
    }, [analyticsData]);

    const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastType }>({
        isVisible: false,
        message: '',
        type: 'success'
    });

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ isVisible: true, message, type });
    };

    useEffect(() => {
        // Check current session
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // In a real app, you'd fetch the role from a 'profiles' table.
                // For this prototype, we'll check user_metadata.
                const role = (session.user.user_metadata?.role as UserRole) || 'customer';
                setCurrentUserRole(role);
                if (session.user.user_metadata?.siteLogo) {
                    setSiteLogo(session.user.user_metadata.siteLogo);
                }
            } else {
                setCurrentUserRole('customer');
            }
            setIsLoadingAuth(false);
        };

        checkSession();

        // Listen for auth changes
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

    const handleUpdateLogo = async (newLogo: string) => {
        setSiteLogo(newLogo);
        // Save logo URL to user metadata for persistence
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.auth.updateUser({
                data: { siteLogo: newLogo }
            });
        }
    };

    const handleLogin = (_role: UserRole) => {
        // Role is now handled by Supabase onAuthStateChanged
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
            setIsMenuOpen(false); // Close menu on navigation
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
    const handleUpdateDeliveryZones = (newZones: DeliveryZone[]) => {
        setDeliveryZones(newZones);
    };

    const renderPage = () => {
        // Access Control: Only admin and superadmin can access #admin
        if (page === '#admin') {
            if (currentUserRole === 'customer') {
                // If not logged in or role is customer, redirect to login
                window.location.hash = '#login';
                return <LoginScreen onLogin={handleLogin} />;
            }
        }
        
        switch (page) {
            case '#login':
                return <LoginScreen onLogin={handleLogin} />;
            case '#catalog':
                return <CatalogPage products={products} onCustomizeClick={handleSelectProduct} />;
            case '#contact':
                return <ContactPage />;
            case '#confirmation':
                return <ConfirmationPage orderDetails={confirmedOrder} />;
            case '#admin':
                return <AdminPage 
                            products={products}
                            customizationOptions={customizationOptions}
                            deliveryZones={deliveryZones}
                            onAddProduct={handleAddProduct}
                            onUpdateProduct={handleUpdateProduct}
                            onDeleteProduct={handleDeleteProduct}
                            onUpdateCustomizationOptions={handleUpdateCustomizationOptions}
                            onUpdateDeliveryZones={handleUpdateDeliveryZones}
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
            <footer className="bg-cocoa-brown pt-20 pb-10 text-cream">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                        {/* Column 1: Brand */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                            <div className="flex flex-col items-center md:items-start gap-4">
                                <div className="w-20 h-20 bg-cream/10 backdrop-blur-md rounded-3xl p-3 border border-cream/20 shadow-2xl">
                                    <img src={siteLogo} alt="Pastelicias Logo" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-rose-gold tracking-tight">Pastelicias</h3>
                                    <p className="text-xs font-bold text-cream/40 uppercase tracking-[0.2em] mt-1 italic">Endulzando tus sueños, un pastel a la vez.</p>
                                </div>
                            </div>
                            <p className="text-cream/70 leading-relaxed max-w-sm">
                                Repostería artesanal con amor y dedicación. Creamos momentos dulces e inolvidables para cada una de tus celebraciones, utilizando ingredientes de la más alta calidad.
                            </p>
                        </div>
                        
                        {/* Column 2: Links */}
                        <div className="text-center">
                            <h4 className="text-lg font-bold font-serif text-rose-gold mb-6">Navegación</h4>
                            <nav className="flex flex-col space-y-4 text-cream/80">
                                <a href="#" className="hover:text-rose-gold transition-colors">Inicio</a>
                                <a href="#catalog" className="hover:text-rose-gold transition-colors">Catálogo</a>
                                <a href="#contact" className="hover:text-rose-gold transition-colors">Contacto</a>
                            </nav>
                        </div>

                        {/* Column 3: Social */}
                        <div className="text-center md:text-right">
                             <h4 className="text-lg font-bold font-serif text-rose-gold mb-6">Síguenos</h4>
                             <div className="flex justify-center md:justify-end space-x-6">
                                 <a href="#" aria-label="Instagram" className="w-12 h-12 bg-cream/5 rounded-2xl flex items-center justify-center text-cream hover:bg-rose-gold hover:text-cocoa-brown transition-all duration-300 border border-cream/10">
                                    <InstagramIcon />
                                 </a>
                                 <a href="https://www.facebook.com/profile.php?id=100063743610519&locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-12 h-12 bg-cream/5 rounded-2xl flex items-center justify-center text-cream hover:bg-rose-gold hover:text-cocoa-brown transition-all duration-300 border border-cream/10">
                                    <FacebookIcon />
                                 </a>
                                 <a href="https://wa.me/56954681985" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-12 h-12 bg-cream/5 rounded-2xl flex items-center justify-center text-cream hover:bg-rose-gold hover:text-cocoa-brown transition-all duration-300 border border-cream/10">
                                    <WhatsappIcon />
                                 </a>
                             </div>
                             <p className="mt-8 text-cream/40 text-xs font-medium uppercase tracking-widest">Síguenos para ver nuestras últimas creaciones</p>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-20 pt-8 border-t border-cream/10 text-center text-cream/40 text-xs tracking-widest uppercase font-bold">
                         <p>&copy; {new Date().getFullYear()} Pastelicias. Todos los derechos reservados.</p>
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
                deliveryZones={deliveryZones}
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
