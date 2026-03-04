import { useState } from "react";
import DashboardCharts from "./Charts/DashboardCharts";
import RecentApplicants from "./Applicants";
import { useMemo } from "react";
import type {
  Applicant,
  ApplicantStatus,
} from "./Applicants";

const EmployerDashboard = () => {
  const [applicants, setApplicants] =
    useState<Applicant[]>([
      {
        id: 1,
        name: "Sarah Chen",
        role: "Full Stack Developer",
        rating: 4.9,
        reviews: 47,
        applied: "2d ago",
        status: "Shortlisted",
      },
    ]);

  const handleStatusChange = (
    id: number,
    status: ApplicantStatus
  ) => {
    setApplicants((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status }
          : app
      )
    );
  };

  const lineData = useMemo(() => ({
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Applications",
      data: [12, 19, 14, 20, 25, 30],
      borderColor: "#16a34a",
      backgroundColor: "#16a34a",
    },
  ],
}), []);

const barData = useMemo(() => ({
  labels: ["Job A", "Job B", "Job C", "Job D"],
  datasets: [
    {
      label: "Applications",
      data: [12, 9, 15, 7],
      backgroundColor: "#16a34a",
    },
  ],
}), []);

  return (
    <div className="p-6 space-y-6">
      <DashboardCharts
        lineData={lineData}
        barData={barData}
      />

      <RecentApplicants
        applicants={applicants}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default EmployerDashboard;