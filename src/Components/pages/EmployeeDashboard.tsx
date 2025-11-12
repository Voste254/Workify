import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  MapPin,
  Calendar,
  Filter,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
} from "lucide-react";

p

export default function EmployeeDashboard() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState({});
  const [selectedLocation, setSelectedLocation] = useState("All Location");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const toggleBookmark = (id) =>
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));

  const jobs = [
    {
      id: 1,
      company: "Rockstar Games New York",
      title: "Senior UI/UX Designer",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/65/Font_Awesome_5_brands_github.svg", // reliable svg
      location: "Las Vegas, NV 89107, USA",
      tags: ["Accounting", "Sales & Marketing"],
      salary: "$1,000 - $2,000 /year",
      posted: "2 days ago",
      left: "2 days left to apply",
    },
    {
      id: 2,
      company: "Rockstar Games New York",
      title: "Project Manager",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      location: "Las Vegas, NV 89107, USA",
      tags: ["UI UX Design", "Accounting"],
      salary: "$1,000 - $1,300 /year",
      posted: "2 days ago",
      left: "5 days left to apply",
    },
    {
      id: 3,
      company: "Rockstar Games New York",
      title: "Senior UI/UX Designer",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
      location: "Las Vegas, NV 89107, USA",
      tags: ["UI UX Design", "Project Manager", "Accounting"],
      salary: "$2,000 - $2,400 /year",
      posted: "2 days ago",
      left: "6 days left to apply",
    },
    {
      id: 4,
      company: "Rockstar Games New York",
      title: "Full Stack Development",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
      location: "Las Vegas, NV 89107, USA",
      tags: ["UI UX Design", "Project Manager"],
      salary: "$1,100 - $1,500 /year",
      posted: "2 days ago",
      left: "7 days left to apply",
    },
  ];

  const filterCategories = [
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar (only notification + avatar) */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-14">
            <button
              aria-label="notifications"
              className="relative p-2 rounded-md hover:bg-gray-100"
            >
              <Bell className="text-gray-600" size={20} />
              <span className="absolute -top-0.5 -right-0.5 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative ml-4">
              <button
                onClick={() => setAvatarOpen((s) => !s)}
                className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100"
              >
                <img
                  src="https://i.pravatar.cc/150?img=32"
                  alt="avatar"
                  className="w-10 h-10 rounded-full border border-gray-200"
                />
              </button>

              {avatarOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg">
                  <button className="block w-full text-left px-4 py-2 hover:bg-green-50">Profile</button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-green-50">Settings</button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-green-50">Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Filter row (search input, location, Filter More, Find Jobs) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white border rounded-md shadow-sm p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            {/* Search / title input */}
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
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="py-2 pr-4 pl-1 focus:outline-none"
              >
                <option>All Location</option>
                <option>Las Vegas</option>
                <option>New York</option>
                <option>Los Angeles</option>
              </select>
            </div>

            {/* Filter More + Find Jobs */}
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => setFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                <Filter size={16} /> Filter More
              </button>

              <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md">
                Find Jobs
              </button>
            </div>
          </div>

          {/* Filter More inline preview (like in screenshot) - small hint area; actual modal opens on button */}
          {/* We'll not render tallies or the distance column per instructions */}
        </div>
      </div>

      {/* Job list */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white border rounded-md">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-md bg-green-600 text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v2H4zM4 11h16v2H4zM4 18h16v2H4z" fill="currentColor"/></svg>
              </button>
              <div className="text-sm text-gray-700">9 Result(s) Found</div>
            </div>
          </div>

          {/* Rows */}
          <div>
            {jobs.map((job) => (
              <div key={job.id} className="px-6 py-5 border-b last:border-b-0">
                <Link
                  to="/login"
                  className="flex items-center gap-6 w-full"
                >
                  {/* Left: logo + title/company */}
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-16 h-16 object-contain"
                    />
                    <div className="min-w-0">
                      <div className="text-green-600 text-sm font-medium">{job.company}</div>
                      <div className="text-lg font-semibold text-gray-900 truncate">{job.title}</div>

                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> {job.left}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: tags - distributed center */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((t, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm font-medium"
                        >
                          {t}
                        </span>
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
                        {/* heart-style bookmark */}
                        <Heart size={18} fill={bookmarks[job.id] ? "currentColor" : "none"} />
                      </button>

                      <button
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                        onClick={(e) => e.preventDefault()}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">Showing {(page-1)*4+1} - {Math.min(page*4, jobs.length)} of {jobs.length}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded border hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
              </button>

              {[1,2,3].map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`px-3 py-1 rounded border ${n===page ? "bg-green-600 text-white" : "hover:bg-gray-50"}`}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded border hover:bg-gray-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* FILTER MORE - CENTERED MODAL */}
      {filterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setFilterOpen(false)}
          />

          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4">
            <div className="bg-white w-full max-w-6xl rounded-lg shadow-xl border overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-semibold">Filter More</h3>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="px-3 py-1 rounded hover:bg-gray-100"
                >
                  Close
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {filterCategories.map((cat, idx) => (
                    <div key={idx}>
                      <h4 className="font-medium mb-3">{cat.title}</h4>
                      <div className="space-y-3">
                        {cat.options.map((opt, j) => (
                          <label key={j} className="flex items-center gap-2 text-gray-700">
                            <input type="radio" name={`filter-${idx}`} className="accent-green-600" />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t flex justify-end gap-3">
                <button onClick={() => setFilterOpen(false)} className="px-4 py-2 rounded border hover:bg-gray-50">Cancel</button>
                <button onClick={() => setFilterOpen(false)} className="px-5 py-2 rounded bg-green-600 text-white hover:bg-green-700">Apply Filters</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
