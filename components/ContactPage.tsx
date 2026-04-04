
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import NotificationModal from './NotificationModal';

const ContactPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section id="contact" className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-0">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-cream rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden border border-blush-pink/10"
            >
                <div className="grid grid-cols-1 lg:grid-cols-5">
                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-2 bg-cocoa-brown p-8 sm:p-12 text-white space-y-8 sm:space-y-12 relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-gold/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                        <div className="relative z-10 space-y-3 sm:space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">Hablemos de tu <span className="text-rose-gold italic">próximo evento</span></h2>
                            <p className="text-sm sm:text-base text-cream/60 font-light leading-relaxed">Estamos aquí para hacer tus momentos más dulces. Cuéntanos qué necesitas y te ayudaremos a personalizar cada detalle.</p>
                        </div>

                        <div className="relative z-10 space-y-6 sm:space-y-8">
                            <ContactInfoItem 
                                icon={<MapPin className="w-6 h-6 text-rose-gold" />}
                                title="Nuestra Ubicación"
                                content={["Lago Bertrand 120,", "Quilpué, Valparaíso"]}
                            />
                            <ContactInfoItem 
                                icon={<Clock className="w-6 h-6 text-rose-gold" />}
                                title="Horario de Atención"
                                content={["Lunes a Domingo las 24 hrs"]}
                            />
                            <ContactInfoItem 
                                icon={<Phone className="w-6 h-6 text-rose-gold" />}
                                title="Teléfono / WhatsApp"
                                content={["+569 54681985"]}
                            />
                            <ContactInfoItem 
                                icon={<Mail className="w-6 h-6 text-rose-gold" />}
                                title="Correo Electrónico"
                                content={["hola@pastelicia.cl"]}
                            />
                        </div>

                        
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3 p-8 sm:p-12 bg-cream/10">
                        <div className="max-w-md mx-auto lg:mx-0 space-y-6 sm:space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-xl sm:text-2xl font-serif font-bold text-cocoa-brown">Envíanos un mensaje</h3>
                                <p className="text-muted-mauve/60 text-xs sm:text-sm">Te responderemos en menos de 24 horas hábiles.</p>
                            </div>

                            <form action="#" method="POST" className="space-y-5 sm:space-y-6" onSubmit={(e) => {
                                e.preventDefault();
                                setIsModalOpen(true);
                            }}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <ContactInput label="Nombre" placeholder="Tu nombre completo" required />
                                    <ContactInput label="Email" type="email" placeholder="tu@email.com" required />
                                </div>
                                <ContactInput label="Asunto" placeholder="¿En qué podemos ayudarte?" />
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-cocoa-brown/40 uppercase tracking-widest ml-1">Mensaje</label>
                                    <textarea 
                                        placeholder="Cuéntanos más sobre tu pedido o consulta..." 
                                        rows={5} 
                                        required 
                                        className="w-full bg-cream border-2 border-blush-pink/20 rounded-2xl py-4 px-6 text-cocoa-brown focus:border-rose-gold focus:ring-4 focus:ring-rose-gold/10 transition-all outline-none placeholder:text-muted-mauve/30 resize-none"
                                    />
                                </div>
                                <motion.button 
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit" 
                                    className="w-full bg-cocoa-brown text-white font-bold py-5 rounded-2xl hover:bg-rose-gold transition-all shadow-xl shadow-cocoa-brown/20 flex items-center justify-center gap-3 group"
                                >
                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    Enviar Mensaje
                                </motion.button>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>

            <NotificationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="¡Mensaje Recibido!"
                message="Gracias por contactarnos. Nuestro equipo revisará tu mensaje y te responderá a la brevedad."
                type="success"
            />
        </section>
    );
};

const ContactInfoItem: React.FC<{icon: React.ReactNode, title: string, content: string[]}> = ({ icon, title, content }) => (
    <div className="flex gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
            {icon}
        </div>
        <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-gold uppercase tracking-widest">{title}</h4>
            {content.map((line, i) => (
                <p key={i} className="text-cream/80 font-light">{line}</p>
            ))}
        </div>
    </div>
);

const ContactInput: React.FC<{label: string, [key: string]: any}> = ({ label, ...props }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-cocoa-brown/40 uppercase tracking-widest ml-1">{label}</label>
        <input 
            {...props} 
            className="w-full bg-cream border-2 border-blush-pink/20 rounded-2xl py-4 px-6 text-cocoa-brown focus:border-rose-gold focus:ring-4 focus:ring-rose-gold/10 transition-all outline-none placeholder:text-muted-mauve/30"
        />
    </div>
);

const SocialLink: React.FC<{href: string, label: string}> = ({ href, label }) => (
    <motion.a 
        whileHover={{ scale: 1.1, color: '#E2B49A' }}
        href={href} 
        className="text-cream/40 text-xs font-bold uppercase tracking-widest transition-colors"
    >
        {label}
    </motion.a>
);

export default ContactPage;