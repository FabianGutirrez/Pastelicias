
import React from 'react';
import { motion } from 'motion/react';
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
    index: number;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, products, onCustomizeClick, index }) => {
    if (products.length === 0) {
        return null;
    }

    return (
        <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="space-y-12"
        >
            <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-px bg-rose-gold/30" />
                    <span className="text-rose-gold font-bold tracking-[0.2em] uppercase text-xs">Categoría</span>
                    <div className="w-12 h-px bg-rose-gold/30" />
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-cocoa-brown text-center">{title}</h2>
            </div>

            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
            >
                {products.map(product => (
                    <motion.div
                        key={product.id}
                        variants={{
                            hidden: { opacity: 0, scale: 0.9 },
                            visible: { opacity: 1, scale: 1 }
                        }}
                    >
                        <ProductCard product={product} onCustomizeClick={onCustomizeClick} />
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    );
};


const CatalogPage: React.FC<CatalogPageProps> = ({ products, onCustomizeClick }) => {
    const promociones = products.filter(p => p.category === 'promocion');
    const dulces = products.filter(p => p.category === 'dulce');
    const salados = products.filter(p => p.category === 'salado');

    const categories = [
        { title: "Promociones Imperdibles", products: promociones },
        { title: "Delicias Dulces", products: dulces },
        { title: "Bocados Salados", products: salados }
    ];

    return (
        <div id="catalog" className="space-y-32 py-12">
            {categories.map((cat, idx) => (
                <CategorySection 
                    key={cat.title} 
                    title={cat.title} 
                    products={cat.products} 
                    onCustomizeClick={onCustomizeClick} 
                    index={idx}
                />
            ))}
        </div>
    );
};

export default CatalogPage;