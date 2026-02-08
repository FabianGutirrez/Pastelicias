
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
            <section className="relative bg-peach rounded-lg shadow-lg overflow-hidden mb-16 h-[50vh] flex items-center justify-center">
                <img src="https://picsum.photos/1200/800?image=25" alt="Delicious cake" className="absolute inset-0 w-full h-full object-cover opacity-60"/>
                <div className="relative z-10 text-center p-8">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-dark-choco mb-4 drop-shadow-md">Coctelería Dulce para tus Eventos</h1>
                    <p className="text-lg md:text-xl text-dark-choco mb-6 max-w-2xl mx-auto drop-shadow-sm">Descubre nuestros deliciosos cupcakes y personalízalos para tus momentos más especiales.</p>
                    <a href="#catalog" className="bg-brown-sugar text-cream font-bold py-3 px-8 rounded-full hover:bg-dark-choco transition-colors duration-300 shadow-md">
                        Ver Coctelería
                    </a>
                </div>
            </section>

            {/* Products Section */}
            <section id="products">
                <h2 className="text-3xl font-serif font-bold text-center mb-8 text-dark-choco">Productos Destacados</h2>
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