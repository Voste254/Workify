import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 backdrop-blur-xl rounded-2xl p-6 border-2 border-slate-200">
      {/* Page Info */}
      <div className="text-sm text-slate-600 font-medium">
        Page <span className="text-slate-900 font-bold">{currentPage}</span> of{' '}
        <span className="text-slate-900 font-bold">{totalPages}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-xl transition-all ${
            currentPage === 1
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
          title="First page"
        >
          <ChevronsLeft className="w-5 h-5" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-xl transition-all ${
            currentPage === 1
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
          title="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-slate-400 font-medium">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`min-w-[40px] px-3 py-2 rounded-xl font-semibold transition-all ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-110'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-600'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-xl transition-all ${
            currentPage === totalPages
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
          title="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-xl transition-all ${
            currentPage === totalPages
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
          title="Last page"
        >
          <ChevronsRight className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Jump (Optional) */}
      <div className="flex items-center gap-2">
        <label htmlFor="page-jump" className="text-sm text-slate-600 font-medium whitespace-nowrap">
          Go to:
        </label>
        <input
          id="page-jump"
          type="number"
          min={1}
          max={totalPages}
          placeholder={currentPage.toString()}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const value = parseInt((e.target as HTMLInputElement).value);
              if (value >= 1 && value <= totalPages) {
                onPageChange(value);
                (e.target as HTMLInputElement).value = '';
              }
            }
          }}
          className="w-16 px-3 py-2 border-2 border-slate-200 rounded-xl text-center text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
        />
      </div>
    </div>
  );
};

export default Pagination;