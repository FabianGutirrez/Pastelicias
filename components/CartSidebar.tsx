
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CartItem } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { TrashIcon } from './icons/TrashIcon';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onRemoveItem: (itemId: string) => void;
    onConfirmOrder: (items: CartItem[], total: number) => void;
    cartItemCount: number;
}

const DELIVERY_SHIPPING_COST = 5000; // Centralized shipping cost

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, onRemoveItem, onConfirmOrder, cartItemCount }) => {
    const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
    const [paymentMethod, setPaymentMethod] = useState<'full' | 'half'>('full');
    
    const sidebarRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            triggerRef.current = document.activeElement as HTMLElement;
            sidebarRef.current?.focus();

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
        }
    }, [isOpen, onClose]);
    
    const shippingCost = useMemo(() => deliveryType === 'delivery' ? DELIVERY_SHIPPING_COST : 0, [deliveryType]);
    
    const subtotal = useMemo(() => 
        cartItems.reduce((total, item) => total + item.selectedTier.price, 0),
        [cartItems]
    );

    const total = useMemo(() => subtotal + shippingCost, [subtotal, shippingCost]);
    
    const amountToPayOnline = useMemo(() => 
        paymentMethod === 'full' ? total : total / 2,
        [paymentMethod, total]
    );

    const handleConfirmClick = () => {
        onConfirmOrder(cartItems, total);
    };

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black bg-opacity-60 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                onClick={onClose}
                aria-hidden="true"
            ></div>
            <div 
                ref={sidebarRef}
                className={`fixed top-0 right-0 h-full w-full max-w-md sm:max-w-lg bg-cream shadow-2xl transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'} outline-none`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="sidebar-title"
                tabIndex={-1}
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-6 border-b border-blush-pink flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <h2 id="sidebar-title" className="text-2xl font-serif font-bold text-cocoa-brown">Tu Carrito</h2>
                            {cartItems.length > 0 && (
                                <span className="bg-rose-gold text-cream text-sm font-bold rounded-full h-7 w-7 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </div>
                        <button onClick={onClose} className="text-cocoa-brown hover:text-red-500 transition-colors" aria-label="Cerrar carrito">
                            <XMarkIcon />
                        </button>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                            <p className="text-gray-500 text-lg">Tu carrito está vacío.</p>
                            <button onClick={onClose} className="mt-4 bg-rose-gold text-cocoa-brown font-bold py-2 px-6 rounded-lg hover:bg-muted-mauve transition-colors">
                                Seguir Comprando
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex-grow overflow-y-auto p-6 space-y-4">
                                {/* Product List */}
                                <div className="space-y-4">
                                    {cartItems.map(item => (
                                        <CartItemCard key={item.id} item={item} onRemoveItem={onRemoveItem} />
                                    ))}
                                </div>

                                {/* Separator */}
                                <div className="pt-4 mt-4 border-t border-blush-pink"></div>

                                {/* Checkout Form within scrollable area */}
                                <div className="space-y-4">
                                    {/* Delivery Options */}
                                    <fieldset className="space-y-2">
                                        <legend className="text-lg font-semibold text-cocoa-brown mb-2">Tipo de Entrega</legend>
                                        <RadioOption id="pickup" name="deliveryType" value="pickup" checked={deliveryType === 'pickup'} onChange={() => setDeliveryType('pickup')} label="Retiro en Tienda" cost="$0" />
                                        <RadioOption id="delivery" name="deliveryType" value="delivery" checked={deliveryType === 'delivery'} onChange={() => setDeliveryType('delivery')} label="Entrega a Domicilio" cost={`$${DELIVERY_SHIPPING_COST.toLocaleString('es-CL')}`} />
                                    </fieldset>
                                    
                                    {deliveryType === 'delivery' && (
                                        <input type="text" placeholder="Dirección de Envío" className="w-full px-3 py-2 border border-blush-pink rounded-md focus:ring-rose-gold focus:border-rose-gold" />
                                    )}
                                    
                                    <input type="date" className="w-full px-3 py-2 border border-blush-pink rounded-md focus:ring-rose-gold focus:border-rose-gold" defaultValue={new Date().toISOString().split('T')[0]}/>
                                    <textarea placeholder="Instrucciones Especiales (opcional)" rows={2} className="w-full px-3 py-2 border border-blush-pink rounded-md focus:ring-rose-gold focus:border-rose-gold"></textarea>
                                    
                                    {/* Payment Options */}
                                    <fieldset className="space-y-2">
                                        <legend className="text-lg font-semibold text-cocoa-brown mb-2">Método de Pago</legend>
                                        <RadioOption id="full_payment" name="paymentMethod" value="full" checked={paymentMethod === 'full'} onChange={() => setPaymentMethod('full')} label="Pago Completo Online" />
                                        <RadioOption id="half_payment" name="paymentMethod" value="half" checked={paymentMethod === 'half'} onChange={() => setPaymentMethod('half')} label="Pagar 50% Online y 50% al Recibir" />
                                    </fieldset>

                                    <div className="space-y-2 border border-blush-pink p-4 rounded-md">
                                        <h4 className="font-semibold">Detalles de la Tarjeta</h4>
                                        <input type="text" placeholder="Número de Tarjeta" className="w-full px-3 py-2 border border-blush-pink rounded-md" />
                                        <div className="grid grid-cols-3 gap-2">
                                            <input type="text" placeholder="MM/YY" className="col-span-1 px-3 py-2 border border-blush-pink rounded-md" />
                                            <input type="text" placeholder="CVV" className="col-span-1 px-3 py-2 border border-blush-pink rounded-md" />
                                        </div>
                                        <input type="text" placeholder="Nombre en la Tarjeta" className="w-full px-3 py-2 border border-blush-pink rounded-md" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Fixed Footer for Totals and Action Button */}
                            <div className="p-6 border-t border-blush-pink bg-cream/80 backdrop-blur-sm flex-shrink-0 space-y-4">
                                <div className="space-y-1 text-cocoa-brown">
                                    <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toLocaleString('es-CL')}</span></div>
                                    <div className="flex justify-between"><span>Envío:</span><span>${shippingCost.toLocaleString('es-CL')}</span></div>
                                    <div className="flex justify-between font-bold text-xl"><span className="font-serif">Total:</span><span>${total.toLocaleString('es-CL')}</span></div>
                                    {paymentMethod === 'half' && (
                                    <>
                                        <div className="flex justify-between text-green-700 font-semibold"><span>A Pagar Online (50%):</span><span>${(total / 2).toLocaleString('es-CL')}</span></div>
                                        <div className="flex justify-between text-orange-600"><span>Pendiente Presencial:</span><span>${(total / 2).toLocaleString('es-CL')}</span></div>
                                    </>
                                    )}
                                </div>

                                <button onClick={handleConfirmClick} className="w-full bg-rose-gold text-cocoa-brown font-bold py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-md">
                                    Confirmar Pedido - Pagar ${amountToPayOnline.toLocaleString('es-CL')}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};


const CartItemCard: React.FC<{item: CartItem; onRemoveItem: (itemId: string) => void}> = ({ item, onRemoveItem }) => {
    return (
        <div className="flex items-start gap-4 bg-white p-3 rounded-lg shadow-sm">
            <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
            <div className="flex-grow">
                <h4 className="font-bold font-serif text-cocoa-brown">{item.product.name}</h4>
                <p className="text-sm font-semibold text-muted-mauve">{item.selectedTier.label}</p>
                <div className="text-xs text-gray-500 mt-1">
                    {item.customizations.flavor && <p>Sabor: {item.customizations.flavor}</p>}
                    {item.customizations.filling && <p>Relleno: {item.customizations.filling}</p>}
                    {item.customizations.color && <p>Color: {item.customizations.color}</p>}
                    {item.customizations.message && <p>Mensaje: "{item.customizations.message}"</p>}
                </div>
                {item.selectedSubProducts && item.selectedSubProducts.length > 0 && (
                    <div className="mt-2">
                        <p className="text-xs font-bold text-cocoa-brown">Tu selección:</p>
                        <ul className="list-disc list-inside text-xs text-gray-600">
                            {item.selectedSubProducts.map(name => <li key={name}>{name}</li>)}
                        </ul>
                    </div>
                )}
                 <div className="text-right mt-2">
                     <span className="font-bold text-lg text-cocoa-brown">${item.selectedTier.price.toLocaleString('es-CL')}</span>
                </div>
            </div>
             <button 
                onClick={() => onRemoveItem(item.id)} 
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                aria-label={`Eliminar ${item.product.name} del carrito`}
             >
                <TrashIcon />
            </button>
        </div>
    );
};

const RadioOption: React.FC<{id: string, name: string, value: string, checked: boolean, onChange: (e:any) => void, label: string, cost?: string}> = ({id, name, value, checked, onChange, label, cost}) => (
    <label htmlFor={id} className="flex items-center justify-between p-3 border border-blush-pink rounded-md cursor-pointer hover:bg-blush-pink/50 transition-colors has-[:checked]:bg-blush-pink has-[:checked]:border-rose-gold has-[:checked]:ring-2 has-[:checked]:ring-rose-gold/50">
        <div className="flex items-center">
            <input type="radio" id={id} name={name} value={value} checked={checked} onChange={onChange} className="h-4 w-4 text-rose-gold focus:ring-rose-gold" />
            <span className="ml-3 text-sm font-medium text-cocoa-brown">{label}</span>
        </div>
        {cost && <span className="text-sm font-semibold">{cost}</span>}
    </label>
);

export default CartSidebar;