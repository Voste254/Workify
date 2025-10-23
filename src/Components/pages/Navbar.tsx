import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menus = [
    { name: "Home", items: ["Overview", "Features", "Why Us?"] },
    { name: "Find Jobs", items: ["All Jobs", "By Category", "By Location"] },
    { name: "Employers", items: ["Post a Job", "Employer Dashboard"] },
    { name: "Candidates", items: ["Browse Candidates", "Candidate Dashboard"] },
    { name: "Blog", items: ["Latest Posts", "Career Tips"] },
    { name: "Pages", items: ["About Us", "Contact", "FAQ"] },
  ];

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
            <li
              key={index}
              className="relative group"
              onMouseEnter={() => setOpenMenu(index)}
              onMouseLeave={() => setOpenMenu(index)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-green-600 font-medium transition">
                {menu.name}
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openMenu === index ? "rotate-180 text-green-600" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {openMenu === index && (
                <div
                  className="absolute left-0 top-full mt-2 w-48 bg-white border shadow-lg rounded-lg p-2 z-[200] transition-all duration-300"
                  onMouseEnter={() => setOpenMenu(index)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  {menu.items.map((item, i) => (
                    <a
                      key={i}
                      href="#"
                      className="block px-4 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded transition"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex space-x-4">
          <button className="px-5 py-2 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition">
            Signup
          </button>
          <button className="px-5 py-2 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition">
            Login
          </button>
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
              <button
                onClick={() =>
                  setOpenMenu(openMenu === index ? null : index)
                }
                className="w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-green-50 hover:text-green-600 flex justify-between items-center"
              >
                <span>{menu.name}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openMenu === index ? "rotate-180 text-green-600" : ""
                  }`}
                />
              </button>

              {/* Dropdown for Mobile */}
              {openMenu === index && (
                <div className="pl-6 pb-2 transition-all duration-300">
                  {menu.items.map((item, i) => (
                    <a
                      key={i}
                      href="#"
                      className="block px-2 py-2 text-gray-600 hover:text-green-600 transition"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Mobile Buttons */}
          <div className="flex flex-col space-y-2 p-4">
            <button className="px-5 py-2 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition">
              Signup
            </button>
            <button className="px-5 py-2 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
