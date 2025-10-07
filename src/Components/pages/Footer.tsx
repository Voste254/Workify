
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="bg-[#242424] pl-24 pt-16 pb-8 flex flex-row justify-center items-center text-white font-sans">
 <section>
          <section className="w-full flex flex-col items-center text-center px-4">
        <div className="w-full max-w-[1000px] flex flex-col md:flex-row justify-center">
          <div className="flex flex-col md:flex-row md:space-x-10">
            {/* Column 1 */}
            <div className="flex flex-col items-start mb-8 md:mb-0 text-left w-40">
              <h2 className="mb-4 text-lg font-semibold">About Us</h2>
              <Link to="/sign-up" className="hover:text-gray-300 mb-2">How we operate</Link>
              <Link to="/" className="hover:text-gray-300 mb-2">Testimonials</Link>
              <Link to="/" className="hover:text-gray-300 mb-2">Vision</Link>
              <Link to="/" className="hover:text-gray-300 mb-2">Trustees</Link>
              <Link to="/" className="hover:text-gray-300 mb-2">Mode of operation</Link>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col items-start mb-8 md:mb-0 text-left w-40">
              <h2 className="mb-4 text-lg font-semibold">Contact Us</h2>
              <Link to="/" className="hover:text-gray-300 mb-2">Contact</Link>
              <Link to="/" className="hover:text-gray-300 mb-2">Queries</Link>
              <Link to="/" className="hover:text-gray-300 mb-2">Follow-ups</Link>
              <Link to="/" className="hover:text-gray-300 mb-2">Sponsorships</Link>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col items-start text-left w-40">
              <h2 className="mb-4 text-lg font-semibold">Social Media</h2>
              <Link to="/" className="hover:text-gray-300 mb-2">Instagram</Link>
              <Link to="/" className="hover:text-gray-300 mb-2">Facebook</Link>
              <Link to="/" className="hover:text-gray-300 mb-2">YouTube</Link>
              <Link to="/" className="hover:text-gray-300 mb-2">X</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Icons */}
      <section className="w-full max-w-[1000px] mt-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center w-full">
          {/* Logo */}
          <div className="text-2xl mb-6 md:mb-0 flex items-center space-x-2">
            <i className="fas fa-shopping-cart" />
            <span>FALLS</span>
          </div>

          {/* Icons */}
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
 </section>


      {/* Subscription Form */}
      <section className="text-center mt-12 px-4 w-full">
        <div className="text-white max-w-xl mx-auto">
          <p className="text-xl mb-4">
            Register here to receive notifications for new arrivals
          </p>
          <p className="text-lg mb-6">You can opt out any time.</p>
          <form className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              className="px-5 py-2 text-lg rounded border border-white bg-transparent placeholder:text-gray-400 focus:outline-none"
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
  );
}

