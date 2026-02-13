
import React from 'react';
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
            <div className="text-center p-8">
                <h2 className="text-2xl font-serif font-bold text-cocoa-brown">No se encontró ningún pedido.</h2>
                <p className="text-gray-600 mt-2">Parece que llegaste aquí por error. Puedes volver al inicio para hacer un nuevo pedido.</p>
                <a href="#" className="mt-4 inline-block bg-rose-gold text-cocoa-brown font-bold py-2 px-6 rounded-lg hover:bg-muted-mauve transition-colors">
                    Volver al Inicio
                </a>
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
        <section id="confirmation" className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl animate-fade-in">
            <div className="text-center border-b-2 border-dashed border-blush-pink pb-6 mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h1 className="text-3xl font-serif font-bold text-cocoa-brown">¡Pedido Recibido!</h1>
                <p className="text-gray-600 mt-2">Hemos enviado tu pedido por WhatsApp. Por favor, finaliza la compra enviando el mensaje y te responderemos con los datos para el pago.</p>
            </div>
            
            <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-cocoa-brown">Resumen del Pedido</h2>
                
                {/* Order Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <DetailItem label="Cliente" value={orderDetails.customerName} />
                    <DetailItem label="Teléfono" value={orderDetails.customerPhone} />
                    <DetailItem label="Entrega" value={orderDetails.deliveryType === 'pickup' ? 'Retiro en Tienda' : 'A Domicilio'} />
                    <DetailItem label="Fecha Solicitada" value={orderDetails.deliveryDate} />
                </div>
                {orderDetails.specialInstructions && <DetailItem label="Instrucciones Especiales" value={orderDetails.specialInstructions} />}

                {/* Items List */}
                <div className="space-y-4">
                    {orderDetails.items.map(item => <OrderItem key={item.id} item={item} />)}
                </div>

                {/* Totals */}
                <div className="pt-4 border-t border-blush-pink space-y-2">
                    <TotalRow label="Subtotal" value={orderDetails.subtotal} />
                    <TotalRow label="Envío" value={orderDetails.shippingCost} />
                    <div className="flex justify-between items-center font-bold text-lg text-cocoa-brown">
                        <span>Total a Pagar</span>
                        <span>${orderDetails.total.toLocaleString('es-CL')}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                     <a href="#" className="w-full text-center bg-rose-gold text-cocoa-brown font-bold py-3 px-6 rounded-lg hover:bg-muted-mauve transition-colors shadow">
                        Seguir Comprando
                    </a>
                    <button onClick={handleDownload} className="w-full bg-gray-200 text-cocoa-brown font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors shadow">
                        Descargar Resumen (.txt)
                    </button>
                </div>
            </div>
        </section>
    );
};

// Helper components for the confirmation page
const DetailItem: React.FC<{label: string, value: string}> = ({ label, value }) => (
    <div className="bg-cream/60 p-3 rounded-md">
        <p className="font-semibold text-muted-mauve">{label}</p>
        <p className="text-cocoa-brown">{value}</p>
    </div>
);

const OrderItem: React.FC<{item: CartItem}> = ({ item }) => (
    <div className="flex gap-4 items-start bg-cream/60 p-3 rounded-md">
        <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
        <div className="flex-grow text-sm">
            <h4 className="font-bold text-cocoa-brown">{item.product.name}</h4>
            <p className="text-muted-mauve">{item.selectedTier.label}</p>
             {item.selectedSubProducts && item.selectedSubProducts.length > 0 && (
                 <p className="text-xs text-gray-600">Selección: {item.selectedSubProducts.join(', ')}</p>
            )}
             {item.customizations.message && <p className="text-xs text-gray-600">Mensaje: "{item.customizations.message}"</p>}
        </div>
        <span className="font-semibold text-cocoa-brown">${item.selectedTier.price.toLocaleString('es-CL')}</span>
    </div>
);

const TotalRow: React.FC<{label: string, value: number}> = ({ label, value }) => (
    <div className="flex justify-between items-center text-cocoa-brown/80">
        <span>{label}</span>
        <span>${value.toLocaleString('es-CL')}</span>
    </div>
);

export default ConfirmationPage;