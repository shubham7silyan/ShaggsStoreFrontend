import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiStar, 
  FiShoppingCart, 
  FiHeart, 
  FiEye
} from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  // Calculate discount percentage
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className="product-card-minimal"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link to={`/products/${product._id}`} className="product-card-link">
        {/* Image Container */}
        <div className="product-image-wrapper">
          <img
            src={product.image || product.images?.[0] || '/api/placeholder/300/300'}
            alt={product.name}
            className="product-card-image"
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="discount-badge-minimal">
              -{discountPercentage}%
            </div>
          )}

          {/* Action Buttons - Show on Hover */}
          <div className="product-actions">
            <button
              onClick={handleWishlist}
              className={`action-btn-minimal ${isWishlisted ? 'active' : ''}`}
              title="Add to Wishlist"
            >
              <FiHeart />
            </button>
            <button
              onClick={handleAddToCart}
              className="action-btn-minimal"
              title="Add to Cart"
            >
              <FiShoppingCart />
            </button>
            <Link
              to={`/products/${product._id}`}
              className="action-btn-minimal"
              title="Quick View"
            >
              <FiEye />
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="product-card-content">
          {/* Brand & Rating */}
          <div className="product-card-header">
            <span className="product-brand-minimal">
              {product.brand?.replace('LuxeOne', 'ShaggsStore') || 'ShaggsStore'}
            </span>
            <div className="product-rating-minimal">
              <FiStar className="rating-star" />
              <span>{product.rating || product.averageRating || '4.5'}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="product-name-minimal">
            {product.name}
          </h3>

          {/* Price */}
          <div className="product-price-minimal">
            <span className="current-price-minimal">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="original-price-minimal">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Category */}
          <div className="product-category-minimal">
            {product.category}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
