
import React from 'react';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { MenuIcon } from './icons/MenuIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { UserRole } from '../types';
import { UserIcon } from './icons/UserIcon';
import { LogoutIcon } from './icons/LogoutIcon';


interface HeaderProps {
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

    const activeClasses = 'text-cocoa-brown font-semibold border-b-2 border-rose-gold';
    const inactiveClasses = 'hover:text-muted-mauve border-b-2 border-transparent';

    return (
        <a href={href} className={`transition-colors py-1 ${isActive ? activeClasses : inactiveClasses} ${className}`} onClick={onClick}>
            {children}
        </a>
    );
};


const Header: React.FC<HeaderProps> = ({ onCartClick, cartItemCount, currentPage, isMenuOpen, setIsMenuOpen, currentUserRole, onLogout }) => {
    const closeMenu = () => setIsMenuOpen(false);

    const navLinks = (
      <>
        <NavLink href="#" currentPage={currentPage} onClick={closeMenu}>Inicio</NavLink>
        <NavLink href="#catalog" currentPage={currentPage} onClick={closeMenu}>Catálogo</NavLink>
        <NavLink href="#contact" currentPage={currentPage} onClick={closeMenu}>Contacto</NavLink>
        {(currentUserRole === 'admin' || currentUserRole === 'superadmin') && (
            <NavLink href="#admin" currentPage={currentPage} onClick={closeMenu} className="text-muted-mauve hover:text-cocoa-brown font-bold">Admin</NavLink>
        )}
      </>
    );

    return (
        <header className="bg-cream/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-2xl font-serif font-bold text-cocoa-brown">
                    <a href="#">Pastelicias</a>
                </div>
                <nav className="hidden md:flex items-center space-x-8 text-cocoa-brown font-medium">
                    {navLinks}
                </nav>
                <div className="flex items-center gap-4">
                     {currentUserRole === 'customer' ? (
                        <a href="#login" className="flex items-center gap-2 bg-white border border-blush-pink rounded-full px-3 py-1 text-sm font-semibold hover:bg-blush-pink/50 transition-colors">
                            <UserIcon />
                            <span>Acceso Admin</span>
                        </a>
                    ) : (
                        <div className="flex items-center gap-2 bg-white border border-blush-pink rounded-full px-3 py-1 text-sm">
                            <UserIcon />
                            <span className="font-semibold capitalize">{currentUserRole}</span>
                            <button onClick={onLogout} title="Cerrar Sesión" className="ml-1 text-gray-500 hover:text-red-500">
                               <LogoutIcon />
                            </button>
                        </div>
                    )}


                    <button 
                        onClick={onCartClick} 
                        className="relative text-cocoa-brown hover:text-muted-mauve transition-colors p-2"
                        aria-label="Ver carrito de compras"
                    >
                        <ShoppingCartIcon />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-rose-gold text-cream text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                    <button className="md:hidden text-cocoa-brown p-2" onClick={() => setIsMenuOpen(true)}>
                        <MenuIcon />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-cream z-50 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
                 <div className="flex justify-between items-center p-4 border-b border-blush-pink">
                     <div className="text-2xl font-serif font-bold text-cocoa-brown">
                        <a href="#" onClick={closeMenu}>Pastelicias</a>
                    </div>
                    <button onClick={closeMenu} className="text-cocoa-brown p-2">
                        <XMarkIcon />
                    </button>
                </div>
                <nav className="flex flex-col items-center justify-center h-full -mt-16 space-y-8 text-xl text-cocoa-brown font-medium">
                   {navLinks}
                </nav>
            </div>
        </header>
    );
};

export default Header;