import { Briefcase, Users, FileText, TrendingUp, Search, CheckCircle } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative w-full min-h-screen flex items-center overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gray-50"></div>

      {/* DIAGONAL COLOR SHAPE */}
      <div
        className="absolute inset-0 bg-blue-100"
        style={{
          clipPath: "polygon(0 0, 70% 0, 30% 100%, 0% 100%)",
        }}
      ></div>

      {/* CONTENT */}
      <div className="relative w-full flex flex-col md:flex-row items-center px-8 md:px-20">

        {/* LEFT */}
        <div className="flex-1 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Transform Your{" "}
            <span className="text-green-600 underline-offset-auto">Career</span> with Workify
          </h1>

          <p className="mt-6 text-gray-500 max-w-lg">
            Connect with real opportunities, trusted employers, and grow your
            skills. Workify helps job seekers and companies find the perfect
            match faster.
          </p>

          {/* BUTTONS */}
          <div className="flex items-center gap-6 mt-8">
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition">
              Get Started
            </button>

            <div className="flex items-center gap-3 cursor-pointer">
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition">
              Learn more
            </button>
              
            </div>
          </div>
        </div>

        {/* RIGHT — Icon-based illustration */}
        <div className="flex-1 mt-10 md:mt-0 flex justify-center md:justify-end z-10">
          <div className="relative w-[90%] max-w-md">
            {/* Main card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                  <Briefcase size={24} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">Find Your Dream Job</p>
                  <p className="text-sm text-gray-400">800+ new jobs every day</p>
                </div>
              </div>

              {/* Search bar mock */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6">
                <Search size={18} className="text-gray-400" />
                <span className="text-sm text-gray-400">Search jobs, companies...</span>
              </div>

              {/* Mini cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Users size={18} />, label: "5K+ Employers", color: "bg-blue-50 text-blue-600" },
                  { icon: <FileText size={18} />, label: "AI CV Builder", color: "bg-purple-50 text-purple-600" },
                  { icon: <TrendingUp size={18} />, label: "Career Growth", color: "bg-amber-50 text-amber-600" },
                  { icon: <CheckCircle size={18} />, label: "Verified Jobs", color: "bg-green-50 text-green-600" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 rounded-lg p-3 ${item.color}`}>
                    {item.icon}
                    <span className="text-xs font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-green-600 text-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-semibold">
              <CheckCircle size={16} /> Trusted Platform
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;