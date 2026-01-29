import React from 'react';
import { Search, MapPin, SlidersHorizontal, Grid3x3, List } from 'lucide-react';
import FilterModal from './FilterModal';

interface FilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  onSearch: () => void;
  onFilterClick: () => void;
  showFilterModal: boolean;
  onCloseModal: () => void;
  filters: any;
  onFilterApply: (filters: any) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  onSearch,
  onFilterClick,
  showFilterModal,
  onCloseModal,
  filters,
  onFilterApply,
  viewMode,
  setViewMode
}) => {
  const locations = [
    'All Location',
    'San Francisco, CA',
    'New York, NY',
    'Austin, TX',
    'Los Angeles, CA',
    'Seattle, WA',
    'Boston, MA'
  ];

  const activeFiltersCount = Object.values(filters).filter(
    (value, index) => {
      const keys = Object.keys(filters);
      const defaultValues = ['All Job Types', 'All Job Categories', 'All Salaries', 'Posted Anytime', 'Seniority Levels'];
      return value !== defaultValues[index];
    }
  ).length;

  return (
    <>
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 p-4 sm:p-6 lg:p-8">
        {/* Main Search Row */}
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mb-4">
          {/* Search Input */}
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search job title, keywords, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Location Select */}
          <div className="relative group lg:w-72">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none z-10">
              <MapPin className="w-5 h-5" />
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl appearance-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all cursor-pointer text-slate-900"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Search Button - Desktop */}
          <button
            onClick={onSearch}
            className="hidden lg:flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Advanced Filters Button */}
            <button
              onClick={onFilterClick}
              className="relative flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all font-medium border-2 border-slate-200 hover:border-slate-300"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Active Filter Tags */}
            {activeFiltersCount > 0 && (
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-sm text-slate-600 font-medium">Active:</span>
                <div className="flex gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    const defaultValues: Record<string, string> = {
                      jobType: 'All Job Types',
                      category: 'All Job Categories',
                      salary: 'All Salaries',
                      posted: 'Posted Anytime',
                      seniority: 'Seniority Levels'
                    };
                    if (value !== defaultValues[key]) {
                      return (
                        <span
                          key={key}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full"
                        >
                          {value as string}
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 font-medium hidden sm:block">View:</span>
            <div className="flex bg-slate-100 rounded-xl p-1 border-2 border-slate-200">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Button - Mobile */}
          <button
            onClick={onSearch}
            className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
          >
            <Search className="w-5 h-5" />
            Search Jobs
          </button>
        </div>
      </div>

      {showFilterModal && (
        <FilterModal
          onClose={onCloseModal}
          filters={filters}
          onApply={onFilterApply}
        />
      )}
    </>
  );
};

export default FilterControls;