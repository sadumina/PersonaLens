/**
 * Card Component
 * Reusable card container
 */
import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
  const hoverStyles = hover
    ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer'
    : '';
  
  return (
    <div
      className={`bg-white rounded-2xl border-2 border-gray-200 shadow-xl transition-all duration-300 ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
