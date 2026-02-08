
import React, { useState, useEffect } from 'react';
import { Product, CustomizationCollection } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface AdminPageProps {
    products: Product[];
    customizationOptions: CustomizationCollection;
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: number) => void;
    onUpdateCustomizationOptions: (newOptions: CustomizationCollection) => void;
}

const emptyProduct: Omit<Product, 'id'> = {
    name: '',
    description: '',
    longDescription: '',
    price: 0,
    imageUrl: 'https://picsum.photos/400/300',
    inStock: true,
    category: 'dulce',
    isFeatured: false,
    priceTiers: [{ quantity: 0, price: 0, label: '' }],
};

const AdminPage: React.FC<AdminPageProps> = ({ 
    products, 
    customizationOptions,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct,
    onUpdateCustomizationOptions,
}) => {
    const [editingProduct, setEditingProduct] = useState<Product | Omit<Product, 'id'> | null>(null);
    const [formState, setFormState] = useState<Product | Omit<Product, 'id'>>(emptyProduct);
    const [newOptions, setNewOptions] = useState<Record<keyof CustomizationCollection, string>>({ flavors: '', fillings: '', colors: '' });

    useEffect(() => {
        if (editingProduct) {
            setFormState(editingProduct);
        } else {
            setFormState(emptyProduct);
        }
    }, [editingProduct]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormState(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormState(prev => ({ ...prev, [name]: value }));
        }
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
        if ('id' in formState) {
            onUpdateProduct(formState as Product);
        } else {
            onAddProduct(formState);
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
        <section id="admin" className="space-y-12">
            <h2 className="text-3xl font-serif font-bold text-center text-dark-choco">Panel de Administración</h2>
            
            {/* Product Form Modal */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/50 z-50 p-4 flex items-center justify-center" onClick={() => setEditingProduct(null)}>
                    <div className="bg-cream rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleSubmit} className="p-8 space-y-4">
                            <h3 className="text-2xl font-serif font-bold text-dark-choco">{'id' in editingProduct ? 'Editar' : 'Añadir'} Producto</h3>
                            {/* Form fields */}
                            <AdminInput label="Nombre del Producto" name="name" value={formState.name} onChange={handleFormChange} />
                            <AdminTextarea label="Descripción Corta" name="description" value={formState.description} onChange={handleFormChange} />
                            <AdminTextarea label="Descripción Larga" name="longDescription" value={formState.longDescription} onChange={handleFormChange} rows={4}/>
                            <AdminInput label="URL de la Imagen" name="imageUrl" value={formState.imageUrl} onChange={handleFormChange} />
                            <AdminInput label="Precio Base (Desde)" name="price" type="number" value={formState.price} onChange={handleFormChange} />
                            
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-dark-choco mb-1">Categoría</label>
                                <select id="category" name="category" value={formState.category} onChange={handleFormChange} className="admin-input">
                                    <option value="dulce">Dulce</option>
                                    <option value="salado">Salado</option>
                                    <option value="promocion">Promoción</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-choco mb-2">Paquetes de Precios</label>
                                {formState.priceTiers.map((tier, index) => (
                                <div key={index} className="flex items-center gap-2 mb-2 p-2 border border-peach rounded-md">
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
                                <button type="button" onClick={() => setEditingProduct(null)} className="py-2 px-4 rounded-md bg-gray-300 hover:bg-gray-400">Cancelar</button>
                                <button type="submit" className="py-2 px-6 rounded-md bg-brown-sugar text-cream hover:bg-dark-choco">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Product Management */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-serif font-bold text-dark-choco">Gestionar Productos</h3>
                    <button onClick={() => setEditingProduct(emptyProduct)} className="bg-brown-sugar text-cream font-bold py-2 px-4 rounded-md hover:bg-dark-choco">Añadir Nuevo Producto</button>
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

            {/* Customization Options Management */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-serif font-bold text-dark-choco mb-4">Gestionar Opciones de Personalización</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <OptionManager title="Sabores" category="flavors" options={customizationOptions.flavors} newOptionValue={newOptions.flavors} onNewOptionChange={e => setNewOptions(p => ({...p, flavors: e.target.value}))} onAdd={handleAddOption} onDelete={handleDeleteOption} />
                    <OptionManager title="Rellenos" category="fillings" options={customizationOptions.fillings} newOptionValue={newOptions.fillings} onNewOptionChange={e => setNewOptions(p => ({...p, fillings: e.target.value}))} onAdd={handleAddOption} onDelete={handleDeleteOption} />
                    <OptionManager title="Colores" category="colors" options={customizationOptions.colors} newOptionValue={newOptions.colors} onNewOptionChange={e => setNewOptions(p => ({...p, colors: e.target.value}))} onAdd={handleAddOption} onDelete={handleDeleteOption} />
                </div>
            </div>
        </section>
    );
};

// Helper components for Admin form
const AdminInput: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-dark-choco mb-1">{label}</label>
        <input {...props} id={props.name} className="admin-input"/>
    </div>
);
const AdminTextarea: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-dark-choco mb-1">{label}</label>
        <textarea {...props} id={props.name} className="admin-input" rows={props.rows || 2}></textarea>
    </div>
);
const AdminCheckbox: React.FC<any> = ({ label, ...props }) => (
    <label className="flex items-center gap-2">
        <input type="checkbox" {...props} className="h-4 w-4 rounded border-peach text-brown-sugar focus:ring-brown-sugar"/>
        <span className="text-sm font-medium text-dark-choco">{label}</span>
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

// This is a hacky way to inject styles in this environment. 
// For a production build, this should be moved to a separate CSS file.
const styleExists = document.getElementById('admin-styles');
if (!styleExists) {
    const styleElement = document.createElement('style');
    styleElement.id = 'admin-styles';
    styleElement.textContent = `
        .admin-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #FFDAB9; /* peach */
            border-radius: 6px;
            background-color: #FFF;
        }
        .admin-input:focus {
            outline: none;
            border-color: #B08968; /* brown-sugar */
            box-shadow: 0 0 0 2px rgba(176, 137, 104, 0.2);
        }
    `;
    document.head.append(styleElement);
}

export default AdminPage;