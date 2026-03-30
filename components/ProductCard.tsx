import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onCustomizeClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onCustomizeClick }) => {
    return (
        <motion.div 
            whileHover={{ y: -12 }}
            className="group bg-white rounded-[2.5rem] flex flex-col border border-blush-pink/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-500"
        >
            {/* Image Container */}
            <div className="relative h-40 sm:h-56 overflow-hidden rounded-t-[2.5rem] flex-shrink-0">
                <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.8 }}
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700" 
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                    <div className={`backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white shadow-lg flex items-center gap-2 ${product.inStock ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${product.inStock ? 'bg-white' : 'bg-white'}`} />
                        {product.inStock ? 'Disponible' : 'Agotado'}
                    </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-cocoa-brown shadow-lg flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-rose-gold" />
                        {product.category}
                    </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-cocoa-brown/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <motion.button
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={() => onCustomizeClick(product)}
                        disabled={!product.inStock}
                        className="bg-white text-cocoa-brown p-4 rounded-full shadow-2xl hover:bg-rose-gold hover:text-white transition-all"
                    >
                        <Plus className="w-6 h-6" />
                    </motion.button>
                </div>
            </div>

            {/* Content Container */}
            <div className="p-4 sm:p-6 flex-grow flex flex-col space-y-3">
                <div className="space-y-1">
                    <h3 className="text-lg md:text-xl font-serif font-bold text-cocoa-brown group-hover:text-rose-gold transition-colors duration-300">
                        {product.name}
                    </h3>
                    <p className="text-muted-mauve/70 text-xs sm:text-sm font-light leading-relaxed">
                        {product.description}
                    </p>
                </div>

                <div className="pt-3 mt-auto flex flex-wrap justify-between items-center border-t border-blush-pink/10 gap-3">
                    <div className="flex flex-col min-w-fit">
                        <span className="text-[9px] uppercase tracking-widest font-bold text-muted-mauve/40">Desde</span>
                        <span className="text-lg md:text-xl font-bold text-cocoa-brown">
                            ${product.price.toLocaleString('es-CL')}
                        </span>
                    </div>
                    
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCustomizeClick(product)}
                        disabled={!product.inStock}
                        className="bg-blush-pink/10 text-cocoa-brown font-bold py-2.5 px-4 md:px-5 rounded-xl hover:bg-blush-pink hover:text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 text-xs md:text-sm whitespace-nowrap shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        {product.category === 'promocion' ? 'Ver Promo' : 'Personalizar'}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;