import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login coming soon!`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7f7', padding: '2rem' }}>
      <div style={{ maxWidth: '30rem', width: '100%', padding: '2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
            Welcome Back
          </h2>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Login Form */}
        <form style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#333', marginBottom: '0.25rem' }}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '1rem',
                  border: errors.email ? '1px solid #ff0000' : '1px solid #ddd',
                  borderRadius: '0.25rem'
                }}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ff0000' }}>{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#333', marginBottom: '0.25rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    fontSize: '1rem',
                    border: errors.password ? '1px solid #ff0000' : '1px solid #ddd',
                    borderRadius: '0.25rem',
                    paddingRight: '2.5rem'
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '0.5rem',
                    transform: 'translateY(-50%)',
                    fontSize: '1rem',
                    color: '#666',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ff0000' }}>{errors.password}</p>
              )}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                style={{
                  height: '1rem',
                  width: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '0.25rem'
                }}
              />
              <label htmlFor="remember-me" style={{ fontSize: '0.875rem', color: '#333', marginLeft: '0.5rem' }}>
                Remember me
              </label>
            </div>

            <div style={{ fontSize: '0.875rem' }}>
              <button
                type="button"
                onClick={() => toast.info('Password reset coming soon!')}
                style={{
                  fontSize: '0.875rem',
                  color: '#337ab7',
                  cursor: 'pointer'
                }}
              >
                Forgot your password?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '1rem',
                backgroundColor: isLoading ? '#ddd' : '#337ab7',
                color: '#fff',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {/* Divider */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)', width: '100%', height: '1px', backgroundColor: '#ddd' }} />
            <div style={{ position: 'relative', fontSize: '0.875rem', color: '#666', backgroundColor: '#f7f7f7', padding: '0 0.5rem' }}>
              Or continue with
            </div>
          </div>

          {/* Social Login Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              style={{
                padding: '0.5rem',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '0.25rem',
                backgroundColor: '#fff',
                cursor: 'pointer'
              }}
            >
              <FaGoogle style={{ color: '#ff0000' }} />
              Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              style={{
                padding: '0.5rem',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '0.25rem',
                backgroundColor: '#fff',
                cursor: 'pointer'
              }}
            >
              <FaFacebook style={{ color: '#337ab7' }} />
              Facebook
            </button>
          </div>

          {/* Sign Up Link */}
          <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>
            <p>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  fontSize: '0.875rem',
                  color: '#337ab7',
                  cursor: 'pointer'
                }}
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
