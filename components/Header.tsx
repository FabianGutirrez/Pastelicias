
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, X, LogOut, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
    logoUrl: string;
    onCartClick: () => void;
    cartItemCount: number;
    currentPage: string;
    isMenuOpen: boolean;
    setIsMenuOpen: (isOpen: boolean) => void;
    currentUserRole: UserRole;
    onLogout: () => void;
}

const NavLink: React.FC<{href: string; currentPage: string; children: React.ReactNode; className?: string, onClick: () => void;}> = 
({ href, currentPage, children, className = '', onClick }) => {
    const isHome = href === '#';
    const isActive = isHome ? (currentPage === '#' || currentPage === '#/') : currentPage === href;

    return (
        <a 
            href={href} 
            className={`relative group transition-all py-2 px-1 text-sm tracking-wide uppercase font-bold ${isActive ? 'text-cocoa-brown' : 'text-muted-mauve/60 hover:text-cocoa-brown'} ${className}`} 
            onClick={onClick}
        >
            {children}
            <motion.span 
                initial={false}
                animate={{ width: isActive ? '100%' : '0%' }}
                className="absolute bottom-0 left-0 h-0.5 bg-rose-gold rounded-full transition-all group-hover:w-full"
            />
        </a>
    );
};


const Header: React.FC<HeaderProps> = ({ logoUrl, onCartClick, cartItemCount, currentPage, isMenuOpen, setIsMenuOpen, currentUserRole, onLogout }) => {
    const closeMenu = () => setIsMenuOpen(false);

    const navLinks = (
      <>
        <NavLink href="#" currentPage={currentPage} onClick={closeMenu}>Inicio</NavLink>
        <NavLink href="#catalog" currentPage={currentPage} onClick={closeMenu}>Catálogo</NavLink>
        <NavLink href="#contact" currentPage={currentPage} onClick={closeMenu}>Contacto</NavLink>
        {(currentUserRole === 'admin' || currentUserRole === 'superadmin') && (
            <NavLink href="#admin" currentPage={currentPage} onClick={closeMenu} className="text-rose-gold">Panel Admin</NavLink>
        )}
      </>
    );

    return (
        <>
            <header className="bg-cream/80 backdrop-blur-md sticky top-0 z-40 border-b border-blush-pink/10 shadow-sm">
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <motion.a 
                        href="#" 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative z-50"
                    >
                        <img src={logoUrl} alt="Pastelicia Logo" className="h-12 w-auto drop-shadow-sm" />
                    </motion.a>

                    <nav className="hidden md:flex items-center space-x-10">
                        {navLinks}
                    </nav>

                    <div className="flex items-center gap-3">
                        {/* User Actions */}
                        <div className="hidden sm:flex items-center">
                            {currentUserRole !== 'customer' && (
                                <div className="flex items-center gap-3 bg-rose-gold/5 border border-rose-gold/20 rounded-2xl px-4 py-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-rose-gold" />
                                        <span className="font-bold text-cocoa-brown capitalize">{currentUserRole}</span>
                                    </div>
                                    <div className="w-px h-4 bg-rose-gold/20" />
                                    <button 
                                        onClick={onLogout} 
                                        className="text-muted-mauve hover:text-red-500 transition-colors"
                                        title="Cerrar Sesión"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Cart Button */}
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onCartClick} 
                            className="relative w-11 h-11 bg-cocoa-brown text-white rounded-2xl flex items-center justify-center shadow-lg shadow-cocoa-brown/20 hover:bg-rose-gold transition-colors"
                            aria-label="Ver carrito"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <AnimatePresence>
                                {cartItemCount > 0 && (
                                    <motion.span 
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute -top-1.5 -right-1.5 bg-rose-gold text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-cream shadow-sm"
                                    >
                                        {cartItemCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* Mobile Menu Toggle */}
                        <button 
                            className="md:hidden w-11 h-11 bg-cream/50 rounded-2xl flex items-center justify-center text-cocoa-brown hover:bg-rose-gold hover:text-white transition-all relative z-50" 
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay - Moved outside header for better stacking */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-0 bg-cream z-[9999] md:hidden flex flex-col"
                    >
                        {/* Decorative background elements */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-gold/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blush-pink/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex justify-between items-center p-6 border-b border-blush-pink/10 bg-cream/80 backdrop-blur-md">
                            <img src={logoUrl} alt="Pastelicia Logo" className="h-10 w-auto" />
                            <button 
                                onClick={closeMenu} 
                                className="w-11 h-11 bg-cocoa-brown text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <nav className="relative z-10 flex-grow flex flex-col items-center justify-center space-y-6 p-6 overflow-y-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="w-full max-w-xs"
                            >
                                <a 
                                    href="#" 
                                    onClick={closeMenu}
                                    className={`block w-full text-center py-4 rounded-2xl text-2xl font-serif font-bold transition-all ${currentPage === '#' || currentPage === '#/' ? 'bg-rose-gold text-white shadow-xl shadow-rose-gold/20' : 'text-cocoa-brown hover:bg-rose-gold/10'}`}
                                >
                                    Inicio
                                </a>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="w-full max-w-xs"
                            >
                                <a 
                                    href="#catalog" 
                                    onClick={closeMenu}
                                    className={`block w-full text-center py-4 rounded-2xl text-2xl font-serif font-bold transition-all ${currentPage === '#catalog' ? 'bg-rose-gold text-white shadow-xl shadow-rose-gold/20' : 'text-cocoa-brown hover:bg-rose-gold/10'}`}
                                >
                                    Catálogo
                                </a>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="w-full max-w-xs"
                            >
                                <a 
                                    href="#contact" 
                                    onClick={closeMenu}
                                    className={`block w-full text-center py-4 rounded-2xl text-2xl font-serif font-bold transition-all ${currentPage === '#contact' ? 'bg-rose-gold text-white shadow-xl shadow-rose-gold/20' : 'text-cocoa-brown hover:bg-rose-gold/10'}`}
                                >
                                    Contacto
                                </a>
                            </motion.div>

                            {(currentUserRole === 'admin' || currentUserRole === 'superadmin') && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="w-full max-w-xs"
                                >
                                    <a 
                                        href="#admin" 
                                        onClick={closeMenu}
                                        className={`block w-full text-center py-4 rounded-2xl text-2xl font-serif font-bold transition-all ${currentPage === '#admin' ? 'bg-cocoa-brown text-white shadow-xl shadow-cocoa-brown/20' : 'text-rose-gold border-2 border-rose-gold/20 hover:bg-rose-gold/10'}`}
                                    >
                                        Panel Admin
                                    </a>
                                </motion.div>
                            )}
                            
                            {currentUserRole !== 'customer' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="pt-4 w-full max-w-xs"
                                >
                                    <button 
                                        onClick={() => { onLogout(); closeMenu(); }} 
                                        className="w-full flex items-center justify-center gap-3 bg-red-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-red-500/20 active:scale-95 transition-transform"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </motion.div>
                            )}
                        </nav>
                        
                        <div className="relative z-10 p-8 text-center border-t border-blush-pink/10">
                            <p className="text-xs font-bold text-muted-mauve/40 uppercase tracking-widest">Pastelicia © 2024</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
