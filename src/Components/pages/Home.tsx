const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">

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
            <span className="text-blue-600 underline-offset-auto">Career</span> with Workify
          </h1>

          <p className="mt-6 text-gray-500 max-w-lg">
            Connect with real opportunities, trusted employers, and grow your
            skills. Workify helps job seekers and companies find the perfect
            match faster.
          </p>

          {/* BUTTONS */}
          <div className="flex items-center gap-6 mt-8">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Get Started
            </button>

            <div className="flex items-center gap-3 cursor-pointer">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Learn more
            </button>
              
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 mt-10 md:mt-0 flex justify-center md:justify-end z-10">
          <img
            src="https://i.ibb.co/yckWrtfW/image.png"
            alt="Workify platform"
            className="w-[90%] max-w-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;