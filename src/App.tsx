import About from "./Components/pages/About";
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
  </Routes>

  )
}

export default App;
