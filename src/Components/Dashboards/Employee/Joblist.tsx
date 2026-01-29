import React, { useState } from 'react';
import { MapPin, Clock, Bookmark, ExternalLink, Sparkles, TrendingUp } from 'lucide-react';

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
  type: string;
  featured?: boolean;
}

interface JoblistProps {
  jobs: Job[];
  totalResults: number;
  viewMode: 'grid' | 'list';
}

const Joblist: React.FC<JoblistProps> = ({ jobs, totalResults, viewMode }) => {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const toggleSave = (jobId: string) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const getCompanyInitial = (company: string) => company.charAt(0);

  const companyColors = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600'
  ];

  if (viewMode === 'grid') {
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {totalResults} Jobs Found
              </h2>
              <p className="text-sm text-slate-600">Showing the best matches for you</p>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <div
              key={job.id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-slate-100 hover:border-indigo-200 transform hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="relative p-6 bg-gradient-to-br from-slate-50 to-indigo-50">
                {job.featured && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </div>
                )}
                
                <div className={`w-16 h-16 bg-gradient-to-br ${companyColors[index % companyColors.length]} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4`}>
                  {getCompanyInitial(job.company)}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {job.title}
                </h3>
                
                <p className="text-sm font-medium text-slate-600 mb-3">{job.company}</p>
                
                <div className="flex flex-wrap gap-2">
                  {job.categories.slice(0, 2).map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/80 backdrop-blur-sm text-slate-700 text-xs font-medium rounded-full border border-slate-200"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{job.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{job.daysLeft} days left</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Salary Range</p>
                      <p className="text-lg font-bold text-slate-900">
                        ${(job.salary.min / 1000).toFixed(0)}k - ${(job.salary.max / 1000).toFixed(0)}k
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      job.type === 'Remote' ? 'bg-emerald-100 text-emerald-700' :
                      job.type === 'Hybrid' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {job.type}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSave(job.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                        savedJobs.has(job.id)
                          ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-slate-200'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">Save</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold transition-all shadow-md hover:shadow-lg">
                      Apply
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {totalResults} Jobs Found
            </h2>
            <p className="text-sm text-slate-600">Showing the best matches for you</p>
          </div>
        </div>
      </div>

      {/* List Layout */}
      <div className="space-y-4">
        {jobs.map((job, index) => (
          <div
            key={job.id}
            className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border-2 border-slate-100 hover:border-indigo-200 transform hover:-translate-y-0.5"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Company Logo & Basic Info */}
              <div className="flex gap-4 flex-1 min-w-0">
                <div className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${companyColors[index % companyColors.length]} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                  {getCompanyInitial(job.company)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {job.title}
                    </h3>
                    {job.featured && (
                      <span className="flex-shrink-0 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm font-medium text-slate-600 mb-3">{job.company}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{job.location}</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{job.daysLeft} days left</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      job.type === 'Remote' ? 'bg-emerald-100 text-emerald-700' :
                      job.type === 'Hybrid' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {job.type}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Salary & Actions */}
              <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 lg:min-w-[200px]">
                <div className="text-left lg:text-right">
                  <p className="text-xs text-slate-500 mb-1">Salary Range</p>
                  <p className="text-xl lg:text-2xl font-bold text-slate-900">
                    ${(job.salary.min / 1000).toFixed(0)}k - ${(job.salary.max / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-slate-500">per {job.salary.period}</p>
                </div>

                <div className="flex lg:flex-col gap-2 w-full lg:w-auto">
                  <button
                    onClick={() => toggleSave(job.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                      savedJobs.has(job.id)
                        ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-slate-200'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold transition-all shadow-md hover:shadow-lg whitespace-nowrap">
                    Apply Now
                    <ExternalLink className="w-4 h-4" />
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