import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiStar, 
  FiShoppingCart, 
  FiHeart, 
  FiShare2,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiArrowLeft,
  FiPlus,
  FiMinus,
  FiCheck
} from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getProductById, products } from '../../utils/productData';
import ProductCard from '../../components/products/ProductCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const loadProduct = () => {
      try {
        const foundProduct = getProductById(id);
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedSize(foundProduct.sizes?.[0] || '');
          setSelectedColor(foundProduct.colors || foundProduct.color || '');
          
          // Get related products from same category
          const related = products
            .filter(p => p.category === foundProduct.category && p._id !== foundProduct._id)
            .slice(0, 4);
          setRelatedProducts(related);
        } else {
          toast.error('Product not found');
          navigate('/products');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    try {
      await addToCart(product._id, quantity, { size: selectedSize, color: selectedColor });
      toast.success(`Added ${quantity} item(s) to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <h2>Product not found</h2>
          <Link to="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/products" className="breadcrumb-link">Products</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to={`/products?category=${product.category}`} className="breadcrumb-link">
            {product.category}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="back-button"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>

        {/* Product Details */}
        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img 
                src={product.image || product.images?.[activeImageIndex] || '/api/placeholder/600/600'} 
                alt={product.name}
                className="product-main-image"
              />
              {discountPercentage > 0 && (
                <div className="discount-badge-detail">
                  -{discountPercentage}% OFF
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="thumbnail-images">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <div className="product-brand-detail">
                {product.brand?.replace('LuxeOne', 'ShaggsStore') || 'ShaggsStore'}
              </div>
              <div className="product-actions-header">
                <button 
                  onClick={handleWishlist}
                  className={`action-btn-header ${isWishlisted ? 'active' : ''}`}
                >
                  <FiHeart />
                </button>
                <button className="action-btn-header">
                  <FiShare2 />
                </button>
              </div>
            </div>

            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating-detail">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    className={`star ${i < Math.floor(product.rating || 4.5) ? 'filled' : ''}`} 
                  />
                ))}
              </div>
              <span className="rating-text">
                {product.rating || '4.5'} ({product.reviewCount || '127'} reviews)
              </span>
            </div>

            <div className="product-price-detail">
              <span className="current-price">₹{product.price}</span>
              {product.originalPrice && (
                <span className="original-price">₹{product.originalPrice}</span>
              )}
              {discountPercentage > 0 && (
                <span className="savings">You save ₹{product.originalPrice - product.price}</span>
              )}
            </div>

            <p className="product-description-detail">
              {product.description}
            </p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="size-selection">
                <h4 className="selection-title">Size</h4>
                <div className="size-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && (
              <div className="color-selection">
                <h4 className="selection-title">Color: {selectedColor}</h4>
                <div className="color-options">
                  <div className="color-option selected">
                    {selectedColor}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="quantity-selection">
              <h4 className="selection-title">Quantity</h4>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="quantity-btn"
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="quantity-btn"
                  disabled={quantity >= (product.stock || 10)}
                >
                  <FiPlus />
                </button>
              </div>
              <span className="stock-info">
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
              </span>
            </div>

            {/* Add to Cart */}
            <div className="cart-actions">
              <button 
                onClick={handleAddToCart}
                className="btn btn-primary add-to-cart-btn"
                disabled={!product.inStock}
              >
                <FiShoppingCart />
                Add to Cart - ₹{(product.price * quantity).toLocaleString()}
              </button>
            </div>

            {/* Product Features */}
            <div className="product-features">
              <div className="feature">
                <FiTruck className="feature-icon" />
                <div>
                  <h5>Free Shipping</h5>
                  <p>On orders above ₹999</p>
                </div>
              </div>
              <div className="feature">
                <FiRefreshCw className="feature-icon" />
                <div>
                  <h5>Easy Returns</h5>
                  <p>30-day return policy</p>
                </div>
              </div>
              <div className="feature">
                <FiShield className="feature-icon" />
                <div>
                  <h5>Secure Payment</h5>
                  <p>100% secure transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2 className="section-title">You May Also Like</h2>
            <div className="products-grid">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
