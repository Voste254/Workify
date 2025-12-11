import React from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
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
  filters: {
    jobType: string;
    category: string;
    salary: string;
    posted: string;
    seniority: string;
  };
  onFilterApply: (filters: any) => void;
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
  onFilterApply
}) => {
  const locations = [
    'All Location',
    'New York, USA',
    'Los Angeles, USA',
    'Las Vegas, USA',
    'Chicago, USA',
    'San Francisco, USA'
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Job title, key words or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Location Dropdown */}
          <div className="relative lg:w-64">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white cursor-pointer"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Filter More Button */}
          <button
            onClick={onFilterClick}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            <Filter className="w-5 h-5" />
            Filter More
          </button>

          {/* Find Jobs Button */}
          <button
            onClick={onSearch}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-sm hover:shadow-md"
          >
            Find Jobs
          </button>
        </div>
      </div>

      {/* Filter Modal */}
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