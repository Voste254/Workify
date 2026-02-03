import JobCard from "./JobCard";
import BlogPreview from "./BlogPreview";

const DashboardHome = () => {
  return (
    <div className="p-6">

      {/* Welcome Section */}
      <div className="bg-slate-800 text-white rounded-xl p-8 mb-8">
        <h2 className="text-3xl font-bold mb-2">
          Welcome back, Brian 👋
        </h2>
        <p className="text-gray-300">
          Find your next opportunity in Kenya.
        </p>
      </div>

      {/* Recommended Jobs */}
      <h3 className="text-xl font-semibold mb-4">Recommended Jobs</h3>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
      </div>

      {/* Blog Section */}
      <BlogPreview />

    </div>
  );
};

export default DashboardHome;
