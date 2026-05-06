import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminProtectedRoute = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to login if not logged in at all
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if not an admin
  if (profile && !profile.is_admin) {
    console.warn("Access denied: User is not an admin", profile);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
