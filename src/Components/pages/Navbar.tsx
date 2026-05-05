import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const menus = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Services", href: "/#services" },
    { name: "Featured Jobs", href: "/#jobs" },
    { name: "FAQ", href: "/faq" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname === "/") {
      const id = href.replace("/#", "");
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    }
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-[100]">
      <div className="max-w-[100vw] flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 py-4">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl md:text-3xl font-bold text-green-600">
            Workify
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-8 relative">
          {menus.map((menu, index) => (
            <li key={index} className="relative group">
              <Link
                to={menu.href}
                onClick={(e) => handleNavClick(e, menu.href)}
                className="text-gray-700 hover:text-green-600 font-medium transition"
              >
                {menu.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex space-x-4">
          <Link to='/signup'>
            <button className="px-5 py-2 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition">
              Signup
            </button>
          </Link>

          <Link to='/login'>
            <button className="px-5 py-2 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition">
              Login
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="focus:outline-none"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t shadow-md">
          {menus.map((menu, index) => (
            <div key={index} className="border-b">
              <Link
                to={menu.href}
                onClick={(e) => handleNavClick(e, menu.href)}
                className="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-green-50 hover:text-green-600 transition"
              >
                {menu.name}
              </Link>
            </div>
          ))}

          {/* Mobile Buttons */}
          <div className="flex flex-col space-y-2 p-4">
            <Link to='/signup'>
              <button className="w-full px-5 py-2 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition">
                Signup
              </button>
            </Link>
            <Link to='/login'>
              <button className="w-full px-5 py-2 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition">
                Login
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
