import { MapPin, Calendar, DollarSign, Star } from "lucide-react";
import { Link } from "react-router-dom";

const jobs = [
  {
    id: 1,
    company: "Flutter Int'l",
    title: "Senior UI/UX Designer",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Google-flutter-logo.svg",
    location: "Las Vegas, NV 89107, USA",
    tags: ["Accounting", "Sales & Marketing"],
    salary: "$1,000 - 2,000 /year",
    posted: "2 days ago",
    left: "2 days left to apply",
  },
  {
    id: 2,
    company: "Rockstar Games New York",
    title: "Project Manager",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Microsoft_logo.svg",
    location: "Las Vegas, NV 89107, USA",
    tags: ["UI UX Design", "Accounting"],
    salary: "$1,000 - 1,300 /year",
    posted: "2 days ago",
    left: "5 days left to apply",
  },
  {
    id: 3,
    company: "IBM Inclusive",
    title: "Senior UI/UX Designer",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    location: "Las Vegas, NV 89107, USA",
    tags: ["UI UX Design", "Project Manager", "Accounting"],
    salary: "$2,000 - 2,400 /year",
    posted: "2 days ago",
    left: "6 days left to apply",
  },
  {
    id: 4,
    company: "NETFLIX",
    title: "Full Stack Development",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    location: "Las Vegas, NV 89107, USA",
    tags: ["UI UX Design", "Project Manager"],
    salary: "$1,100 - 1,500 /year",
    posted: "2 days ago",
    left: "7 days left to apply",
  },
  {
    id: 5,
    company: "Amazon Web Services",
    title: "Cloud Infrastructure Engineer",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    location: "Seattle, WA, USA",
    tags: ["AWS", "DevOps", "Kubernetes"],
    salary: "$2,500 - 3,500 /year",
    posted: "3 days ago",
    left: "4 days left to apply",
  },
  {
    id: 6,
    company: "Tesla Inc.",
    title: "AI Software Engineer",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
    location: "Palo Alto, CA, USA",
    tags: ["AI", "Machine Learning", "Python"],
    salary: "$3,000 - 4,200 /year",
    posted: "1 day ago",
    left: "5 days left to apply",
  },
];

export default function FeaturedJobs() {
  return (
    <section className="py-16 px-6 lg:px-20 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900">Featured Jobs</h2>
        <p className="text-gray-500 mt-2">
          Find the job that’s perfect for you. About 800+ new jobs every day
        </p>
      </div>

      {/* Job Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {jobs.map((job) => (
          <Link
            key={job.id}
            to="/login"
            className="block bg-white p-6 rounded-lg border border-green-300 hover:border-green-800 transition relative"
          >
            <div className="flex items-start space-x-4">
              <img
                src={job.logo}
                alt={job.company}
                className="w-20 h-20 object-contain"
              />
              <div className="flex-1">
                <h4 className="text-green-600 text-sm font-semibold">
                  {job.company}
                </h4>
                <h3 className="text-lg font-bold text-gray-900">
                  {job.title}
                </h3>
                <div className="flex items-center text-gray-500 text-sm mt-1 space-x-3">
                  <span className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {job.location}
                  </span>
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {job.posted}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {job.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="flex items-center text-gray-800 font-medium">
                <DollarSign size={16} className="mr-1" />
                {job.salary}
              </div>
              <span className="text-gray-500 text-sm">{job.left}</span>
            </div>

            {/* Rating */}
            <div className="absolute top-6 right-6 flex space-x-1 text-yellow-400">
              {[...Array(4)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-center mt-12">
        <Link to='/jobs'>
        <button className="px-8 py-3  border border-green-800 bg-white hover:bg-green-700 text-green-600 hover:text-white rounded-lg text-lg font-semibold transition">
          See More Jobs
        </button>
        </Link>
 
      </div>
    </section>
  );
}
