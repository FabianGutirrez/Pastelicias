
import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, CustomizationOptions, CustomizationCollection, UserRole, AnalyticsEvent } from './types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMIZATION_OPTIONS } from './constants';
import Header from './components/Header';
import ProductModal from './components/ProductModal';
import CartSidebar from './components/CartSidebar';
import HomePage from './components/HomePage';
import CatalogPage from './components/CatalogPage';
import AdminPage from './components/AdminPage';
import ContactPage from './components/ContactPage';
import LoginScreen from './components/LoginScreen';

// Simple ID generator to ensure uniqueness during the session
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
    
    // Default role is 'customer'. Login is only for admin roles.
    const [currentUserRole, setCurrentUserRole] = useState<UserRole>('customer');
    const [analyticsData, setAnalyticsData] = useState<AnalyticsEvent[]>([]);

    const handleLogin = (role: UserRole) => {
        setCurrentUserRole(role);
        window.location.hash = '#admin'; // Redirect to admin panel after login
    };

    const handleLogout = () => {
        setCurrentUserRole('customer');
        window.location.hash = '#'; // Redirect to home page on logout
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

    const handleAddToCart = (product: Product, selectedTier: { quantity: number; price: number; label: string; }, customizations: CustomizationOptions) => {
        const newItem: CartItem = {
            id: `${product.id}-${selectedTier.quantity}-${Date.now()}`,
            product, selectedTier, customizations
        };
        logAnalyticsEvent({ type: 'addToCart', productId: product.id });
        setCartItems(prevItems => [...prevItems, newItem]);
        setSelectedProduct(null);
    };
    
    const handleRemoveFromCart = (itemId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const handleConfirmOrder = (confirmedItems: CartItem[], orderTotal: number) => {
        logAnalyticsEvent({ type: 'order', items: confirmedItems, total: orderTotal });
        alert('¡Pedido Confirmado! Gracias por tu compra. (Esto es una simulación)');
        setCartItems([]);
        setIsCartOpen(false);
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
             // Redirect to home if a customer tries to access admin page
            return <HomePage products={featuredProducts} onCustomizeClick={handleSelectProduct} />;
        }
        
        switch (page) {
            case '#login':
                return <LoginScreen onLogin={handleLogin} />;
            case '#catalog':
                return <CatalogPage products={products} onCustomizeClick={handleSelectProduct} />;
            case '#contact':
                return <ContactPage />;
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
                       />;
            case '#':
            case '#/':
            default:
                return <HomePage products={featuredProducts} onCustomizeClick={handleSelectProduct} />;
        }
    };

    return (
        <div className="bg-cream min-h-screen text-cocoa-brown">
            <Header 
                onCartClick={handleToggleCart} 
                cartItemCount={cartItemCount} 
                currentPage={page}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                currentUserRole={currentUserRole}
                onLogout={handleLogout}
            />
            <main className="container mx-auto px-4 py-8">
                {renderPage()}
            </main>
            <footer className="bg-blush-pink mt-16 py-8">
              <div className="container mx-auto text-center text-cocoa-brown">
                <p>&copy; 2024 Pastelicias. Todos los derechos reservados.</p>
              </div>
            </footer>
            {selectedProduct && (
                <ProductModal 
                    product={selectedProduct} 
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
        </div>
    );
};

export default App;