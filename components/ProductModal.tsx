
import React, { useState } from 'react';
import { Product, CustomizationOptions, CustomizationCollection } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface ProductModalProps {
    product: Product;
    onClose: () => void;
    onAddToCart: (product: Product, selectedTier: { quantity: number; price: number; label: string; }, customizations: CustomizationOptions) => void;
    customizationOptions: CustomizationCollection;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart, customizationOptions }) => {
    const [selectedTier, setSelectedTier] = useState(product.priceTiers[0]);
    const [customizations, setCustomizations] = useState<CustomizationOptions>({
        flavor: customizationOptions.flavors[0],
        filling: customizationOptions.fillings[0],
        color: customizationOptions.colors[0],
        message: ''
    });

    const handleCustomizationChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomizations(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddToCart(product, selectedTier, customizations);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-cream rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="relative p-6 md:p-8">
                    <button onClick={onClose} className="absolute top-4 right-4 text-dark-choco hover:text-red-500 transition-colors">
                        <XMarkIcon />
                    </button>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <img src={product.imageUrl.replace('400/300', '600/500')} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-3xl font-serif font-bold text-dark-choco mb-2">{product.name}</h2>
                                <p className="text-gray-600 mb-6">{product.longDescription}</p>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-dark-choco mb-2">Elige la Cantidad</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {product.priceTiers.map(tier => (
                                            <label key={tier.quantity} className="flex items-center justify-between p-3 border border-peach rounded-md cursor-pointer hover:bg-peach/50 transition-colors has-[:checked]:bg-peach has-[:checked]:border-brown-sugar">
                                                <div className="flex items-center">
                                                     <input 
                                                        type="radio" 
                                                        name="tier" 
                                                        value={tier.quantity}
                                                        checked={selectedTier.quantity === tier.quantity}
                                                        onChange={() => setSelectedTier(tier)}
                                                        className="h-4 w-4 text-brown-sugar focus:ring-brown-sugar"
                                                    />
                                                    <span className="ml-3 text-sm font-medium text-dark-choco">{tier.label}</span>
                                                </div>
                                                <span className="text-sm font-semibold">${tier.price.toLocaleString('es-CL')}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <CustomizationSelect id="flavor" name="Sabor del Bizcocho" options={customizationOptions.flavors} value={customizations.flavor} onChange={handleCustomizationChange} />
                                    <CustomizationSelect id="filling" name="Tipo de Relleno" options={customizationOptions.fillings} value={customizations.filling} onChange={handleCustomizationChange} />
                                    <CustomizationSelect id="color" name="Color de la Decoración" options={customizationOptions.colors} value={customizations.color} onChange={handleCustomizationChange} />
                                    
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-dark-choco mb-1">Mensaje Personalizado (opcional)</label>
                                        <input type="text" id="message" name="message" value={customizations.message} onChange={handleCustomizationChange} maxLength={30} className="w-full px-3 py-2 border border-peach rounded-md focus:ring-brown-sugar focus:border-brown-sugar bg-white" placeholder="Ej: Feliz Cumpleaños, Mamá"/>
                                    </div>
                                </div>
                                
                                <div className="mt-auto">
                                    <button type="submit" className="w-full bg-gold-accent text-dark-choco font-bold py-3 px-6 rounded-md hover:opacity-90 transition-opacity duration-300 shadow-md">
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
        <label htmlFor={id} className="block text-sm font-medium text-dark-choco mb-1">{name}</label>
        <select id={id} name={id} value={value} onChange={onChange} className="w-full px-3 py-2 border border-peach rounded-md focus:ring-brown-sugar focus:border-brown-sugar bg-white">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default ProductModal;
