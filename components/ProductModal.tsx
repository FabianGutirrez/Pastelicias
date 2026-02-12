
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, CustomizationOptions, CustomizationCollection } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface ProductModalProps {
    product: Product;
    allProducts: Product[];
    onClose: () => void;
    onAddToCart: (product: Product, selectedTier: { quantity: number; price: number; label: string; }, customizations: CustomizationOptions, selectedSubProducts?: string[]) => void;
    customizationOptions: CustomizationCollection;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, allProducts, onClose, onAddToCart, customizationOptions }) => {
    const [selectedTier, setSelectedTier] = useState(product.priceTiers[0]);
    const [selectedSubProductIds, setSelectedSubProductIds] = useState<number[]>([]);
    
    const [customizations, setCustomizations] = useState<CustomizationOptions>(() => {
        const initial: CustomizationOptions = { flavor: '', filling: '', color: '', message: '' };
        if (product.availableCustomizations?.includes('flavors')) initial.flavor = customizationOptions.flavors[0];
        if (product.availableCustomizations?.includes('fillings')) initial.filling = customizationOptions.fillings[0];
        if (product.availableCustomizations?.includes('colors')) initial.color = customizationOptions.colors[0];
        return initial;
    });

    const modalRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        triggerRef.current = document.activeElement as HTMLElement;
        modalRef.current?.focus();
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            triggerRef.current?.focus();
        };
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
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div 
                ref={modalRef}
                className="bg-cream rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto outline-none animate-scale-in" 
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabIndex={-1}
            >
                <div className="relative p-6 md:p-8">
                    <button onClick={onClose} className="absolute top-4 right-4 text-cocoa-brown hover:text-red-500 transition-colors" aria-label="Cerrar modal">
                        <XMarkIcon />
                    </button>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <img src={product.imageUrl} alt={product.name} className="w-full h-64 sm:h-80 md:h-full object-cover rounded-lg shadow-md" />
                            </div>
                            <div className="flex flex-col">
                                <h2 id="modal-title" className="text-2xl md:text-3xl font-serif font-bold text-cocoa-brown mb-2">{product.name}</h2>
                                <p className="text-gray-600 mb-6">{product.longDescription}</p>

                                {product.priceTiers.length > 1 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-cocoa-brown mb-2">Elige la Cantidad</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {product.priceTiers.map(tier => (
                                            <label key={tier.quantity} className="flex items-center justify-between p-3 border border-blush-pink rounded-md cursor-pointer hover:bg-blush-pink/50 transition-colors has-[:checked]:bg-blush-pink has-[:checked]:border-rose-gold has-[:checked]:ring-2 has-[:checked]:ring-rose-gold/50">
                                                <div className="flex items-center">
                                                     <input 
                                                        type="radio" 
                                                        name="tier" 
                                                        value={tier.quantity}
                                                        checked={selectedTier.quantity === tier.quantity}
                                                        onChange={() => setSelectedTier(tier)}
                                                        className="h-4 w-4 text-rose-gold focus:ring-rose-gold"
                                                    />
                                                    <span className="ml-3 text-sm font-medium text-cocoa-brown">{tier.label}</span>
                                                </div>
                                                <span className="text-sm font-semibold">${tier.price.toLocaleString('es-CL')}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                )}

                                {isPromoWithOptions ? (
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium text-cocoa-brown">Elige tus variedades</label>
                                            <span className="text-sm font-bold text-rose-gold">{selectedSubProductIds.length} / {product.selectableProducts?.maxSelections || 0}</span>
                                        </div>
                                        <div className="space-y-2 max-h-48 overflow-y-auto p-2 border border-blush-pink rounded-md bg-white">
                                            {availableSubProducts.map(subProduct => (
                                                <label key={subProduct.id} className="flex items-center p-2 rounded-md hover:bg-blush-pink/50 has-[:checked]:bg-blush-pink/80">
                                                    <input 
                                                        type="checkbox"
                                                        checked={selectedSubProductIds.includes(subProduct.id)}
                                                        onChange={() => handleSubProductChange(subProduct.id)}
                                                        disabled={!selectedSubProductIds.includes(subProduct.id) && selectedSubProductIds.length >= (product.selectableProducts?.maxSelections ?? Infinity)}
                                                        className="h-4 w-4 rounded border-gray-300 text-rose-gold focus:ring-rose-gold"
                                                    />
                                                    <span className="ml-3 text-sm text-cocoa-brown">{subProduct.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {(hasCustomizations || product.category !== 'salado') && (
                                            <div className="space-y-4 mb-6">
                                                {product.availableCustomizations?.includes('flavors') && (
                                                    <CustomizationSelect id="flavor" name="Sabor del Bizcocho" options={customizationOptions.flavors} value={customizations.flavor} onChange={handleCustomizationChange} />
                                                )}
                                                {product.availableCustomizations?.includes('fillings') && (
                                                    <CustomizationSelect id="filling" name="Tipo de Relleno" options={customizationOptions.fillings} value={customizations.filling} onChange={handleCustomizationChange} />
                                                )}
                                                {product.availableCustomizations?.includes('colors') && (
                                                    <CustomizationSelect id="color" name="Color de la Decoración" options={customizationOptions.colors} value={customizations.color} onChange={handleCustomizationChange} />
                                                )}
                                                
                                                <div>
                                                    <label htmlFor="message" className="block text-sm font-medium text-cocoa-brown mb-1">Mensaje Personalizado (opcional)</label>
                                                    <input type="text" id="message" name="message" value={customizations.message} onChange={handleCustomizationChange} maxLength={30} className="w-full px-3 py-2 border border-blush-pink rounded-md focus:ring-rose-gold focus:border-rose-gold bg-white" placeholder="Ej: Feliz Cumpleaños, Mamá"/>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                
                                <div className="mt-auto pt-6">
                                    <button type="submit" className="w-full bg-rose-gold text-cocoa-brown font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
                                        Añadir al Carrito - ${selectedTier.price.toLocaleString('es-CL')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
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
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-cocoa-brown mb-1">{name}</label>
        <select id={id} name={id} value={value} onChange={onChange} className="w-full px-3 py-2 border border-blush-pink rounded-md focus:ring-rose-gold focus:border-rose-gold bg-white">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default ProductModal;