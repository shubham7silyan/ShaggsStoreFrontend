import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FaArrowLeft, FaHeart, FaShoppingCart, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import { getProductById, getAllProducts } from '../../utils/productData';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [wishlistItems, setWishlistItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Mock wishlist data - in real app, this would come from API/localStorage
  const mockWishlistIds = ['s1', 's3', 'j2', 's7', 'j5'];

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view your wishlist');
      navigate('/login');
      return;
    }

    // Simulate loading wishlist
    setTimeout(() => {
      const allProducts = getAllProducts();
      const wishlistProducts = mockWishlistIds.map(id => 
        allProducts.find(product => product.id === id)
      ).filter(Boolean);
      
      setWishlistItems(wishlistProducts);
      setFilteredItems(wishlistProducts);
      setLoading(false);
    }, 1000);
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    let filtered = wishlistItems;

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category.toLowerCase() === categoryFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [wishlistItems, categoryFilter, searchTerm]);

  const handleRemoveFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
    toast.success('Item removed from wishlist');
    // In real app, this would call an API
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product.id, 1);
    if (result.success) {
      // Optionally remove from wishlist after adding to cart
      // handleRemoveFromWishlist(product.id);
    }
  };

  const handleMoveAllToCart = async () => {
    let successCount = 0;
    for (const item of filteredItems) {
      const result = await addToCart(item.id, 1);
      if (result.success) {
        successCount++;
      }
    }
    
    if (successCount > 0) {
      toast.success(`${successCount} items added to cart`);
      // Optionally clear wishlist
      // setWishlistItems([]);
    }
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      setWishlistItems([]);
      toast.success('Wishlist cleared');
    }
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        {/* Header */}
        <div className="wishlist-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <FaArrowLeft />
            Back
          </button>
          <h1 className="wishlist-title">Your Wishlist</h1>
          <span className="wishlist-count">{filteredItems.length} items</span>
        </div>

        {/* Filters */}
        {wishlistItems.length > 0 && (
          <div className="wishlist-filters">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search wishlist items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-dropdown">
              <FaFilter className="filter-icon" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                <option value="shirts">Shirts</option>
                <option value="jeans">Jeans</option>
              </select>
            </div>

            <div className="wishlist-actions">
              {filteredItems.length > 0 && (
                <button 
                  onClick={handleMoveAllToCart}
                  className="btn btn-primary"
                >
                  <FaShoppingCart />
                  Add All to Cart
                </button>
              )}
              
              {wishlistItems.length > 0 && (
                <button 
                  onClick={handleClearWishlist}
                  className="btn btn-outline clear-btn"
                >
                  Clear Wishlist
                </button>
              )}
            </div>
          </div>
        )}

        {/* Wishlist Items */}
        {filteredItems.length === 0 ? (
          <div className="empty-wishlist">
            <FaHeart className="empty-wishlist-icon" />
            <h2>
              {wishlistItems.length === 0 
                ? "Your Wishlist is Empty" 
                : "No Items Match Your Filters"
              }
            </h2>
            <p>
              {wishlistItems.length === 0 
                ? "Save items you love to your wishlist and shop them later." 
                : "Try adjusting your search or filter criteria."
              }
            </p>
            <Link to="/products" className="btn btn-primary">
              {wishlistItems.length === 0 ? "Start Shopping" : "Browse Products"}
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="wishlist-item">
                <div className="item-image">
                  <Link to={`/products/${item.id}`}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </Link>
                  <button 
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="remove-wishlist-btn"
                    title="Remove from wishlist"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="item-content">
                  <div className="item-brand">
                    {item.brand?.replace('LuxeOne', 'ShaggsStore') || 'ShaggsStore'}
                  </div>
                  
                  <Link to={`/products/${item.id}`} className="item-name">
                    {item.name}
                  </Link>
                  
                  <div className="item-category">
                    {item.category}
                  </div>

                  <div className="item-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`star ${i < Math.floor(item.rating) ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="rating-text">({item.rating})</span>
                  </div>

                  <div className="item-price">
                    <span className="current-price">₹{item.price}</span>
                    {item.originalPrice && (
                      <>
                        <span className="original-price">₹{item.originalPrice}</span>
                        <span className="discount">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                        </span>
                      </>
                    )}
                  </div>

                  <div className="item-actions">
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="btn btn-primary add-to-cart-btn"
                    >
                      <FaShoppingCart />
                      Add to Cart
                    </button>
                    
                    <Link 
                      to={`/products/${item.id}`}
                      className="btn btn-outline view-btn"
                    >
                      View Details
                    </Link>
                  </div>

                  {item.inStock === false && (
                    <div className="out-of-stock-badge">
                      Out of Stock
                    </div>
                  )}

                  {item.featured && (
                    <div className="featured-badge">
                      Featured
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {wishlistItems.length === 0 && (
          <div className="recommendations">
            <h3>You Might Like</h3>
            <p>Discover trending items from ShaggsStore</p>
            <Link to="/products?featured=true" className="btn btn-outline">
              View Featured Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
