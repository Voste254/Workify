import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#242424] text-white font-sans px-6 sm:px-10 md:px-12 lg:px-24 pt-16 pb-8 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start w-full gap-10">
        {/* LEFT SIDE: About, Contact, Social */}
        <section className="flex flex-col md:flex-row flex-wrap md:space-x-10 w-full md:w-1/2">
          {/* Column 1 */}
          <div className="flex flex-col items-start mb-8 md:mb-0 text-left w-full sm:w-40">
            <h2 className="mb-4 text-lg font-semibold">About Us</h2>
            <Link to="/sign-up" className="hover:text-gray-300 mb-2">How we operate</Link>
            <Link to="/" className="hover:text-gray-300 mb-2">Testimonials</Link>
            <Link to="/" className="hover:text-gray-300 mb-2">Vision</Link>
            <Link to="/" className="hover:text-gray-300 mb-2">Trustees</Link>
            <Link to="/" className="hover:text-gray-300 mb-2">Mode of operation</Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-start mb-8 md:mb-0 text-left w-full sm:w-40">
            <h2 className="mb-4 text-lg font-semibold">Contact Us</h2>
            <Link to="/" className="hover:text-gray-300 mb-2">Contact</Link>
            <Link to="/" className="hover:text-gray-300 mb-2">Queries</Link>
            <Link to="/" className="hover:text-gray-300 mb-2">Follow-ups</Link>
            <Link to="/" className="hover:text-gray-300 mb-2">Sponsorships</Link>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-start text-left w-full sm:w-40">
            <h2 className="mb-4 text-lg font-semibold">Social Media</h2>
            <Link to="/" className="hover:text-gray-300 mb-2">Instagram</Link>
            <Link to="/" className="hover:text-gray-300 mb-2">Facebook</Link>
            <Link to="/" className="hover:text-gray-300 mb-2">YouTube</Link>
            <Link to="/" className="hover:text-gray-300 mb-2">X</Link>
          </div>
        </section>

        {/* Subscription Form */}
        <section className="text-center md:text-right mt-4 md:mt-0 w-full md:w-1/2">
          <div className="text-white w-full max-w-md md:max-w-full mx-auto md:ml-auto">
            <p className="text-xl mb-4">
              Register here to receive notifications for new arrivals
            </p>
            <p className="text-lg mb-6 text-gray-300">You can opt out any time.</p>
            <form className="flex flex-col sm:flex-row md:justify-end items-center gap-4 w-full">
              <input
                className="px-4 py-2 w-full sm:w-auto flex-grow text-lg rounded border border-white bg-transparent placeholder:text-gray-400 focus:outline-none"
                type="email"
                placeholder="Your Email"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-gray-300 transition"
              >
                Register
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* SOCIAL ICONS */}
      <section className="w-full mt-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center gap-6">
          {/* Logo */}
          <div className="text-2xl flex items-center space-x-2">
            <i className="fas fa-briefcase" />
            <span>WORKIFY</span>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-6 text-2xl">
            <Link to="/" className="hover:text-gray-300">
              <i className="fab fa-facebook-f" />
            </Link>
            <Link to="/" className="hover:text-gray-300">
              <i className="fab fa-instagram" />
            </Link>
            <Link to="/" className="hover:text-gray-300">
              <i className="fab fa-youtube" />
            </Link>
            <Link to="/" className="hover:text-gray-300">
              <i className="fab fa-twitter" />
            </Link>
            <Link to="/" className="hover:text-gray-300">
              <i className="fab fa-linkedin" />
            </Link>
          </div>
        </div>
      </section>

      {/* COPYRIGHT */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Workify. All rights reserved.
      </div>
    </footer>
  );
}
