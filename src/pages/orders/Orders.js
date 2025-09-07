import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaArrowLeft, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaEye, FaUndo, FaSearch, FaFilter, FaShoppingBag, FaClock } from 'react-icons/fa';
import { getAllProducts } from '../../utils/productData';
import toast from 'react-hot-toast';

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Get actual products for realistic order data
  const allProducts = getAllProducts();

  // Enhanced mock order data with actual products
  const mockOrders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 2399,
      items: [
        { 
          id: allProducts[0]?._id, 
          name: allProducts[0]?.name || 'Classic Cotton Shirt', 
          quantity: 2, 
          price: allProducts[0]?.price || 799, 
          image: allProducts[0]?.image 
        },
        { 
          id: allProducts[19]?._id, 
          name: allProducts[19]?.name || 'Slim Fit Jeans', 
          quantity: 1, 
          price: allProducts[19]?.price || 1599, 
          image: allProducts[19]?.image 
        }
      ],
      shippingAddress: '123 Main St, Mumbai, Maharashtra 400001',
      trackingNumber: 'TRK123456789',
      deliveredDate: '2024-01-20',
      canReturn: true,
      returnDeadline: '2024-02-20',
      progress: {
        ordered: { completed: true, date: '2024-01-15' },
        confirmed: { completed: true, date: '2024-01-15' },
        shipped: { completed: true, date: '2024-01-17' },
        delivered: { completed: true, date: '2024-01-20' }
      }
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-20',
      status: 'shipped',
      total: 1599,
      items: [
        { 
          id: allProducts[2]?._id, 
          name: allProducts[2]?.name || 'Casual T-Shirt', 
          quantity: 2, 
          price: allProducts[2]?.price || 599, 
          image: allProducts[2]?.image 
        },
        { 
          id: allProducts[21]?._id, 
          name: allProducts[21]?.name || 'Denim Jacket', 
          quantity: 1, 
          price: allProducts[21]?.price || 999, 
          image: allProducts[21]?.image 
        }
      ],
      shippingAddress: '456 Park Ave, Delhi, Delhi 110001',
      trackingNumber: 'TRK987654321',
      estimatedDelivery: '2024-01-25',
      progress: {
        ordered: { completed: true, date: '2024-01-20' },
        confirmed: { completed: true, date: '2024-01-20' },
        shipped: { completed: true, date: '2024-01-22' },
        delivered: { completed: false }
      }
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-22',
      status: 'processing',
      total: 1199,
      items: [
        { 
          id: allProducts[4]?._id, 
          name: allProducts[4]?.name || 'Formal Shirt', 
          quantity: 1, 
          price: allProducts[4]?.price || 1199, 
          image: allProducts[4]?.image 
        }
      ],
      shippingAddress: '789 Oak St, Bangalore, Karnataka 560001',
      progress: {
        ordered: { completed: true, date: '2024-01-22' },
        confirmed: { completed: true, date: '2024-01-22' },
        shipped: { completed: false },
        delivered: { completed: false }
      }
    },
    {
      id: 'ORD-2024-004',
      date: '2024-01-10',
      status: 'returned',
      total: 899,
      items: [
        { 
          id: allProducts[5]?._id, 
          name: allProducts[5]?.name || 'Polo Shirt', 
          quantity: 1, 
          price: allProducts[5]?.price || 899, 
          image: allProducts[5]?.image 
        }
      ],
      shippingAddress: '321 Pine St, Chennai, Tamil Nadu 600001',
      returnDate: '2024-01-18',
      returnReason: 'Size too small',
      progress: {
        ordered: { completed: true, date: '2024-01-10' },
        confirmed: { completed: true, date: '2024-01-10' },
        shipped: { completed: true, date: '2024-01-12' },
        delivered: { completed: true, date: '2024-01-15' },
        returned: { completed: true, date: '2024-01-18' }
      }
    },
    {
      id: 'ORD-2024-005',
      date: '2024-01-25',
      status: 'cancelled',
      total: 1499,
      items: [
        { 
          id: allProducts[22]?._id, 
          name: allProducts[22]?.name || 'Premium Jeans', 
          quantity: 1, 
          price: allProducts[22]?.price || 1499, 
          image: allProducts[22]?.image 
        }
      ],
      shippingAddress: '654 Elm St, Pune, Maharashtra 411001',
      cancelledDate: '2024-01-25',
      cancelReason: 'Customer request',
      progress: {
        ordered: { completed: true, date: '2024-01-25' },
        confirmed: { completed: false },
        shipped: { completed: false },
        delivered: { completed: false }
      }
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view your orders');
      navigate('/login');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return <FaClock className="status-icon processing" />;
      case 'shipped': return <FaTruck className="status-icon shipped" />;
      case 'delivered': return <FaCheckCircle className="status-icon delivered" />;
      case 'returned': return <FaUndo className="status-icon returned" />;
      case 'cancelled': return <FaTimesCircle className="status-icon cancelled" />;
      default: return <FaBox className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'returned': return 'Returned';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getProgressSteps = (status, progress) => {
    const steps = [
      { key: 'ordered', label: 'Ordered', icon: <FaShoppingBag /> },
      { key: 'confirmed', label: 'Confirmed', icon: <FaCheckCircle /> },
      { key: 'shipped', label: 'Shipped', icon: <FaTruck /> },
      { key: 'delivered', label: 'Delivered', icon: <FaBox /> }
    ];

    if (status === 'returned') {
      steps.push({ key: 'returned', label: 'Returned', icon: <FaUndo /> });
    }

    return steps.map(step => ({
      ...step,
      completed: progress[step.key]?.completed || false,
      active: !progress[step.key]?.completed && 
              steps.findIndex(s => !progress[s.key]?.completed) === steps.indexOf(step),
      date: progress[step.key]?.date
    }));
  };

  const handleReturnOrder = (orderId) => {
    if (window.confirm('Are you sure you want to return this order?')) {
      toast.success('Return request submitted successfully');
      // In real app, this would call an API
    }
  };

  const handleTrackOrder = (trackingNumber) => {
    toast.info(`Opening tracking for: ${trackingNumber}`);
    // In real app, this would open tracking page or modal
  };

  const handleBuyAgain = (order) => {
    toast.success(`${order.items.length} item(s) added to cart`);
    // In real app, this would add items to cart
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      toast.success('Order cancelled successfully');
      // In real app, this would call an API
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        {/* Header */}
        <div className="orders-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <FaArrowLeft />
            Back
          </button>
          <h1 className="orders-title">Your Orders</h1>
          <span className="orders-count">{filteredOrders.length} orders</span>
        </div>

        {/* Filters */}
        <div className="orders-filters">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search orders by ID or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-dropdown">
            <FaFilter className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="returned">Returned</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <FaBox className="no-orders-icon" />
            <h2>No Orders Found</h2>
            <p>
              {orders.length === 0 
                ? "You haven't placed any orders yet." 
                : "No orders match your current filters."
              }
            </p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-id">{order.id}</h3>
                    <p className="order-date">Placed on {new Date(order.date).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="order-status">
                    {getStatusIcon(order.status)}
                    <span className={`status-text ${order.status}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="order-total">
                    <span className="total-label">Total</span>
                    <span className="total-amount">₹{order.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Order Progress */}
                {order.progress && (
                  <div className="order-progress">
                    {getProgressSteps(order.status, order.progress).map((step, index) => (
                      <div 
                        key={step.key} 
                        className={`progress-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}
                      >
                        <div className="progress-icon">
                          {step.icon}
                        </div>
                        <div className="progress-label">
                          {step.label}
                          {step.date && (
                            <div style={{ fontSize: '10px', marginTop: '2px' }}>
                              {new Date(step.date).toLocaleDateString('en-IN')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p className="item-price">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-details">
                  <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                  {order.trackingNumber && (
                    <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
                  )}
                  {order.estimatedDelivery && (
                    <p><strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}</p>
                  )}
                  {order.deliveredDate && (
                    <p><strong>Delivered On:</strong> {new Date(order.deliveredDate).toLocaleDateString('en-IN')}</p>
                  )}
                  {order.returnDate && (
                    <p><strong>Returned On:</strong> {new Date(order.returnDate).toLocaleDateString('en-IN')}</p>
                  )}
                  {order.returnReason && (
                    <p><strong>Return Reason:</strong> {order.returnReason}</p>
                  )}
                  {order.cancelledDate && (
                    <p><strong>Cancelled On:</strong> {new Date(order.cancelledDate).toLocaleDateString('en-IN')}</p>
                  )}
                  {order.cancelReason && (
                    <p><strong>Cancel Reason:</strong> {order.cancelReason}</p>
                  )}
                </div>

                <div className="order-actions">
                  <Link to={`/orders/${order.id}`} className="btn btn-outline">
                    <FaEye />
                    View Details
                  </Link>
                  
                  {order.trackingNumber && order.status === 'shipped' && (
                    <button 
                      onClick={() => handleTrackOrder(order.trackingNumber)}
                      className="btn btn-outline"
                    >
                      <FaTruck />
                      Track Order
                    </button>
                  )}
                  
                  {order.canReturn && order.status === 'delivered' && (
                    <button 
                      onClick={() => handleReturnOrder(order.id)}
                      className="btn btn-outline return-btn"
                    >
                      <FaUndo />
                      Return Items
                    </button>
                  )}
                  
                  {order.status === 'processing' && (
                    <button 
                      onClick={() => handleCancelOrder(order.id)}
                      className="btn btn-outline return-btn"
                    >
                      <FaTimesCircle />
                      Cancel Order
                    </button>
                  )}
                  
                  {(order.status === 'delivered' || order.status === 'returned') && (
                    <button 
                      onClick={() => handleBuyAgain(order)}
                      className="btn btn-primary"
                    >
                      <FaShoppingBag />
                      Buy Again
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
