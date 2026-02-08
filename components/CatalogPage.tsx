
import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface CatalogPageProps {
    products: Product[];
    onCustomizeClick: (product: Product) => void;
}

interface CategorySectionProps {
    title: string;
    products: Product[];
    onCustomizeClick: (product: Product) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, products, onCustomizeClick }) => {
    if (products.length === 0) {
        return null;
    }

    return (
        <section>
            <h2 className="text-3xl font-serif font-bold text-center mb-8 text-dark-choco">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} onCustomizeClick={onCustomizeClick} />
                ))}
            </div>
        </section>
    );
};


const CatalogPage: React.FC<CatalogPageProps> = ({ products, onCustomizeClick }) => {
    const promociones = products.filter(p => p.category === 'promocion');
    const dulces = products.filter(p => p.category === 'dulce');
    const salados = products.filter(p => p.category === 'salado');

    return (
        <div id="catalog" className="space-y-16">
            <CategorySection title="Promociones Imperdibles" products={promociones} onCustomizeClick={onCustomizeClick} />
            <CategorySection title="Delicias Dulces" products={dulces} onCustomizeClick={onCustomizeClick} />
            <CategorySection title="Bocados Salados" products={salados} onCustomizeClick={onCustomizeClick} />
        </div>
    );
};

export default CatalogPage;