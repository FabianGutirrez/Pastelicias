
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
    const [products, setProducts] = useState<Product[]>([]);
    const [customizationOptions, setCustomizationOptions] = useState<CustomizationCollection>(INITIAL_CUSTOMIZATION_OPTIONS);
    const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
    
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Fetch data from Supabase
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingData(true);
            try {
                // Fetch Products
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .order('id', { ascending: true });
                
                if (productsError) throw productsError;
                setProducts(productsData || INITIAL_PRODUCTS);

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
                } else {
                    setCustomizationOptions(INITIAL_CUSTOMIZATION_OPTIONS);
                }

                // Fetch Delivery Zones
                const { data: zonesData, error: zonesError } = await supabase
                    .from('delivery_zones')
                    .select('*')
                    .order('price', { ascending: true });
                
                if (zonesError) throw zonesError;
                setDeliveryZones(zonesData || INITIAL_DELIVERY_ZONES);

                // Fetch Logo from configuracion table
                const { data: configData, error: configError } = await supabase
                    .from('configuracion')
                    .select('logo_url')
                    .eq('id', 1)
                    .single();
                
                if (configError && configError.code !== 'PGRST116') {
                    console.warn('Error fetching logo from configuracion:', configError);
                } else if (configData?.logo_url) {
                    setSiteLogo(configData.logo_url);
                }

            } catch (error) {
                console.error('Error fetching data from Supabase:', error);
                // Fallback to localStorage or initial data
                const savedProducts = localStorage.getItem('pastelicia_products');
                setProducts(savedProducts ? JSON.parse(savedProducts) : INITIAL_PRODUCTS);
                
                const savedCustomizations = localStorage.getItem('pastelicia_customizations');
                setCustomizationOptions(savedCustomizations ? JSON.parse(savedCustomizations) : INITIAL_CUSTOMIZATION_OPTIONS);
                
                const savedZones = localStorage.getItem('pastelicia_delivery_zones');
                setDeliveryZones(savedZones ? JSON.parse(savedZones) : INITIAL_DELIVERY_ZONES);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, []);

    // Simple ID generator to ensure uniqueness during the session
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
    
    // Default role is 'customer'. Login is only for admin roles.
    const [currentUserRole, setCurrentUserRole] = useState<UserRole>('customer');
    const [analyticsData, setAnalyticsData] = useState<AnalyticsEvent[]>(() => {
        const saved = localStorage.getItem('pastelicia_analytics');
        return saved ? JSON.parse(saved) : [];
    });
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('pastelicia_products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('pastelicia_customizations', JSON.stringify(customizationOptions));
    }, [customizationOptions]);

    useEffect(() => {
        localStorage.setItem('pastelicia_delivery_zones', JSON.stringify(deliveryZones));
    }, [deliveryZones]);

    useEffect(() => {
        localStorage.setItem('pastelicia_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('pastelicia_analytics', JSON.stringify(analyticsData));
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
        
        try {
            const { error } = await supabase
                .from('configuracion')
                .upsert({ id: 1, logo_url: newLogo });
            
            if (error) throw error;
            showToast('Logo actualizado con éxito', 'success');
        } catch (error) {
            console.error('Error updating logo in Supabase:', error);
            showToast('Error al actualizar el logo en la nube', 'error');
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
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

    const handleAddProduct = async (product: Omit<Product, 'id'>) => {
        const newProduct = { ...product, id: generateUniqueId() };
        setProducts(prev => [...prev, newProduct]);
        
        try {
            const { error } = await supabase.from('products').insert([newProduct]);
            if (error) throw error;
            showToast('Producto añadido con éxito', 'success');
        } catch (error) {
            console.error('Error adding product to Supabase:', error);
            showToast('Error al guardar en la nube, pero se guardó localmente', 'info');
        }
    };

    const handleUpdateProduct = async (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        
        try {
            const { error } = await supabase
                .from('products')
                .update(updatedProduct)
                .eq('id', updatedProduct.id);
            
            if (error) throw error;
            showToast('Producto actualizado con éxito', 'success');
        } catch (error) {
            console.error('Error updating product in Supabase:', error);
            showToast('Error al actualizar en la nube', 'error');
        }
    };

    const handleDeleteProduct = async (productId: number) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
        
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId);
            
            if (error) throw error;
            showToast('Producto eliminado con éxito', 'success');
        } catch (error) {
            console.error('Error deleting product from Supabase:', error);
            showToast('Error al eliminar en la nube', 'error');
        }
    };

    const handleUpdateCustomizationOptions = async (newOptions: CustomizationCollection) => {
        setCustomizationOptions(newOptions);
        
        try {
            const { error } = await supabase
                .from('customizations')
                .upsert({ id: 1, ...newOptions }); // Assuming a single record for customizations
            
            if (error) throw error;
            showToast('Opciones actualizadas', 'success');
        } catch (error) {
            console.error('Error updating customizations in Supabase:', error);
            showToast('Error al guardar opciones', 'error');
        }
    };

    const handleUpdateDeliveryZones = async (newZones: DeliveryZone[]) => {
        setDeliveryZones(newZones);
        
        try {
            // This is a bit more complex as we need to sync the whole list
            // For simplicity, we'll delete all and re-insert, or use a more sophisticated sync
            // Let's try upserting each zone
            const { error } = await supabase
                .from('delivery_zones')
                .upsert(newZones);
            
            if (error) throw error;
            showToast('Zonas de entrega actualizadas', 'success');
        } catch (error) {
            console.error('Error updating delivery zones in Supabase:', error);
            showToast('Error al guardar zonas', 'error');
        }
    };

    const renderPage = () => {
        if (isLoadingData) {
            return (
                <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-rose-gold border-t-transparent rounded-full mb-6"
                    />
                    <h2 className="text-2xl font-serif font-bold text-cocoa-brown animate-pulse">Cargando Pastelicia...</h2>
                    <p className="text-muted-mauve/60 mt-2">Preparando tus dulces favoritos</p>
                </div>
            );
        }

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
            <footer className="bg-[#1a1412] pt-20 pb-10 text-cream border-t border-rose-gold/10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                        {/* Column 1: Brand */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                            <div className="flex flex-col items-center md:items-start gap-4">
                                <div className="w-20 h-20 bg-cream/10 backdrop-blur-md rounded-3xl p-3 border border-cream/20 shadow-2xl">
                                    <img src={siteLogo} alt="Pastelicia Logo" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-rose-gold tracking-tight">Pastelicia</h3>
                                    <p className="text-[10px] font-bold text-cream/30 uppercase tracking-[0.3em] mt-1 italic">Excelencia en Alta Repostería</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-cream/70 leading-relaxed max-w-sm text-sm">
                                    En <span className="text-rose-gold font-bold">Pastelicia</span>, transformamos ingredientes premium en obras de arte comestibles. Nuestra pasión es crear experiencias sensoriales únicas que celebren los momentos más importantes de tu vida.
                                </p>
                                <p className="text-cream/50 text-xs italic font-serif border-l-2 border-rose-gold/30 pl-4 py-1">
                                    "Cada detalle cuenta, cada sabor cuenta una historia de dedicación y amor por el arte dulce."
                                </p>
                            </div>
                        </div>
                        
                        {/* Column 2: Links */}
                        <div className="text-center">
                            <h4 className="text-lg font-bold font-serif text-rose-gold mb-6">Navegación</h4>
                            <nav className="flex flex-col space-y-4 text-cream/80">
                                <a href="#" className="hover:text-rose-gold transition-colors text-sm">Inicio</a>
                                <a href="#catalog" className="hover:text-rose-gold transition-colors text-sm">Catálogo</a>
                                <a href="#contact" className="hover:text-rose-gold transition-colors text-sm">Contacto</a>
                                <div className="pt-10">
                                    <button 
                                        onClick={() => window.location.hash = '#login'}
                                        className="text-cream/10 hover:text-rose-gold/40 transition-all duration-500 text-[9px] font-bold uppercase tracking-[0.3em] hover:tracking-[0.4em] cursor-pointer"
                                    >
                                        Acceso Administrativo
                                    </button>
                                </div>
                            </nav>
                        </div>

                        {/* Column 3: Social */}
                        <div className="text-center md:text-right">
                             <h4 className="text-lg font-bold font-serif text-rose-gold mb-6">Conecta con nosotros</h4>
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
                             <p className="mt-8 text-cream/30 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                Descubre nuestras creaciones diarias<br/>y promociones exclusivas en redes sociales.
                             </p>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-20 pt-8 border-t border-cream/5 text-center text-cream/20 text-[10px] tracking-[0.2em] uppercase font-bold">
                         <p>&copy; {new Date().getFullYear()} Pastelicia. Todos los derechos reservados.</p>
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