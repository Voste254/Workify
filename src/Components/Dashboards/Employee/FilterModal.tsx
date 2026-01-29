import React, { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';

interface FilterModalProps {
  onClose: () => void;
  filters: {
    jobType: string;
    category: string;
    salary: string;
    posted: string;
    seniority: string;
  };
  onApply: (filters: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ onClose, filters: initialFilters, onApply }) => {
  const [filters, setFilters] = useState(initialFilters);

  const defaultFilters = {
    jobType: 'All Job Types',
    category: 'All Job Categories',
    salary: 'All Salaries',
    posted: 'Posted Anytime',
    seniority: 'Seniority Levels'
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const handleApply = () => {
    onApply(filters);
  };

  const FilterOption: React.FC<{
    name: keyof typeof filters;
    value: string;
    label: string;
    icon?: string;
  }> = ({ name, value, label, icon }) => {
    const isSelected = filters[name] === value;
    
    return (
      <button
        onClick={() => setFilters({ ...filters, [name]: value })}
        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
          isSelected
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md transform scale-[1.02]'
            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-2 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {icon && <span>{icon}</span>}
          <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-900'}`}>
            {label}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl my-8 overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="relative px-6 sm:px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Advanced Filters</h2>
              <p className="text-indigo-100 text-sm">Refine your job search</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 py-8 max-h-[calc(100vh-280px)] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Job Type */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                Work Type
              </h3>
              <FilterOption name="jobType" value="All Job Types" label="All Types" icon="🌐" />
              <FilterOption name="jobType" value="On-site" label="On-site" icon="🏢" />
              <FilterOption name="jobType" value="Remote" label="Remote" icon="🏠" />
              <FilterOption name="jobType" value="Hybrid" label="Hybrid" icon="🔄" />
            </div>

            {/* Category */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                Job Type
              </h3>
              <FilterOption name="category" value="All Job Categories" label="All Categories" icon="📋" />
              <FilterOption name="category" value="Full-time" label="Full-time" icon="⏰" />
              <FilterOption name="category" value="Part-time" label="Part-time" icon="🕐" />
              <FilterOption name="category" value="Contract" label="Contract" icon="📄" />
              <FilterOption name="category" value="Internship" label="Internship" icon="🎓" />
              <FilterOption name="category" value="Temporary" label="Temporary" icon="⚡" />
            </div>

            {/* Salary */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                Salary Range
              </h3>
              <FilterOption name="salary" value="All Salaries" label="Any Salary" icon="💰" />
              <FilterOption name="salary" value="$1000 - $1500" label="$1k - $1.5k" icon="💵" />
              <FilterOption name="salary" value="$1500 - $2000" label="$1.5k - $2k" icon="💵" />
              <FilterOption name="salary" value="$2000 - $5000" label="$2k - $5k" icon="💴" />
              <FilterOption name="salary" value="$5000+" label="$5k+" icon="💸" />
            </div>

            {/* Posted Date */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Date Posted
              </h3>
              <FilterOption name="posted" value="Posted Anytime" label="Anytime" icon="📅" />
              <FilterOption name="posted" value="Last 24 hours" label="Last 24 hours" icon="🕐" />
              <FilterOption name="posted" value="Last 3 days" label="Last 3 days" icon="📆" />
              <FilterOption name="posted" value="Last 7 days" label="Last week" icon="📊" />
              <FilterOption name="posted" value="Last 30 days" label="Last month" icon="📈" />
            </div>

            {/* Seniority */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-600 rounded-full"></span>
                Experience
              </h3>
              <FilterOption name="seniority" value="Seniority Levels" label="All Levels" icon="🎯" />
              <FilterOption name="seniority" value="Entry Level" label="Entry Level" icon="🌱" />
              <FilterOption name="seniority" value="Mid Level" label="Mid Level" icon="🚀" />
              <FilterOption name="seniority" value="Senior" label="Senior" icon="⭐" />
              <FilterOption name="seniority" value="Executive" label="Executive" icon="👔" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-6 bg-slate-50 border-t-2 border-slate-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Filters
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-bold shadow-lg hover:shadow-xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;