
import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, CustomizationOptions, CustomizationCollection } from './types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMIZATION_OPTIONS } from './constants';
import Header from './components/Header';
import ProductModal from './components/ProductModal';
import CartSidebar from './components/CartSidebar';
import HomePage from './components/HomePage';
import CatalogPage from './components/CatalogPage';
import AdminPage from './components/AdminPage';
import ContactPage from './components/ContactPage';

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

    useEffect(() => {
        const handleHashChange = () => {
            setPage(window.location.hash || '#');
            setIsMenuOpen(false); // Close menu on navigation
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Global effect to lock body scroll when overlays are open
    useEffect(() => {
        const body = document.body;
        if (isCartOpen || selectedProduct || isMenuOpen) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }
        return () => { // Cleanup
            body.style.overflow = 'auto';
        };
    }, [isCartOpen, selectedProduct, isMenuOpen]);

    const handleSelectProduct = (product: Product) => setSelectedProduct(product);
    const handleCloseModal = () => setSelectedProduct(null);
    const handleToggleCart = () => setIsCartOpen(prev => !prev);

    const handleAddToCart = (product: Product, selectedTier: { quantity: number; price: number; label: string; }, customizations: CustomizationOptions) => {
        const newItem: CartItem = {
            id: `${product.id}-${selectedTier.quantity}-${Date.now()}`,
            product, selectedTier, customizations
        };
        setCartItems(prevItems => [...prevItems, newItem]);
        setSelectedProduct(null);
        setIsCartOpen(true);
    };
    
    const handleRemoveFromCart = (itemId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const cartItemCount = useMemo(() => {
      return cartItems.reduce((total, item) => total + item.selectedTier.quantity, 0);
    }, [cartItems]);
    
    const featuredProducts = useMemo(() => products.filter(p => p.isFeatured), [products]);

    // Admin Panel Handlers
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
        switch (page) {
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
                       />;
            case '#':
            case '#/': // Also support the old home link for robustness
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
            />
        </div>
    );
};

export default App;