
export interface Product {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  price: number; // Represents the starting price
  imageUrl: string; // Can be a web URL or a local base64 data URI
  inStock: boolean;
  category: 'dulce' | 'salado' | 'promocion';
  isFeatured?: boolean;
  priceTiers: {
    quantity: number;
    price: number;
    label: string;
  }[];
  availableCustomizations?: ('flavors' | 'fillings' | 'colors')[];
  selectableProducts?: {
    productIds: number[];
    maxSelections: number;
  };
}

export interface CustomizationOptions {
  flavor: string;
  filling: string;
  color: string;
  message: string;
}

export interface CartItem {
  id: string; 
  product: Product;
  selectedTier: {
    quantity: number;
    price: number;
    label: string;
  };
  customizations: CustomizationOptions;
  selectedSubProducts?: string[];
}

export interface CustomizationCollection {
  flavors: string[];
  fillings: string[];
  colors: string[];
}

export type UserRole = 'customer' | 'admin' | 'superadmin';

export interface AnalyticsEvent {
    type: 'view' | 'addToCart' | 'order';
    timestamp: Date;
    productId?: number;
    items?: CartItem[];
    total?: number;
}

export interface OrderDetails {
    items: CartItem[];
    total: number;
    customerName: string;
    customerPhone: string;
    deliveryType: 'pickup' | 'delivery';
    deliveryDate: string;
    specialInstructions: string;
    shippingCost: number;
    subtotal: number;
}