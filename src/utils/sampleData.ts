import { Flower, TreePine, Star, Droplet, Citrus, LucideIcon } from 'lucide-react';
import { Order } from '@/types/order';

//!! Type definitions for sample data
export interface SimpleProduct {
  title: string;
  size_ml: number;
  price: number;
  image: string;
  id?: string;
  family?: string;
}

export interface DetailedProduct {
  id: string;
  title: string;
  size_ml: number;
  price: number;
  image: string;
  description: string;
  family: string;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  sizes: Array<{ ml: number; price: number }>;
}

export interface FragranceFamily {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  characteristics: string[];
  color: string;
}

export interface FragranceFamilyFilter {
  value: string;
  label: string;
  icon: LucideIcon | null;
}

export interface SampleCartItem {
  product: SimpleProduct;
  quantity: number;
  size_ml: number;
}





//!! Fragrance families data (for category page)
export const fragranceFamilies: FragranceFamily[] = [
  {
    id: 'floral',
    name: 'Floral',
    icon: Flower,
    description: 'Romantic and feminine, featuring the essence of blooming flowers',
    characteristics: ['Rose', 'Jasmine', 'Lily', 'Peony', 'Magnolia'],
    color: 'pink',
  },
  {
    id: 'woody',
    name: 'Woody',
    icon: TreePine,
    description: 'Warm and sophisticated with earthy, forest-inspired notes',
    characteristics: ['Sandalwood', 'Cedar', 'Vetiver', 'Patchouli', 'Oud'],
    color: 'brown',
  },
  {
    id: 'oriental',
    name: 'Oriental',
    icon: Star,
    description: 'Exotic and sensual with rich, spicy, and amber notes',
    characteristics: ['Amber', 'Vanilla', 'Spice', 'Incense', 'Musk'],
    color: 'amber',
  },
  {
    id: 'fresh',
    name: 'Fresh',
    icon: Droplet,
    description: 'Light and invigorating with aquatic and citrus elements',
    characteristics: ['Aquatic', 'Marine', 'Mint', 'Green', 'Cucumber'],
    color: 'blue',
  },
  {
    id: 'citrus',
    name: 'Citrus',
    icon: Citrus,
    description: 'Bright and energizing with zesty, tangy fruit notes',
    characteristics: ['Lemon', 'Orange', 'Grapefruit', 'Bergamot', 'Lime'],
    color: 'orange',
  },
];

//!! Fragrance families for filter (Browse page)
export const fragranceFamiliesFilter: FragranceFamilyFilter[] = [
  { value: 'all', label: 'All Fragrances', icon: null },
  { value: 'floral', label: 'Floral', icon: Flower },
  { value: 'woody', label: 'Woody', icon: TreePine },
  { value: 'oriental', label: 'Oriental', icon: Star },
  { value: 'fresh', label: 'Fresh', icon: Droplet },
  { value: 'citrus', label: 'Citrus', icon: Citrus },
];

//!! Products by family (Category page)
export const productsByFamily: Record<string, SimpleProduct[]> = {
  floral: [
    { id: 'golden-bloom', title: 'Golden Bloom', size_ml: 75, price: 120, image: '/images/golden_bloom.jpg' },
    { id: 'velvet-rose', title: 'Velvet Rose', size_ml: 50, price: 135, image: '/images/golden_bloom.jpg' },
    { id: 'jasmine-dreams', title: 'Jasmine Dreams', size_ml: 100, price: 150, image: '/images/golden_bloom.jpg' },
    { id: 'peony-petals', title: 'Peony Petals', size_ml: 75, price: 125, image: '/images/golden_bloom.jpg' },
    { id: 'lily-garden', title: 'Lily Garden', size_ml: 50, price: 110, image: '/images/golden_bloom.jpg' },
  ],
  woody: [
    { id: 'noir-mystique', title: 'Noir Mystique', size_ml: 100, price: 165, image: '/images/golden_bloom.jpg' },
    { id: 'forest-whisper', title: 'Forest Whisper', size_ml: 75, price: 140, image: '/images/golden_bloom.jpg' },
    { id: 'sandalwood-dreams', title: 'Sandalwood Dreams', size_ml: 50, price: 130, image: '/images/golden_bloom.jpg' },
    { id: 'cedar-essence', title: 'Cedar Essence', size_ml: 100, price: 155, image: '/images/golden_bloom.jpg' },
    { id: 'vetiver-noir', title: 'Vetiver Noir', size_ml: 75, price: 145, image: '/images/golden_bloom.jpg' },
  ],
  oriental: [
    { id: 'midnight-elegance', title: 'Midnight Elegance', size_ml: 50, price: 145, image: '/images/golden_bloom.jpg' },
    { id: 'amber-nights', title: 'Amber Nights', size_ml: 75, price: 140, image: '/images/golden_bloom.jpg' },
    { id: 'vanilla-spice', title: 'Vanilla Spice', size_ml: 100, price: 160, image: '/images/golden_bloom.jpg' },
    { id: 'incense-mystique', title: 'Incense Mystique', size_ml: 50, price: 135, image: '/images/golden_bloom.jpg' },
    { id: 'musk-royal', title: 'Musk Royal', size_ml: 75, price: 150, image: '/images/golden_bloom.jpg' },
  ],
  fresh: [
    { id: 'ocean-breeze', title: 'Ocean Breeze', size_ml: 50, price: 95, image: '/images/golden_bloom.jpg' },
    { id: 'marine-mist', title: 'Marine Mist', size_ml: 75, price: 105, image: '/images/golden_bloom.jpg' },
    { id: 'mint-fresh', title: 'Mint Fresh', size_ml: 100, price: 115, image: '/images/golden_bloom.jpg' },
    { id: 'green-garden', title: 'Green Garden', size_ml: 50, price: 100, image: '/images/golden_bloom.jpg' },
    { id: 'aqua-blue', title: 'Aqua Blue', size_ml: 75, price: 110, image: '/images/golden_bloom.jpg' },
  ],
  citrus: [
    { id: 'citrus-sunrise', title: 'Citrus Sunrise', size_ml: 75, price: 110, image: '/images/golden_bloom.jpg' },
    { id: 'lemon-zest', title: 'Lemon Zest', size_ml: 50, price: 95, image: '/images/golden_bloom.jpg' },
    { id: 'orange-burst', title: 'Orange Burst', size_ml: 100, price: 120, image: '/images/golden_bloom.jpg' },
    { id: 'grapefruit-spark', title: 'Grapefruit Spark', size_ml: 75, price: 105, image: '/images/golden_bloom.jpg' },
    { id: 'bergamot-bliss', title: 'Bergamot Bliss', size_ml: 50, price: 100, image: '/images/golden_bloom.jpg' },
  ],
};

//!! New arrivals products (NewArrivals component)
export const newArrivalsProducts: SimpleProduct[] = [
  {
    title: 'Golden Bloom',
    size_ml: 75,
    price: 120,
    image: '/images/golden_bloom.jpg',
  },
  {
    title: 'Golden Bloom',
    size_ml: 75,
    price: 120,
    image: '/images/golden_bloom.jpg',
  },
  {
    title: 'Golden Bloom',
    size_ml: 75,
    price: 120,
    image: '/images/golden_bloom.jpg',
  },
  {
    title: 'Golden Bloom',
    size_ml: 75,
    price: 120,
    image: '/images/golden_bloom.jpg',
  },
  {
    title: 'Golden Bloom',
    size_ml: 75,
    price: 120,
    image: '/images/golden_bloom.jpg',
  },
];

//!! Browse page products (with family field)
export const browseProducts: SimpleProduct[] = [
  {
    title: 'Midnight Elegance',
    size_ml: 50,
    price: 145,
    image: '/images/golden_bloom.jpg',
    family: 'oriental',
  },
  {
    title: 'Golden Bloom',
    size_ml: 75,
    price: 120,
    image: '/images/golden_bloom.jpg',
    family: 'floral',
  },
  {
    title: 'Noir Mystique',
    size_ml: 100,
    price: 165,
    image: '/images/golden_bloom.jpg',
    family: 'woody',
  },
  {
    title: 'Ocean Breeze',
    size_ml: 50,
    price: 95,
    image: '/images/golden_bloom.jpg',
    family: 'fresh',
  },
  {
    title: 'Citrus Sunrise',
    size_ml: 75,
    price: 110,
    image: '/images/golden_bloom.jpg',
    family: 'citrus',
  },
  {
    title: 'Velvet Rose',
    size_ml: 100,
    price: 150,
    image: '/images/golden_bloom.jpg',
    family: 'floral',
  },
  {
    title: 'Sandalwood Dreams',
    size_ml: 50,
    price: 130,
    image: '/images/golden_bloom.jpg',
    family: 'woody',
  },
  {
    title: 'Amber Nights',
    size_ml: 75,
    price: 140,
    image: '/images/golden_bloom.jpg',
    family: 'oriental',
  },
  {
    title: 'Sandalwood Dreams',
    size_ml: 50,
    price: 130,
    image: '/images/golden_bloom.jpg',
    family: 'woody',
  },
  {
    title: 'Amber Nights',
    size_ml: 75,
    price: 140,
    image: '/images/golden_bloom.jpg',
    family: 'oriental',
  },
];

//!! Detailed product data (Product detail page)
export const detailedProducts: Record<string, DetailedProduct> = {
  'golden-bloom': {
    id: 'golden-bloom',
    title: 'Golden Bloom',
    size_ml: 75,
    price: 120,
    image: '/images/golden_bloom.jpg',
    description: 'A romantic and feminine fragrance that captures the essence of a blooming garden. Golden Bloom is a delicate floral composition that opens with fresh rose petals and jasmine, creating an enchanting first impression. The heart reveals the softness of peony and magnolia, while the base notes of white musk and vanilla add warmth and longevity.',
    family: 'Floral',
    notes: {
      top: ['Rose', 'Jasmine', 'Bergamot'],
      middle: ['Peony', 'Magnolia', 'Lily'],
      base: ['White Musk', 'Vanilla', 'Amberwood'],
    },
    sizes: [
      { ml: 50, price: 95 },
      { ml: 75, price: 120 },
      { ml: 100, price: 145 },
    ],
  },
  'noir-mystique': {
    id: 'noir-mystique',
    title: 'Noir Mystique',
    size_ml: 100,
    price: 165,
    image: '/images/golden_bloom.jpg',
    description: 'A sophisticated and mysterious woody fragrance that evokes the depth of a midnight forest. Noir Mystique combines rich sandalwood and cedar with earthy vetiver, creating a warm and sensual experience. The oriental base notes of patchouli and oud add complexity and intrigue.',
    family: 'Woody',
    notes: {
      top: ['Black Pepper', 'Bergamot', 'Lavender'],
      middle: ['Sandalwood', 'Cedar', 'Vetiver'],
      base: ['Patchouli', 'Oud', 'Amber'],
    },
    sizes: [
      { ml: 50, price: 130 },
      { ml: 75, price: 145 },
      { ml: 100, price: 165 },
    ],
  },
  'midnight-elegance': {
    id: 'midnight-elegance',
    title: 'Midnight Elegance',
    size_ml: 50,
    price: 145,
    image: '/images/golden_bloom.jpg',
    description: 'An exotic and sensual oriental fragrance that captures the essence of a starry night. Midnight Elegance opens with spicy notes of cardamom and saffron, leading to a rich heart of amber and vanilla. The base reveals the warmth of musk and incense, creating a luxurious and memorable scent.',
    family: 'Oriental',
    notes: {
      top: ['Cardamom', 'Saffron', 'Bergamot'],
      middle: ['Amber', 'Vanilla', 'Orchid'],
      base: ['Musk', 'Incense', 'Benzoin'],
    },
    sizes: [
      { ml: 50, price: 145 },
      { ml: 75, price: 160 },
      { ml: 100, price: 180 },
    ],
  },
};

//!! Related products (Product detail page)
export const relatedProducts: SimpleProduct[] = [
  { title: 'Velvet Rose', size_ml: 50, price: 135, image: '/images/golden_bloom.jpg' },
  { title: 'Jasmine Dreams', size_ml: 100, price: 150, image: '/images/golden_bloom.jpg' },
  { title: 'Peony Petals', size_ml: 75, price: 125, image: '/images/golden_bloom.jpg' },
];

export const sampleCartItems: SampleCartItem[] = [
  {
    product: {
      id: 'golden-bloom',
      title: 'Golden Bloom',
      size_ml: 75,
      price: 120,
      image: '/images/golden_bloom.jpg',
    },
    quantity: 1,
    size_ml: 75,
  },
  {
    product: {
      id: 'noir-mystique',
      title: 'Noir Mystique',
      size_ml: 100,
      price: 165,
      image: '/images/golden_bloom.jpg',
    },
    quantity: 2,
    size_ml: 100,
  },
];

//!! Sample orders data (My Orders page)
export const sampleOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    items: [
      {
        product: { title: 'Golden Bloom', size_ml: 75, price: 120, image: '/images/golden_bloom.jpg' },
        quantity: 2,
        size_ml: 75,
      },
      {
        product: { title: 'Velvet Rose', size_ml: 50, price: 135, image: '/images/golden_bloom.jpg' },
        quantity: 1,
        size_ml: 50,
      },
    ],
    subtotal: 375,
    shipping: 15,
    total: 390,
    shippingAddress: '123 Main Street, Accra, Ghana',
    trackingNumber: 'TRK-123456789',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-01-20',
    status: 'shipped',
    items: [
      {
        product: { title: 'Noir Mystique', size_ml: 100, price: 165, image: '/images/golden_bloom.jpg' },
        quantity: 1,
        size_ml: 100,
      },
    ],
    subtotal: 165,
    shipping: 15,
    total: 180,
    shippingAddress: '123 Main Street, Accra, Ghana',
    trackingNumber: 'TRK-987654321',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-01-25',
    status: 'processing',
    items: [
      {
        product: { title: 'Midnight Elegance', size_ml: 50, price: 145, image: '/images/golden_bloom.jpg' },
        quantity: 1,
        size_ml: 50,
      },
      {
        product: { title: 'Amber Nights', size_ml: 75, price: 140, image: '/images/golden_bloom.jpg' },
        quantity: 1,
        size_ml: 75,
      },
    ],
    subtotal: 285,
    shipping: 15,
    total: 300,
    shippingAddress: '123 Main Street, Accra, Ghana',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    date: '2024-01-28',
    status: 'pending',
    items: [
      {
        product: { title: 'Ocean Breeze', size_ml: 50, price: 95, image: '/images/golden_bloom.jpg' },
        quantity: 1,
        size_ml: 50,
      },
    ],
    subtotal: 95,
    shipping: 15,
    total: 110,
    shippingAddress: '123 Main Street, Accra, Ghana',
  },
];

