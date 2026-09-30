import React from 'react';

const LoadingSpinner = ({ label = 'Loading AgriLink content...' }) => {
  return (
    <div className="agri-loading-state flex flex-col items-center justify-center p-12">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
      <p className="mt-3 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
