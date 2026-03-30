
import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Download, ShoppingBag, Phone, MapPin, Calendar, MessageSquare } from 'lucide-react';
import { OrderDetails, CartItem } from '../types';

interface ConfirmationPageProps {
    orderDetails: OrderDetails | null;
}

const generateOrderSummaryText = (details: OrderDetails): string => {
    let summary = `Resumen del Pedido - Pastelicias\n`;
    summary += `==================================\n\n`;
    summary += `DATOS DEL CLIENTE:\n`;
    summary += `Nombre: ${details.customerName}\n`;
    summary += `Teléfono: ${details.customerPhone}\n\n`;
    summary += `DETALLES DE ENTREGA:\n`;
    summary += `Método: ${details.deliveryType === 'pickup' ? 'Retiro en Tienda' : 'Entrega a Domicilio'}\n`;
    summary += `Fecha Solicitada: ${details.deliveryDate}\n`;
    if (details.specialInstructions) {
        summary += `Instrucciones: ${details.specialInstructions}\n`;
    }
    summary += `\nPRODUCTOS:\n`;
    details.items.forEach(item => {
        summary += `----------------------------------\n`;
        summary += `* ${item.product.name} (${item.selectedTier.label})\n`;
        if (item.selectedSubProducts && item.selectedSubProducts.length > 0) {
            summary += `  - Selección: ${item.selectedSubProducts.join(', ')}\n`;
        }
        if (item.customizations.message) {
            summary += `  - Mensaje: "${item.customizations.message}"\n`;
        }
        summary += `  - Precio: $${item.selectedTier.price.toLocaleString('es-CL')}\n`;
    });
    summary += `----------------------------------\n\n`;
    summary += `RESUMEN DE PAGO:\n`;
    summary += `Subtotal: $${details.subtotal.toLocaleString('es-CL')}\n`;
    summary += `Costo de Envío: $${details.shippingCost.toLocaleString('es-CL')}\n`;
    summary += `TOTAL A PAGAR: $${details.total.toLocaleString('es-CL')}\n`;
    
    return summary;
};

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ orderDetails }) => {
    if (!orderDetails) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-rose-gold/10 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-rose-gold" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-cocoa-brown mb-4">No se encontró ningún pedido</h2>
                <p className="text-muted-mauve max-w-md mb-8 text-lg">
                    Parece que llegaste aquí por error. Puedes volver al inicio para hacer un nuevo pedido.
                </p>
                <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#" 
                    className="bg-rose-gold text-cocoa-brown font-bold py-4 px-10 rounded-2xl hover:bg-muted-mauve hover:text-white transition-all shadow-lg shadow-rose-gold/20"
                >
                    Volver al Inicio
                </motion.a>
            </div>
        );
    }

    const handleDownload = () => {
        const summaryText = generateOrderSummaryText(orderDetails);
        const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pedido_pastelicias_${orderDetails.customerName.replace(/\s/g, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    return (
        <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            {/* Header Card */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden mb-8 border border-blush-pink/30">
                <div className="bg-gradient-to-r from-green-50 to-white p-10 text-center relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
                        <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[200%] rotate-12 bg-[radial-gradient(circle,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    </div>
                    
                    <motion.div 
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white"
                    >
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </motion.div>
                    
                    <h1 className="text-4xl font-serif font-bold text-cocoa-brown mb-4 tracking-tight">¡Pedido Recibido!</h1>
                    <p className="text-muted-mauve max-w-xl mx-auto text-lg leading-relaxed">
                        Hemos enviado tu pedido por WhatsApp. Por favor, finaliza la compra enviando el mensaje y te responderemos con los datos para el pago.
                    </p>
                </div>
                
                <div className="p-8 md:p-12 space-y-12">
                    {/* Customer Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DetailItem icon={<ShoppingBag className="w-5 h-5" />} label="Cliente" value={orderDetails.customerName} />
                        <DetailItem icon={<Phone className="w-5 h-5" />} label="Teléfono" value={orderDetails.customerPhone} />
                        <DetailItem icon={<MapPin className="w-5 h-5" />} label="Entrega" value={orderDetails.deliveryType === 'pickup' ? 'Retiro en Tienda' : 'A Domicilio'} />
                        <DetailItem icon={<Calendar className="w-5 h-5" />} label="Fecha" value={orderDetails.deliveryDate} />
                    </div>

                    {orderDetails.specialInstructions && (
                        <div className="bg-cream/40 p-6 rounded-3xl border border-blush-pink/20">
                            <div className="flex items-center gap-3 mb-3 text-cocoa-brown font-bold font-serif">
                                <MessageSquare className="w-5 h-5 text-rose-gold" />
                                <h3>Instrucciones Especiales</h3>
                            </div>
                            <p className="text-muted-mauve leading-relaxed">{orderDetails.specialInstructions}</p>
                        </div>
                    )}

                    {/* Items List */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-serif font-bold text-cocoa-brown border-b border-blush-pink pb-4">Tu Selección</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {orderDetails.items.map(item => <OrderItem key={item.id} item={item} />)}
                        </div>
                    </div>

                    {/* Totals Section */}
                    <div className="bg-cocoa-brown text-white rounded-[2rem] p-8 md:p-10 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-gold/10 rounded-full -ml-16 -mb-16 blur-2xl" />
                        
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-white/70">
                                <span className="text-lg">Subtotal</span>
                                <span className="font-medium">${orderDetails.subtotal.toLocaleString('es-CL')}</span>
                            </div>
                            <div className="flex justify-between items-center text-white/70">
                                <span className="text-lg">Costo de Envío</span>
                                <span className="font-medium">${orderDetails.shippingCost.toLocaleString('es-CL')}</span>
                            </div>
                            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                <span className="text-2xl font-serif font-bold">Total a Pagar</span>
                                <span className="text-3xl font-bold text-rose-gold">${orderDetails.total.toLocaleString('es-CL')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <motion.a 
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            href="#" 
                            className="flex-1 text-center bg-rose-gold text-cocoa-brown font-bold py-5 px-8 rounded-2xl hover:bg-muted-mauve hover:text-white transition-all shadow-lg shadow-rose-gold/20 flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Seguir Comprando
                        </motion.a>
                        <motion.button 
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleDownload} 
                            className="flex-1 bg-white border-2 border-blush-pink text-cocoa-brown font-bold py-5 px-8 rounded-2xl hover:bg-cream transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Descargar Resumen (.txt)
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

// Helper components for the confirmation page
const DetailItem: React.FC<{icon: React.ReactNode, label: string, value: string}> = ({ icon, label, value }) => (
    <div className="bg-cream/40 p-5 rounded-3xl border border-blush-pink/10 flex flex-col items-center text-center">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm text-rose-gold">
            {icon}
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-mauve/60 mb-1">{label}</p>
        <p className="text-cocoa-brown font-bold">{value}</p>
    </div>
);

const OrderItem: React.FC<{item: CartItem}> = ({ item }) => (
    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start bg-cream/30 p-6 rounded-3xl border border-blush-pink/10 hover:bg-cream/50 transition-colors group">
        <div className="relative">
            <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute -top-2 -right-2 bg-rose-gold text-cocoa-brown w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg">
                {item.selectedTier.quantity}
            </div>
        </div>
        <div className="flex-grow text-center sm:text-left">
            <h4 className="text-xl font-serif font-bold text-cocoa-brown mb-1">{item.product.name}</h4>
            <p className="text-muted-mauve font-medium mb-3">{item.selectedTier.label}</p>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {item.selectedSubProducts && item.selectedSubProducts.length > 0 && (
                    <span className="text-xs bg-white/80 px-3 py-1 rounded-full text-cocoa-brown/70 border border-blush-pink/20">
                        Variedades: {item.selectedSubProducts.join(', ')}
                    </span>
                )}
                {item.customizations.message && (
                    <span className="text-xs bg-rose-gold/10 px-3 py-1 rounded-full text-cocoa-brown/70 border border-rose-gold/20 italic">
                        "{item.customizations.message}"
                    </span>
                )}
            </div>
        </div>
        <div className="text-2xl font-bold text-cocoa-brown">
            ${item.selectedTier.price.toLocaleString('es-CL')}
        </div>
    </div>
);

export default ConfirmationPage;