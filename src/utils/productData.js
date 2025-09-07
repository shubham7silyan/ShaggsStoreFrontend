// Product data based on images in components/images folder
// Shirts start with 's' and jeans start with 'j'

// Import images
import sImg from '../components/images/s.jpg';
import s2Img from '../components/images/s (2).jpg';
import s3Img from '../components/images/s (3).jpg';
import s4Img from '../components/images/s (4).jpg';
import s5Img from '../components/images/s (5).jpg';
import s6Img from '../components/images/s (6).jpg';
import s7Img from '../components/images/s (7).jpg';
import s8Img from '../components/images/s (8).jpg';
import s9Img from '../components/images/s (9).jpg';
import s10Img from '../components/images/s (10).jpg';
import s11Img from '../components/images/s (11).jpg';
import s12Img from '../components/images/s (12).jpg';
import s13Img from '../components/images/s (13).jpg';
import s14Img from '../components/images/s (14).jpg';
import s15Img from '../components/images/s (15).jpg';
import s16Img from '../components/images/s (16).jpg';
import s17Img from '../components/images/s (17).jpg';
import s18Img from '../components/images/s (18).jpg';
import s19Img from '../components/images/s (19).jpg';

import jImg from '../components/images/j.jpg';
import j2Img from '../components/images/j (2).jpg';
import j3Img from '../components/images/j (3).jpg';
import j4Img from '../components/images/j (4).jpg';
import j5Img from '../components/images/j (5).jpg';
import j6Img from '../components/images/j (6).jpg';
import j7Img from '../components/images/j (7).jpg';
import j8Img from '../components/images/j (8).jpg';
import j9Img from '../components/images/j (9).jpg';
import j10Img from '../components/images/j (10).jpg';
import j11Img from '../components/images/j (11).jpg';
import j12Img from '../components/images/j (12).jpg';
import j13Img from '../components/images/j (13).jpg';
import j14Img from '../components/images/j (14).jpg';
import j15Img from '../components/images/j (15).jpg';

// Shirt names and descriptions
const shirtNames = [
  'Classic Cotton T-Shirt', 'Premium Polo Shirt', 'Casual Button-Down', 'Vintage Graphic Tee',
  'Slim Fit Dress Shirt', 'Henley Long Sleeve', 'Striped Crew Neck', 'Oxford Shirt',
  'V-Neck Cotton Tee', 'Flannel Shirt', 'Linen Casual Shirt', 'Printed T-Shirt',
  'Muscle Fit Tank', 'Hoodie Sweatshirt', 'Baseball Tee', 'Pocket T-Shirt',
  'Thermal Long Sleeve', 'Denim Shirt', 'Performance Athletic Shirt'
];

const shirtDescriptions = [
  'Comfortable everyday cotton t-shirt with perfect fit',
  'Premium quality polo shirt for casual and semi-formal occasions',
  'Versatile button-down shirt perfect for any occasion',
  'Retro-inspired graphic tee with vintage appeal',
  'Professional slim-fit dress shirt for business wear',
  'Comfortable henley with long sleeves for layering',
  'Classic striped crew neck for timeless style',
  'Traditional oxford shirt with button-down collar',
  'Soft v-neck cotton tee for relaxed comfort',
  'Cozy flannel shirt perfect for cooler weather',
  'Breathable linen shirt for summer comfort',
  'Eye-catching printed t-shirt with unique design',
  'Athletic muscle fit tank for active lifestyle',
  'Warm and comfortable hoodie sweatshirt',
  'Classic baseball tee with contrasting sleeves',
  'Simple pocket t-shirt for everyday wear',
  'Thermal long sleeve for cold weather comfort',
  'Stylish denim shirt for casual sophistication',
  'High-performance athletic shirt with moisture-wicking'
];

// Jean names and descriptions
const jeanNames = [
  'Classic Straight Jeans', 'Slim Fit Denim', 'Relaxed Fit Jeans', 'Skinny Jeans',
  'Bootcut Jeans', 'High-Waisted Jeans', 'Distressed Denim', 'Dark Wash Jeans',
  'Light Blue Jeans', 'Black Jeans', 'Ripped Jeans', 'Vintage Denim',
  'Stretch Comfort Jeans', 'Wide Leg Jeans', 'Cropped Jeans'
];

const jeanDescriptions = [
  'Timeless straight-leg jeans with classic fit',
  'Modern slim-fit denim for contemporary style',
  'Comfortable relaxed-fit jeans for all-day wear',
  'Trendy skinny jeans with stretch comfort',
  'Classic bootcut jeans with slight flare',
  'Flattering high-waisted jeans for vintage appeal',
  'Edgy distressed denim with authentic wear',
  'Sophisticated dark wash jeans for versatile styling',
  'Classic light blue denim with faded finish',
  'Sleek black jeans for modern elegance',
  'Stylish ripped jeans with designer tears',
  'Authentic vintage denim with retro character',
  'Comfortable stretch jeans for active lifestyle',
  'Fashion-forward wide leg jeans for statement style',
  'Trendy cropped jeans perfect for summer'
];

// Generate shirt products
const shirts = [
  { img: sImg, name: shirtNames[0], desc: shirtDescriptions[0] },
  { img: s2Img, name: shirtNames[1], desc: shirtDescriptions[1] },
  { img: s3Img, name: shirtNames[2], desc: shirtDescriptions[2] },
  { img: s4Img, name: shirtNames[3], desc: shirtDescriptions[3] },
  { img: s5Img, name: shirtNames[4], desc: shirtDescriptions[4] },
  { img: s6Img, name: shirtNames[5], desc: shirtDescriptions[5] },
  { img: s7Img, name: shirtNames[6], desc: shirtDescriptions[6] },
  { img: s8Img, name: shirtNames[7], desc: shirtDescriptions[7] },
  { img: s9Img, name: shirtNames[8], desc: shirtDescriptions[8] },
  { img: s10Img, name: shirtNames[9], desc: shirtDescriptions[9] },
  { img: s11Img, name: shirtNames[10], desc: shirtDescriptions[10] },
  { img: s12Img, name: shirtNames[11], desc: shirtDescriptions[11] },
  { img: s13Img, name: shirtNames[12], desc: shirtDescriptions[12] },
  { img: s14Img, name: shirtNames[13], desc: shirtDescriptions[13] },
  { img: s15Img, name: shirtNames[14], desc: shirtDescriptions[14] },
  { img: s16Img, name: shirtNames[15], desc: shirtDescriptions[15] },
  { img: s17Img, name: shirtNames[16], desc: shirtDescriptions[16] },
  { img: s18Img, name: shirtNames[17], desc: shirtDescriptions[17] },
  { img: s19Img, name: shirtNames[18], desc: shirtDescriptions[18] }
].map((shirt, index) => ({
  _id: `shirt_${index + 1}`,
  name: shirt.name,
  description: shirt.desc,
  price: Math.floor(Math.random() * 800) + 399, // Random price between ₹399-₹1199
  originalPrice: Math.floor(Math.random() * 600) + 1200, // Original price ₹1200-₹1800
  image: shirt.img,
  images: [shirt.img],
  category: 'Shirts',
  subcategory: index < 10 ? 'Casual Shirts' : 'Formal Shirts',
  brand: ['ShaggsStore', 'Premium', 'Classic', 'Modern'][index % 4],
  rating: (Math.random() * 2 + 3).toFixed(1), // Rating between 3.0-5.0
  reviewCount: Math.floor(Math.random() * 200) + 50,
  inStock: true,
  stock: Math.floor(Math.random() * 50) + 10,
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  colors: ['White', 'Black', 'Navy', 'Gray', 'Blue'][index % 5],
  featured: index < 4,
  tags: ['comfortable', 'cotton', 'casual', 'premium'],
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
}));

// Generate jean products
const jeans = [
  { img: jImg, name: jeanNames[0], desc: jeanDescriptions[0] },
  { img: j2Img, name: jeanNames[1], desc: jeanDescriptions[1] },
  { img: j3Img, name: jeanNames[2], desc: jeanDescriptions[2] },
  { img: j4Img, name: jeanNames[3], desc: jeanDescriptions[3] },
  { img: j5Img, name: jeanNames[4], desc: jeanDescriptions[4] },
  { img: j6Img, name: jeanNames[5], desc: jeanDescriptions[5] },
  { img: j7Img, name: jeanNames[6], desc: jeanDescriptions[6] },
  { img: j8Img, name: jeanNames[7], desc: jeanDescriptions[7] },
  { img: j9Img, name: jeanNames[8], desc: jeanDescriptions[8] },
  { img: j10Img, name: jeanNames[9], desc: jeanDescriptions[9] },
  { img: j11Img, name: jeanNames[10], desc: jeanDescriptions[10] },
  { img: j12Img, name: jeanNames[11], desc: jeanDescriptions[11] },
  { img: j13Img, name: jeanNames[12], desc: jeanDescriptions[12] },
  { img: j14Img, name: jeanNames[13], desc: jeanDescriptions[13] },
  { img: j15Img, name: jeanNames[14], desc: jeanDescriptions[14] }
].map((jean, index) => ({
  _id: `jean_${index + 1}`,
  name: jean.name,
  description: jean.desc,
  price: Math.floor(Math.random() * 1200) + 799, // Random price between ₹799-₹1999
  originalPrice: Math.floor(Math.random() * 1000) + 2000, // Original price ₹2000-₹3000
  image: jean.img,
  images: [jean.img],
  category: 'Jeans',
  subcategory: index < 8 ? 'Men\'s Jeans' : 'Women\'s Jeans',
  brand: ['ShaggsStore', 'Denim Co', 'Classic', 'Premium'][index % 4],
  rating: (Math.random() * 2 + 3).toFixed(1), // Rating between 3.0-5.0
  reviewCount: Math.floor(Math.random() * 150) + 30,
  inStock: true,
  stock: Math.floor(Math.random() * 40) + 5,
  sizes: ['28', '30', '32', '34', '36', '38', '40'],
  colors: ['Blue', 'Black', 'Gray', 'Light Blue', 'Dark Blue'][index % 5],
  featured: index < 3,
  tags: ['denim', 'comfortable', 'stylish', 'premium'],
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
}));

// Combine all products
export const products = [...shirts, ...jeans];

// Export categories
export const categories = ['Shirts', 'Jeans'];

// Export by category
export const productsByCategory = {
  'Shirts': shirts,
  'Jeans': jeans
};

// Export featured products
export const featuredProducts = products.filter(product => product.featured);

// Helper functions
export const getProductById = (id) => {
  return products.find(product => product._id === id);
};

export const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category);
};

export const searchProducts = (query) => {
  const searchTerm = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

// Get all products function
export const getAllProducts = () => {
  return products;
};

export default products;
