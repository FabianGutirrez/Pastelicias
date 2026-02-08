import React from 'react';
import { Product } from '../types';

// FIX: Define the props interface for the component.
interface ProductCardProps {
    product: Product;
    onCustomizeClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onCustomizeClick }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transition-transform duration-300 hover:scale-105">
            <div className="relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
                <div className={`absolute top-2 right-2 py-1 px-3 rounded-full text-xs font-semibold text-white ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}>
                    {product.inStock ? 'En Stock' : 'Agotado'}
                </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-serif font-bold text-dark-choco mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm flex-grow mb-4">{product.description}</p>
                <div className="flex justify-between items-center mt-auto">
                    <span className="text-lg font-bold font-sans text-brown-sugar">
                        Desde ${product.price.toLocaleString('es-CL')}
                    </span>
                    <button 
                        onClick={() => onCustomizeClick(product)}
                        disabled={!product.inStock}
                        className="bg-brown-sugar text-cream font-bold py-2 px-4 rounded-md hover:bg-dark-choco disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300">
                        Personalizar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;