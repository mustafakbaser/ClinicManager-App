import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  className = '' 
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm";
  const variants = {
    primary: "border border-transparent bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    danger: "border border-transparent bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}