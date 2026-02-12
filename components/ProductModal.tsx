import React, { useState, useEffect, useRef } from 'react';
import { Product, CustomizationOptions, CustomizationCollection } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface ProductModalProps {
    product: Product;
    onClose: () => void;
    onAddToCart: (product: Product, selectedTier: { quantity: number; price: number; label: string; }, customizations: CustomizationOptions) => void;
    customizationOptions: CustomizationCollection;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart, customizationOptions }) => {
    // 1. Estado para la cantidad/precio seleccionado
    const [selectedTier, setSelectedTier] = useState(product.priceTiers[0]);
    
    // 2. Estado para personalizaciones CORREGIDO:
    // Se inicializa con el primer valor de la lista para evitar discrepancias entre UI y Estado.
    const [customizations, setCustomizations] = useState<CustomizationOptions>(() => {
        return {
            flavor: product.availableCustomizations?.includes('flavors') ? customizationOptions.flavors[0] : '',
            filling: product.availableCustomizations?.includes('fillings') ? customizationOptions.fillings[0] : '',
            color: product.availableCustomizations?.includes('colors') ? customizationOptions.colors[0] : '',
            message: ''
        };
    });

    const modalRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);

    // Manejo de accesibilidad y teclado (Escape)
    useEffect(() => {
        triggerRef.current = document.activeElement as HTMLElement;
        modalRef.current?.focus();
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            triggerRef.current?.focus();
        };
    }, [onClose]);

    // Manejador genérico de cambios CORREGIDO:
    // Ahora funciona correctamente porque el componente hijo pasa el atributo 'name'.
    const handleCustomizationChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomizations(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddToCart(product, selectedTier, customizations);
    };

    const hasCustomizations = product.availableCustomizations && product.availableCustomizations.length > 0;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
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
                    <button onClick={onClose} className="absolute top-4 right-4 text-dark-choco hover:text-red-500 transition-colors" aria-label="Cerrar modal">
                        <XMarkIcon />
                    </button>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Imagen del Producto */}
                            <div className="h-full">
                                <img src={product.imageUrl} alt={product.name} className="w-full h-64 sm:h-80 md:h-full object-cover rounded-lg shadow-md" />
                            </div>

                            {/* Detalles y Opciones */}
                            <div className="flex flex-col">
                                <h2 id="modal-title" className="text-2xl md:text-3xl font-serif font-bold text-dark-choco mb-2">{product.name}</h2>
                                <p className="text-gray-600 mb-6 text-sm md:text-base">{product.longDescription}</p>

                                {/* Selector de Cantidades (Price Tiers) */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-dark-choco mb-3">Elige la Cantidad</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {product.priceTiers.map(tier => (
                                            <label 
                                                key={tier.quantity} 
                                                className={`flex items-center justify-between p-3 border rounded-md cursor-pointer transition-all ${
                                                    selectedTier.quantity === tier.quantity 
                                                    ? 'bg-peach border-brown-sugar ring-2 ring-brown-sugar/20' 
                                                    : 'border-peach hover:bg-peach/30'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <input 
                                                        type="radio" 
                                                        name="tier" 
                                                        checked={selectedTier.quantity === tier.quantity}
                                                        onChange={() => setSelectedTier(tier)}
                                                        className="h-4 w-4 text-dark-choco focus:ring-dark-choco"
                                                    />
                                                    <span className="ml-3 text-sm font-medium">{tier.label}</span>
                                                </div>
                                                <span className="text-sm font-bold">${tier.price.toLocaleString('es-CL')}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Secciones de Personalización */}
                                {hasCustomizations && (
                                    <div className="space-y-4 mb-6">
                                        {product.availableCustomizations?.includes('flavors') && (
                                            <CustomizationSelect 
                                                id="flavor" 
                                                name="Sabor del Bizcocho" 
                                                options={customizationOptions.flavors} 
                                                value={customizations.flavor} 
                                                onChange={handleCustomizationChange} 
                                            />
                                        )}
                                        {product.availableCustomizations?.includes('fillings') && (
                                            <CustomizationSelect 
                                                id="filling" 
                                                name="Tipo de Relleno" 
                                                options={customizationOptions.fillings} 
                                                value={customizations.filling} 
                                                onChange={handleCustomizationChange} 
                                            />
                                        )}
                                        {product.availableCustomizations?.includes('colors') && (
                                            <CustomizationSelect 
                                                id="color" 
                                                name="Color de la Decoración" 
                                                options={customizationOptions.colors} 
                                                value={customizations.color} 
                                                onChange={handleCustomizationChange} 
                                            />
                                        )}
                                        
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-dark-choco mb-1">Mensaje Personalizado (opcional)</label>
                                            <input 
                                                type="text" 
                                                id="message" 
                                                name="message" 
                                                value={customizations.message} 
                                                onChange={handleCustomizationChange} 
                                                maxLength={30} 
                                                className="w-full px-3 py-2 border border-peach rounded-md focus:ring-brown-sugar focus:border-brown-sugar bg-white" 
                                                placeholder="Ej: Feliz Cumpleaños, Mamá"
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                {/* Botón de Acción */}
                                <div className="mt-auto pt-6">
                                    <button 
                                        type="submit" 
                                        className="w-full bg-dark-choco text-cream font-bold py-3 px-6 rounded-lg hover:bg-brown-sugar transition-colors shadow-md"
                                    >
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

// --- Subcomponente Auxiliar CORREGIDO ---
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
        <select 
            id={id} 
            name={id} // Crucial: vincula el nombre al estado del padre
            value={value} 
            onChange={onChange} 
            className="w-full px-3 py-2 border border-peach rounded-md focus:ring-brown-sugar focus:border-brown-sugar bg-white"
        >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default ProductModal;