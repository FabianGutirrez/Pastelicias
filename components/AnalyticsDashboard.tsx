
import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, ShoppingBag, Eye, MousePointer2, Calendar, BarChart3 } from 'lucide-react';
import { AnalyticsEvent, Product } from '../types';

interface AnalyticsDashboardProps {
    data: AnalyticsEvent[];
    products: Product[];
}

type TimeFilter = 'today' | 'this_month';

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data, products }) => {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('this_month');

    const productMap = useMemo(() => new Map(products.map(p => [p.id, p])), [products]);

    const filteredData = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return data.filter(event => {
            const eventDate = event.timestamp;
            if (timeFilter === 'today') {
                return eventDate >= today;
            }
            if (timeFilter === 'this_month') {
                return eventDate >= startOfMonth;
            }
            return true;
        });
    }, [data, timeFilter]);

    const kpis = useMemo(() => {
        const orders = filteredData.filter(e => e.type === 'order');
        const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const totalOrders = orders.length;

        const getTopProduct = (type: 'view' | 'addToCart' | 'order') => {
            const counts = new Map<number, number>();
            filteredData.forEach(event => {
                if(type === 'order' && event.type === 'order' && event.items) {
                     event.items.forEach(item => {
                        counts.set(item.product.id, (counts.get(item.product.id) || 0) + 1);
                    });
                } else if (event.type === type && event.productId) {
                    counts.set(event.productId, (counts.get(event.productId) || 0) + 1);
                }
            });
            
            if (counts.size === 0) return 'N/A';
            
            const topProductId = [...counts.entries()].reduce((a, b) => a[1] > b[1] ? a : b)[0];
            return productMap.get(topProductId)?.name || 'Producto Desconocido';
        };

        const getTopThreeProducts = (type: 'view' | 'addToCart' | 'order') => {
            const counts = new Map<number, number>();
             filteredData.forEach(event => {
                if(type === 'order' && event.type === 'order' && event.items) {
                     event.items.forEach(item => {
                        counts.set(item.product.id, (counts.get(item.product.id) || 0) + 1);
                    });
                } else if (event.type === type && event.productId) {
                    counts.set(event.productId, (counts.get(event.productId) || 0) + 1);
                }
            });

            return [...counts.entries()]
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([id, count]) => ({
                    name: productMap.get(id)?.name || 'Desconocido',
                    count
                }));
        };

        return {
            totalSales,
            totalOrders,
            mostViewed: getTopProduct('view'),
            mostAddedToCart: getTopProduct('addToCart'),
            topViewed: getTopThreeProducts('view'),
            topAdded: getTopThreeProducts('addToCart'),
            topPurchased: getTopThreeProducts('order'),
        };
    }, [filteredData, productMap]);

    const salesChartData = useMemo(() => {
        const salesByDay = new Map<string, number>();
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {
             salesByDay.set(i.toString(), 0);
        }

        filteredData
            .filter(e => e.type === 'order')
            .forEach(order => {
                const day = order.timestamp.getDate().toString();
                salesByDay.set(day, (salesByDay.get(day) || 0) + (order.total || 0));
            });

        const chartData = Array.from(salesByDay.entries()).map(([day, total]) => ({
            label: day,
            value: total
        }));

        const maxValue = Math.max(...chartData.map(d => d.value));
        return {
            data: chartData,
            maxValue: maxValue === 0 ? 1 : maxValue, // Avoid division by zero
        };

    }, [filteredData]);

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h3 className="text-3xl font-serif font-bold text-cocoa-brown">Análisis de Rendimiento</h3>
                    <p className="text-muted-mauve/60 text-sm">Monitorea el crecimiento y las preferencias de tus clientes.</p>
                </div>
                
                <div className="flex p-1.5 bg-cream/50 backdrop-blur-md rounded-2xl border border-blush-pink/20 shadow-sm">
                    <FilterButton 
                        label="Hoy" 
                        isActive={timeFilter === 'today'} 
                        onClick={() => setTimeFilter('today')} 
                        icon={<Calendar className="w-4 h-4" />}
                    />
                    <FilterButton 
                        label="Este Mes" 
                        isActive={timeFilter === 'this_month'} 
                        onClick={() => setTimeFilter('this_month')} 
                        icon={<TrendingUp className="w-4 h-4" />}
                    />
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard 
                    title="Ventas Totales" 
                    value={`$${kpis.totalSales.toLocaleString('es-CL')}`} 
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="rose-gold"
                    delay={0.1}
                />
                <KpiCard 
                    title="Total Encargos" 
                    value={kpis.totalOrders.toString()} 
                    icon={<ShoppingBag className="w-5 h-5" />}
                    color="cocoa-brown"
                    delay={0.2}
                />
                <KpiCard 
                    title="Más Visto" 
                    value={kpis.mostViewed} 
                    icon={<Eye className="w-5 h-5" />}
                    color="muted-mauve"
                    delay={0.3}
                />
                <KpiCard 
                    title="Favorito Carrito" 
                    value={kpis.mostAddedToCart} 
                    icon={<MousePointer2 className="w-5 h-5" />}
                    color="blush-pink"
                    delay={0.4}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-cocoa-brown/5 border border-blush-pink/10"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-rose-gold/10 rounded-xl flex items-center justify-center text-rose-gold">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <h4 className="text-xl font-serif font-bold text-cocoa-brown">Ventas del Período</h4>
                        </div>
                        <span className="text-xs font-bold text-muted-mauve/40 uppercase tracking-widest">Valores en CLP</span>
                    </div>

                    <div className="h-64 flex items-end gap-2 px-2">
                        {salesChartData.data.map((item, i) => (
                            <div key={item.label} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(item.value / salesChartData.maxValue) * 100}%` }}
                                    transition={{ delay: i * 0.02, duration: 0.8, ease: "easeOut" }}
                                    className="w-full bg-gradient-to-t from-rose-gold to-rose-gold/60 rounded-t-lg group-hover:from-cocoa-brown group-hover:to-cocoa-brown/80 transition-all duration-300 relative"
                                >
                                    {/* Tooltip */}
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-cocoa-brown text-white text-[10px] py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-20">
                                        ${item.value.toLocaleString('es-CL')}
                                    </div>
                                </motion.div>
                                <span className="text-[10px] font-bold text-muted-mauve/30 mt-3 group-hover:text-cocoa-brown transition-colors">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Lists Section */}
                <div className="space-y-6">
                    <TopProductsList 
                        title="Más Vistos" 
                        products={kpis.topViewed} 
                        icon={<Eye className="w-4 h-4" />}
                        delay={0.5}
                    />
                    <TopProductsList 
                        title="Más Deseados" 
                        products={kpis.topAdded} 
                        icon={<TrendingUp className="w-4 h-4" />}
                        delay={0.6}
                    />
                    <TopProductsList 
                        title="Más Vendidos" 
                        products={kpis.topPurchased} 
                        icon={<ShoppingBag className="w-4 h-4" />}
                        delay={0.7}
                    />
                </div>
            </div>
        </div>
    );
};

// Helper Components
const FilterButton: React.FC<{label: string, isActive: boolean, onClick: () => void, icon: React.ReactNode}> = ({label, isActive, onClick, icon}) => (
    <button 
        onClick={onClick} 
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
            isActive 
            ? 'bg-cocoa-brown text-white shadow-lg shadow-cocoa-brown/20' 
            : 'text-cocoa-brown/60 hover:bg-rose-gold/10 hover:text-cocoa-brown'
        }`}
    >
        {icon}
        {label}
    </button>
);

const KpiCard: React.FC<{title: string, value: string, icon: React.ReactNode, color: string, delay: number}> = ({title, value, icon, color, delay}) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white p-6 rounded-[2rem] shadow-xl shadow-cocoa-brown/5 border border-blush-pink/10 relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-700`} />
        
        <div className="relative z-10 space-y-4">
            <div className={`w-10 h-10 bg-${color}/10 rounded-xl flex items-center justify-center text-${color}`}>
                {icon}
            </div>
            <div className="space-y-1">
                <h4 className="text-xs font-bold text-muted-mauve/40 uppercase tracking-widest">{title}</h4>
                <p className="text-2xl font-bold text-cocoa-brown truncate" title={value}>{value}</p>
            </div>
        </div>
    </motion.div>
);

const TopProductsList: React.FC<{title: string, products: {name: string, count: number}[], icon: React.ReactNode, delay: number}> = ({title, products, icon, delay}) => (
    <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="bg-white p-6 rounded-[2rem] shadow-lg shadow-cocoa-brown/5 border border-blush-pink/10"
    >
        <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-rose-gold/10 rounded-lg flex items-center justify-center text-rose-gold">
                {icon}
            </div>
            <h4 className="font-serif font-bold text-cocoa-brown">{title}</h4>
        </div>
        
        {products.length > 0 ? (
            <ul className="space-y-3">
                {products.map((p, i) => (
                    <li key={p.name} className="flex justify-between items-center group cursor-default">
                        <div className="flex items-center gap-3 truncate">
                            <span className="text-[10px] font-bold text-rose-gold/40 w-4">0{i + 1}</span>
                            <span className="text-sm text-cocoa-brown/80 group-hover:text-rose-gold transition-colors truncate">{p.name}</span>
                        </div>
                        <span className="text-xs font-bold bg-cream px-2.5 py-1 rounded-lg text-cocoa-brown group-hover:bg-rose-gold group-hover:text-white transition-all">{p.count}</span>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="py-4 text-center">
                <p className="text-xs text-muted-mauve/40 italic">Sin datos suficientes</p>
            </div>
        )}
    </motion.div>
);

export default AnalyticsDashboard;
