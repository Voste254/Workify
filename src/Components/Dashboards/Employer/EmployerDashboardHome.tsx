
import { Users, Briefcase, CheckCircle, Activity, Star, Eye, MoreHorizontal, Mail, XCircle  } from "lucide-react";
import { Line, Bar } from "react-chartjs-2";
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EmployerDashboard = () => {
  // Sample stats
  const stats = [
    {
      name: "Total Jobs",
      value: 12,
      icon: <Briefcase size={24} className="text-green-600" />,
    },
    {
      name: "Active Applications",
      value: 75,
      icon: <Users size={24} className="text-green-600" />,
    },
    {
      name: "Shortlisted Candidates",
      value: 20,
      icon: <CheckCircle size={24} className="text-green-600" />,
    },
    {
      name: "Hires This Month",
      value: 5,
      icon: <Activity size={24} className="text-green-600" />,
    },
  ];

  // Line chart sample data (Applications Growth)
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Applications",
        data: [12, 19, 14, 20, 25, 30],
        fill: false,
        backgroundColor: "#16a34a", // green accent
        borderColor: "#16a34a",
      },
    ],
  };

  // Bar chart sample data (Top Jobs)
  const barData = {
    labels: ["Job A", "Job B", "Job C", "Job D"],
    datasets: [
      {
        label: "Applications",
        data: [12, 9, 15, 7],
        backgroundColor: "#16a34a",
      },
    ],
  };

type ApplicantStatus = "Applied" | "Shortlisted" | "Approved" | "Rejected";

type Applicant = {
  id: number;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  applied: string;
  status: ApplicantStatus;
};

const [openMenu, setOpenMenu] = useState<number | null>(null);

const [applicants, setApplicants] = useState<Applicant[]>([
  {
    id: 1,
    name: "Sarah Chen",
    role: "Full Stack Developer",
    rating: 4.9,
    reviews: 47,
    applied: "2d ago",
    status: "Shortlisted",
  },
  {
    id: 2,
    name: "Marcus Williams",
    role: "Professional Electrician",
    rating: 4.8,
    reviews: 112,
    applied: "1d ago",
    status: "Applied",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Specialist",
    rating: 4.7,
    reviews: 28,
    applied: "4d ago",
    status: "Approved",
  },
]);

const updateStatus = (id: number, status: ApplicantStatus) => {
  setApplicants((prev) =>
    prev.map((app) =>
      app.id === id ? { ...app, status } : app
    )
  );
  setOpenMenu(null);
};

const statusStyles = {
  Applied: "bg-gray-100 text-gray-600",
  Shortlisted: "bg-green-50 text-green-600",
  Approved: "bg-blue-50 text-blue-600",
  Rejected: "bg-red-50 text-red-600",
};

  return (
    <div className="p-6 space-y-6">
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm"
          >
            <div className="p-3 bg-green-50 rounded-full mr-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.name}</p>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-gray-700 font-semibold mb-2">
            Applications Growth
          </h3>
          <Line data={lineData} />
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-gray-700 font-semibold mb-2">
            Top Jobs
          </h3>
          <Bar data={barData} />
        </div>
      </div>

{/* RECENT APPLICANTS */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100">
  {/* Header */}
  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
    <h3 className="text-gray-800 font-semibold text-lg">
      Recent Applicants
    </h3>
    <button className="text-green-600 text-sm font-medium hover:underline">
      View All →
    </button>
  </div>

  {/* Table Header */}
  <div className="grid grid-cols-5 px-6 py-3 text-sm text-gray-500 font-medium border-b border-gray-100">
    <span>Applicant</span>
    <span>Rating</span>
    <span>Applied</span>
    <span>Status</span>
    <span className="text-right">Actions</span>
  </div>

  <div className="divide-y divide-gray-100">
    {applicants.map((app) => (
      <div
        key={app.id}
        className="grid grid-cols-5 items-center px-6 py-4 hover:bg-gray-50 transition relative"
      >
        {/* Entire row clickable */}
        <button
          className="absolute inset-0 z-0"
          onClick={() => console.log("Open applicant profile")}
        />

        {/* Applicant Info */}
        <div className="relative z-10">
          <p className="font-medium text-gray-800">
            {app.name}
          </p>
          <p className="text-sm text-gray-500">
            {app.role}
          </p>
        </div>

        {/* Rating */}
        <div className="relative z-10 flex items-center gap-1 text-sm">
          <Star
            size={14}
            className="text-yellow-400 fill-yellow-400"
          />
          <span className="font-medium">
            {app.rating}
          </span>
          <span className="text-gray-400">
            ({app.reviews})
          </span>
        </div>

        {/* Applied */}
        <p className="relative z-10 text-sm text-gray-500">
          {app.applied}
        </p>

        {/* Status */}
        <span
          className={`relative z-10 text-sm px-3 py-1 rounded-md w-fit ${statusStyles[app.status]}`}
        >
          {app.status}
        </span>

        {/* Actions */}
        <div className="relative z-10 flex justify-end items-center gap-4">
          
          {/* View Button */}
          <button
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600"
            onClick={(e) => {
              e.stopPropagation();
              console.log("View clicked");
            }}
          >
            <Eye size={16} />
            View
          </button>

          {/* Three Dots */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenu(
                openMenu === app.id ? null : app.id
              );
            }}
            className="text-gray-500 hover:text-green-600"
          >
            <MoreHorizontal size={18} />
          </button>

          {/* Dropdown */}
          {openMenu === app.id && (
            <div className="absolute right-6 top-14 bg-white border rounded-lg shadow-lg w-44 z-20">
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Send Message");
                  setOpenMenu(null);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50"
              >
                <Mail size={14} />
                Send Message
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(app.id, "Shortlisted");
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
              >
                <CheckCircle size={14} />
                Shortlist
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(app.id, "Approved");
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
              >
                <CheckCircle size={14} />
                Approve
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(app.id, "Rejected");
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <XCircle size={14} />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>
    </div>
  );
};

export default EmployerDashboard;