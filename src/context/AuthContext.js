import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'USER_LOADED':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token in localStorage
  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };

  // Load user from token (mock implementation for development)
  const loadUser = useCallback(async () => {
    if (state.token) {
      try {
        // Mock user data for development
        const savedUser = localStorage.getItem('shaggsstore_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          dispatch({
            type: 'USER_LOADED',
            payload: user
          });
        } else {
          // Create a default user for development
          const defaultUser = {
            id: '1',
            name: 'Demo User',
            email: 'demo@shaggsstore.com',
            role: 'user'
          };
          localStorage.setItem('shaggsstore_user', JSON.stringify(defaultUser));
          dispatch({
            type: 'USER_LOADED',
            payload: defaultUser
          });
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('shaggsstore_user');
        setAuthToken(null);
        dispatch({ type: 'AUTH_ERROR' });
      }
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  }, [state.token]);

  // Login user (mock implementation for development)
  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock login - accept any email/password for development
      const mockUser = {
        id: '1',
        name: credentials.email.split('@')[0] || 'User',
        email: credentials.email,
        role: credentials.email.includes('admin') ? 'admin' : 'user'
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      setAuthToken(mockToken);
      localStorage.setItem('shaggsstore_user', JSON.stringify(mockUser));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: mockUser, token: mockToken }
      });
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      toast.error('Login failed');
      dispatch({ type: 'AUTH_ERROR' });
      return { success: false, message: 'Login failed' };
    }
  };

  // Register user (mock implementation for development)
  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock registration - accept any data for development
      const mockUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: 'user'
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      setAuthToken(mockToken);
      localStorage.setItem('shaggsstore_user', JSON.stringify(mockUser));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: mockUser, token: mockToken }
      });
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      toast.error('Registration failed');
      dispatch({ type: 'AUTH_ERROR' });
      return { success: false, message: 'Registration failed' };
    }
  };

  // Logout user
  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('shaggsstore_user');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  // Update user profile (mock implementation)
  const updateProfile = async (profileData) => {
    try {
      const updatedUser = { ...state.user, ...profileData };
      localStorage.setItem('shaggsstore_user', JSON.stringify(updatedUser));
      dispatch({
        type: 'USER_LOADED',
        payload: updatedUser
      });
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      toast.error('Update failed');
      return { success: false, message: 'Update failed' };
    }
  };

  // Change password (mock implementation)
  const changePassword = async (passwordData) => {
    try {
      // Mock password change - just show success for development
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      toast.error('Password change failed');
      return { success: false, message: 'Password change failed' };
    }
  };

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
