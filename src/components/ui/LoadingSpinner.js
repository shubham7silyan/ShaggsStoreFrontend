import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ className = '', size = 'md' }) => {
  const getSizeStyles = (size) => {
    const sizes = {
      sm: { width: '32px', height: '32px' },
      md: { width: '64px', height: '64px' },
      lg: { width: '96px', height: '96px' },
      xl: { width: '128px', height: '128px' }
    };
    return sizes[size] || sizes.md;
  };

  const sizeStyles = getSizeStyles(size);

  return (
    <div className={`loading-spinner-container ${className}`}>
      <div className="loading-spinner-wrapper">
        {/* Main Liquid Loader */}
        <div className="liquid-loader" style={sizeStyles} />
        
        {/* Orbiting Particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="loading-particle"
            animate={{
              rotate: 360,
              scale: [1, 1.5, 1],
            }}
            transition={{
              rotate: {
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 1 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            style={{
              transformOrigin: `${20 + i * 10}px 0px`
            }}
          />
        ))}
        
        {/* Pulsing Ring */}
        <motion.div
          className="loading-ring"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
