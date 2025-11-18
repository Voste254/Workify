import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, DollarSign, Heart } from "lucide-react";

export type JobType = {
  id: number;
  company: string;
  title: string;
  logo: string;
  location: string;
  tags: string[];
  salary: string;
  left: string;
};

interface Props {
  jobs: JobType[];
  bookmarks: Record<number, boolean>;
  toggleBookmark: (id: number) => void;
}

export const JobList: React.FC<Props> = ({ jobs, bookmarks, toggleBookmark }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="bg-white border rounded-md">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-md bg-green-600 text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v2H4zM4 11h16v2H4zM4 18h16v2H4z" fill="currentColor"/></svg>
            </button>
            <div className="text-sm text-gray-700">9 Result(s) Found</div>
          </div>
        </div>

        <div>
          {jobs.map((job) => (
            <div key={job.id} className="px-6 py-5 border-b last:border-b-0">
              <Link to="/login" className="flex items-center gap-6 w-full">
                {/* Left: logo + company + title + meta */}
                <div className="flex items-center gap-4 min-w-0">
                  <img src={job.logo} alt={job.company} className="w-16 h-16 object-contain" />
                  <div className="min-w-0">
                    <div className="text-green-600 text-sm font-medium">{job.company}</div>
                    <div className="text-lg font-semibold text-gray-900 truncate">{job.title}</div>

                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-2 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                      <span className="flex items-center gap-1"><Calendar size={14} /> {job.left}</span>
                    </div>
                  </div>
                </div>

                {/* Middle: tags centered */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((t, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm font-medium">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Right: salary + actions */}
                <div className="flex items-center gap-4 min-w-[240px] justify-end">
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <DollarSign size={18} /> <span>{job.salary}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleBookmark(job.id);
                      }}
                      className={`p-2 rounded-full border hover:bg-gray-50 ${bookmarks[job.id] ? "text-green-600 border-green-200 bg-green-50" : "text-gray-500 border-gray-100"}`}
                      aria-label="bookmark"
                    >
                      <Heart size={18} fill={bookmarks[job.id] ? "currentColor" : "none"} />
                    </button>

                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">
                      Apply
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobList;
