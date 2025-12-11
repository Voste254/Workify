import React from 'react';
import { MapPin, Calendar, Heart } from 'lucide-react';

interface Job {
  id: string;
  company: string;
  logo: string;
  title: string;
  location: string;
  daysLeft: number;
  categories: string[];
  salary: {
    min: number;
    max: number;
    period: string;
  };
}

interface JoblistProps {
  jobs: Job[];
  totalResults: number;
}

const Joblist: React.FC<JoblistProps> = ({ jobs, totalResults }) => {
  const getLogoColor = (index: number) => {
    const colors = ['bg-gray-800', 'bg-gradient-to-br from-orange-500 to-blue-500', 'bg-blue-900', 'bg-red-600'];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-lg shadow-sm">
        <div className="bg-green-600 p-2 rounded">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {totalResults} Result{totalResults !== 1 ? 's' : ''} Found
        </h2>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {jobs.map((job, index) => (
          <div
            key={job.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
          >
            <div className="flex items-start gap-4">
              {/* Company Logo */}
              <div className={`flex-shrink-0 w-16 h-16 ${getLogoColor(index)} rounded-lg flex items-center justify-center overflow-hidden`}>
                {index === 0 && (
                  <span className="text-white font-bold text-xl">R</span>
                )}
                {index === 1 && (
                  <div className="w-full h-full grid grid-cols-2 grid-rows-2">
                    <div className="bg-red-500"></div>
                    <div className="bg-green-500"></div>
                    <div className="bg-blue-500"></div>
                    <div className="bg-yellow-500"></div>
                  </div>
                )}
                {index === 2 && (
                  <span className="text-white font-bold text-2xl" style={{ fontFamily: 'serif' }}>IBM</span>
                )}
                {index === 3 && (
                  <span className="text-white font-bold text-xl">N</span>
                )}
              </div>

              {/* Job Details */}
              <div className="flex-1 min-w-0">
                {/* Company Name */}
                <p className="text-sm text-green-600 font-medium mb-1">{job.company}</p>
                
                {/* Job Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                
                {/* Location and Days Left */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{job.daysLeft} days left to apply</span>
                  </div>
                </div>
              </div>

              {/* Categories, Salary and Actions */}
              <div className="flex flex-col items-end gap-3 ml-4">
                {/* Categories */}
                <div className="flex flex-wrap gap-2 justify-end">
                  {job.categories.map((category, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                {/* Salary and Actions */}
                <div className="flex items-center gap-3">
                  {/* Salary */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                      <span className="text-sm text-gray-600 font-normal"> /{job.salary.period}</span>
                    </p>
                  </div>

                  {/* Favorite Button */}
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>

                  {/* Apply Button */}
                  <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Joblist;