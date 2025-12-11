import React, { useState } from 'react';
import { X } from 'lucide-react';

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

  const handleApply = () => {
    onApply(filters);
  };

  const handleCancel = () => {
    setFilters(initialFilters);
    onClose();
  };

  const RadioOption: React.FC<{ name: string; value: string; label: string; checked: boolean; onChange: () => void }> = 
    ({ name, value, label, checked, onChange }) => (
    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-green-600 focus:ring-green-500"
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Filter More</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* On-site/Remote */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">On-site/Remote</h3>
              <div className="space-y-2">
                <RadioOption
                  name="jobType"
                  value="All Job Types"
                  label="All Job Types"
                  checked={filters.jobType === 'All Job Types'}
                  onChange={() => setFilters({ ...filters, jobType: 'All Job Types' })}
                />
                <RadioOption
                  name="jobType"
                  value="On-site"
                  label="On-site"
                  checked={filters.jobType === 'On-site'}
                  onChange={() => setFilters({ ...filters, jobType: 'On-site' })}
                />
                <RadioOption
                  name="jobType"
                  value="Remote"
                  label="Remote"
                  checked={filters.jobType === 'Remote'}
                  onChange={() => setFilters({ ...filters, jobType: 'Remote' })}
                />
                <RadioOption
                  name="jobType"
                  value="Hybrid"
                  label="Hybrid"
                  checked={filters.jobType === 'Hybrid'}
                  onChange={() => setFilters({ ...filters, jobType: 'Hybrid' })}
                />
              </div>
            </div>

            {/* All Job Categories */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Job Categories</h3>
              <div className="space-y-2">
                <RadioOption
                  name="category"
                  value="All Job Categories"
                  label="All Job Categories"
                  checked={filters.category === 'All Job Categories'}
                  onChange={() => setFilters({ ...filters, category: 'All Job Categories' })}
                />
                <RadioOption
                  name="category"
                  value="Full-time"
                  label="Full-time"
                  checked={filters.category === 'Full-time'}
                  onChange={() => setFilters({ ...filters, category: 'Full-time' })}
                />
                <RadioOption
                  name="category"
                  value="Part-time"
                  label="Part-time"
                  checked={filters.category === 'Part-time'}
                  onChange={() => setFilters({ ...filters, category: 'Part-time' })}
                />
                <RadioOption
                  name="category"
                  value="Contract"
                  label="Contract"
                  checked={filters.category === 'Contract'}
                  onChange={() => setFilters({ ...filters, category: 'Contract' })}
                />
                <RadioOption
                  name="category"
                  value="Internship"
                  label="Internship"
                  checked={filters.category === 'Internship'}
                  onChange={() => setFilters({ ...filters, category: 'Internship' })}
                />
                <RadioOption
                  name="category"
                  value="Temporary"
                  label="Temporary"
                  checked={filters.category === 'Temporary'}
                  onChange={() => setFilters({ ...filters, category: 'Temporary' })}
                />
              </div>
            </div>

            {/* All Salary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Salary</h3>
              <div className="space-y-2">
                <RadioOption
                  name="salary"
                  value="All Salaries"
                  label="All Salaries"
                  checked={filters.salary === 'All Salaries'}
                  onChange={() => setFilters({ ...filters, salary: 'All Salaries' })}
                />
                <RadioOption
                  name="salary"
                  value="$1000 - $1500"
                  label="$1000 - $1500"
                  checked={filters.salary === '$1000 - $1500'}
                  onChange={() => setFilters({ ...filters, salary: '$1000 - $1500' })}
                />
                <RadioOption
                  name="salary"
                  value="$1500 - $2000"
                  label="$1500 - $2000"
                  checked={filters.salary === '$1500 - $2000'}
                  onChange={() => setFilters({ ...filters, salary: '$1500 - $2000' })}
                />
                <RadioOption
                  name="salary"
                  value="$2000 - $5000"
                  label="$2000 - $5000"
                  checked={filters.salary === '$2000 - $5000'}
                  onChange={() => setFilters({ ...filters, salary: '$2000 - $5000' })}
                />
              </div>
            </div>

            {/* Posted Anytime */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Posted Anytime</h3>
              <div className="space-y-2">
                <RadioOption
                  name="posted"
                  value="Posted Anytime"
                  label="Posted Anytime"
                  checked={filters.posted === 'Posted Anytime'}
                  onChange={() => setFilters({ ...filters, posted: 'Posted Anytime' })}
                />
                <RadioOption
                  name="posted"
                  value="Last 3 days"
                  label="Last 3 days"
                  checked={filters.posted === 'Last 3 days'}
                  onChange={() => setFilters({ ...filters, posted: 'Last 3 days' })}
                />
                <RadioOption
                  name="posted"
                  value="Last 7 days"
                  label="Last 7 days"
                  checked={filters.posted === 'Last 7 days'}
                  onChange={() => setFilters({ ...filters, posted: 'Last 7 days' })}
                />
              </div>
            </div>

            {/* Seniority Levels */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seniority Levels</h3>
              <div className="space-y-2">
                <RadioOption
                  name="seniority"
                  value="Seniority Levels"
                  label="Seniority Levels"
                  checked={filters.seniority === 'Seniority Levels'}
                  onChange={() => setFilters({ ...filters, seniority: 'Seniority Levels' })}
                />
                <RadioOption
                  name="seniority"
                  value="Entry Level"
                  label="Entry Level"
                  checked={filters.seniority === 'Entry Level'}
                  onChange={() => setFilters({ ...filters, seniority: 'Entry Level' })}
                />
                <RadioOption
                  name="seniority"
                  value="Mid Level"
                  label="Mid Level"
                  checked={filters.seniority === 'Mid Level'}
                  onChange={() => setFilters({ ...filters, seniority: 'Mid Level' })}
                />
                <RadioOption
                  name="seniority"
                  value="Executive"
                  label="Executive"
                  checked={filters.seniority === 'Executive'}
                  onChange={() => setFilters({ ...filters, seniority: 'Executive' })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;