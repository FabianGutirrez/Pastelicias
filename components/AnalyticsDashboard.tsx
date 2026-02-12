
import React, { useState, useMemo } from 'react';
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
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-8">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-serif font-bold text-cocoa-brown">Análisis de Rendimiento</h3>
                <div className="flex gap-2 p-1 bg-cream rounded-full">
                    <FilterButton label="Día Actual" isActive={timeFilter === 'today'} onClick={() => setTimeFilter('today')} />
                    <FilterButton label="Mes Actual" isActive={timeFilter === 'this_month'} onClick={() => setTimeFilter('this_month')} />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Ventas Totales" value={`$${kpis.totalSales.toLocaleString('es-CL')}`} />
                <KpiCard title="Total de Encargos" value={kpis.totalOrders.toString()} />
                <KpiCard title="Producto Más Visto" value={kpis.mostViewed} />
                <KpiCard title="Más Agregado al Carrito" value={kpis.mostAddedToCart} />
            </div>

            {/* Sales Chart */}
             {timeFilter === 'this_month' && (
                <div>
                    <h4 className="text-xl font-serif font-bold text-cocoa-brown mb-4">Ventas del Mes</h4>
                    <div className="bg-cream p-4 rounded-lg h-72 flex gap-1 items-end">
                        {salesChartData.data.map(item => (
                            <div key={item.label} className="chart-bar-container">
                                <div 
                                    className="chart-bar"
                                    style={{ height: `${(item.value / salesChartData.maxValue) * 100}%` }}
                                    title={`Día ${item.label}: $${item.value.toLocaleString('es-CL')}`}
                                ></div>
                                <span className="chart-label">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {/* Top Products Lists */}
            <div className="grid md:grid-cols-3 gap-6">
                <TopProductsList title="Top 3 Más Vistos" products={kpis.topViewed} />
                <TopProductsList title="Top 3 Más Agregados" products={kpis.topAdded} />
                <TopProductsList title="Top 3 Más Comprados" products={kpis.topPurchased} />
            </div>
        </div>
    );
};

// Helper Components
const FilterButton: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({label, isActive, onClick}) => (
    <button onClick={onClick} className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${isActive ? 'bg-rose-gold text-white shadow' : 'text-cocoa-brown hover:bg-blush-pink'}`}>
        {label}
    </button>
);

const KpiCard: React.FC<{title: string, value: string}> = ({title, value}) => (
    <div className="bg-cream p-4 rounded-lg shadow-sm">
        <h4 className="text-sm text-muted-mauve font-semibold mb-1">{title}</h4>
        <p className="text-2xl font-bold text-cocoa-brown truncate" title={value}>{value}</p>
    </div>
);

const TopProductsList: React.FC<{title: string, products: {name: string, count: number}[]}> = ({title, products}) => (
    <div className="bg-cream p-4 rounded-lg">
        <h4 className="font-serif font-bold text-cocoa-brown mb-3">{title}</h4>
        {products.length > 0 ? (
            <ul className="space-y-2">
                {products.map((p, i) => (
                    <li key={p.name} className="flex justify-between items-center text-sm">
                        <span className="truncate pr-2">{i + 1}. {p.name}</span>
                        <span className="font-bold bg-blush-pink px-2 py-0.5 rounded-md">{p.count}</span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-sm text-gray-500">No hay datos suficientes.</p>
        )}
    </div>
);


export default AnalyticsDashboard;