import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-minimal">
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <span>S</span>
              </div>
              <span className="footer-brand-name">ShaggsStore</span>
            </div>
            <p className="footer-description">
              Your destination for timeless fashion. Discover curated collections that define contemporary style with quality, comfort, and elegance.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="footer-section">
            <h3 className="footer-title">Shop</h3>
            <ul className="footer-links">
              <li>
                <Link to="/products" className="footer-link">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=Shirts" className="footer-link">
                  Shirts
                </Link>
              </li>
              <li>
                <Link to="/products?category=Jeans" className="footer-link">
                  Jeans
                </Link>
              </li>
              <li>
                <Link to="/products?featured=true" className="footer-link">
                  Must Have Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="footer-section">
            <h3 className="footer-title">Customer Care</h3>
            <ul className="footer-links">
              <li>
                <Link to="/contact" className="footer-link">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="footer-link">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="footer-link">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/faq" className="footer-link">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li>
                <Link to="/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="footer-link">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="footer-link">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link to="/press" className="footer-link">
                  Press
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; 2024 ShaggsStore. All rights reserved.
          </div>
          <div className="footer-legal">
            <Link to="/privacy" className="footer-legal-link">
              Privacy Policy
            </Link>
            <Link to="/terms" className="footer-legal-link">
              Terms of Service
            </Link>
            <Link to="/cookies" className="footer-legal-link">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
