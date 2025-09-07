import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    // Animation variants for floating elements
    const floatingVariants = {
        animate: {
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [-5, 5, -5],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const floatingVariants2 = {
        animate: {
            y: [20, -20, 20],
            x: [10, -10, 10],
            rotate: [5, -5, 5],
            transition: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const floatingVariants3 = {
        animate: {
            y: [-15, 15, -15],
            x: [-15, 15, -15],
            rotate: [-3, 3, -3],
            transition: {
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="hero-section">
            {/* Animated Background */}
            <div className="animated-background">
                {/* Gradient Waves */}
                <div className="gradient-wave wave1"></div>
                <div className="gradient-wave wave2"></div>
                <div className="gradient-wave wave3"></div>
                
                {/* Floating Clothing Elements */}
                <motion.div 
                    className="floating-element shirt-1"
                    variants={floatingVariants}
                    animate="animate"
                >
                    👔
                </motion.div>
                
                <motion.div 
                    className="floating-element pants-1"
                    variants={floatingVariants2}
                    animate="animate"
                >
                    👖
                </motion.div>
                
                <motion.div 
                    className="floating-element dress-1"
                    variants={floatingVariants3}
                    animate="animate"
                >
                    👗
                </motion.div>
                
                <motion.div 
                    className="floating-element shoe-1"
                    variants={floatingVariants}
                    animate="animate"
                    style={{ animationDelay: '2s' }}
                >
                    👠
                </motion.div>
                
                <motion.div 
                    className="floating-element bag-1"
                    variants={floatingVariants2}
                    animate="animate"
                    style={{ animationDelay: '1s' }}
                >
                    👜
                </motion.div>
                
                <motion.div 
                    className="floating-element hat-1"
                    variants={floatingVariants3}
                    animate="animate"
                    style={{ animationDelay: '3s' }}
                >
                    👒
                </motion.div>
                
                <motion.div 
                    className="floating-element jacket-1"
                    variants={floatingVariants}
                    animate="animate"
                    style={{ animationDelay: '1.5s' }}
                >
                    🧥
                </motion.div>
                
                <motion.div 
                    className="floating-element sneaker-1"
                    variants={floatingVariants2}
                    animate="animate"
                    style={{ animationDelay: '2.5s' }}
                >
                    👟
                </motion.div>

                {/* Floating Particles */}
                <div className="particles">
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className={`particle particle-${i + 1}`}></div>
                    ))}
                </div>
            </div>

            {/* Hero Content */}
            <motion.div
                className="hero-content"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
            >
                <h1>Welcome to ShaggsStore</h1>
                <p>Top Fashion Brands. Huge Discounts. Exclusive Styles.</p>
                <Link to="/products">
                    <button className="cta-btn">Shop Now</button>
                </Link>
            </motion.div>
        </div>
    );
};

export default Home;
