import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import JobCard from "./JobCard";

type JobType = "Corporate" | "Manual/Casual";
type ContractType =
  | "Permanent"
  | "Contractual"
  | "Daily"
  | "Hourly";

interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: JobType;
  contractType: ContractType;
  rating: number;
  daysAgo: number;
}

const FindJobsPage = () => {
  const [activeType, setActiveType] = useState<string>("All Types");
  const [activeContract, setActiveContract] =
    useState<string>("All Contracts");
  const [search, setSearch] = useState("");

  /* ===============================
     FILTER OPTIONS
  =============================== */

  const jobTypes = [
    "All Types",
    "Corporate",
    "Manual/Casual",
  ];

  const contractTypes = [
    "All Contracts",
    "Permanent",
    "Contractual",
    "Daily",
    "Hourly",
  ];

  /* ===============================
     JOB DATA (2+ per category)
  =============================== */

  const jobs: Job[] = [
    // CORPORATE - Permanent
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Kenya",
      location: "Nairobi, Kenya",
      salary: "180,000 - 250,000",
      jobType: "Corporate",
      contractType: "Permanent",
      rating: 4.8,
      daysAgo: 4,
    },
    {
      title: "Backend Engineer",
      company: "Safaricom PLC",
      location: "Nairobi, Kenya",
      salary: "200,000 - 300,000",
      jobType: "Corporate",
      contractType: "Permanent",
      rating: 4.6,
      daysAgo: 2,
    },

    // CORPORATE - Contractual
    {
      title: "React Developer (6 Months)",
      company: "Africa Fintech",
      location: "Lagos, Nigeria",
      salary: "150,000 - 220,000",
      jobType: "Corporate",
      contractType: "Contractual",
      rating: 4.4,
      daysAgo: 6,
    },
    {
      title: "Data Analyst (Project Based)",
      company: "KCB Group",
      location: "Nairobi, Kenya",
      salary: "120,000 - 180,000",
      jobType: "Corporate",
      contractType: "Contractual",
      rating: 4.2,
      daysAgo: 5,
    },

    // MANUAL - Daily
    {
      title: "Construction Worker",
      company: "BuildRight Ltd",
      location: "Nairobi, Kenya",
      salary: "2,500 per day",
      jobType: "Manual/Casual",
      contractType: "Daily",
      rating: 4.1,
      daysAgo: 1,
    },
    {
      title: "Warehouse Loader",
      company: "QuickLogistics",
      location: "Mombasa, Kenya",
      salary: "2,000 per day",
      jobType: "Manual/Casual",
      contractType: "Daily",
      rating: 4.0,
      daysAgo: 3,
    },

    // MANUAL - Hourly
    {
      title: "House Cleaner",
      company: "Sparkle Services",
      location: "Nairobi, Kenya",
      salary: "500 per hour",
      jobType: "Manual/Casual",
      contractType: "Hourly",
      rating: 4.3,
      daysAgo: 2,
    },
    {
      title: "Delivery Rider",
      company: "SwiftSend",
      location: "Nairobi, Kenya",
      salary: "600 per hour",
      jobType: "Manual/Casual",
      contractType: "Hourly",
      rating: 4.4,
      daysAgo: 4,
    },
  ];

  /* ===============================
     FILTERING LOGIC
  =============================== */

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesType =
        activeType === "All Types" ||
        job.jobType === activeType;

      const matchesContract =
        activeContract === "All Contracts" ||
        job.contractType === activeContract;

      const matchesSearch =
        job.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        job.company
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesType && matchesContract && matchesSearch;
    });
  }, [activeType, activeContract, search]);

  /* ===============================
     UI
  =============================== */

  return (
    <div className="p-6 lg:p-10 space-y-8">

      {/* Header */}
      <h1 className="text-3xl font-semibold">
        Find Your Next Opportunity
      </h1>

      {/* Search + Filters Card */}
      <div className="bg-white border rounded-2xl p-6 space-y-6">

        {/* Search */}
        <div className="flex items-center bg-gray-100 rounded-full px-5 py-3">
          <Search size={18} className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search jobs, skills, or companies..."
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Job Type Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {jobTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-full text-sm border transition
                ${
                  activeType === type
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Contract Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-500 mr-2">
            Contract:
          </span>
          {contractTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveContract(type)}
              className={`px-4 py-2 rounded-full text-sm border transition
                ${
                  activeContract === type
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
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

      {/* Job Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredJobs.map((job, index) => (
          <JobCard type={"Permanent"} key={index} {...job} />
        ))}
      </div>
    </div>
  );
};

export default FindJobsPage;