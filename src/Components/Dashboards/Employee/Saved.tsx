import { useState, useMemo } from "react";
import { Search, Bookmark, Building2 } from "lucide-react";

interface SavedJob {
  title: string;
  company: string;
  location: string;
  salary: string;
  daysAgo: number;
}

interface SavedEmployer {
  name: string;
  industry: string;
  location: string;
  rating: number;
}

const SavedPage = () => {

  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState<"jobs" | "employers">("jobs");

  /* ===============================
     MOCK DATA
  =============================== */

  const savedJobs: SavedJob[] = [
    {
      title: "Frontend Developer",
      company: "TechCorp Kenya",
      location: "Nairobi, Kenya",
      salary: "180,000 - 220,000",
      daysAgo: 2,
    },
    {
      title: "Data Analyst",
      company: "KCB Group",
      location: "Nairobi, Kenya",
      salary: "150,000 - 200,000",
      daysAgo: 5,
    },
  ];

  const savedEmployers: SavedEmployer[] = [
    {
      name: "Safaricom PLC",
      industry: "Telecommunications",
      location: "Nairobi, Kenya",
      rating: 4.7,
    },
    {
      name: "Africa Fintech",
      industry: "Financial Technology",
      location: "Lagos, Nigeria",
      rating: 4.5,
    },
  ];

  /* ===============================
     FILTERING
  =============================== */

  const filteredJobs = useMemo(() => {
    return savedJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredEmployers = useMemo(() => {
    return savedEmployers.filter(
      (employer) =>
        employer.name.toLowerCase().includes(search.toLowerCase()) ||
        employer.industry.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  /* ===============================
     UI
  =============================== */

  return (
    <div className="p-6 lg:p-10 space-y-8">

      {/* Header */}
      <h1 className="text-3xl font-semibold">
        Saved
      </h1>

      {/* Search */}
      <div className="bg-white border rounded-2xl p-6 space-y-6">

        <div className="flex items-center bg-gray-100 rounded-full px-5 py-3">
          <Search size={18} className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search saved jobs or employers..."
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-3">

          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-4 py-2 rounded-full text-sm border transition
            ${
              activeTab === "jobs"
                ? "bg-green-600 text-white border-green-600"
                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
            }`}
          >
            Saved Jobs
          </button>

          <button
            onClick={() => setActiveTab("employers")}
            className={`px-4 py-2 rounded-full text-sm border transition
            ${
              activeTab === "employers"
                ? "bg-green-600 text-white border-green-600"
                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
            }`}
          >
            Saved Employers
          </button>

        </div>
      </div>

      {/* Results */}

      {activeTab === "jobs" && (
        <>
          <p className="text-sm text-gray-600">
            {filteredJobs.length} saved jobs
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            {filteredJobs.map((job, index) => (
              <div
                key={index}
                className="bg-white border rounded-2xl p-6 space-y-3 hover:shadow-md transition"
              >

                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="font-semibold text-lg">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {job.company}
                    </p>
                  </div>

                  <Bookmark className="text-green-600" size={20} />

                </div>

                <p className="text-sm text-gray-500">
                  {job.location}
                </p>

                <p className="font-medium text-sm">
                  KES {job.salary}
                </p>

                <p className="text-xs text-gray-400">
                  Saved • {job.daysAgo} days ago
                </p>

                <button className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700">
                  View Job
                </button>

              </div>
            ))}

          </div>
        </>
      )}

      {activeTab === "employers" && (
        <>
          <p className="text-sm text-gray-600">
            {filteredEmployers.length} saved employers
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            {filteredEmployers.map((employer, index) => (
              <div
                key={index}
                className="bg-white border rounded-2xl p-6 space-y-3 hover:shadow-md transition"
              >

                <div className="flex justify-between items-center">

                  <div className="flex items-center gap-3">
                    <Building2 className="text-gray-500" size={22} />

                    <div>
                      <h3 className="font-semibold">
                        {employer.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {employer.industry}
                      </p>
                    </div>
                  </div>

                  <Bookmark className="text-green-600" size={20} />

                </div>

                <p className="text-sm text-gray-500">
                  {employer.location}
                </p>

                <p className="text-sm">
                  ⭐ {employer.rating} company rating
                </p>

                <button className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700">
                  View Company
                </button>

              </div>
            ))}

          </div>
        </>
      )}

    </div>
  );
};

export default SavedPage;