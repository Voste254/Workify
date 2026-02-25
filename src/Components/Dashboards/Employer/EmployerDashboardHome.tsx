
import { Users, Briefcase, CheckCircle, Activity } from "lucide-react";
import { Line, Bar } from "react-chartjs-2";
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
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-gray-700 font-semibold mb-4">
          Recent Applicants
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
            <div>
              <p className="font-medium text-gray-800">John Doe</p>
              <p className="text-gray-500 text-sm">Software Engineer</p>
            </div>
            <p className="text-gray-500 text-sm">Applied 2h ago</p>
          </div>
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
            <div>
              <p className="font-medium text-gray-800">Jane Smith</p>
              <p className="text-gray-500 text-sm">UI/UX Designer</p>
            </div>
            <p className="text-gray-500 text-sm">Applied 4h ago</p>
          </div>
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
            <div>
              <p className="font-medium text-gray-800">Michael Lee</p>
              <p className="text-gray-500 text-sm">Frontend Developer</p>
            </div>
            <p className="text-gray-500 text-sm">Applied 6h ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;