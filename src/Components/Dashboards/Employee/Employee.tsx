import React, { useMemo, useState } from "react";
import TopBar from "./Topbar";
import FilterControls, { filterCategories } from "./FilterControls";
import JobList, { type JobType } from "./Joblist";
import Pagination from "./Pagination";



const MOCK_JOBS: JobType[] = [
  {
    id: 1,
    company: "Rockstar Games New York",
    title: "Senior UI/UX Designer",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/65/Font_Awesome_5_brands_github.svg",
    location: "Las Vegas, NV 89107, USA",
    tags: ["Accounting", "Sales & Marketing"],
    salary: "$1,000 - $2,000 /year",
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
    left: "7 days left to apply",
  },
];

const Employee: React.FC = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All Location");
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // naive paging; page size 4
  const totalPages = Math.max(1, Math.ceil(MOCK_JOBS.length / 4));
  const filtered = useMemo(() => {
    let arr = MOCK_JOBS;
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter((j) => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q));
    }
    if (location !== "All Location") {
      arr = arr.filter((j) => j.location.includes(location));
    }
    return arr;
  }, [search, location]);

  return (
    <div>
      <TopBar />
      <FilterControls
        search={search}
        setSearch={setSearch}
        location={location}
        setLocation={setLocation}
        onOpenModal={() => setFilterOpen(true)}
      />

      <JobList jobs={filtered} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      {filterOpen && (
        <div>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setFilterOpen(false)} />

          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4">
            <div className="bg-white w-full max-w-6xl rounded-lg shadow-xl border overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-semibold">Filter More</h3>
                <button onClick={() => setFilterOpen(false)} className="px-3 py-1 rounded hover:bg-gray-100">
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
                <button onClick={() => setFilterOpen(false)} className="px-4 py-2 rounded border hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={() => setFilterOpen(false)} className="px-5 py-2 rounded bg-green-600 text-white hover:bg-green-700">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
