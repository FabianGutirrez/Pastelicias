
import { Product, CustomizationCollection } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- PRODUCTOS DULCES ---
  {
    id: 1,
    name: 'Waffles con Chocolate (Triángulos)',
    description: 'Deliciosos mini waffles triangulares bañados en un rico chocolate de cobertura.',
    longDescription: 'Nuestros mini waffles son crujientes por fuera y suaves por dentro. Vienen bañados en un rico chocolate de cobertura y son perfectos para cualquier mesa dulce o evento especial.',
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
  },
  {
    id: 2,
    name: 'Mini Donas',
    description: 'Pequeñas y esponjosas donas con glaseados y chispas de colores vibrantes.',
    longDescription: 'Una selección irresistible de mini donas, perfectas para alegrar cualquier momento. Vienen en una variedad de sabores y decoraciones para satisfacer todos los gustos.',
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
  },
  {
    id: 3,
    name: 'Cakepops',
    description: 'Bocados de bizcocho de chocolate cubiertos y decorados, ideales para fiestas.',
    longDescription: 'Nuestros cakepops combinan un tierno bizcocho de chocolate con una cobertura crujiente. Cada uno está cuidadosamente decorado a mano para ser el centro de atención.',
    price: 7000,
    imageUrl: 'https://images.pexels.com/photos/5119528/pexels-photo-5119528.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'dulce',
    priceTiers: [
      { quantity: 24, price: 7000, label: '24 unidades' },
      { quantity: 48, price: 13000, label: '48 unidades' },
      { quantity: 100, price: 22000, label: '100 unidades' },
    ],
  },
  {
    id: 4,
    name: 'Mashpops',
    description: 'Suaves malvaviscos bañados en chocolate y decorados con chispas de colores.',
    longDescription: 'Una golosina divertida y deliciosa que encanta a niños y adultos. La combinación perfecta de la suavidad del malvavisco con el rico sabor del chocolate.',
    price: 7500,
    imageUrl: 'https://images.pexels.com/photos/1038935/pexels-photo-1038935.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'dulce',
    priceTiers: [
      { quantity: 30, price: 7500, label: '30 unidades' },
      { quantity: 60, price: 14000, label: '60 unidades' },
      { quantity: 100, price: 21000, label: '100 unidades' },
    ],
  },
  {
    id: 5,
    name: 'Mini Pie de Limón',
    description: 'El equilibrio perfecto entre el ácido del limón y el dulce del merengue.',
    longDescription: 'Disfruta del sabor clásico del pie de limón en un formato individual. Base de galleta crujiente, relleno de crema de limón y una corona de merengue suave.',
    price: 12000,
    imageUrl: 'https://images.pexels.com/photos/7968033/pexels-photo-7968033.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'dulce',
    priceTiers: [
      { quantity: 40, price: 12000, label: '40 unidades' },
      { quantity: 80, price: 20000, label: '80 unidades' },
      { quantity: 100, price: 23000, label: '100 unidades' },
    ],
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
  },
  {
    id: 7,
    name: 'Mini Berlines',
    description: 'Esponjosos y azucarados, rellenos de una deliciosa crema pastelera o manjar.',
    longDescription: 'Tiernos y esponjosos, nuestros mini berlines están generosamente espolvoreados con azúcar flor y esconden un delicioso relleno casero.',
    price: 7000,
    imageUrl: 'https://images.pexels.com/photos/8968233/pexels-photo-8968233.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'dulce',
    priceTiers: [
        { quantity: 25, price: 7000, label: '25 unidades' },
        { quantity: 50, price: 14000, label: '50 unidades' },
        { quantity: 100, price: 25000, label: '100 unidades' },
    ],
  },
  {
    id: 8,
    name: 'Mini Cupcakes',
    description: 'Pequeños y esponjosos cupcakes con frosting de colores y sabores surtidos.',
    longDescription: 'La base perfecta para cualquier celebración. Mini cupcakes de vainilla o chocolate con un suave frosting de crema, decorados para la ocasión.',
    price: 7000,
    imageUrl: 'https://images.pexels.com/photos/1055271/pexels-photo-1055271.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'dulce',
    priceTiers: [
        { quantity: 25, price: 7000, label: '25 unidades' },
        { quantity: 50, price: 12000, label: '50 unidades' }
    ],
  },
  {
    id: 9,
    name: 'Mini Tacitas Manjar Nuez',
    description: 'Delicadas masitas horneadas rellenas con una clásica mezcla de manjar y nuez.',
    longDescription: 'Un clásico de la repostería chilena. Pequeñas y delicadas masitas horneadas, rellenas de manjar de campo y nueces seleccionadas.',
    price: 12000,
    imageUrl: 'https://images.pexels.com/photos/1854037/pexels-photo-1854037.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'dulce',
    priceTiers: [
        { quantity: 40, price: 12000, label: '40 unidades' },
        { quantity: 80, price: 20000, label: '80 unidades' }
    ],
  },
  {
    id: 10,
    name: 'Mini Cachitos',
    description: 'Crujientes cachitos de hojaldre rellenos de manjar (dulce de leche).',
    longDescription: 'Una delicia tradicional que no puede faltar. Crujiente masa de hojaldre horneada a la perfección y rellena generosamente con el más cremoso manjar.',
    price: 8000,
    imageUrl: 'https://images.pexels.com/photos/827513/pexels-photo-827513.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'dulce',
    priceTiers: [
        { quantity: 30, price: 8000, label: '30 unidades' },
        { quantity: 60, price: 15000, label: '60 unidades' }
    ],
  },

  // --- PRODUCTOS SALADOS ---
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
  },
   {
    id: 12,
    name: 'Mini Empanadas Jamón Queso',
    description: 'La combinación perfecta de jamón y queso en una masa crujiente.',
    longDescription: 'Un clásico irresistible. Mini empanadas horneadas rellenas de jamón pierna y queso fundido, perfectas para cualquier ocasión.',
    price: 17000,
    imageUrl: 'https://images.pexels.com/photos/114670/pexels-photo-114670.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'salado',
    priceTiers: [
        { quantity: 50, price: 17000, label: '50 unidades' },
        { quantity: 100, price: 30000, label: '100 unidades' }
    ],
  },
  {
    id: 13,
    name: 'Tapaditos',
    description: 'Pequeños sándwiches en pan suave. Elige entre churrasco luco o lechuga-tomate-mayo.',
    longDescription: 'Una selección de tapaditos clásicos en pan de miga suave. Ideales para cualquier cóctel, con rellenos frescos y sabrosos para todos los gustos.',
    price: 17000,
    imageUrl: 'https://images.pexels.com/photos/806361/pexels-photo-806361.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'salado',
    priceTiers: [
        { quantity: 25, price: 17000, label: '25 unidades' },
        { quantity: 50, price: 30000, label: '50 unidades' }
    ],
  },
  {
    id: 14,
    name: 'Mini Pizzas',
    description: 'Bases de masa esponjosa con salsa de tomate, queso y orégano.',
    longDescription: 'El sabor de la pizza en un bocado. Nuestras mini pizzas son perfectas para eventos, con una base de masa tierna, salsa de tomate casera y abundante queso.',
    price: 9500,
    imageUrl: 'https://images.pexels.com/photos/845811/pexels-photo-845811.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'salado',
    priceTiers: [
        { quantity: 25, price: 9500, label: '25 unidades' },
        { quantity: 50, price: 17500, label: '50 unidades' },
        { quantity: 100, price: 30000, label: '100 unidades' },
    ],
  },
  {
    id: 15,
    name: 'Mini Chaparritas',
    description: 'Crujientes salchichas envueltas en masa horneada, un clásico irresistible.',
    longDescription: 'Las favoritas de todos. Mini salchichas de alta calidad envueltas en una masa suave y dorada, horneadas hasta la perfección. Se sirven calientes y deliciosas.',
    price: 9000,
    imageUrl: 'https://images.pexels.com/photos/14876646/pexels-photo-14876646.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'salado',
    priceTiers: [
        { quantity: 25, price: 9000, label: '25 unidades' },
        { quantity: 50, price: 14000, label: '50 unidades' },
        { quantity: 100, price: 23000, label: '100 unidades' },
    ],
  },
  {
    id: 16,
    name: 'Canapés',
    description: 'Elegantes bocadillos con combinaciones de sabores gourmet. 2 o 3 variedades.',
    longDescription: 'Eleva tu evento con nuestros canapés premium. Variedades como ave-mayo-pimentón, lomito-atún-mayo-orégano y queso Philadelphia-tomate-ciboulette.',
    price: 16000,
    imageUrl: 'https://images.pexels.com/photos/5638732/pexels-photo-5638732.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'salado',
    priceTiers: [
        { quantity: 50, price: 16000, label: '50 unidades (2 varied.)' },
        { quantity: 100, price: 28000, label: '100 unidades (3 varied.)' }
    ],
  },
  {
    id: 17,
    name: 'Mini Tacita Choclo',
    description: 'Suaves masitas rellenas con una cremosa pasta de choclo.',
    longDescription: 'Un bocado tradicional y delicioso. Pequeñas masitas horneadas con un relleno cremoso de pasta de choclo, un sabor casero que sorprende.',
    price: 15000,
    imageUrl: 'https://images.pexels.com/photos/4109128/pexels-photo-4109128.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'salado',
    priceTiers: [
        { quantity: 50, price: 15000, label: '50 unidades' },
        { quantity: 100, price: 28000, label: '100 unidades' }
    ],
  },

  // --- PROMOCIONES ---
  {
    id: 20,
    name: 'PROMO 1',
    description: 'Un surtido dulce completo y predefinido para tus celebraciones.',
    longDescription: '¡La combinación ideal para satisfacer a todos! Esta promoción incluye un surtido fijo de 120 unidades: 40 mini cupcakes, 40 mini donas, 20 mashpops y 20 cakepops. No es personalizable.',
    price: 22000,
    imageUrl: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    isFeatured: true,
    category: 'promocion',
    priceTiers: [
      { quantity: 120, price: 22000, label: 'Total 120 unidades' }
    ],
  },
  {
    id: 21,
    name: 'PROMO 2',
    description: 'El doble de dulzura para eventos más grandes. 240 unidades fijas.',
    longDescription: 'Para celebraciones en grande. Esta promoción incluye un surtido fijo de 240 unidades: 80 mini cupcakes, 80 mini donas, 40 mashpops y 40 cakepops. No es personalizable.',
    price: 40000,
    imageUrl: 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'promocion',
    priceTiers: [
      { quantity: 240, price: 40000, label: 'Total 240 unidades' }
    ],
  },
  {
    id: 22,
    name: 'PROMO 3 (Dulce a Elección)',
    description: '100 unidades: elige 4 o 5 de tus variedades dulces favoritas.',
    longDescription: 'Arma tu caja dulce perfecta eligiendo hasta 5 variedades de nuestra selección. Ideal para personalizar tu mesa de postres o para regalar una experiencia única.',
    price: 30000,
    imageUrl: 'https://images.pexels.com/photos/2067423/pexels-photo-2067423.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    isFeatured: true,
    category: 'promocion',
    priceTiers: [
        { quantity: 100, price: 30000, label: '100 unidades a elección' }
    ],
    selectableProducts: {
      maxSelections: 5,
      productIds: [8, 2, 6, 5, 3, 4, 7, 9, 10] // IDs de: Cupcakes, Donas, Tartaletas, Pie de Limón, Cakepops, Mashpops, Berlines, Tacitas Manjar Nuez, Cachitos
    }
  },
  {
    id: 23,
    name: 'PROMO 4 (Salado a Elección)',
    description: '100 unidades: elige 4 o 5 de tus variedades saladas favoritas.',
    longDescription: 'Personaliza tu cóctel con nuestra promoción salada. Elige hasta 5 de tus productos favoritos y nosotros preparamos una bandeja surtida de 100 unidades para tu evento.',
    price: 40000,
    imageUrl: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    isFeatured: true,
    category: 'promocion',
    priceTiers: [
        { quantity: 100, price: 40000, label: '100 unidades a elección' }
    ],
    selectableProducts: {
      maxSelections: 5,
      productIds: [11, 12, 13, 14, 15, 16, 17] // IDs de: Empanadas Queso, Empanadas J/Q, Tapaditos, Pizzas, Chaparritas, Canapés, Tacita Choclo
    }
  },
  {
    id: 24,
    name: 'Cajita 50 Mini Pastelitos Surtidos',
    description: 'Una selección variada de nuestros mejores mini pastelitos dulces.',
    longDescription: 'La opción perfecta para un antojo o un pequeño detalle. Incluye un surtido de 50 mini pastelitos seleccionados por nosotros, incluyendo donas, cupcakes, pie de limón y tartaletas.',
    price: 10000,
    imageUrl: 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'promocion',
    priceTiers: [
        { quantity: 50, price: 10000, label: '50 unidades surtidas' }
    ],
  },
  {
    id: 25,
    name: 'Ciento Dulce (4 Variedades)',
    description: 'Una selección fija de 100 delicias dulces a un precio especial.',
    longDescription: 'Un clásico que nunca falla. 100 unidades de nuestras 4 variedades más populares: mini cupcakes, mini donas, mini pie de limón y mini tartaletas.',
    price: 18000,
    imageUrl: 'https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'promocion',
    priceTiers: [
        { quantity: 100, price: 18000, label: '100 unidades fijas' }
    ],
  },
  {
    id: 26,
    name: 'Cajita Mixta Salada',
    description: 'Un surtido fijo de nuestros mejores bocados salados.',
    longDescription: 'La solución perfecta para tu picoteo. Incluye un surtido de canapés, mini empanadas de queso, chaparritas, mini pizzas y mini tacitas de choclo.',
    price: 15000,
    imageUrl: 'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'promocion',
    priceTiers: [
        { quantity: 50, price: 15000, label: '50 unidades' },
        { quantity: 100, price: 25000, label: '100 unidades' }
    ],
  },
  {
    id: 27,
    name: 'Ciento Mixto (50 Dulce y 50 Salado)',
    description: 'Lo mejor de ambos mundos: 50 bocados dulces y 50 salados.',
    longDescription: '¿Por qué elegir? Disfruta de una selección equilibrada. Incluye: DULCE (mini donas, mini cupcakes, mini pie, mini tartaletas) y SALADO (canapés, mini empanada queso, chaparrita, mini pizza, mini tacita choclo).',
    price: 23000,
    imageUrl: 'https://images.pexels.com/photos/1633572/pexels-photo-1633572.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'promocion',
    priceTiers: [
        { quantity: 100, price: 23000, label: '50 dulces y 50 salados' }
    ],
  }
];

export const INITIAL_CUSTOMIZATION_OPTIONS: CustomizationCollection = {
    flavors: ['Surtidos', 'Vainilla', 'Chocolate', 'Red Velvet'],
    fillings: ['Surtidos', 'Crema Pastelera', 'Dulce de Leche', 'Ganache de Chocolate'],
    colors: ['Surtidos', 'Rosado Pastel', 'Azul Cielo', 'Blanco Clásico'],
};