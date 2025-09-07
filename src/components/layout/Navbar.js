import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiLogOut,
  FiSettings,
  FiHeart,
  FiHome,
  FiBox
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items: cartItems = [] } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const cartItemsCount = Array.isArray(cartItems) ? cartItems.reduce((total, item) => total + (item.quantity || 0), 0) : 0;

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/products', label: 'Products', icon: FiBox },
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav 
      className={`navbar-fixed ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
    >
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="navbar-logo">
              <div className="logo-icon">
                <span className="logo-text">S</span>
              </div>
              <span className="brand-name">ShaggsStore</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="nav-desktop">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`nav-link ${isActivePath(item.path) ? 'nav-link-active' : ''}`}
                >
                  <item.icon className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Search Bar */}
          <motion.form 
            onSubmit={handleSearch}
            className="search-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="search-container">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <FiSearch className="search-icon" />
            </div>
          </motion.form>

          {/* Right Side Actions */}
          <div className="navbar-actions">
            {/* Cart */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/cart"
                className="action-button"
              >
                <FiShoppingCart className="action-icon" />
                {cartItemsCount > 0 && (
                  <motion.span
                    className="cart-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            {/* User Menu */}
            <div className="user-menu-container">
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="action-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiUser className="action-icon" />
              </motion.button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    className="user-dropdown"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {user ? (
                      <div className="dropdown-content">
                        <div className="user-info">
                          <div className="user-avatar">
                            <span className="avatar-text">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="user-name">{user.name}</p>
                            <p className="user-email">{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="dropdown-menu">
                          <Link
                            to="/profile"
                            className="dropdown-item"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FiSettings className="dropdown-icon" />
                            <span>Profile Settings</span>
                          </Link>
                          
                          <button
                            onClick={handleLogout}
                            className="dropdown-item logout-item"
                          >
                            <FiLogOut className="dropdown-icon" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="dropdown-content">
                        <Link
                          to="/login"
                          className="dropdown-item"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiLogOut className="dropdown-icon" />
                          <span>Login</span>
                        </Link>
                        
                        <Link
                          to="/register"
                          className="dropdown-item"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiUser className="dropdown-icon" />
                          <span>Register</span>
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <FiX className="action-icon" /> : <FiMenu className="action-icon" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mobile-menu-content">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mobile-search">
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                    />
                    <FiSearch className="search-icon" />
                  </div>
                </form>

                {/* Mobile Navigation Links */}
                <div className="mobile-nav-links">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`mobile-nav-link ${isActivePath(item.path) ? 'mobile-nav-link-active' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="nav-icon" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  
                  <Link
                    to="/cart"
                    className="mobile-nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiShoppingCart className="nav-icon" />
                    <span>Cart ({cartItemsCount})</span>
                  </Link>

                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="mobile-nav-link"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiUser className="nav-icon" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="mobile-nav-link logout-item"
                      >
                        <FiLogOut className="nav-icon" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="mobile-nav-link"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiLogOut className="nav-icon" />
                        <span>Login</span>
                      </Link>
                      <Link
                        to="/register"
                        className="mobile-nav-link"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiUser className="nav-icon" />
                        <span>Register</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
