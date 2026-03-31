import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  /** If provided, user must have this role in their profile */
  requiredRole?: UserRole;
  /** Where to send the user if they don't have the required role */
  redirectTo?: string;
}

export default function ProtectedRoute({
  requiredRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { session, profile, loading } = useAuth();

  // Still checking auth — show a minimal full-screen spinner
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid #e5e7eb",
            borderTopColor: "#111827",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not logged in → send to login
  if (!session) {
    return <Navigate to={redirectTo} replace />;
  }

  // Role check — only enforced once the profile has loaded
  if (requiredRole && profile && !profile.role.includes(requiredRole)) {
    // Send employers to employer dashboard and seekers to jobs
    const fallback = profile.role.includes("employer")
      ? "/EmployerDashboard"
      : "/jobs";
    return <Navigate to={fallback} replace />;
  }

  // All good — render the child route
  return <Outlet />;
}
