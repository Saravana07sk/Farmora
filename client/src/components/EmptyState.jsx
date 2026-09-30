import React from 'react';
import { PackageX } from 'lucide-react';

const EmptyState = ({ title = 'No produce found', message = 'Try adjusting your search query or filters.', actionLabel, onAction }) => {
  return (
    <div className="agri-empty-state flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
      <div className="rounded-full bg-emerald-50 p-4 text-emerald-600">
        <PackageX className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
