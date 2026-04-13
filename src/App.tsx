import About from "./Components/pages/About";
import Employee from "./Components/Dashboards/Employee/DashboardLayout";
import FeaturedJobs from "./Components/pages/Featured";
import Footer from "./Components/pages/Footer";
import Home from "./Components/pages/Home";
import Navbar from "./Components/pages/Navbar";
import Offer from "./Components/pages/Offer";
import Partners from "./Components/pages/Partners";
import Services from "./Components/pages/Services";
import FAQ from "./Components/pages/FAQ";
import { Route, Routes } from "react-router-dom";
import Login from "./Components/pages/Authentication/Login";
import Signup from "./Components/pages/Authentication/SignupWizard";
import Employer from "./Components/Dashboards/Employer/EmployerDashboardLayout";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";

function Landing() {
  return (
    <div>
      <Navbar />
      <Home />
      <About />
      <Services />
      <FeaturedJobs />
      <Offer />
      <Partners />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/faq" element={<><Navbar /><FAQ /></>} />

        {/* Protected routes — must be logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Employee />} />
          <Route path="/EmployerDashboard" element={<Employer />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
