
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, Phone, User, MapPin, Calendar, MessageSquare, ChevronRight, AlertCircle } from 'lucide-react';
import { CartItem, OrderDetails, DeliveryZone } from '../types';
import { WhatsappIcon } from './icons/WhatsappIcon';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    deliveryZones: DeliveryZone[];
    onRemoveItem: (itemId: string) => void;
    onConfirmOrder: (orderDetails: OrderDetails) => void;
    cartItemCount: number;
}

const YOUR_WHATSAPP_NUMBER = "56954681985"; // Número de WhatsApp actualizado.

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, deliveryZones, onRemoveItem, onConfirmOrder, cartItemCount }) => {
    const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [selectedZoneId, setSelectedZoneId] = useState<string>('');
    const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [error, setError] = useState('');

    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setError('');
            const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);
    
    const selectedZone = useMemo(() => 
        deliveryZones.find(z => z.id === selectedZoneId), 
        [deliveryZones, selectedZoneId]
    );

    const shippingCost = useMemo(() => 
        deliveryType === 'delivery' ? (selectedZone?.price || 0) : 0, 
        [deliveryType, selectedZone]
    );
    const subtotal = useMemo(() => cartItems.reduce((total, item) => total + item.selectedTier.price, 0), [cartItems]);
    const total = useMemo(() => subtotal + shippingCost, [subtotal, shippingCost]);
    
    const generateWhatsAppMessage = () => {
        let message = `¡Hola Pastelicias! 👋 Quiero hacer el siguiente pedido:\n\n`;
        message += `*MI PEDIDO:*\n`;
        cartItems.forEach(item => {
            message += `• *${item.product.name}* (${item.selectedTier.label}) - $${item.selectedTier.price.toLocaleString('es-CL')}\n`;
            if (item.selectedSubProducts && item.selectedSubProducts.length > 0) {
                 message += `  - Selección: ${item.selectedSubProducts.join(', ')}\n`;
            }
            if (item.customizations.message) {
                 message += `  - Mensaje: "${item.customizations.message}"\n`;
            }
        });
        message += `\n*Subtotal:* $${subtotal.toLocaleString('es-CL')}`;
        message += `\n*Envío:* $${shippingCost.toLocaleString('es-CL')}`;
        message += `\n*TOTAL:* *$${total.toLocaleString('es-CL')}*\n`;
        message += `\n*DETALLES DE ENTREGA:*`;
        message += `\n- *Tipo:* ${deliveryType === 'pickup' ? 'Retiro en Tienda' : 'Entrega a Domicilio'}`;
        if (deliveryType === 'delivery') {
            message += `\n- *ZONA SELECCIONADA:* ${selectedZone ? selectedZone.name : 'No especificada'}`;
            message += `\n- *DIRECCIÓN:* ${customerAddress || 'No especificada'}`;
            message += `\n- *COSTO ENVÍO:* $${shippingCost.toLocaleString('es-CL')}`;
            message += `\n_(Sujeto a verificación de dirección)_`;
        }
        message += `\n- *Fecha:* ${deliveryDate}`;
        if (specialInstructions) {
            message += `\n- *Instrucciones:* ${specialInstructions}`;
        }
        message += `\n\n*Mis Datos:*`;
        message += `\n- *Nombre:* ${customerName}`;
        message += `\n- *Teléfono:* ${customerPhone}`;
        message += `\n\nQuedo a la espera de los datos para la transferencia. ¡Gracias!`;

        return encodeURIComponent(message);
    };

    const handleConfirm = () => {
        if (!customerName.trim() || !customerPhone.trim()) {
            setError('Por favor, completa tu nombre y teléfono.');
            return;
        }

        if (deliveryType === 'delivery') {
            if (!selectedZoneId) {
                setError('Por favor, selecciona una zona de despacho.');
                return;
            }
            if (!customerAddress.trim()) {
                setError('Por favor, ingresa la dirección para el despacho.');
                return;
            }
        }

        setError('');

        const orderDetails: OrderDetails = {
            items: cartItems,
            total,
            customerName,
            customerPhone,
            customerAddress: deliveryType === 'delivery' ? customerAddress : undefined,
            deliveryZone: deliveryType === 'delivery' ? selectedZone?.name : undefined,
            deliveryType,
            deliveryDate,
            specialInstructions,
            shippingCost,
            subtotal
        };

        onConfirmOrder(orderDetails);
        
        const whatsappUrl = `https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=${generateWhatsAppMessage()}`;
        window.open(whatsappUrl, '_blank');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-cocoa-brown/60 backdrop-blur-sm z-50" 
                        onClick={onClose} 
                    />
                    <motion.div 
                        ref={sidebarRef}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md sm:max-w-lg bg-cream shadow-2xl z-50 flex flex-col outline-none border-l border-cream/20"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Header */}
                        <div className="p-6 sm:p-8 border-b border-blush-pink/20 flex justify-between items-center bg-cream/10">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-gold/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-rose-gold shadow-inner">
                                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-cocoa-brown">Tu Carrito</h2>
                                    <p className="text-[10px] font-bold text-muted-mauve/60 uppercase tracking-widest">{cartItemCount} {cartItemCount === 1 ? 'producto' : 'productos'}</p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="w-9 h-9 sm:w-10 sm:h-10 bg-cream/50 rounded-full flex items-center justify-center text-cocoa-brown hover:bg-rose-gold hover:text-white transition-all"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-grow overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-24 h-24 bg-cream/50 rounded-full flex items-center justify-center text-muted-mauve/20">
                                        <ShoppingBag className="w-12 h-12" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif font-bold text-cocoa-brown mb-2">Tu carrito está vacío</h3>
                                        <p className="text-muted-mauve max-w-[200px] mx-auto">Parece que aún no has añadido ninguna delicia.</p>
                                    </div>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onClose} 
                                        className="bg-rose-gold text-cocoa-brown font-bold py-3 px-8 rounded-2xl hover:bg-muted-mauve hover:text-white transition-all shadow-lg shadow-rose-gold/20"
                                    >
                                        Seguir Comprando
                                    </motion.button>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    {/* Items List */}
                                    <div className="space-y-4">
                                        {cartItems.map(item => (
                                            <CartItemCard key={item.id} item={item} onRemoveItem={onRemoveItem} />
                                        ))}
                                    </div>

                                    {/* Customer Form */}
                                    <div className="space-y-6 pt-6 border-t border-blush-pink/20">
                                        <div className="flex items-center gap-2 text-cocoa-brown font-bold font-serif text-lg">
                                            <User className="w-5 h-5 text-rose-gold" />
                                            <h3>Tus Datos</h3>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <SidebarInput icon={<User className="w-4 h-4" />} placeholder="Tu Nombre *" value={customerName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)} />
                                            <SidebarInput icon={<Phone className="w-4 h-4" />} type="tel" placeholder="Tu Teléfono (WhatsApp) *" value={customerPhone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerPhone(e.target.value)} />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-cocoa-brown font-bold font-serif text-lg">
                                                <MapPin className="w-5 h-5 text-rose-gold" />
                                                <h3>Tipo de Entrega</h3>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                <RadioOption id="pickup" name="deliveryType" value="pickup" checked={deliveryType === 'pickup'} onChange={() => setDeliveryType('pickup')} label="Retiro en Tienda" cost="$0" />
                                                <RadioOption id="delivery" name="deliveryType" value="delivery" checked={deliveryType === 'delivery'} onChange={() => setDeliveryType('delivery')} label="Entrega a Domicilio" cost={selectedZone ? `$${selectedZone.price.toLocaleString('es-CL')}` : 'Selecciona zona'} />
                                            </div>
                                            
                                            <AnimatePresence>
                                                {deliveryType === 'delivery' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden space-y-4"
                                                    >
                                                        <div className="flex items-center gap-2 text-cocoa-brown font-bold font-serif text-lg pt-2">
                                                            <MapPin className="w-5 h-5 text-rose-gold" />
                                                            <h3>Zona de Despacho</h3>
                                                        </div>
                                                        <div className="relative group">
                                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-mauve/40 group-focus-within:text-rose-gold transition-colors">
                                                                <MapPin className="w-4 h-4" />
                                                            </div>
                                                            <select 
                                                                value={selectedZoneId}
                                                                onChange={(e) => setSelectedZoneId(e.target.value)}
                                                                className="w-full bg-cream/20 border-2 border-blush-pink/30 rounded-2xl py-4 pl-14 pr-6 text-cocoa-brown focus:border-rose-gold focus:ring-4 focus:ring-rose-gold/10 transition-all outline-none appearance-none cursor-pointer"
                                                            >
                                                                <option value="">Selecciona una zona...</option>
                                                                {deliveryZones.map(zone => (
                                                                    <option key={zone.id} value={zone.id}>
                                                                        {zone.name} (${zone.price.toLocaleString('es-CL')})
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted-mauve/40">
                                                                <ChevronRight className="w-4 h-4 rotate-90" />
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-cocoa-brown font-bold font-serif text-lg pt-2">
                                                            <MapPin className="w-5 h-5 text-rose-gold" />
                                                            <h3>Dirección de Despacho</h3>
                                                        </div>
                                                        <SidebarInput 
                                                            icon={<MapPin className="w-4 h-4" />} 
                                                            placeholder="Calle, número, depto/casa *" 
                                                            value={customerAddress} 
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerAddress(e.target.value)} 
                                                        />
                                                        <p className="text-[10px] text-red-500/70 italic px-2">
                                                            * La dirección será verificada. Si la zona no corresponde, el costo de envío será ajustado.
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-cocoa-brown font-bold font-serif text-lg">
                                                <Calendar className="w-5 h-5 text-rose-gold" />
                                                <h3>Fecha de Entrega</h3>
                                            </div>
                                            <SidebarInput icon={<Calendar className="w-4 h-4" />} type="date" value={deliveryDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeliveryDate(e.target.value)} />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-cocoa-brown font-bold font-serif text-lg">
                                                <MessageSquare className="w-5 h-5 text-rose-gold" />
                                                <h3>Instrucciones Especiales</h3>
                                            </div>
                                            <textarea 
                                                placeholder="Ej: Tocar el timbre fuerte, dejar en conserjería..." 
                                                rows={3} 
                                                value={specialInstructions} 
                                                onChange={e => setSpecialInstructions(e.target.value)} 
                                                className="w-full bg-cream/20 border-2 border-blush-pink/30 rounded-2xl py-4 px-6 text-cocoa-brown focus:border-rose-gold focus:ring-4 focus:ring-rose-gold/10 transition-all outline-none placeholder:text-muted-mauve/30 resize-none"
                                            />
                                        </div>

                                        <AnimatePresence>
                                            {error && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold"
                                                >
                                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                                    {error}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-6 sm:p-8 border-t border-blush-pink/20 bg-cream shadow-[0_-10px_40px_rgba(0,0,0,0.05)] space-y-4 sm:space-y-6">
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex justify-between text-muted-mauve font-medium text-sm sm:text-base">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toLocaleString('es-CL')}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-mauve font-medium text-sm sm:text-base">
                                        <span>Costo de Envío</span>
                                        <span>${shippingCost.toLocaleString('es-CL')}</span>
                                    </div>
                                    <div className="pt-3 sm:pt-4 border-t border-blush-pink/10 flex justify-between items-center">
                                        <span className="text-xl sm:text-2xl font-serif font-bold text-cocoa-brown">Total</span>
                                        <span className="text-2xl sm:text-3xl font-bold text-rose-gold">${total.toLocaleString('es-CL')}</span>
                                    </div>
                                </div>
                                
                                <motion.button 
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleConfirm} 
                                    className="w-full bg-[#25D366] text-white font-bold py-4 sm:py-5 rounded-2xl hover:bg-[#128C7E] transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-2 sm:gap-3 group"
                                >
                                    <WhatsappIcon />
                                    <span className="text-base sm:text-lg">Confirmar por WhatsApp</span>
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const CartItemCard: React.FC<{item: CartItem; onRemoveItem: (itemId: string) => void}> = ({ item, onRemoveItem }) => (
    <div className="flex gap-4 bg-cream/20 p-4 rounded-3xl border border-blush-pink/10 hover:bg-cream/40 transition-colors group">
        <div className="relative shrink-0">
            <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-2xl shadow-sm group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold font-serif text-cocoa-brown truncate pr-2">{item.product.name}</h4>
                <button 
                    onClick={() => onRemoveItem(item.id)} 
                    className="text-muted-mauve/40 hover:text-red-500 transition-colors p-1"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            <p className="text-xs font-bold text-rose-gold mb-2">{item.selectedTier.label}</p>
            
            <div className="space-y-1">
                {item.customizations.flavor && <p className="text-[10px] text-muted-mauve/70"><span className="font-bold">Sabor:</span> {item.customizations.flavor}</p>}
                {item.customizations.filling && <p className="text-[10px] text-muted-mauve/70"><span className="font-bold">Relleno:</span> {item.customizations.filling}</p>}
                {item.customizations.color && <p className="text-[10px] text-muted-mauve/70"><span className="font-bold">Color:</span> {item.customizations.color}</p>}
                {item.customizations.message && <p className="text-[10px] text-rose-gold/80 italic">"{item.customizations.message}"</p>}
            </div>
            
            {item.selectedSubProducts && item.selectedSubProducts.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {item.selectedSubProducts.map(name => (
                        <span key={name} className="text-[9px] bg-cream/50 px-2 py-0.5 rounded-full border border-blush-pink/20 text-cocoa-brown/60">{name}</span>
                    ))}
                </div>
            )}
            
            <div className="text-right mt-2">
                <span className="font-bold text-cocoa-brown">${item.selectedTier.price.toLocaleString('es-CL')}</span>
            </div>
        </div>
    </div>
);

const SidebarInput: React.FC<{icon: React.ReactNode, [key: string]: any}> = ({ icon, ...props }) => (
    <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-gold group-focus-within:text-cocoa-brown transition-colors">
            {icon}
        </div>
        <input 
            {...props} 
            className="w-full bg-cream/20 border-2 border-blush-pink/30 rounded-2xl py-4 pl-14 pr-6 text-cocoa-brown focus:border-rose-gold focus:ring-4 focus:ring-rose-gold/10 transition-all outline-none placeholder:text-muted-mauve/30"
        />
    </div>
);

const RadioOption: React.FC<{id: string, name: string, value: string, checked: boolean, onChange: (e:any) => void, label: string, cost?: string}> = ({id, name, value, checked, onChange, label, cost}) => (
    <label 
        htmlFor={id} 
        className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
            checked 
            ? 'bg-rose-gold/10 border-rose-gold shadow-sm ring-4 ring-rose-gold/5' 
            : 'bg-cream/50 border-blush-pink/20 hover:border-blush-pink/50 hover:bg-cream/30'
        }`}
    >
        <div className="flex items-center">
            <div className="relative flex items-center">
                <input 
                    type="radio" 
                    id={id} 
                    name={name} 
                    value={value} 
                    checked={checked} 
                    onChange={onChange} 
                    className="peer h-5 w-5 rounded-full border-2 border-blush-pink text-rose-gold focus:ring-rose-gold transition-all appearance-none checked:bg-rose-gold checked:border-rose-gold" 
                />
                <div className="absolute w-2 h-2 bg-cream rounded-full opacity-0 peer-checked:opacity-100 left-1.5 pointer-events-none transition-opacity" />
            </div>
            <span className={`ml-4 text-sm font-bold ${checked ? 'text-cocoa-brown' : 'text-muted-mauve'}`}>{label}</span>
        </div>
        {cost && <span className="text-sm font-bold text-cocoa-brown">{cost}</span>}
    </label>
);

export default CartSidebar;