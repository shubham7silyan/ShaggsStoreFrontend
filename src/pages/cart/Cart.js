import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, totalAmount, totalItems, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <FaShoppingBag className="cart-empty-icon" />
            <h2>Please Login to View Cart</h2>
            <p>You need to be logged in to access your shopping cart.</p>
            <Link to="/login" className="btn btn-primary">
              Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <FaShoppingBag className="cart-empty-icon" />
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        {/* Header */}
        <div className="cart-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <FaArrowLeft />
            Back
          </button>
          <h1 className="cart-title">Shopping Cart</h1>
          <span className="cart-count">{totalItems} items</span>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-items-header">
              <h2>Your Items</h2>
              <button onClick={handleClearCart} className="clear-cart-btn">
                Clear Cart
              </button>
            </div>

            {items.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="cart-item-image">
                  <img 
                    src={item.product?.image} 
                    alt={item.product?.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>

                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.product?.name}</h3>
                  <p className="cart-item-brand">
                    {item.product?.brand?.replace('LuxeOne', 'ShaggsStore') || 'ShaggsStore'}
                  </p>
                  <p className="cart-item-category">{item.product?.category}</p>
                  
                  <div className="cart-item-price">
                    <span className="current-price">₹{item.product?.price}</span>
                    {item.product?.originalPrice && (
                      <span className="original-price">₹{item.product?.originalPrice}</span>
                    )}
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      className="quantity-btn"
                      disabled={loading}
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      className="quantity-btn"
                      disabled={loading}
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <div className="item-total">
                    ₹{(item.product?.price * item.quantity).toLocaleString()}
                  </div>

                  <button 
                    onClick={() => handleRemoveItem(item.productId)}
                    className="remove-btn"
                    disabled={loading}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">Free</span>
              </div>
              
              <div className="summary-row">
                <span>Tax</span>
                <span>₹{Math.round(totalAmount * 0.18).toLocaleString()}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{Math.round(totalAmount * 1.18).toLocaleString()}</span>
              </div>

              <button 
                onClick={handleCheckout}
                className="checkout-btn"
                disabled={loading}
              >
                Proceed to Checkout
              </button>

              <div className="shipping-info">
                <p>✓ Free shipping on all orders</p>
                <p>✓ Easy returns within 30 days</p>
                <p>✓ Secure payment processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
