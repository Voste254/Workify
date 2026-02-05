import { useState } from "react";
import { Search } from "lucide-react";
import JobCard from "./JobCard";

const FindJobsPage = () => {
  const [activeType, setActiveType] = useState("All");
  const [search, setSearch] = useState("");

  const jobTypes = ["All", "Internship", "Contractual", "Permanent"];

  // Hardcoded jobs (2 per category minimum)
  const jobs = [
    // Permanent
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Kenya",
      location: "Nairobi, Kenya",
      salary: "180,000 - 250,000",
      type: "Permanent" as const,
      rating: 4.8,
      daysAgo: 4,
    },
    {
      title: "Backend Engineer",
      company: "Safaricom PLC",
      location: "Nairobi, Kenya",
      salary: "200,000 - 300,000",
      type: "Permanent" as const,
      rating: 4.6,
      daysAgo: 2,
    },

    // Internship
    {
      title: "Software Developer Intern",
      company: "iHub",
      location: "Nairobi, Kenya",
      salary: "25,000 - 40,000",
      type: "Internship" as const,
      rating: 4.3,
      daysAgo: 1,
    },
    {
      title: "UI/UX Intern",
      company: "Andela",
      location: "Remote",
      salary: "30,000 - 45,000",
      type: "Internship" as const,
      rating: 4.5,
      daysAgo: 3,
    },

    // Contractual
    {
      title: "React Developer (6 Months)",
      company: "Africa Fintech",
      location: "Lagos, Nigeria",
      salary: "150,000 - 220,000",
      type: "Contractual" as const,
      rating: 4.4,
      daysAgo: 6,
    },
    {
      title: "Data Analyst (Project Based)",
      company: "KCB Group",
      location: "Nairobi, Kenya",
      salary: "120,000 - 180,000",
      type: "Contractual" as const,
      rating: 4.2,
      daysAgo: 5,
    },
  ];

  // Filtering logic
  const filteredJobs = jobs.filter((job) => {
    const matchesType =
      activeType === "All" || job.type === activeType;

    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-10 space-y-8">

      {/* Header */}
      <h1 className="text-2xl font-semibold">Find Jobs</h1>

      {/* Search + Filters Card */}
      <div className="bg-white border rounded-xl p-6 space-y-4">

        {/* Search */}
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search jobs, skills, or companies..."
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3">
          {jobTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-full text-sm border transition
                ${
                  activeType === type
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Job Count */}
      <p className="text-sm text-gray-600">
        {filteredJobs.length} jobs found
      </p>

      {/* Job Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredJobs.map((job, index) => (
          <JobCard key={index} {...job} />
        ))}
      </div>
    </div>
  );
};

export default FindJobsPage;
