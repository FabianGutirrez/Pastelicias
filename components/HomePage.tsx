
import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface HomePageProps {
    products: Product[];
    onCustomizeClick: (product: Product) => void;
}

const HomePage: React.FC<HomePageProps> = ({ products, onCustomizeClick }) => {
    return (
        <>
            {/* Hero Banner */}
            <section className="relative bg-blush-pink rounded-lg shadow-lg overflow-hidden mb-16 h-[60vh] flex items-center justify-center">
                <img src="https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Delicious cake" className="absolute inset-0 w-full h-full object-cover opacity-50"/>
                <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/50 to-transparent"></div>
                <div className="relative z-10 text-center p-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-cocoa-brown mb-4" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.2)'}}>Coctelería Dulce para tus Eventos</h1>
                    <p className="text-lg md:text-xl text-cocoa-brown mb-8 max-w-2xl mx-auto" style={{textShadow: '1px 1px 2px rgba(255,255,255,0.3)'}}>Descubre nuestras delicias y personalízalas para tus momentos más especiales.</p>
                    <a href="#catalog" className="bg-rose-gold text-cocoa-brown font-bold py-2 px-6 md:py-3 md:px-8 rounded-full hover:bg-muted-mauve hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                        Ver Catálogo
                    </a>
                </div>
            </section>

            {/* Products Section */}
            <section id="products">
                <h2 className="text-3xl font-serif font-bold text-center mb-8 text-cocoa-brown">Productos Destacados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} onCustomizeClick={onCustomizeClick} />
                    ))}
                </div>
            </section>
        </>
    );
};

export default HomePage;