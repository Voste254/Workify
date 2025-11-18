import React from "react";
import { Filter, MapPin } from "lucide-react";

export type FilterCategoriesType = {
  title: string;
  options: string[];
}[];

interface Props {
  search: string;
  setSearch: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  onOpenModal?: () => void;
}

export const filterCategories: FilterCategoriesType = [
  {
    title: "On-site/Remote",
    options: ["All Job Types", "On-site", "Remote", "Hybrid"],
  },
  {
    title: "All Job Categories",
    options: ["All Job Categories", "Full-time", "Part-time", "Contract", "Internship", "Temporary"],
  },
  {
    title: "All Salary",
    options: ["All Salaries", "$1000 - $1500", "$1500 - $2000", "$2000 - $5000"],
  },
  {
    title: "Posted Anytime",
    options: ["Posted Anytime", "Last 3 days", "Last 7 days"],
  },
  {
    title: "Seniority Levels",
    options: ["Seniority Levels", "Entry Level", "Mid Level", "Executive"],
  },
];

const FilterControls: React.FC<Props> = ({
  search,
  setSearch,
  location,
  setLocation,
  onOpenModal,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="bg-white border rounded-md shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Search Input */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center px-3 border-r">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5"></circle>
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Job title, key words or company"
              className="w-full px-3 py-3 text-gray-700 focus:outline-none"
            />
          </div>

          {/* Location select */}
          <div className="flex items-center border-l pl-4">
            <MapPin className="text-gray-500 mr-2" size={18} />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="py-2 pr-4 pl-1 focus:outline-none"
            >
              <option>All Location</option>
              <option>Las Vegas</option>
              <option>New York</option>
              <option>Los Angeles</option>
            </select>
          </div>

          {/* Controls: Filter More + Find Jobs */}
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={onOpenModal}
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              <Filter size={16} /> Filter More
            </button>

            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md">
              Find Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
