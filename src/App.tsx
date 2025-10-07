import About from "./Components/pages/About";
import Footer from "./Components/pages/Footer";
import Home from "./Components/pages/Home";
import Navbar from "./Components/pages/Navbar";
import Offer from "./Components/pages/Offer";
import Services from "./Components/pages/Services";



function App() {
  return (
    <div>
    <Navbar/>
    <Home/>
    <About/>
    <Services/>
    <Offer/>
    <Footer/>
    </div> 

  );
}

export default App;
