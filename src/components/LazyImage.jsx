import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/LazyImage.css';

/**
 * LazyImage component for optimized image loading
 * Only loads images when they are about to enter the viewport
 */
const LazyImage = ({ src, alt, className, placeholderColor = '#f0f0f0' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Set up intersection observer to detect when image enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Stop observing once in view
        }
      },
      {
        root: null, // viewport
        rootMargin: '100px', // start loading when within 100px of viewport
        threshold: 0.1, // 10% of image visible
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  // Handle image load
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={imgRef}
      className={`lazy-image-container ${className || ''}`}
      style={{
        backgroundColor: placeholderColor,
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
          onLoad={handleImageLoad}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
      {!isLoaded && (
        <div
          className="placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: placeholderColor,
          }}
        >
          <div className="loading-spinner" />
        </div>
      )}
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholderColor: PropTypes.string
};

export default LazyImage; 