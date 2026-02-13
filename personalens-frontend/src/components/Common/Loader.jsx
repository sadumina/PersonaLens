/**
 * Loader Component
 * Loading spinner with optional text
 */
import React from 'react';

const Loader = ({ text = 'Loading...', size = 'md' }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizes[size]}`}></div>
      {text && <p className="text-gray-600 font-medium">{text}</p>}
    </div>
  );
};

export default Loader;
