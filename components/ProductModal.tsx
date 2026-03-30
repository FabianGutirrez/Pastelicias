
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';
import { Product, CustomizationOptions, CustomizationCollection } from '../types';

interface ProductModalProps {
    product: Product;
    allProducts: Product[];
    onClose: () => void;
    onAddToCart: (product: Product, selectedTier: { quantity: number; price: number; label: string; }, customizations: CustomizationOptions, selectedSubProducts?: string[]) => void;
    customizationOptions: CustomizationCollection;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, allProducts, onClose, onAddToCart, customizationOptions }) => {
    const [selectedTier] = useState(product.priceTiers[0]);
    const [selectedSubProductIds, setSelectedSubProductIds] = useState<number[]>([]);
    
    const [customizations, setCustomizations] = useState<CustomizationOptions>(() => {
        const initial: CustomizationOptions = { flavor: '', filling: '', color: '', message: '' };
        if (product.availableCustomizations?.includes('flavors')) initial.flavor = customizationOptions.flavors[0];
        if (product.availableCustomizations?.includes('fillings')) initial.filling = customizationOptions.fillings[0];
        if (product.availableCustomizations?.includes('colors')) initial.color = customizationOptions.colors[0];
        return initial;
    });

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSubProductChange = (productId: number) => {
        setSelectedSubProductIds(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            }
            if (product.selectableProducts && prev.length < product.selectableProducts.maxSelections) {
                return [...prev, productId];
            }
            return prev;
        });
    };
    
    const handleCustomizationChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomizations(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let selectedNames: string[] | undefined = undefined;
        if (product.selectableProducts) {
            const productMap = new Map(allProducts.map(p => [p.id, p.name]));
            selectedNames = selectedSubProductIds.map(id => productMap.get(id) || 'Producto Desconocido');
        }
        onAddToCart(product, selectedTier, customizations, selectedNames);
    };

    const hasCustomizations = product.availableCustomizations && product.availableCustomizations.length > 0;
    const isPromoWithOptions = !!product.selectableProducts;

    const availableSubProducts = useMemo(() => {
        const productIds = product.selectableProducts?.productIds || [];
        if (productIds.length === 0) return [];
        const productMap = new Map(allProducts.map(p => [p.id, p]));
        return productIds.map(id => productMap.get(id)).filter((p): p is Product => p !== undefined);
    }, [product, allProducts]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#FFF9F5] rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col md:flex-row border border-cocoa-brown/5"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-30 p-2 text-cocoa-brown hover:opacity-70 transition-opacity"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left Side: Image */}
                <div className="w-full md:w-1/2 p-6 md:p-8">
                    <div className="w-full h-full min-h-[300px] md:min-h-[400px] overflow-hidden rounded-2xl shadow-sm">
                        <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="w-full md:w-1/2 flex flex-col p-8 md:pl-0 md:pr-10 md:py-10">
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-cocoa-brown mb-4 leading-tight">
                                {product.name}
                            </h2>
                            <p className="text-muted-mauve/80 text-sm leading-relaxed mb-8 font-light">
                                {product.longDescription || product.description}
                            </p>

                            {/* Promo Selection */}
                            {isPromoWithOptions && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-bold text-cocoa-brown/80">Elige tus variedades</h3>
                                        <span className="text-xs font-bold text-cocoa-brown/60">
                                            {selectedSubProductIds.length} / {product.selectableProducts?.maxSelections || 0}
                                        </span>
                                    </div>
                                    
                                    <div className="border border-cocoa-brown/10 rounded-xl overflow-hidden bg-white shadow-inner">
                                        <div className="max-h-[250px] overflow-y-auto divide-y divide-cocoa-brown/5 custom-scrollbar">
                                            {availableSubProducts.map(subProduct => (
                                                <label 
                                                    key={subProduct.id} 
                                                    className={`flex items-center p-4 transition-colors cursor-pointer hover:bg-cream/20 ${
                                                        !selectedSubProductIds.includes(subProduct.id) && selectedSubProductIds.length >= (product.selectableProducts?.maxSelections ?? Infinity)
                                                        ? 'opacity-50 cursor-not-allowed'
                                                        : ''
                                                    }`}
                                                >
                                                    <div className="relative flex items-center">
                                                        <input 
                                                            type="checkbox"
                                                            checked={selectedSubProductIds.includes(subProduct.id)}
                                                            onChange={() => handleSubProductChange(subProduct.id)}
                                                            disabled={!selectedSubProductIds.includes(subProduct.id) && selectedSubProductIds.length >= (product.selectableProducts?.maxSelections ?? Infinity)}
                                                            className="h-5 w-5 rounded border-cocoa-brown/20 text-cocoa-brown focus:ring-cocoa-brown/20 transition-all cursor-pointer"
                                                        />
                                                    </div>
                                                    <span className="ml-4 text-sm font-medium text-cocoa-brown">{subProduct.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Standard Customizations */}
                            {!isPromoWithOptions && (hasCustomizations || product.category !== 'salado') && (
                                <div className="space-y-6 mt-4">
                                    {product.availableCustomizations?.includes('flavors') && (
                                        <CustomizationSelect id="flavor" name="Sabor del Bizcocho" options={customizationOptions.flavors} value={customizations.flavor} onChange={handleCustomizationChange} />
                                    )}
                                    {product.availableCustomizations?.includes('fillings') && (
                                        <CustomizationSelect id="filling" name="Tipo de Relleno" options={customizationOptions.fillings} value={customizations.filling} onChange={handleCustomizationChange} />
                                    )}
                                    {product.availableCustomizations?.includes('colors') && (
                                        <CustomizationSelect id="color" name="Color de Decoración" options={customizationOptions.colors} value={customizations.color} onChange={handleCustomizationChange} />
                                    )}
                                    
                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-xs font-bold text-cocoa-brown/60 ml-1">
                                            Mensaje Personalizado (opcional)
                                        </label>
                                        <input 
                                            type="text" 
                                            id="message" 
                                            name="message" 
                                            value={customizations.message} 
                                            onChange={handleCustomizationChange} 
                                            maxLength={30} 
                                            className="w-full bg-white border border-cocoa-brown/10 rounded-xl py-3 px-4 text-sm text-cocoa-brown focus:border-rose-gold outline-none transition-all" 
                                            placeholder="Ej: ¡Feliz Cumpleaños!"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Action */}
                        <div className="mt-8">
                            <button 
                                type="submit" 
                                disabled={isPromoWithOptions && selectedSubProductIds.length < (product.selectableProducts?.maxSelections || 0)}
                                className="w-full bg-[#FFF9F5] border border-cocoa-brown/10 text-cocoa-brown font-bold py-4 px-6 rounded-xl shadow-sm hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                <span className="text-lg">Añadir al Carrito - ${selectedTier.price.toLocaleString('es-CL')}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

interface CustomizationSelectProps {
    id: keyof Omit<CustomizationOptions, 'message'>;
    name: string;
    options: string[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CustomizationSelect: React.FC<CustomizationSelectProps> = ({ id, name, options, value, onChange }) => (
    <div className="space-y-2">
        <label htmlFor={id} className="text-xs font-bold text-cocoa-brown/60 ml-1">
            {name}
        </label>
        <div className="relative group">
            <select 
                id={id} 
                name={id} 
                value={value} 
                onChange={onChange} 
                className="w-full bg-white border border-cocoa-brown/10 rounded-xl py-3 px-4 text-sm text-cocoa-brown focus:border-rose-gold outline-none appearance-none cursor-pointer transition-all"
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cocoa-brown/40">
                <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
        </div>
    </div>
);

export default ProductModal;
