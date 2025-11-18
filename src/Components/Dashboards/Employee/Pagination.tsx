import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  setPage: (n: number) => void;
  totalPages: number;
}

export const Pagination: React.FC<Props> = ({ page, setPage, totalPages }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-8 flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Showing {(page - 1) * 4 + 1} - {Math.min(page * 4, totalPages * 4)} of {totalPages * 4}
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setPage(Math.max(1, page - 1))} className="p-2 rounded border hover:bg-gray-50">
          <ChevronLeft size={18} />
        </button>

        {pages.map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className={`px-3 py-1 rounded border ${n === page ? "bg-green-600 text-white" : "hover:bg-gray-50"}`}
          >
            {n}
          </button>
        ))}

        <button onClick={() => setPage(Math.min(totalPages, page + 1))} className="p-2 rounded border hover:bg-gray-50">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
