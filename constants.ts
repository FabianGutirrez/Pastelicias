
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
    name: 'Promo 1 (120 Unidades)',
    description: 'Un surtido dulce completo para tus celebraciones, combinando nuestros mejores productos.',
    longDescription: '¡La combinación ideal para satisfacer a todos tus invitados! Esta promoción incluye: 40 mini cupcakes, 40 mini donas, 20 mashpops y 20 cakepops.',
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
    id: 9,
    name: 'Promo 2 (240 Unidades)',
    description: 'El doble de sabor para eventos más grandes. Una selección generosa y variada.',
    longDescription: 'Perfecto para grandes celebraciones. Esta promoción incluye: 80 mini cupcakes, 80 mini donas, 40 mashpops y 40 cakepops. ¡Nadie se quedará sin su postre favorito!',
    price: 40000,
    imageUrl: 'https://images.pexels.com/photos/2067423/pexels-photo-2067423.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    isFeatured: false,
    category: 'promocion',
    priceTiers: [
      { quantity: 240, price: 40000, label: 'Total 240 unidades' }
    ],
    availableCustomizations: []
  },
  {
    id: 10,
    name: 'Promo 3: 100 Dulces a Elección',
    description: 'Crea tu propia selección de 100 delicias dulces. ¡Tú eliges!',
    longDescription: 'Arma tu caja perfecta con 100 unidades, eligiendo entre 4 a 5 variedades de nuestra selección dulce. Indica tus preferidas en las "Instrucciones Especiales" del carrito.',
    price: 30000,
    imageUrl: 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    isFeatured: true,
    category: 'promocion',
    priceTiers: [
        { quantity: 100, price: 30000, label: '100 unidades a elección' }
    ],
    availableCustomizations: []
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
    longDescription: 'Una selección de tapaditos con rellenos clásicos y deliciosos. Perfectos para cócteles, reuniones de oficina o cualquier evento donde quieras ofrecer una opción salada y fresca.',
    price: 17000,
    imageUrl: 'https://images.pexels.com/photos/14737299/pexels-photo-14737299.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'salado',
    priceTiers: [
        { quantity: 25, price: 17000, label: '25 unidades' },
        { quantity: 50, price: 30000, label: '50 unidades' }
    ],
    availableCustomizations: []
  },
  {
    id: 13,
    name: 'Mini Pizzas',
    description: 'El sabor de la pizza en un formato perfecto para cóctel. ¡A todos les encantan!',
    longDescription: 'Bases de pizza esponjosas cubiertas con salsa de tomate, queso y orégano. Un clásico que nunca falla y que es fácil de disfrutar en cualquier tipo de reunión.',
    price: 9500,
    imageUrl: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: false,
    category: 'salado',
    priceTiers: [
        { quantity: 25, price: 9500, label: '25 unidades' },
        { quantity: 50, price: 17000, label: '50 unidades' },
        { quantity: 100, price: 30000, label: '100 unidades' }
    ],
    availableCustomizations: []
  },
  {
    id: 14,
    name: 'Caja Mixta 50 Dulce y 50 Salado',
    description: 'El equilibrio perfecto entre dulce y salado. 100 bocados para todos los gustos.',
    longDescription: '¿No puedes decidirte? ¡No hay problema! Esta caja incluye 50 delicias dulces (mini donas, mini cupcakes, mini pie, tartaletas) y 50 bocados salados (canapés, mini empanadas, mini pizza, etc).',
    price: 23000,
    imageUrl: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    isFeatured: true,
    category: 'promocion',
    priceTiers: [
        { quantity: 100, price: 23000, label: 'Caja 50 dulce y 50 salado' }
    ],
    availableCustomizations: []
  },
  {
    id: 15,
    name: 'Mini Chaparritas',
    description: 'Sabrosas mini vienesas envueltas en masa horneada. El bocado perfecto.',
    longDescription: 'Un clásico irresistible para cualquier evento. Nuestras mini chaparritas son perfectas para picar, con una suave masa que envuelve una sabrosa vienesa.',
    price: 9000,
    imageUrl: 'https://images.pexels.com/photos/8246342/pexels-photo-8246342.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'salado',
    priceTiers: [
      { quantity: 25, price: 9000, label: '25 unidades' },
      { quantity: 50, price: 14000, label: '50 unidades' },
      { quantity: 100, price: 23000, label: '100 unidades' },
    ],
    availableCustomizations: []
  },
  {
    id: 16,
    name: 'Canapés Surtidos',
    description: 'Elegantes bocadillos con una variedad de pastas y decoraciones frescas.',
    longDescription: 'Una selección de canapés premium, ideales para recepciones y cócteles. Elige entre nuestras deliciosas variedades (2 para 50 uds, 3 para 100 uds) y especifícalas en las "Instrucciones Especiales" del carrito.',
    price: 16000,
    imageUrl: 'https://images.pexels.com/photos/6604169/pexels-photo-6604169.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    category: 'salado',
    priceTiers: [
      { quantity: 50, price: 16000, label: '50 unidades (2 variedades)' },
      { quantity: 100, price: 28000, label: '100 unidades (3 variedades)' },
    ],
    availableCustomizations: []
  },
  {
    id: 17,
    name: 'Cajita 50 Mini Pastelitos Surtidos',
    description: 'Una selección variada de nuestros mejores mini pastelitos.',
    longDescription: 'Disfruta de una caja con 50 de nuestros más populares mini pastelitos, incluyendo mini cupcakes, mini donas, pie de limón y tartaletas. Ideal para compartir en cualquier ocasión.',
    price: 10000,
    imageUrl: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    isFeatured: true,
    category: 'promocion',
    priceTiers: [
      { quantity: 50, price: 10000, label: '50 mini pastelitos' }
    ],
    availableCustomizations: []
  },
  {
    id: 18,
    name: 'Ciento Dulce (4 Variedades)',
    description: '100 delicias dulces con 4 variedades a elegir.',
    longDescription: 'Arma tu caja perfecta con 100 unidades, eligiendo 4 variedades de nuestra selección dulce: mini cupcakes, mini donas, mini pie de limón y mini tartaletas.',
    price: 18000,
    imageUrl: 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    isFeatured: true,
    category: 'promocion',
    priceTiers: [
      { quantity: 100, price: 18000, label: '100 unidades (4 variedades)' }
    ],
    availableCustomizations: []
  },
  {
    id: 19,
    name: 'Cajita Mixta Salada',
    description: 'Un surtido de nuestros mejores bocados salados.',
    longDescription: 'Una deliciosa selección de bocados salados que incluye canapés, mini empanadas de queso, chaparritas, mini pizza y mini tacitas de choclo. Perfecto para cualquier cóctel o reunión.',
    price: 15000,
    imageUrl: 'https://images.pexels.com/photos/6604169/pexels-photo-6604169.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    isFeatured: false,
    category: 'salado',
    priceTiers: [
      { quantity: 50, price: 15000, label: '50 unidades' },
      { quantity: 100, price: 25000, label: '100 unidades' }
    ],
    availableCustomizations: []
  },
  {
    id: 20,
    name: 'Promo 4: 100 Salados a Elección',
    description: 'Elige 4 o 5 variedades y arma tu caja salada perfecta con 100 unidades.',
    longDescription: 'Crea tu combinación ideal para cualquier evento con 100 bocados salados. Puedes elegir entre 4 y 5 de nuestras deliciosas variedades. Indica tus preferidas en las "Instrucciones Especiales" del carrito.',
    price: 40000,
    imageUrl: 'https://images.pexels.com/photos/14737299/pexels-photo-14737299.jpeg?auto=compress&cs=tinysrgb&w=600',
    inStock: true,
    isFeatured: true,
    category: 'promocion',
    priceTiers: [
      { quantity: 100, price: 40000, label: '100 unidades (4-5 variedades)' }
    ],
    availableCustomizations: []
  }
];

export const INITIAL_CUSTOMIZATION_OPTIONS: CustomizationCollection = {
    flavors: ['Surtidos', 'Vainilla', 'Chocolate', 'Red Velvet', 'Limón', 'Naranja'],
    fillings: ['Surtidos', 'Crema Pastelera', 'Dulce de Leche', 'Ganache de Chocolate', 'Nata Montada'],
    colors: ['Surtidos', 'Rosado Pastel', 'Azul Cielo', 'Blanco Clásico', 'Dorado Brillante', 'Multicolor'],
};