import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { getProductById } from '../utils/productData';

const CartContext = createContext();

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload.items || [],
        totalItems: action.payload.totalItems || 0,
        totalAmount: action.payload.totalAmount || 0,
        loading: false
      };
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(item => item.productId === action.payload.productId);
      let newItems;
      
      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
      } else {
        const product = getProductById(action.payload.productId);
        newItems = [...state.items, {
          productId: action.payload.productId,
          quantity: action.payload.quantity,
          product: product
        }];
      }
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
      
      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
        loading: false
      };
    }
    case 'UPDATE_CART': {
      const newItems = state.items.map(item => 
        item.productId === action.payload.productId 
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
      
      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
        loading: false
      };
    }
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.productId !== action.payload.productId);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
      
      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
        loading: false
      };
    }
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalAmount: 0,
        loading: false
      };
    case 'CART_ERROR':
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Load cart from localStorage for now (since we're using local data)
  const loadCart = useCallback(() => {
    if (!isAuthenticated) {
      dispatch({ type: 'CLEAR_CART' });
      return;
    }

    try {
      const savedCart = localStorage.getItem('shaggsstore_cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        dispatch({
          type: 'LOAD_CART',
          payload: cartData
        });
      }
    } catch (error) {
      console.error('Load cart error:', error);
      dispatch({ type: 'CART_ERROR' });
    }
  }, [isAuthenticated]);

  // Save cart to localStorage
  const saveCart = useCallback(() => {
    if (isAuthenticated) {
      localStorage.setItem('shaggsstore_cart', JSON.stringify({
        items: state.items,
        totalItems: state.totalItems,
        totalAmount: state.totalAmount
      }));
    }
  }, [state.items, state.totalItems, state.totalAmount, isAuthenticated]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return { success: false };
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      dispatch({
        type: 'ADD_TO_CART',
        payload: { productId, quantity }
      });
      
      toast.success('Item added to cart');
      return { success: true };
    } catch (error) {
      toast.error('Failed to add item to cart');
      dispatch({ type: 'CART_ERROR' });
      return { success: false };
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) {
      toast.error('Please login to update cart');
      return { success: false };
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      dispatch({
        type: 'UPDATE_CART',
        payload: { productId, quantity }
      });
      
      return { success: true };
    } catch (error) {
      toast.error('Failed to update cart');
      dispatch({ type: 'CART_ERROR' });
      return { success: false };
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to remove items from cart');
      return { success: false };
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: { productId }
      });
      
      toast.success('Item removed from cart');
      return { success: true };
    } catch (error) {
      toast.error('Failed to remove item from cart');
      dispatch({ type: 'CART_ERROR' });
      return { success: false };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!isAuthenticated) {
      return { success: false };
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      dispatch({ type: 'CLEAR_CART' });
      toast.success('Cart cleared');
      return { success: true };
    } catch (error) {
      toast.error('Failed to clear cart');
      dispatch({ type: 'CART_ERROR' });
      return { success: false };
    }
  };

  // Get cart summary
  const getCartSummary = () => {
    return {
      totalItems: state.totalItems,
      totalAmount: state.totalAmount,
      itemCount: state.items.length
    };
  };

  // Load cart when authentication status changes
  useEffect(() => {
    loadCart();
  }, [isAuthenticated, loadCart]);

  // Save cart when items change
  useEffect(() => {
    if (isAuthenticated && state.items.length >= 0) {
      saveCart();
    }
  }, [state.items, state.totalItems, state.totalAmount, saveCart, isAuthenticated]);

  const value = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadCart,
    getCartSummary
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
