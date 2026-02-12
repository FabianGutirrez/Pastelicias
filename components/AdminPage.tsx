
import React, { useState, useEffect } from 'react';
import { Product, CustomizationCollection, AnalyticsEvent, UserRole } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import AnalyticsDashboard from './AnalyticsDashboard';


interface AdminPageProps {
    products: Product[];
    customizationOptions: CustomizationCollection;
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: number) => void;
    onUpdateCustomizationOptions: (newOptions: CustomizationCollection) => void;
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

type AdminTab = 'analytics' | 'products' | 'options' | 'settings';

const AdminPage: React.FC<AdminPageProps> = ({ 
    products, 
    customizationOptions,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct,
    onUpdateCustomizationOptions,
    analyticsData,
    currentUserRole,
    siteLogo,
    onUpdateLogo
}) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
    const [editingProduct, setEditingProduct] = useState<Product | Omit<Product, 'id'> | null>(null);
    const [formState, setFormState] = useState<Product | Omit<Product, 'id'>>(emptyProduct);
    const [newOptions, setNewOptions] = useState<Record<keyof CustomizationCollection, string>>({ flavors: '', fillings: '', colors: '' });
    const [newLogoPreview, setNewLogoPreview] = useState<string | null>(null);


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
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveLogo = () => {
        if (newLogoPreview) {
            onUpdateLogo(newLogoPreview);
            setNewLogoPreview(null);
            alert('Logo actualizado con éxito.');
        }
    };


    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (name === 'maxSelections') {
            setFormState(prev => ({ ...prev, selectableProducts: { ...prev.selectableProducts!, maxSelections: parseInt(value, 10) || 0 }}));
        } else if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormState(prev => ({ ...prev, [name]: checked }));
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


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormState(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalProductData = { ...formState };
        if (finalProductData.category !== 'promocion' || !finalProductData.selectableProducts?.productIds.length) {
             delete finalProductData.selectableProducts;
        }

        if ('id' in finalProductData) {
            onUpdateProduct(finalProductData as Product);
        } else {
            onAddProduct(finalProductData);
        }
        setEditingProduct(null);
    };

    const handleDelete = (productId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            onDeleteProduct(productId);
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

    return (
        <section id="admin" className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-center text-cocoa-brown">Panel de Administración</h2>
            
             {/* Tabs */}
            <div className="flex justify-center border-b border-blush-pink mb-6">
                <TabButton title="Análisis" isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                <TabButton title="Gestionar Productos" isActive={activeTab === 'products'} onClick={() => setActiveTab('products')} />
                {currentUserRole === 'superadmin' && (
                    <>
                        <TabButton title="Gestionar Opciones" isActive={activeTab === 'options'} onClick={() => setActiveTab('options')} />
                        <TabButton title="Configuración" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                    </>
                )}
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'analytics' && <AnalyticsDashboard data={analyticsData} products={products} />}
                {activeTab === 'products' && (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-serif font-bold text-cocoa-brown">Productos</h3>
                            <button onClick={() => setEditingProduct(emptyProduct)} className="bg-rose-gold text-cocoa-brown font-bold py-2 px-4 rounded-lg hover:bg-muted-mauve hover:text-white">Añadir Nuevo Producto</button>
                        </div>
                        <div className="bg-rose-gold/20 border-l-4 border-rose-gold text-cocoa-brown/80 p-4 mb-4 rounded-r-lg">
                            <p className="font-bold">¿Cómo crear una Caja Promocional?</p>
                            <p className="text-sm mt-1">1. Añade o edita un producto.</p>
                            <p className="text-sm">2. Selecciona la categoría <strong>"Promoción"</strong>.</p>
                            <p className="text-sm">3. Aparecerá el <strong>"Configurador de Caja"</strong> para que elijas qué productos incluir y cuántos puede seleccionar el cliente.</p>
                        </div>
                        <div className="space-y-2">
                            {products.map(product => (
                                <div key={product.id} className="flex items-center justify-between p-3 bg-cream/50 rounded-md">
                                    <span className="font-semibold">{product.name}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingProduct(product)} className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-md hover:bg-blue-200">Editar</button>
                                        <button onClick={() => handleDelete(product.id)} className="text-sm bg-red-100 text-red-800 py-1 px-3 rounded-md hover:bg-red-200">Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'options' && currentUserRole === 'superadmin' && (
                     <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-serif font-bold text-cocoa-brown mb-1">Opciones de Personalización</h3>
                        <p className="text-sm text-muted-mauve mb-4">Gestiona los sabores, rellenos y colores disponibles para los productos individuales (no promociones).</p>
                        <div className="grid md:grid-cols-3 gap-6">
                            <OptionManager title="Sabores" category="flavors" options={customizationOptions.flavors} newOptionValue={newOptions.flavors} onNewOptionChange={e => setNewOptions(p => ({...p, flavors: e.target.value}))} onAdd={handleAddOption} onDelete={handleDeleteOption} />
                            <OptionManager title="Rellenos" category="fillings" options={customizationOptions.fillings} newOptionValue={newOptions.fillings} onNewOptionChange={e => setNewOptions(p => ({...p, fillings: e.target.value}))} onAdd={handleAddOption} onDelete={handleDeleteOption} />
                            <OptionManager title="Colores" category="colors" options={customizationOptions.colors} newOptionValue={newOptions.colors} onNewOptionChange={e => setNewOptions(p => ({...p, colors: e.target.value}))} onAdd={handleAddOption} onDelete={handleDeleteOption} />
                        </div>
                    </div>
                )}
                {activeTab === 'settings' && currentUserRole === 'superadmin' && (
                     <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-serif font-bold text-cocoa-brown mb-4">Configuración del Sitio</h3>
                        <div className="space-y-6">
                            {/* Logo Manager */}
                            <div>
                                <h4 className="font-bold font-serif text-cocoa-brown mb-2">Gestionar Logo</h4>
                                <div className="flex flex-col sm:flex-row items-start gap-6 p-4 border border-blush-pink rounded-md">
                                    <div className="text-center">
                                        <p className="text-sm font-semibold mb-2">Logo Actual</p>
                                        <img src={siteLogo} alt="Logo actual" className="w-28 h-28 object-contain rounded-md bg-cream p-2"/>
                                    </div>
                                    <div className="flex-grow">
                                        <label htmlFor="logoUpload" className="block text-sm font-medium text-cocoa-brown mb-2">Subir nuevo logo:</label>
                                        <input id="logoUpload" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoFileChange} className="block w-full text-sm text-cocoa-brown file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-gold/50 file:text-cocoa-brown hover:file:bg-rose-gold"/>
                                        {newLogoPreview && (
                                            <div className="mt-4">
                                                <p className="text-sm font-semibold mb-2">Previsualización:</p>
                                                <img src={newLogoPreview} alt="Previsualización del nuevo logo" className="w-28 h-28 object-contain rounded-md bg-cream p-2"/>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={handleSaveLogo} disabled={!newLogoPreview} className="self-end bg-rose-gold text-cocoa-brown font-bold py-2 px-4 rounded-lg hover:bg-muted-mauve hover:text-white disabled:bg-gray-400 disabled:cursor-not-allowed">
                                        Guardar Logo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Form Modal */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/60 z-50 p-4 flex items-center justify-center animate-fade-in" onClick={() => setEditingProduct(null)}>
                    <div className="bg-cream rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleSubmit} className="p-8 space-y-4">
                            <h3 className="text-2xl font-serif font-bold text-cocoa-brown">{'id' in editingProduct ? 'Editar' : 'Añadir'} Producto</h3>
                            <AdminInput label="Nombre del Producto" name="name" value={formState.name} onChange={handleFormChange} />
                            <AdminTextarea label="Descripción Corta" name="description" value={formState.description} onChange={handleFormChange} />
                            <AdminTextarea label="Descripción Larga" name="longDescription" value={formState.longDescription} onChange={handleFormChange} rows={4}/>
                            
                            <div>
                                <label className="block text-sm font-medium text-cocoa-brown mb-1">Imagen del Producto</label>
                                <div className="flex items-center gap-4">
                                    <img src={formState.imageUrl} alt="Previsualización" className="w-24 h-24 object-cover rounded-md bg-gray-200"/>
                                    <input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
                                    <label htmlFor="imageUpload" className="cursor-pointer bg-white text-cocoa-brown font-semibold py-2 px-4 border border-blush-pink rounded-lg hover:bg-blush-pink/50">
                                        Cambiar Imagen
                                    </label>
                                </div>
                            </div>

                            <AdminInput label="Precio Base (Desde)" name="price" type="number" value={formState.price} onChange={handleFormChange} />
                            
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-cocoa-brown mb-1">Categoría</label>
                                <select id="category" name="category" value={formState.category} onChange={handleFormChange} className="admin-input">
                                    <option value="dulce">Dulce</option>
                                    <option value="salado">Salado</option>
                                    <option value="promocion">Promoción</option>
                                </select>
                            </div>

                             <div>
                                <label className="block text-sm font-medium text-cocoa-brown mb-2">Opciones de Personalización Disponibles</label>
                                <div className="flex gap-4">
                                   <AdminCheckbox label="Sabores" name="flavors" checked={formState.availableCustomizations?.includes('flavors') || false} onChange={() => handleCustomizationToggle('flavors')} />
                                   <AdminCheckbox label="Rellenos" name="fillings" checked={formState.availableCustomizations?.includes('fillings') || false} onChange={() => handleCustomizationToggle('fillings')} />
                                   <AdminCheckbox label="Colores" name="colors" checked={formState.availableCustomizations?.includes('colors') || false} onChange={() => handleCustomizationToggle('colors')} />
                                </div>
                            </div>
                            
                            {formState.category === 'promocion' && (
                                <div className="p-4 border-2 border-dashed border-rose-gold rounded-lg space-y-4">
                                    <h4 className="font-bold font-serif text-cocoa-brown">Configurador de Caja Promocional</h4>
                                    <AdminInput label="Número de variedades a elegir" name="maxSelections" type="number" value={formState.selectableProducts?.maxSelections || 0} onChange={handleFormChange}/>
                                    <div>
                                        <label className="block text-sm font-medium text-cocoa-brown mb-2">Productos disponibles para esta caja:</label>
                                        <div className="max-h-48 overflow-y-auto space-y-1 p-2 border border-blush-pink rounded-md bg-white">
                                            {products.filter(p => 'id' in formState ? p.id !== formState.id : true).map(p => (
                                                <AdminCheckbox 
                                                    key={p.id}
                                                    label={`${p.name} (${p.category})`}
                                                    name={`selectable-${p.id}`}
                                                    checked={formState.selectableProducts?.productIds.includes(p.id) || false}
                                                    onChange={() => handleSelectableProductToggle(p.id)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-cocoa-brown mb-2">Paquetes de Precios</label>
                                {formState.priceTiers.map((tier, index) => (
                                <div key={index} className="flex items-center gap-2 mb-2 p-2 border border-blush-pink rounded-md">
                                    <input type="text" name="label" placeholder="Etiqueta (ej. 30 unidades)" value={tier.label} onChange={e => handleTierChange(index, e)} className="admin-input flex-1"/>
                                    <input type="number" name="quantity" placeholder="Cant." value={tier.quantity} onChange={e => handleTierChange(index, e)} className="admin-input w-20"/>
                                    <input type="number" name="price" placeholder="Precio" value={tier.price} onChange={e => handleTierChange(index, e)} className="admin-input w-24"/>
                                    <button type="button" onClick={() => removeTier(index)} className="p-2 text-red-500 hover:text-red-700"><TrashIcon /></button>
                                </div>
                                ))}
                                <button type="button" onClick={addTier} className="text-sm bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300">+ Añadir Paquete</button>
                            </div>

                            <div className="flex gap-4">
                                <AdminCheckbox label="En Stock" name="inStock" checked={formState.inStock} onChange={handleFormChange} />
                                <AdminCheckbox label="Destacado" name="isFeatured" checked={!!formState.isFeatured} onChange={handleFormChange} />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={() => setEditingProduct(null)} className="py-2 px-4 rounded-lg bg-gray-300 hover:bg-gray-400">Cancelar</button>
                                <button type="submit" className="py-2 px-6 rounded-lg bg-rose-gold text-cocoa-brown hover:bg-muted-mauve hover:text-white">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

const TabButton: React.FC<{title: string; isActive: boolean; onClick: () => void}> = ({ title, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-lg font-serif transition-colors duration-300 ${
            isActive ? 'border-b-2 border-rose-gold text-cocoa-brown' : 'text-muted-mauve hover:text-cocoa-brown'
        }`}
        role="tab"
        aria-selected={isActive}
    >
        {title}
    </button>
);


// Helper components for Admin form
const AdminInput: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-cocoa-brown mb-1">{label}</label>
        <input {...props} id={props.name} className="admin-input"/>
    </div>
);
const AdminTextarea: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-cocoa-brown mb-1">{label}</label>
        <textarea {...props} id={props.name} className="admin-input" rows={props.rows || 2}></textarea>
    </div>
);
const AdminCheckbox: React.FC<any> = ({ label, ...props }) => (
    <label className="flex items-center gap-2 p-1">
        <input type="checkbox" {...props} className="h-4 w-4 rounded border-blush-pink text-rose-gold focus:ring-rose-gold"/>
        <span className="text-sm font-medium text-cocoa-brown">{label}</span>
    </label>
);
const OptionManager: React.FC<{title: string, category: keyof CustomizationCollection, options: string[], newOptionValue: string, onNewOptionChange: React.ChangeEventHandler<HTMLInputElement>, onAdd: Function, onDelete: Function}> = 
({title, category, options, newOptionValue, onNewOptionChange, onAdd, onDelete}) => (
    <div className="space-y-3">
        <h4 className="font-bold font-serif">{title}</h4>
        <div className="flex gap-2">
            <input type="text" value={newOptionValue} onChange={onNewOptionChange} placeholder={`Nuevo ${title.slice(0,-2)}...`} className="admin-input flex-grow"/>
            <button onClick={() => onAdd(category)} className="text-sm bg-green-100 text-green-800 py-1 px-3 rounded-md hover:bg-green-200">Añadir</button>
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
            {options.map(opt => (
                <div key={opt} className="flex items-center justify-between text-sm p-2 bg-cream/50 rounded-md">
                    <span>{opt}</span>
                    <button onClick={() => onDelete(category, opt)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon /></button>
                </div>
            ))}
        </div>
    </div>
);

export default AdminPage;