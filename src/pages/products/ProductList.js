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
    <div style={{ minHeight: '100vh', backgroundColor: '#f7f7f7' }}>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            {filters.category ? `${filters.category} Products` : 'All Products'}
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', maxWidth: '300px' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                style={{ width: '100%', padding: '1rem', paddingLeft: '2.5rem', border: '1px solid #ccc', borderRadius: '0.5rem', fontSize: '1rem' }}
              />
              <FaSearch style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#ccc' }} />
            </div>
          </form>

          {/* Filter and Sort Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '0.5rem', fontSize: '1rem', cursor: 'pointer' }}
              >
                <FaFilter style={{ fontSize: '1.5rem' }} />
                Filters
              </button>
              
              {(filters.category || filters.minPrice || filters.maxPrice || filters.featured) && (
                <button
                  onClick={clearFilters}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '0.5rem', fontSize: '1rem', cursor: 'pointer', color: '#ff0000' }}
                >
                  <FaTimes style={{ fontSize: '1.5rem' }} />
                  Clear Filters
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1rem', color: '#666' }}>
                {totalProducts} products found
              </span>
              
              <select
                value={`${filters.sortBy}:${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split(':');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
                style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '0.5rem', fontSize: '1rem' }}
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

        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Filters Sidebar */}
          <div className={`filters-sidebar ${showFilters ? '' : 'hidden'}`} style={{ display: showFilters ? 'block' : 'none', width: '300px' }}>
            <div style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Filters</h3>
              
              {/* Category Filter */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Category</h4>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '0.5rem', fontSize: '1rem' }}
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
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Price Range</h4>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '0.5rem', fontSize: '1rem' }}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '0.5rem', fontSize: '1rem' }}
                  />
                </div>
              </div>

              {/* Featured Filter */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={filters.featured === 'true'}
                    onChange={(e) => handleFilterChange('featured', e.target.checked ? 'true' : '')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span style={{ fontSize: '1rem' }}>Featured Products Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div style={{ flex: 1 }}>
            {loading ? (
              <LoadingSpinner style={{ height: '20rem' }} />
            ) : displayProducts.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '20rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>No products found</h3>
                <p style={{ fontSize: '1rem', color: '#666' }}>Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                  {displayProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <nav style={{ display: 'flex', gap: '1rem' }}>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '0.5rem', fontSize: '1rem', cursor: 'pointer' }}
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '0.5rem', fontSize: '1rem', cursor: 'pointer', backgroundColor: currentPage === page ? '#007bff' : '#fff', color: currentPage === page ? '#fff' : '#333' }}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '0.5rem', fontSize: '1rem', cursor: 'pointer' }}
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
