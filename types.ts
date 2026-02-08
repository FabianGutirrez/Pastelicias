
export interface Product {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  price: number; // Represents the starting price
  imageUrl: string;
  inStock: boolean;
  category: 'dulce' | 'salado' | 'promocion';
  isFeatured?: boolean;
  priceTiers: {
    quantity: number;
    price: number;
    label: string;
  }[];
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
}

export interface CustomizationCollection {
  flavors: string[];
  fillings: string[];
  colors: string[];
}