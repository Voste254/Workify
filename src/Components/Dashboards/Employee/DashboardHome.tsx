import JobCard from "./JobCard";
import BlogPreview from "./BlogPreview";

const DashboardHome = () => {
  return (
    <div className="p-6">

      {/* Welcome */}
      <div className="bg-slate-800 text-white rounded-xl p-8 mb-8">
        <h2 className="text-3xl font-bold mb-2">
          Welcome back, Voste 👋
        </h2>
        <p className="text-gray-300">
          You have 3 active applications.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 ">

        <div className="bg-white border rounded-xl p-6 border-gray-500">
          <p className="text-sm text-gray-500">Active Applications</p>
          <h3 className="text-2xl font-bold mt-2">3</h3>
        </div>

        <div className="bg-white border rounded-xl p-6 border-gray-500">
          <p className="text-sm text-gray-500">Shortlisted</p>
          <h3 className="text-2xl font-bold mt-2">1</h3>
        </div>

        <div className="bg-white border rounded-xl p-6 border-gray-500">
          <p className="text-sm text-gray-500">Jobs Applied</p>
          <h3 className="text-2xl font-bold mt-2">8</h3>
        </div>

        <div className="bg-white border rounded-xl p-6 border-gray-500">
          <p className="text-sm text-gray-500">Profile Views</p>
          <h3 className="text-2xl font-bold mt-2">54</h3>
        </div>

      </div>

      {/* Recommended Jobs */}
      <h3 className="text-xl font-semibold mb-4">Jobs you might be interested in</h3>

<div className="grid md:grid-cols-2 gap-6 mb-12">
  <JobCard
    title="Frontend Developer"
    company="Nairobi Tech Ltd"
    location="Nairobi County"
    salary="120,000 - 180,000"
    type="Permanent"
    rating={4.5}
    daysAgo={2}
  />

  <JobCard
    title="Data Analyst Intern"
    company="Mombasa Analytics"
    location="Mombasa County"
    salary="30,000 - 50,000"
    type="Internship"
    rating={4.2}
    daysAgo={5}
  />

  <JobCard
    title="Plumber"
    company="Kisumu Contractors"
    location="Kisumu County"
    salary="2,500/day"
    type="Contractual"
    rating={4.7}
    daysAgo={1}
  />

  <JobCard
    title="Backend Engineer"
    company="Eldoret Systems"
    location="Uasin Gishu County"
    salary="150,000 - 220,000"
    type="Permanent"
    rating={4.8}
    daysAgo={3}
  />
</div>

      {/* Blog Preview */}
      <BlogPreview />

    </div>
  );
};

export default DashboardHome;
