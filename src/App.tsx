import About from "./Components/pages/About";
import EmployeeDashboard from "./Components/pages/EmployeeDashboard";
import FeaturedJobs from "./Components/pages/Featured";
import Footer from "./Components/pages/Footer";
import Home from "./Components/pages/Home";
import Navbar from "./Components/pages/Navbar";
import Offer from "./Components/pages/Offer";
import Partners from "./Components/pages/Partners";
import Services from "./Components/pages/Services";
import {Route, Routes} from "react-router-dom"



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
    <Route path='/jobs' element={<EmployeeDashboard/>} />
  </Routes>

  )
}

export default App;
