
import React, { useState, useEffect } from 'react';
import { Product, CustomizationCollection, AnalyticsEvent, UserRole, DeliveryZone } from '../types';
import { supabase } from '../supabase';
import NotificationModal from './NotificationModal';
import ConfirmationModal from './ConfirmationModal';
import { CheckCircle2, Plus, Edit2, LayoutDashboard, Package, Settings, Sliders, Image as ImageIcon, X, Trash, MapPin } from 'lucide-react';
import AnalyticsDashboard from './AnalyticsDashboard';
import { motion, AnimatePresence } from 'motion/react';


interface AdminPageProps {
    products: Product[];
    customizationOptions: CustomizationCollection;
    deliveryZones: DeliveryZone[];
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: number) => void;
    onUpdateCustomizationOptions: (newOptions: CustomizationCollection) => void;
    onUpdateDeliveryZones: (newZones: DeliveryZone[]) => void;
    analyticsData: AnalyticsEvent[];
    currentUserRole: UserRole;
    siteLogo: string;
    onUpdateLogo: (newLogo: string) => void;
}

const emptyProduct: Omit<Product, 'id'> = {
    name: '',
    description: '',
    longDescription: '',
    price: 0,
    imageUrl: 'https://placehold.co/400x300?text=Sin+Imagen',
    inStock: true,
    category: 'dulce',
    isFeatured: false,
    priceTiers: [{ quantity: 0, price: 0, label: '' }],
    availableCustomizations: [],
    selectableProducts: { productIds: [], maxSelections: 0 },
};

type AdminTab = 'analytics' | 'products' | 'options' | 'settings' | 'delivery';

const PromoStep: React.FC<{number: string, text: string}> = ({ number, text }) => (
    <div className="flex items-start gap-4">
        <div className="w-8 h-8 bg-rose-gold text-cocoa-brown rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-md">
            {number}
        </div>
        <p className="text-sm text-muted-mauve/80 leading-relaxed">{text}</p>
    </div>
);

const AdminPage: React.FC<AdminPageProps> = ({ 
    products, 
    customizationOptions,
    deliveryZones,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct,
    onUpdateCustomizationOptions,
    onUpdateDeliveryZones,
    analyticsData,
    currentUserRole,
    siteLogo,
    onUpdateLogo
}) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
    const [editingProduct, setEditingProduct] = useState<Product | Omit<Product, 'id'> | null>(null);
    const [formState, setFormState] = useState<Product | Omit<Product, 'id'>>(emptyProduct);
    const [newOptions, setNewOptions] = useState<Record<keyof CustomizationCollection, string>>({ flavors: '', fillings: '', colors: '' });
    const [newZone, setNewZone] = useState({ name: '', price: '' });
    const [newLogoPreview, setNewLogoPreview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [notification, setNotification] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'info' }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; productId: number | null }>({
        isOpen: false,
        productId: null
    });


    useEffect(() => {
        if (editingProduct) {
            setFormState({
                ...editingProduct,
                selectableProducts: editingProduct.selectableProducts || { productIds: [], maxSelections: 0 }
            });
        } else {
            setFormState(emptyProduct);
        }
    }, [editingProduct]);

    const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file: File, bucket: string = 'images'): Promise<{ url: string | null; error: any }> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            return { url: null, error: uploadError };
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return { url: data.publicUrl, error: null };
    };

    const handleSaveLogo = async () => {
        if (logoFile) {
            setIsUploading(true);
            const { url: publicUrl, error } = await uploadImage(logoFile);
            if (publicUrl) {
                try {
                    await onUpdateLogo(publicUrl);
                    setNewLogoPreview(null);
                    setLogoFile(null);
                    setNotification({
                        isOpen: true,
                        title: '¡Éxito!',
                        message: 'El logo se ha actualizado correctamente en la tienda y en la nube.',
                        type: 'success'
                    });
                } catch (updateError: any) {
                    setNotification({
                        isOpen: true,
                        title: 'Error de Actualización',
                        message: `La imagen se subió pero no se pudo actualizar la configuración: ${updateError.message || 'Error desconocido'}`,
                        type: 'error'
                    });
                }
            } else {
                let message = 'Error al subir el logo.';
                if (error?.message?.includes('bucket not found') || error?.status === 404) {
                    message += '\n\nSugerencia: El bucket "images" no existe en tu proyecto de Supabase. Por favor, créalo en la sección de Storage y asegúrate de que sea público.';
                } else if (error?.message?.includes('row-level security') || error?.status === 403) {
                    message += '\n\nSugerencia: Error de permisos (RLS). Asegúrate de que el bucket "images" tenga políticas que permitan la subida de archivos.';
                }
                setNotification({
                    isOpen: true,
                    title: 'Error de Subida',
                    message: message,
                    type: 'error'
                });
            }
            setIsUploading(false);
        }
    };


    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (name === 'maxSelections') {
            setFormState(prev => ({ ...prev, selectableProducts: { ...prev.selectableProducts!, maxSelections: parseInt(value, 10) || 0 }}));
        } else if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormState(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number' || name === 'price') {
            setFormState(prev => ({ ...prev, [name]: Number(value) }));
        } else {
            setFormState(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSelectableProductToggle = (productId: number) => {
        const currentIds = formState.selectableProducts?.productIds || [];
        const newIds = currentIds.includes(productId)
            ? currentIds.filter(id => id !== productId)
            : [...currentIds, productId];
        setFormState(prev => ({ ...prev, selectableProducts: { ...prev.selectableProducts!, productIds: newIds }}));
    };


    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsUploading(true);
            const { url: publicUrl, error } = await uploadImage(file);
            if (publicUrl) {
                setFormState(prev => ({ ...prev, imageUrl: publicUrl }));
            } else {
                let message = `Error al subir la imagen del producto: ${error?.message || 'Error desconocido'}`;
                if (error?.message?.includes('bucket not found') || error?.status === 404) {
                    message += '\n\nSugerencia: El bucket "images" no existe en Supabase. Créalo en Storage y hazlo público.';
                } else if (error?.message?.includes('row-level security') || error?.status === 403) {
                    message += '\n\nSugerencia: Error de permisos (RLS) en el Storage. Asegúrate de que el bucket "images" permita subir archivos a usuarios autenticados.';
                }
                setNotification({
                    isOpen: true,
                    title: 'Error de Subida',
                    message: message,
                    type: 'error'
                });
            }
            setIsUploading(false);
        }
    };

    const handleCustomizationToggle = (option: 'flavors' | 'fillings' | 'colors') => {
        const currentOptions = formState.availableCustomizations || [];
        const newOptions = currentOptions.includes(option)
            ? currentOptions.filter(item => item !== option)
            : [...currentOptions, option];
        setFormState(prev => ({ ...prev, availableCustomizations: newOptions }));
    };

    const handleTierChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newTiers = [...formState.priceTiers];
        newTiers[index] = { ...newTiers[index], [name]: name === 'label' ? value : Number(value) };
        setFormState(prev => ({ ...prev, priceTiers: newTiers }));
    };

    const addTier = () => {
        setFormState(prev => ({
            ...prev,
            priceTiers: [...prev.priceTiers, { quantity: 0, price: 0, label: '' }]
        }));
    };
    
    const removeTier = (index: number) => {
        setFormState(prev => ({
            ...prev,
            priceTiers: prev.priceTiers.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (!formState.name.trim()) {
            setNotification({
                isOpen: true,
                title: 'Error de Validación',
                message: 'El nombre del producto es obligatorio.',
                type: 'error'
            });
            return;
        }

        if (formState.price <= 0) {
            setNotification({
                isOpen: true,
                title: 'Error de Validación',
                message: 'El precio debe ser mayor a 0.',
                type: 'error'
            });
            return;
        }

        const finalProductData = { ...formState };
        if (finalProductData.category !== 'promocion' || !finalProductData.selectableProducts?.productIds.length) {
             delete finalProductData.selectableProducts;
        }

        try {
            if ('id' in finalProductData) {
                await onUpdateProduct(finalProductData as Product);
            } else {
                await onAddProduct(finalProductData as Omit<Product, 'id'>);
            }
            setEditingProduct(null);
        } catch (error: any) {
            setNotification({
                isOpen: true,
                title: 'Error al Guardar',
                message: error.message || 'Ocurrió un error inesperado.',
                type: 'error'
            });
        }
    };

    const handleDelete = (productId: number) => {
        setConfirmDelete({ isOpen: true, productId });
    };

    const confirmDeleteProduct = () => {
        if (confirmDelete.productId !== null) {
            onDeleteProduct(confirmDelete.productId);
            setNotification({
                isOpen: true,
                title: 'Producto Eliminado',
                message: 'El producto ha sido eliminado exitosamente.',
                type: 'success'
            });
        }
    };
    
    const handleAddOption = (category: keyof CustomizationCollection) => {
        if (!newOptions[category].trim()) return;
        const updatedOptions = {
            ...customizationOptions,
            [category]: [...customizationOptions[category], newOptions[category].trim()]
        };
        onUpdateCustomizationOptions(updatedOptions);
        setNewOptions(prev => ({...prev, [category]: ''}));
    };

    const handleDeleteOption = (category: keyof CustomizationCollection, optionToDelete: string) => {
        const updatedOptions = {
            ...customizationOptions,
            [category]: customizationOptions[category].filter(opt => opt !== optionToDelete)
        };
        onUpdateCustomizationOptions(updatedOptions);
    };

    const handleAddZone = () => {
        if (!newZone.name.trim() || !newZone.price) return;
        const updated = [...deliveryZones, { id: Date.now().toString(), name: newZone.name, price: Number(newZone.price) }];
        onUpdateDeliveryZones(updated);
        setNewZone({ name: '', price: '' });
    };

    const handleDeleteZone = (id: string) => {
        const updated = deliveryZones.filter(z => z.id !== id);
        onUpdateDeliveryZones(updated);
    };

    return (
        <section id="admin" className="space-y-8">
            <NotificationModal 
                isOpen={notification.isOpen}
                onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
                title={notification.title}
                message={notification.message}
                type={notification.type}
            />
            <ConfirmationModal 
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, productId: null })}
                onConfirm={confirmDeleteProduct}
                title="Eliminar Producto"
                message="¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                type="danger"
            />
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center text-cocoa-brown">Panel de Administración</h2>
            
            {/* Tabs */}
            <div className="flex justify-start sm:justify-center border-b border-blush-pink/10 mb-8 sm:mb-12 overflow-x-auto no-scrollbar">
                <TabButton 
                    title="Análisis" 
                    isActive={activeTab === 'analytics'} 
                    onClick={() => setActiveTab('analytics')} 
                    icon={<LayoutDashboard className="w-5 h-5" />}
                />
                <TabButton 
                    title="Productos" 
                    isActive={activeTab === 'products'} 
                    onClick={() => setActiveTab('products')} 
                    icon={<Package className="w-5 h-5" />}
                />
                <TabButton 
                    title="Entregas" 
                    isActive={activeTab === 'delivery'} 
                    onClick={() => setActiveTab('delivery')} 
                    icon={<MapPin className="w-5 h-5" />}
                />
                {currentUserRole === 'superadmin' && (
                    <>
                        <TabButton 
                            title="Opciones" 
                            isActive={activeTab === 'options'} 
                            onClick={() => setActiveTab('options')} 
                            icon={<Sliders className="w-5 h-5" />}
                        />
                        <TabButton 
                            title="Ajustes" 
                            isActive={activeTab === 'settings'} 
                            onClick={() => setActiveTab('settings')} 
                            icon={<Settings className="w-5 h-5" />}
                        />
                    </>
                )}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                >
                    {activeTab === 'analytics' && <AnalyticsDashboard data={analyticsData} products={products} />}
                    
                    {activeTab === 'delivery' && (
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-cocoa-brown">Tarifas de Entrega</h3>
                                <p className="text-muted-mauve/60 text-xs sm:text-sm">Gestiona las zonas de despacho y sus respectivos costos.</p>
                            </div>

                            <div className="bg-cream p-4 sm:p-10 rounded-[1.5rem] sm:rounded-[3rem] shadow-xl shadow-cocoa-brown/5 border border-blush-pink/10">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Add New Zone */}
                                    <div className="space-y-6">
                                        <h4 className="text-lg font-bold text-cocoa-brown flex items-center gap-2">
                                            <Plus className="w-5 h-5 text-rose-gold" />
                                            Añadir Nueva Zona
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-mauve uppercase tracking-widest">Nombre de la Zona / Comuna</label>
                                                <input 
                                                    type="text" 
                                                    value={newZone.name}
                                                    onChange={e => setNewZone(p => ({...p, name: e.target.value}))}
                                                    placeholder="Ej: Providencia, Santiago Centro..."
                                                    className="w-full bg-cream/50 border-2 border-blush-pink/20 rounded-xl py-3 px-4 text-cocoa-brown focus:border-rose-gold outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-mauve uppercase tracking-widest">Costo de Envío ($)</label>
                                                <input 
                                                    type="number" 
                                                    value={newZone.price}
                                                    onChange={e => setNewZone(p => ({...p, price: e.target.value}))}
                                                    placeholder="Ej: 3500"
                                                    className="w-full bg-cream/50 border-2 border-blush-pink/20 rounded-xl py-3 px-4 text-cocoa-brown focus:border-rose-gold outline-none transition-all"
                                                />
                                            </div>
                                            <button 
                                                onClick={handleAddZone}
                                                className="w-full bg-rose-gold text-white font-bold py-3 rounded-xl hover:bg-rose-gold/80 transition-all shadow-lg shadow-rose-gold/20"
                                            >
                                                Añadir Zona
                                            </button>
                                        </div>
                                    </div>

                                    {/* Zone List */}
                                    <div className="space-y-6">
                                        <h4 className="text-lg font-bold text-cocoa-brown flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-rose-gold" />
                                            Zonas Configuradas
                                        </h4>
                                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {deliveryZones.length === 0 ? (
                                                <p className="text-muted-mauve/60 text-sm italic">No hay zonas configuradas.</p>
                                            ) : (
                                                deliveryZones.map(zone => (
                                                    <div key={zone.id} className="flex items-center justify-between p-4 bg-cream/30 border border-blush-pink/10 rounded-xl group hover:border-rose-gold/30 transition-all">
                                                        <div>
                                                            <p className="font-bold text-cocoa-brown">{zone.name}</p>
                                                            <p className="text-sm text-rose-gold font-bold">${zone.price.toLocaleString('es-CL')}</p>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleDeleteZone(zone.id)}
                                                            className="p-2 text-muted-mauve/40 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="space-y-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                <div className="space-y-1">
                                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-cocoa-brown">Gestión de Productos</h3>
                                    <p className="text-muted-mauve/60 text-xs sm:text-sm">Añade, edita o elimina productos de tu catálogo.</p>
                                </div>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setEditingProduct(emptyProduct)} 
                                    className="w-full sm:w-auto bg-cocoa-brown text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl hover:bg-rose-gold transition-all shadow-xl shadow-cocoa-brown/20 flex items-center justify-center gap-3"
                                >
                                    <Plus className="w-5 h-5" />
                                    Nuevo Producto
                                </motion.button>
                            </div>

                            {/* Promotional Box Info */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gradient-to-br from-rose-gold/10 to-blush-pink/5 border border-rose-gold/20 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-gold/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 relative z-10">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cream rounded-xl sm:rounded-[1.5rem] flex items-center justify-center shadow-lg text-rose-gold shrink-0">
                                        <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />
                                    </div>
                                    <div className="space-y-3 sm:space-y-4 text-center md:text-left">
                                        <h4 className="text-xl sm:text-2xl font-serif font-bold text-cocoa-brown">¿Cómo crear una Caja Promocional?</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                            <PromoStep number="1" text="Crea un producto nuevo o edita uno existente." />
                                            <PromoStep number="2" text="Selecciona la categoría 'Promoción'." />
                                            <PromoStep number="3" text="Usa el configurador para elegir variedades." />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Product List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map(product => (
                                    <motion.div 
                                        key={product.id}
                                        layout
                                        className="bg-cream p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl shadow-cocoa-brown/5 border border-blush-pink/10 flex items-center gap-4 sm:gap-6 group hover:border-rose-gold/30 transition-all duration-500"
                                    >
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 shadow-md">
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-grow min-w-0 space-y-0.5 sm:space-y-1">
                                            <h4 className="text-sm sm:text-base font-bold text-cocoa-brown truncate">{product.name}</h4>
                                            <p className="text-[10px] text-muted-mauve/60 uppercase tracking-widest font-bold">{product.category}</p>
                                            <p className="text-xs sm:text-sm font-bold text-rose-gold">${product.price.toLocaleString('es-CL')}</p>
                                        </div>
                                        <div className="flex flex-col gap-1.5 sm:gap-2">
                                            <button 
                                                onClick={() => setEditingProduct(product)} 
                                                className="p-2 sm:p-3 bg-cream/50 text-cocoa-brown rounded-lg sm:rounded-xl hover:bg-rose-gold hover:text-white transition-all shadow-sm"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product.id)} 
                                                className="p-2 sm:p-3 bg-red-50 text-red-500 rounded-lg sm:rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                title="Eliminar"
                                            >
                                                <Trash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'options' && currentUserRole === 'superadmin' && (
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-cocoa-brown">Personalización</h3>
                                <p className="text-muted-mauve/60 text-xs sm:text-sm">Gestiona los sabores, rellenos y colores disponibles para tus productos.</p>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                                <OptionManager title="Sabores" category="flavors" options={customizationOptions.flavors} newOptionValue={newOptions.flavors} onNewOptionChange={e => setNewOptions(p => ({...p, flavors: e.target.value}))} onAdd={handleAddOption} onDelete={handleDeleteOption} />
                                <OptionManager title="Rellenos" category="fillings" options={customizationOptions.fillings} newOptionValue={newOptions.fillings} onNewOptionChange={e => setNewOptions(p => ({...p, fillings: e.target.value}))} onAdd={handleAddOption} onDelete={handleDeleteOption} />
                                <OptionManager title="Colores" category="colors" options={customizationOptions.colors} newOptionValue={newOptions.colors} onNewOptionChange={e => setNewOptions(p => ({...p, colors: e.target.value}))} onAdd={handleAddOption} onDelete={handleDeleteOption} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && currentUserRole === 'superadmin' && (
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-cocoa-brown">Configuración General</h3>
                                <p className="text-muted-mauve/60 text-xs sm:text-sm">Personaliza la identidad visual de tu tienda.</p>
                            </div>
                            
                            <div className="bg-cream p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[3rem] shadow-xl shadow-cocoa-brown/5 border border-blush-pink/10">
                                <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-start">
                                    <div className="space-y-4 sm:space-y-6 lg:w-1/3">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-gold/10 rounded-xl sm:rounded-[1.5rem] flex items-center justify-center text-rose-gold">
                                            <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-xl sm:text-2xl font-serif font-bold text-cocoa-brown">Logotipo del Sitio</h4>
                                            <p className="text-xs sm:text-sm text-muted-mauve/60 leading-relaxed">Sube una imagen en formato PNG, JPG o SVG. Se recomienda un fondo transparente para mejor integración.</p>
                                        </div>
                                    </div>

                                    <div className="flex-grow w-full space-y-6 sm:space-y-8">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                            <div className="space-y-3">
                                                <span className="text-[10px] font-bold text-muted-mauve/40 uppercase tracking-widest ml-1">Logo Actual</span>
                                                <div className="bg-cream/20 border-2 border-dashed border-blush-pink/20 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 flex items-center justify-center h-40 sm:h-48">
                                                    <img src={siteLogo} alt="Logo actual" className="max-w-full max-h-full object-contain" />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <span className="text-[10px] font-bold text-muted-mauve/40 uppercase tracking-widest ml-1">Nueva Versión</span>
                                                <div className="bg-cream border-2 border-dashed border-rose-gold/20 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 flex flex-col items-center justify-center h-40 sm:h-48 relative group">
                                                    {newLogoPreview ? (
                                                        <img src={newLogoPreview} alt="Previsualización" className="max-w-full max-h-full object-contain" />
                                                    ) : (
                                                        <div className="text-center space-y-2">
                                                            <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-rose-gold/30 mx-auto" />
                                                            <p className="text-[10px] sm:text-xs text-muted-mauve/40">Arrastra o selecciona un archivo</p>
                                                        </div>
                                                    )}
                                                    <input 
                                                        id="logoUpload" 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={handleLogoFileChange} 
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                                            {newLogoPreview && (
                                                <button 
                                                    onClick={() => {setNewLogoPreview(null); setLogoFile(null);}}
                                                    className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-muted-mauve hover:text-red-500 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                            )}
                                            <motion.button 
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleSaveLogo} 
                                                disabled={!logoFile || isUploading} 
                                                className="bg-cocoa-brown text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-xl sm:rounded-2xl hover:bg-rose-gold transition-all shadow-xl shadow-cocoa-brown/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                            >
                                                {isUploading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <CheckCircle2 className="w-5 h-5" />
                                                )}
                                                {isUploading ? 'Subiendo...' : 'Actualizar Logotipo'}
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Product Form Modal */}
            <AnimatePresence>
                {editingProduct && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-cocoa-brown/40 backdrop-blur-sm z-50 p-4 flex items-center justify-center" 
                        onClick={() => setEditingProduct(null)}
                    >
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-cream/95 backdrop-blur-md rounded-[3rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-white/40 flex flex-col" 
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-6 sm:p-8 border-b border-blush-pink/10 flex justify-between items-center bg-cream/50">
                                <div className="space-y-1">
                                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-cocoa-brown">
                                        {'id' in editingProduct ? 'Editar' : 'Nuevo'} Producto
                                    </h3>
                                    <p className="text-muted-mauve/60 text-xs sm:text-sm">Completa los detalles para tu catálogo.</p>
                                </div>
                                <button 
                                    onClick={() => setEditingProduct(null)}
                                    className="p-2 sm:p-3 bg-cream rounded-xl sm:rounded-2xl text-muted-mauve hover:text-red-500 transition-all shadow-sm border border-blush-pink/10"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>

                            <form id="productForm" onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-8 sm:space-y-10 custom-scrollbar">
                                {/* Basic Info Section */}
                                <div className="space-y-4 sm:space-y-6">
                                    <h4 className="text-[10px] sm:text-xs font-bold text-rose-gold uppercase tracking-[0.2em] ml-1">Información Básica</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <AdminInput label="Nombre del Producto" name="name" value={formState.name} onChange={handleFormChange} placeholder="Ej: Tarta de Frambuesa" />
                                        <div className="space-y-2">
                                            <label htmlFor="category" className="text-[10px] font-bold text-cocoa-brown/40 uppercase tracking-widest ml-1">Categoría</label>
                                            <select 
                                                id="category" 
                                                name="category" 
                                                value={formState.category} 
                                                onChange={handleFormChange} 
                                                className="w-full bg-cream border-2 border-blush-pink/20 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base text-cocoa-brown focus:border-rose-gold focus:ring-4 focus:ring-rose-gold/10 transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="dulce">Dulce</option>
                                                <option value="salado">Salado</option>
                                                <option value="promocion">Promoción</option>
                                            </select>
                                        </div>
                                    </div>
                                    <AdminTextarea label="Descripción Corta" name="description" value={formState.description} onChange={handleFormChange} placeholder="Breve resumen para el catálogo..." />
                                    <AdminTextarea label="Descripción Detallada" name="longDescription" value={formState.longDescription} onChange={handleFormChange} rows={4} placeholder="Ingredientes, alérgenos, historia del producto..." />
                                </div>

                                {/* Visuals & Price Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                                    <div className="space-y-4 sm:space-y-6">
                                        <h4 className="text-[10px] sm:text-xs font-bold text-rose-gold uppercase tracking-[0.2em] ml-1">Imagen</h4>
                                        <div className="relative group">
                                            <div className="w-full aspect-video rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-cream/50 border-2 border-dashed border-blush-pink/20 flex items-center justify-center relative">
                                                <img src={formState.imageUrl} alt="Previsualización" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-cocoa-brown/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                    <label htmlFor="imageUpload" className="bg-cream text-cocoa-brown font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl cursor-pointer hover:bg-rose-gold hover:text-white transition-all shadow-xl flex items-center gap-2 text-xs sm:text-sm">
                                                        <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        Cambiar Imagen
                                                    </label>
                                                </div>
                                            </div>
                                            <input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={isUploading}/>
                                        </div>
                                    </div>

                                    <div className="space-y-4 sm:space-y-6">
                                        <h4 className="text-[10px] sm:text-xs font-bold text-rose-gold uppercase tracking-[0.2em] ml-1">Precio Base</h4>
                                        <AdminInput label="Precio desde ($)" name="price" type="number" value={formState.price} onChange={handleFormChange} />
                                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                            <AdminCheckbox label="En Stock" name="inStock" checked={formState.inStock} onChange={handleFormChange} />
                                            <AdminCheckbox label="Destacado" name="isFeatured" checked={!!formState.isFeatured} onChange={handleFormChange} />
                                        </div>
                                    </div>
                                </div>

                                {/* Customization Section */}
                                <div className="space-y-4 sm:space-y-6">
                                    <h4 className="text-[10px] sm:text-xs font-bold text-rose-gold uppercase tracking-[0.2em] ml-1">Personalización Disponible</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                        <AdminCheckbox label="Sabores" name="flavors" checked={formState.availableCustomizations?.includes('flavors') || false} onChange={() => handleCustomizationToggle('flavors')} />
                                        <AdminCheckbox label="Rellenos" name="fillings" checked={formState.availableCustomizations?.includes('fillings') || false} onChange={() => handleCustomizationToggle('fillings')} />
                                        <AdminCheckbox label="Colores" name="colors" checked={formState.availableCustomizations?.includes('colors') || false} onChange={() => handleCustomizationToggle('colors')} />
                                    </div>
                                </div>

                                {/* Promotional Config */}
                                {formState.category === 'promocion' && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-6 sm:p-8 bg-rose-gold/5 border-2 border-dashed border-rose-gold/30 rounded-[1.5rem] sm:rounded-[2.5rem] space-y-6 sm:space-y-8"
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-10 h-10 sm:w-12 h-12 bg-rose-gold text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                                                <Sliders className="w-5 h-5 sm:w-6 sm:h-6" />
                                            </div>
                                            <h4 className="text-lg sm:text-xl font-serif font-bold text-cocoa-brown">Configurador de Caja Promocional</h4>
                                        </div>
                                        
                                        <AdminInput label="Máximo de variedades a elegir" name="maxSelections" type="number" value={formState.selectableProducts?.maxSelections || 0} onChange={handleFormChange}/>
                                        
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-cocoa-brown/40 uppercase tracking-widest ml-1">Productos disponibles para esta caja</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-h-64 overflow-y-auto p-3 sm:p-4 bg-cream/50 rounded-2xl sm:rounded-3xl border border-blush-pink/10 custom-scrollbar">
                                                {products.filter(p => 'id' in formState ? p.id !== formState.id : true).map(p => (
                                                    <AdminCheckbox 
                                                        key={p.id}
                                                        label={p.name}
                                                        name={`selectable-${p.id}`}
                                                        checked={formState.selectableProducts?.productIds.includes(p.id) || false}
                                                        onChange={() => handleSelectableProductToggle(p.id)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Price Tiers Section */}
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-[10px] sm:text-xs font-bold text-rose-gold uppercase tracking-[0.2em] ml-1">Paquetes de Precios</h4>
                                        <button 
                                            type="button" 
                                            onClick={addTier} 
                                            className="text-[10px] sm:text-xs font-bold text-cocoa-brown bg-cream border border-blush-pink/20 py-2 px-3 sm:px-4 rounded-lg sm:rounded-xl hover:bg-rose-gold hover:text-white transition-all shadow-sm flex items-center gap-2"
                                        >
                                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                            Añadir Paquete
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3 sm:space-y-4">
                                        <AnimatePresence mode="popLayout">
                                            {formState.priceTiers.map((tier, index) => (
                                                <motion.div 
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="flex flex-col sm:flex-row items-end gap-3 sm:gap-4 p-4 sm:p-6 bg-cream rounded-[1.5rem] sm:rounded-[2rem] border border-blush-pink/10 shadow-sm group relative"
                                                >
                                                    <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
                                                        <AdminInput label="Etiqueta (ej. 30 unidades)" name="label" value={tier.label} onChange={(e: any) => handleTierChange(index, e)} />
                                                        <AdminInput label="Cantidad" name="quantity" type="number" value={tier.quantity} onChange={(e: any) => handleTierChange(index, e)} />
                                                        <AdminInput label="Precio ($)" name="price" type="number" value={tier.price} onChange={(e: any) => handleTierChange(index, e)} />
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeTier(index)} 
                                                        className="p-3 sm:p-4 text-muted-mauve/30 hover:text-red-500 hover:bg-red-50 rounded-xl sm:rounded-2xl transition-all"
                                                        title="Eliminar Paquete"
                                                    >
                                                        <Trash className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        {formState.priceTiers.length === 0 && (
                                            <div className="text-center py-8 sm:py-10 bg-cream/30 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-dashed border-blush-pink/10">
                                                <p className="text-xs sm:text-sm text-muted-mauve/40 font-medium">No hay paquetes de precios configurados.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </form>

                            {/* Modal Footer */}
                            <div className="p-6 sm:p-8 border-t border-blush-pink/10 bg-cream/50 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                                <button 
                                    type="button" 
                                    onClick={() => setEditingProduct(null)} 
                                    className="order-2 sm:order-1 px-8 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-muted-mauve hover:text-cocoa-brown transition-colors"
                                >
                                    Cancelar
                                </button>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit" 
                                    form="productForm"
                                    className="order-1 sm:order-2 bg-cocoa-brown text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl sm:rounded-2xl hover:bg-rose-gold transition-all shadow-xl shadow-cocoa-brown/20 flex items-center justify-center gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    Guardar Cambios
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

const TabButton: React.FC<{title: string; isActive: boolean; onClick: () => void; icon: React.ReactNode}> = ({ title, isActive, onClick, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-500 relative group ${
            isActive ? 'text-cocoa-brown' : 'text-muted-mauve/50 hover:text-cocoa-brown'
        }`}
        role="tab"
        aria-selected={isActive}
    >
        {icon}
        {title}
        {isActive && (
            <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-rose-gold rounded-full"
            />
        )}
    </button>
);


// Helper components for Admin form
const AdminInput: React.FC<any> = ({ label, ...props }) => (
    <div className="space-y-2">
        <label htmlFor={props.name} className="text-[10px] font-bold text-cocoa-brown/40 uppercase tracking-widest ml-1">{label}</label>
        <input 
            {...props} 
            id={props.name} 
            className="w-full bg-cream border-2 border-blush-pink/20 rounded-2xl py-4 px-6 text-cocoa-brown focus:border-rose-gold focus:ring-4 focus:ring-rose-gold/10 transition-all outline-none placeholder:text-muted-mauve/30"
        />
    </div>
);
const AdminTextarea: React.FC<any> = ({ label, ...props }) => (
    <div className="space-y-2">
        <label htmlFor={props.name} className="text-[10px] font-bold text-cocoa-brown/40 uppercase tracking-widest ml-1">{label}</label>
        <textarea 
            {...props} 
            id={props.name} 
            className="w-full bg-cream border-2 border-blush-pink/20 rounded-2xl py-4 px-6 text-cocoa-brown focus:border-rose-gold focus:ring-4 focus:ring-rose-gold/10 transition-all outline-none placeholder:text-muted-mauve/30 resize-none" 
            rows={props.rows || 2}
        ></textarea>
    </div>
);
const AdminCheckbox: React.FC<any> = ({ label, ...props }) => (
    <label className="flex items-center gap-4 p-4 bg-cream border border-blush-pink/10 rounded-2xl cursor-pointer hover:bg-cream/50 transition-all group">
        <div className="relative flex items-center">
            <input 
                type="checkbox" 
                {...props} 
                className="peer h-6 w-6 rounded-lg border-2 border-blush-pink/30 text-rose-gold focus:ring-rose-gold transition-all appearance-none checked:bg-rose-gold checked:border-rose-gold"
            />
            <CheckCircle2 className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" />
        </div>
        <span className="text-sm font-bold text-cocoa-brown/60 group-hover:text-cocoa-brown transition-colors">{label}</span>
    </label>
);
const OptionManager: React.FC<{title: string, category: keyof CustomizationCollection, options: string[], newOptionValue: string, onNewOptionChange: React.ChangeEventHandler<HTMLInputElement>, onAdd: Function, onDelete: Function}> = 
({title, category, options, newOptionValue, onNewOptionChange, onAdd, onDelete}) => (
    <div className="bg-cream p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl shadow-cocoa-brown/5 border border-blush-pink/10 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
            <h4 className="text-lg sm:text-xl font-serif font-bold text-cocoa-brown">{title}</h4>
            <span className="text-[10px] font-bold text-rose-gold uppercase tracking-widest bg-rose-gold/10 px-3 py-1 rounded-full">{options.length}</span>
        </div>
        
        <div className="flex gap-2 sm:gap-3">
            <input 
                type="text" 
                value={newOptionValue} 
                onChange={onNewOptionChange} 
                placeholder={`Nuevo ${title.slice(0,-2)}...`} 
                className="flex-grow bg-cream/30 border-2 border-blush-pink/10 rounded-lg sm:rounded-xl py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm focus:border-rose-gold outline-none transition-all"
            />
            <button 
                onClick={() => onAdd(category)} 
                className="bg-cocoa-brown text-white p-3 rounded-xl hover:bg-rose-gold transition-all shadow-lg shadow-cocoa-brown/10"
            >
                <Plus className="w-5 h-5" />
            </button>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
                {options.map(opt => (
                    <motion.div 
                        key={opt}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center justify-between p-4 bg-cream/20 rounded-2xl group hover:bg-cream/40 transition-colors"
                    >
                        <span className="text-sm text-cocoa-brown/80 font-medium">{opt}</span>
                        <button 
                            onClick={() => onDelete(category, opt)} 
                            className="p-2 text-muted-mauve/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                            <Trash className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    </div>
);

export default AdminPage;