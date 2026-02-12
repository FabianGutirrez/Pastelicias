
import { Product, CustomizationCollection } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Waffles con Chocolate (Triángulos)',
    description: 'Deliciosos mini waffles triangulares bañados en un rico chocolate de cobertura.',
    longDescription: 'Nuestros mini waffles son crujientes por fuera y suaves por dentro. Vienen bañados en un rico chocolate de cobertura y son perfectos para cualquier mesa dulce o evento especial. Un bocado irresistible.',
    price: 7500,
    imageUrl: 'https://images.pexels.com/photos/1326946/pexels-photo-1326946.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    isFeatured: true,
    category: 'dulce',
    priceTiers: [
      { quantity: 30, price: 7500, label: '30 unidades' },
      { quantity: 50, price: 10000, label: '50 unidades' },
      { quantity: 100, price: 18000, label: '100 unidades' },
    ],
    availableCustomizations: ['colors']
  },
  {
    id: 2,
    name: 'Mini Donas Surtidas',
    description: 'Pequeñas y esponjosas donas con glaseados y chispas de colores vibrantes.',
    longDescription: 'Una selección irresistible de mini donas, perfectas para alegrar cualquier momento. Vienen en una variedad de sabores y decoraciones para satisfacer todos los gustos. Ideales para compartir.',
    price: 7000,
    imageUrl: 'https://images.pexels.com/photos/867470/pexels-photo-867470.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    isFeatured: true,
    category: 'dulce',
    priceTiers: [
      { quantity: 25, price: 7000, label: '25 unidades' },
      { quantity: 50, price: 12000, label: '50 unidades' },
      { quantity: 100, price: 18000, label: '100 unidades' },
    ],
    availableCustomizations: ['colors']
  },
  {
    id: 3,
    name: 'Cakepops de Chocolate',
    description: 'Bocados de bizcocho de chocolate cubiertos y decorados, ideales para fiestas.',
    longDescription: 'Nuestros cakepops combinan un tierno bizcocho de chocolate con una cobertura crujiente. Cada uno está cuidadosamente decorado a mano para ser el centro de atención de tu mesa de postres.',
    price: 7000,
    imageUrl: 'https://images.pexels.com/photos/5119528/pexels-photo-5119528.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    isFeatured: false,
    category: 'dulce',
    priceTiers: [
      { quantity: 24, price: 7000, label: '24 cakepops' },
      { quantity: 48, price: 13000, label: '48 cakepops' },
      { quantity: 100, price: 22000, label: '100 cakepops' },
    ],
    availableCustomizations: ['flavors', 'colors']
  },
  {
    id: 4,
    name: 'Mashpops Divertidos',
    description: 'Suaves malvaviscos bañados en chocolate y decorados con chispas de colores.',
    longDescription: 'Una golosina divertida y deliciosa que encanta a niños y adultos. Los Mashpops son la combinación perfecta de la suavidad del malvavisco con el rico sabor del chocolate.',
    price: 7500,
    imageUrl: 'https://images.pexels.com/photos/1038935/pexels-photo-1038935.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'dulce',
    priceTiers: [
      { quantity: 30, price: 7500, label: '30 unidades' },
      { quantity: 60, price: 14000, label: '60 unidades' },
      { quantity: 100, price: 21000, label: '100 unidades' },
    ],
    availableCustomizations: ['colors']
  },
  {
    id: 5,
    name: 'Mini Pie de Limón',
    description: 'El equilibrio perfecto entre el ácido del limón y el dulce del merengue.',
    longDescription: 'Disfruta del sabor clásico del pie de limón en un formato individual. Base de galleta crujiente, relleno de crema de limón y una corona de merengue suave y tostado.',
    price: 12000,
    imageUrl: 'https://images.pexels.com/photos/7968033/pexels-photo-7968033.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    isFeatured: false,
    category: 'dulce',
    priceTiers: [
      { quantity: 40, price: 12000, label: '40 unidades' },
      { quantity: 80, price: 20000, label: '80 unidades' },
      { quantity: 100, price: 23000, label: '100 unidades' },
    ],
    availableCustomizations: []
  },
  {
    id: 6,
    name: 'Mini Tartaletas de Fruta',
    description: 'Pequeñas tartaletas rellenas de crema pastelera y cubiertas con fruta fresca.',
    longDescription: 'Un bocado fresco y elegante. Nuestras mini tartaletas tienen una base crujiente, un corazón de crema pastelera suave y están decoradas con frutas de temporada.',
    price: 12000,
    imageUrl: 'https://images.pexels.com/photos/135127/pexels-photo-135127.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'dulce',
    priceTiers: [
        { quantity: 40, price: 12000, label: '40 unidades' },
        { quantity: 80, price: 20000, label: '80 unidades' },
        { quantity: 100, price: 23000, label: '100 unidades' },
    ],
    availableCustomizations: []
  },
  {
    id: 7,
    name: 'Mini Berlines Rellenos',
    description: 'Esponjosos y azucarados, rellenos de una deliciosa crema pastelera.',
    longDescription: 'Tiernos y esponjosos, nuestros mini berlines están generosamente espolvoreados con azúcar flor y esconden un delicioso relleno de crema pastelera casera.',
    price: 7000,
    imageUrl: 'https://images.pexels.com/photos/8968233/pexels-photo-8968233.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'dulce',
    priceTiers: [
        { quantity: 25, price: 7000, label: '25 unidades' },
        { quantity: 50, price: 14000, label: '50 unidades' },
        { quantity: 100, price: 25000, label: '100 unidades' },
    ],
    availableCustomizations: ['fillings']
  },
  {
    id: 8,
    name: 'Promo 1 (120 Unidades Fijas)',
    description: 'Un surtido dulce completo y predefinido para tus celebraciones.',
    longDescription: '¡La combinación ideal para satisfacer a todos! Esta promoción incluye un surtido fijo: 40 mini cupcakes, 40 mini donas, 20 mashpops y 20 cakepops. No es personalizable.',
    price: 22000,
    imageUrl: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    isFeatured: true,
    category: 'promocion',
    priceTiers: [
      { quantity: 120, price: 22000, label: 'Total 120 unidades' }
    ],
    availableCustomizations: []
  },
  {
    id: 10,
    name: 'Promo Dulce: Arma tu Caja',
    description: 'Crea tu propia selección de delicias dulces. ¡Tú eliges 5 variedades!',
    longDescription: 'Arma tu caja perfecta eligiendo 5 variedades de nuestra selección dulce. Ideal para personalizar tu mesa de postres o para regalar una experiencia única.',
    price: 30000,
    imageUrl: 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    isFeatured: true,
    category: 'promocion',
    priceTiers: [
        { quantity: 100, price: 30000, label: '100 unidades a elección' }
    ],
    selectableProducts: {
      maxSelections: 5,
      productIds: [2, 3, 4, 5, 6, 7, 21, 22] // Donas, Cakepops, Mashpops, Pie, Tartaletas, Berlines, Tacitas, Cachitos
    }
  },
  {
    id: 11,
    name: 'Mini Empanadas de Queso',
    description: 'Clásicas y deliciosas, el bocado salado que no puede faltar en tu evento.',
    longDescription: 'Crujientes y rellenas de queso derretido. Nuestras mini empanadas son horneadas a la perfección y son el complemento salado ideal para cualquier celebración.',
    price: 17000,
    imageUrl: 'https://images.pexels.com/photos/3599233/pexels-photo-3599233.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'salado',
    priceTiers: [
        { quantity: 50, price: 17000, label: '50 unidades' },
        { quantity: 100, price: 30000, label: '100 unidades' }
    ],
    availableCustomizations: []
  },
  {
    id: 12,
    name: 'Tapaditos Surtidos',
    description: 'Pequeños sándwiches en pan suave con una variedad de rellenos frescos.',
    longDescription: 'Una selección de tapaditos clásicos con rellenos como ave-pimiento, pasta de huevo y jamón-queso. Perfectos para cualquier cóctel o reunión.',
    price: 18000,
    imageUrl: 'https://images.pexels.com/photos/806361/pexels-photo-806361.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'salado',
    priceTiers: [
        { quantity: 50, price: 18000, label: '50 unidades' },
        { quantity: 100, price: 32000, label: '100 unidades' }
    ],
    availableCustomizations: []
  },
  {
    id: 13,
    name: 'Mini Chaparritas',
    description: 'Crujientes salchichas envueltas en masa horneada, un clásico irresistible.',
    longDescription: 'Las favoritas de todos. Mini salchichas de alta calidad envueltas en una masa suave y dorada, horneadas hasta la perfección. Se sirven calientes y deliciosas.',
    price: 17000,
    imageUrl: 'https://images.pexels.com/photos/14876646/pexels-photo-14876646.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'salado',
    priceTiers: [
        { quantity: 50, price: 17000, label: '50 unidades' },
        { quantity: 100, price: 30000, label: '100 unidades' }
    ],
    availableCustomizations: []
  },
  {
    id: 14,
    name: 'Canapés Premium',
    description: 'Elegantes bocadillos con combinaciones de sabores gourmet.',
    longDescription: 'Eleva tu evento con nuestros canapés premium. Bases crujientes con toppings como salmón ahumado con queso crema, palmitos con salsa golf y champiñones al ajillo.',
    price: 20000,
    imageUrl: 'https://images.pexels.com/photos/5638732/pexels-photo-5638732.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'salado',
    priceTiers: [
        { quantity: 50, price: 20000, label: '50 unidades' },
        { quantity: 100, price: 35000, label: '100 unidades' }
    ],
    availableCustomizations: []
  },
  {
    id: 20,
    name: 'Promo Salada: Arma tu Bandeja',
    description: 'Elige 4 variedades de nuestros bocados salados y crea tu surtido perfecto.',
    longDescription: 'Personaliza tu cóctel con nuestra promoción salada. Elige 4 de tus productos favoritos y nosotros preparamos una bandeja surtida de 100 unidades para tu evento.',
    price: 32000,
    imageUrl: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'promocion',
    priceTiers: [
        { quantity: 100, price: 32000, label: '100 unidades a elección' }
    ],
    selectableProducts: {
      maxSelections: 4,
      productIds: [11, 12, 13, 14] // Empanadas, Tapaditos, Chaparritas, Canapés
    }
  },
  {
    id: 21,
    name: 'Tacitas de Cóctel',
    description: 'Pequeñas masitas rellenas con crema pastelera y decoradas con frutas.',
    longDescription: 'Un clásico de la repostería chilena en formato de cóctel. Pequeñas y delicadas masitas horneadas, rellenas de suave crema pastelera y coronadas con una fruta de la estación.',
    price: 12000,
    imageUrl: 'https://images.pexels.com/photos/1854037/pexels-photo-1854037.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'dulce',
    priceTiers: [
        { quantity: 40, price: 12000, label: '40 unidades' },
        { quantity: 80, price: 20000, label: '80 unidades' }
    ],
    availableCustomizations: []
  },
  {
    id: 22,
    name: 'Cachitos de Hojaldre',
    description: 'Crujientes cachitos de hojaldre rellenos de manjar (dulce de leche).',
    longDescription: 'Una delicia tradicional que no puede faltar. Crujiente masa de hojaldre horneada a la perfección y rellena generosamente con el más cremoso manjar casero.',
    price: 8000,
    imageUrl: 'https://images.pexels.com/photos/827513/pexels-photo-827513.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'dulce',
    priceTiers: [
        { quantity: 30, price: 8000, label: '30 unidades' },
        { quantity: 60, price: 15000, label: '60 unidades' }
    ],
    availableCustomizations: []
  }
];

export const INITIAL_CUSTOMIZATION_OPTIONS: CustomizationCollection = {
    flavors: ['Surtidos', 'Vainilla', 'Chocolate', 'Red Velvet'],
    fillings: ['Surtidos', 'Crema Pastelera', 'Dulce de Leche', 'Ganache de Chocolate'],
    colors: ['Surtidos', 'Rosado Pastel', 'Azul Cielo', 'Blanco Clásico'],
};