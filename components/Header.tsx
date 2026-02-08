
import React, { useState } from 'react';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { MenuIcon } from './icons/MenuIcon';
import { XMarkIcon } from './icons/XMarkIcon';

interface HeaderProps {
    onCartClick: () => void;
    cartItemCount: number;
    currentPage: string;
}

const NavLink: React.FC<{href: string; currentPage: string; children: React.ReactNode; className?: string, onClick: () => void;}> = 
({ href, currentPage, children, className = '', onClick }) => {
    const isHome = href === '#';
    const isActive = isHome ? (currentPage === '#' || currentPage === '#/') : currentPage === href;

    const activeClasses = 'text-brown-sugar font-semibold border-b-2 border-brown-sugar';
    const inactiveClasses = 'hover:text-brown-sugar border-b-2 border-transparent';

    return (
        <a href={href} className={`transition-colors py-1 ${isActive ? activeClasses : inactiveClasses} ${className}`} onClick={onClick}>
            {children}
        </a>
    );
};


const Header: React.FC<HeaderProps> = ({ onCartClick, cartItemCount, currentPage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);

    const navLinks = (
      <>
        <NavLink href="#" currentPage={currentPage} onClick={closeMenu}>Inicio</NavLink>
        <NavLink href="#catalog" currentPage={currentPage} onClick={closeMenu}>Catálogo</NavLink>
        <NavLink href="#contact" currentPage={currentPage} onClick={closeMenu}>Contacto</NavLink>
        <NavLink href="#admin" currentPage={currentPage} onClick={closeMenu} className="text-gold-accent hover:text-gold-accent/80 font-bold">Admin</NavLink>
      </>
    );

    return (
        <header className="bg-cream/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-2xl font-serif font-bold text-dark-choco">
                    <a href="#">Pastelicias</a>
                </div>
                <nav className="hidden md:flex items-center space-x-8 text-dark-choco font-medium">
                    {navLinks}
                </nav>
                <div className="flex items-center">
                    <button onClick={onCartClick} className="relative text-dark-choco hover:text-brown-sugar transition-colors p-2">
                        <ShoppingCartIcon />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-gold-accent text-cream text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                    <button className="md:hidden text-dark-choco p-2 ml-2" onClick={() => setIsMenuOpen(true)}>
                        <MenuIcon />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-cream z-50 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
                 <div className="flex justify-between items-center p-4 border-b border-peach">
                     <div className="text-2xl font-serif font-bold text-dark-choco">
                        <a href="#" onClick={closeMenu}>Pastelicias</a>
                    </div>
                    <button onClick={closeMenu} className="text-dark-choco p-2">
                        <XMarkIcon />
                    </button>
                </div>
                <nav className="flex flex-col items-center justify-center h-full -mt-16 space-y-8 text-2xl text-dark-choco font-medium">
                   {navLinks}
                </nav>
            </div>
        </header>
    );
};

export default Header;