import { useState, useEffect } from "react";

const backgrounds = [
  "https://i.ibb.co/5hHC32XF/dwn.jpg",
  "https://i.ibb.co/h1KLQM6d/download.jpg",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?fit=crop&w=1400&q=80",
];

const WorkifyLanding = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-start text-white overflow-hidden"
      style={{
        backgroundImage: `url(${backgrounds[index]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl w-full px-4 sm:px-6 md:px-12 lg:px-16 py-20 md:py-32">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Your Job search <br className="hidden sm:inline" /> Ends here
        </h1>

        {/* Subtext */}
        <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl">
          Workify is a true performance-based job board. Enjoy custom hiring
          products and access to thousands of new resume registrations daily —
          with no subscriptions or user licences.
        </p>

        {/* Search Box */}
        <div className="mt-10 bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col md:flex-row items-center gap-4 w-full max-w-5xl">
          {/* Job input */}
          <input
            type="text"
            placeholder="Job title, key words or company"
            className="flex-grow w-full p-4 border border-gray-300 rounded-lg text-gray-800 focus:ring-green-500 focus:border-green-500"
          />

          {/* Location selector */}
          <select className="w-full md:w-56 p-4 border border-gray-300 rounded-lg text-gray-800 focus:ring-green-500 focus:border-green-500">
            <option>All Location</option>
            <option>Nairobi, Kenya</option>
            <option>London, UK</option>
            <option>New York, USA</option>
          </select>

          {/* Button */}
          <button className="w-full md:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-300">
            Find Jobs
          </button>
        </div>

        {/* Popular Tags */}
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-300">
          <span className="font-medium text-gray-200">Popular:</span>
          {["Designer", "Developer", "Tester", "Writer", "Project Manager"].map(
            (tag) => (
              <a
                key={tag}
                href="#"
                className="underline-offset-4 hover:underline hover:text-white transition"
              >
                {tag}
              </a>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkifyLanding;
