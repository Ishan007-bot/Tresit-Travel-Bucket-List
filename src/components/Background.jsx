import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/Background.css';

/**
 * Background component that provides a Thailand-inspired decorative background
 * with responsive elements like palm trees, floating lanterns, and temple silhouette.
 * The component adapts to the current theme (light/dark).
 */
const Background = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="app-background" data-theme={theme}>
      {/* Decorative Elements */}
      <div className="decorative-elements">
        {/* Palm tree silhouettes */}
        <div className="palm-tree palm-tree-1"></div>
        <div className="palm-tree palm-tree-2"></div>
        
        {/* Floating lanterns */}
        <div className="floating-lantern lantern-1"></div>
        <div className="floating-lantern lantern-2"></div>
        <div className="floating-lantern lantern-3"></div>
        
        {/* Temple silhouette */}
        <div className="temple-silhouette"></div>
      </div>
    </div>
  );
};

export default Background; 