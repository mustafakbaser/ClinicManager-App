import React from 'react';

export default function Input({
  label,
  type = 'text',
  required = false,
  className = '',
  ...props
}) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        required={required}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
        {...props}
      />
    </div>
  );
}