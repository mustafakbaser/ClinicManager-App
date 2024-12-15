import React from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function PageContainer({ 
  children, 
  isLoading, 
  error,
  className = '' 
}) {
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bir Hata Oluştu</h3>
          <p className="text-sm text-gray-600">{error.message || 'Lütfen daha sonra tekrar deneyin.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}