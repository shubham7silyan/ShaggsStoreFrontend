import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products, categories, searchProducts, getProductsByCategory } from '../../utils/productData';
import ProductCard from '../../components/products/ProductCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProductList = () => {
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    featured: searchParams.get('featured') || ''
  });

  const productsPerPage = 12;

  const applyFilters = useCallback(() => {
    let filteredProducts = [...products];

    // Apply search filter
    if (filters.search) {
      filteredProducts = searchProducts(filters.search);
    }

    // Apply category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category === filters.category
      );
    }

    // Apply price range filter
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price <= parseFloat(filters.maxPrice)
      );
    }

    // Apply featured filter
    if (filters.featured === 'true') {
      filteredProducts = filteredProducts.filter(product => product.featured);
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aValue = a[filters.sortBy];
      let bValue = b[filters.sortBy];

      if (filters.sortBy === 'price') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (filters.sortBy === 'rating') {
        aValue = parseFloat(a.rating);
        bValue = parseFloat(b.rating);
      } else if (filters.sortBy === 'name') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      } else if (filters.sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setTotalProducts(filteredProducts.length);

    // Apply pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    setDisplayProducts(paginatedProducts);
  }, [filters, currentPage, productsPerPage]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      applyFilters();
    } catch (error) {
      console.error('Error filtering products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [applyFilters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (currentPage > 1) params.set('page', currentPage.toString());
    setSearchParams(params);
  }, [filters, currentPage, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      featured: ''
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const sortOptions = [
    { value: 'createdAt:desc', label: 'Newest First' },
    { value: 'createdAt:asc', label: 'Oldest First' },
    { value: 'price:asc', label: 'Price: Low to High' },
    { value: 'price:desc', label: 'Price: High to Low' },
    { value: 'name:asc', label: 'Name: A to Z' },
    { value: 'name:desc', label: 'Name: Z to A' },
    { value: 'rating:desc', label: 'Highest Rated' }
  ];

  return (
    <div className="product-list-container">
      <div className="product-list-wrapper">
        {/* Header */}
        <div className="product-list-header">
          <h1 className="product-list-title">
            {filters.category ? `${filters.category} Products` : 'All Products'}
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
              <FaSearch className="search-icon" />
            </div>
          </form>

          {/* Filter and Sort Controls */}
          <div className="controls-wrapper">
            <div className="filter-controls">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="filter-btn"
              >
                <FaFilter />
                <span className="filter-btn-text">Filters</span>
              </button>
              
              {(filters.category || filters.minPrice || filters.maxPrice || filters.featured) && (
                <button
                  onClick={clearFilters}
                  className="clear-filters-btn"
                >
                  <FaTimes />
                  <span className="clear-btn-text">Clear</span>
                </button>
              )}
            </div>

            <div className="sort-controls">
              <span className="products-count">
                {totalProducts} products
              </span>
              
              <select
                value={`${filters.sortBy}:${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split(':');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
                className="sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="content-wrapper">
          {/* Filters Sidebar */}
          <div className={`filters-sidebar ${showFilters ? 'show' : 'hide'}`}>
            <div className="filters-content">
              <h3 className="filters-title">Filters</h3>
              
              {/* Category Filter */}
              <div className="filter-group">
                <h4 className="filter-label">Category</h4>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="filter-group">
                <h4 className="filter-label">Price Range</h4>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="price-input"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="price-input"
                  />
                </div>
              </div>

              {/* Featured Filter */}
              <div className="filter-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.featured === 'true'}
                    onChange={(e) => handleFilterChange('featured', e.target.checked ? 'true' : '')}
                    className="checkbox-input"
                  />
                  <span>Featured Products Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-section">
            {loading ? (
              <LoadingSpinner />
            ) : displayProducts.length === 0 ? (
              <div className="no-products">
                <div className="no-products-icon">📦</div>
                <h3 className="no-products-title">No products found</h3>
                <p className="no-products-text">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {displayProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="product-item"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-wrapper">
                    <nav className="pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
