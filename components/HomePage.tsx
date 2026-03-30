
import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Star, Heart, Sparkles } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface HomePageProps {
    products: Product[];
    onCustomizeClick: (product: Product) => void;
}

const HomePage: React.FC<HomePageProps> = ({ products, onCustomizeClick }) => {
    return (
        <div className="space-y-24 pb-20">
            {/* Hero Banner */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden rounded-[3rem] shadow-2xl mx-4 sm:mx-0">
                {/* Background Image with Parallax-like effect */}
                <motion.div 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
                    className="absolute inset-0"
                >
                    <img 
                        src="https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1" 
                        alt="Delicious cake" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-cocoa-brown/30 backdrop-blur-[2px]" />
                </motion.div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cocoa-brown/20 to-cocoa-brown/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-cocoa-brown/60 via-transparent to-cocoa-brown/60" />

                {/* Content */}
                <div className="relative z-10 text-center px-6 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <motion.div 
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="w-12 h-px bg-rose-gold" 
                            />
                            <span className="text-rose-gold font-bold tracking-[0.3em] uppercase text-sm flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Repostería Artesanal
                                <Sparkles className="w-4 h-4" />
                            </span>
                            <motion.div 
                                animate={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="w-12 h-px bg-rose-gold" 
                            />
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.1] drop-shadow-2xl">
                            Momentos <br />
                            <span className="text-rose-gold italic">Inolvidables</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-cream/90 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
                            Creamos experiencias dulces personalizadas para tus celebraciones más especiales. Calidad premium en cada bocado.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                            <motion.a 
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                href="#catalog" 
                                className="group bg-rose-gold text-cocoa-brown font-bold py-4 px-10 rounded-2xl hover:bg-white transition-all duration-500 shadow-2xl shadow-rose-gold/30 flex items-center gap-3"
                            >
                                Explorar Catálogo
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.a>
                            
                            <motion.a 
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                href="#contact" 
                                className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-10 rounded-2xl hover:bg-white/20 transition-all duration-500"
                            >
                                Contactar Ahora
                            </motion.a>
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Scroll</span>
                    <motion.div 
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" 
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                <FeatureCard 
                    icon={<Star className="w-8 h-8" />}
                    title="Calidad Premium"
                    description="Ingredientes seleccionados de la más alta calidad para un sabor excepcional."
                />
                <FeatureCard 
                    icon={<Heart className="w-8 h-8" />}
                    title="Hecho con Amor"
                    description="Cada pedido es preparado artesanalmente con dedicación y cuidado."
                />
                <FeatureCard 
                    icon={<Sparkles className="w-8 h-8" />}
                    title="Personalización"
                    description="Adaptamos cada detalle a tu gusto para que tu evento sea único."
                />
            </section>

            {/* Products Section */}
            <section id="products" className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-rose-gold font-bold uppercase tracking-widest text-xs">
                            <div className="w-8 h-px bg-rose-gold" />
                            Nuestras Delicias
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-cocoa-brown">Productos Destacados</h2>
                    </div>
                    <a href="#catalog" className="text-muted-mauve hover:text-rose-gold font-bold flex items-center gap-2 transition-colors group">
                        Ver todo el catálogo
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
                >
                    {products.map(product => (
                        <motion.div
                            key={product.id}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0 }
                            }}
                        >
                            <ProductCard product={product} onCustomizeClick={onCustomizeClick} />
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </div>
    );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
    <motion.div 
        whileHover={{ y: -10 }}
        className="text-center space-y-4 p-8 rounded-[2rem] bg-cream/10 border border-blush-pink/10 hover:bg-cream/40 hover:shadow-xl transition-all duration-500"
    >
        <div className="w-16 h-16 bg-rose-gold/10 rounded-2xl flex items-center justify-center text-rose-gold mx-auto shadow-inner">
            {icon}
        </div>
        <h3 className="text-xl font-serif font-bold text-cocoa-brown">{title}</h3>
        <p className="text-muted-mauve font-light leading-relaxed">{description}</p>
    </motion.div>
);

export default HomePage;