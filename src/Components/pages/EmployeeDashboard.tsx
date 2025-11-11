import { useState } from "react";
import {
  Bell,
  MapPin,
  DollarSign,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function EmployeeDashboard() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const jobs = [
    {
      id: 1,
      title: "Senior UI/UX Designer",
      company: "Rockstar Games New York",
      logo: "https://i.ibb.co/Y7nsyhj/kisspng-coders-programming-language-computer-programming-logo-5ac20c5075a2c7-2421946715226578721598.png",
      location: "Las Vegas, NV 89107, USA",
      tags: ["Accounting", "Sales & Marketing"],
      salary: "$1,000 – $2,000 /year",
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "Project Manager",
      company: "Rockstar Games New York",
      logo: "https://i.ibb.co/tL2Rqmx/icons8-up-arrow-96.png",
      location: "Los Angeles, CA",
      tags: ["UI/UX Design", "Accounting"],
      salary: "$1,000 – $1,300 /year",
      posted: "3 days ago",
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "Rockstar Games New York",
      logo: "https://i.ibb.co/GFGMqRQ/icons8-bars-96.png",
      location: "New York, USA",
      tags: ["Frontend", "Backend"],
      salary: "$1,200 – $1,600 /year",
      posted: "4 days ago",
    },
  ];

  const filterCategories = [
    {
      title: "On-site/Remote",
      options: ["All Job Types", "On-site", "Remote", "Hybrid"],
    },
    {
      title: "Job Categories",
      options: ["All Categories", "Full-time", "Part-time", "Contract", "Internship", "Temporary"],
    },
    {
      title: "Salary",
      options: ["All Salaries", "$1000 - $1500", "$1500 - $2000", "$2000 - $5000"],
    },
    {
      title: "Posted Anytime",
      options: ["Anytime", "Last 3 days", "Last 7 days"],
    },
    {
      title: "Seniority Levels",
      options: ["All", "Entry Level", "Mid Level", "Executive"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="w-full bg-white shadow-sm py-3 px-6 flex justify-end items-center space-x-6 sticky top-0 z-50">
        <button className="relative">
          <Bell size={22} className="text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="relative">
          <img
            src="https://i.ibb.co/Dz7WgxV/user-avatar.png"
            alt="User"
            className="w-10 h-10 rounded-full cursor-pointer border border-gray-300"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            className="w-full sm:w-80 px-4 py-2 border rounded-lg focus:outline-none"
          />
          <div className="relative">
            <select
              className="px-4 py-2 border rounded-lg bg-white focus:outline-none"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option>All Locations</option>
              <option>Las Vegas</option>
              <option>Los Angeles</option>
              <option>New York</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 transition"
        >
          <Filter size={18} className="mr-2" /> Filter More
        </button>
      </div>

      {/* Job List */}
      <div className="p-6 space-y-4">
        <p className="text-gray-600 font-medium">{jobs.length} Results Found</p>

        {jobs.map((job) => (
          <Link
            to="/login"
            key={job.id}
            className="bg-white flex flex-col md:flex-row justify-between items-start md:items-center p-5 rounded-lg border hover:border-green-500 transition"
          >
            <div className="flex items-start space-x-4">
              <img src={job.logo} alt={job.company} className="w-16 h-16 object-contain" />
              <div>
                <h4 className="text-green-600 text-sm font-semibold">{job.company}</h4>
                <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                <div className="flex items-center text-gray-500 text-sm mt-1 space-x-3">
                  <span className="flex items-center">
                    <MapPin size={14} className="mr-1" /> {job.location}
                  </span>
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1" /> {job.posted}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center text-gray-800 font-medium">
                <DollarSign size={16} className="mr-1" /> {job.salary}
              </div>
              <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                Apply
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-3 py-6">
        <button className="p-2 border rounded hover:bg-gray-100">
          <ChevronLeft size={18} />
        </button>
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            className={`px-3 py-1 border rounded ${
              num === 1 ? "bg-green-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}
        <button className="p-2 border rounded hover:bg-gray-100">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Filter More Panel */}
      {filterOpen && (
        <>
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setFilterOpen(false)}
          ></div>

          {/* Drawer for small screens / floating for large */}
          <div className="fixed z-50 bg-white rounded-lg shadow-lg p-6 w-full sm:w-[500px] sm:right-8 sm:top-32 sm:rounded-xl max-h-[90vh] overflow-y-auto sm:overflow-visible sm:max-h-none transition">
            <h3 className="text-xl font-semibold mb-4">Filter More</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filterCategories.map((cat, i) => (
                <div key={i}>
                  <h4 className="font-medium mb-2">{cat.title}</h4>
                  <div className="space-y-2">
                    {cat.options.map((opt, j) => (
                      <label key={j} className="flex items-center space-x-2 text-gray-600">
                        <input type="checkbox" className="accent-green-600" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setFilterOpen(false)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
