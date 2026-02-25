import About from "./Components/pages/About";
import Employee from "./Components/Dashboards/Employee/DashboardLayout";
import FeaturedJobs from "./Components/pages/Featured";
import Footer from "./Components/pages/Footer";
import Home from "./Components/pages/Home";
import Navbar from "./Components/pages/Navbar";
import Offer from "./Components/pages/Offer";
import Partners from "./Components/pages/Partners";
import Services from "./Components/pages/Services";
import {Route, Routes} from "react-router-dom"
import Login  from "./Components/pages/Login";
import Employer from "./Components/Dashboards/Employer/EmployerDashboardLayout";



function Landing() {
  return (
    <div>
    <Navbar/>
    <Home/>
    <About/>
    <Services/>
    <FeaturedJobs/>
    <Offer/>
    <Partners/>
    <Footer/>
    </div> 

  );
}

function App(){
  return (
  <Routes>
    <Route path='/' element={<Landing/>} />
    <Route path='/jobs' element={<Employee/>} />
    <Route path='/EmployerDashboard' element={<Employer/>}></Route>
  <Route
        path="/login"
        element={
          <>
            <Login />
            <Footer />
          </>
        }
      />
  </Routes>

  )
}

export default App;
