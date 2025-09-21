const AboutUs = () => {
  return (
    <section className="relative bg-white py-16 px-6 lg:px-20 h-screen">
      {/* Title */}
      <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center lg:text-left">
        ABOUT US
      </h2>

      <div className="relative flex flex-col lg:flex-row items-start lg:items-center">
        {/* Text Box */}
        <div className="relative bg-gray-200   p-8 lg:p-12 z-10 w-full lg:w-2/3">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
         Workify is a modern job platform built to connect employers and job seekers<br></br> in a simple, 
         fast, and reliable way. From permanent corporate positions to<br></br> short-term gigs and casual
          work, we make it easy for businesses to find the <br></br>right talent and for individuals to showcase 
          their skills, availability, and expected pay. <br></br>Our platform goes beyond job listings by offering 
          career blogs, educational reels,<br></br> and tools like an AI-powered CV builder to help users stand out
           and grow in their careers.<br></br><br></br>

        At Workify, our mission is to make opportunities more accessible and meaningful.<br></br> We believe that work
         should be flexible, transparent, and rewarding for everyone.<br></br> By bridging the gap between talent and 
         opportunity, we empower job seekers to <br></br>take control of their career paths and enable employers to hire
          with confidence thus creating <br></br>a thriving ecosystem where both people and businesses succeed.
          </p>
        </div>

        {/* Overlapping Image */}
        <div className="absolute right-0 top-1/3 transform -translate-y-1/2 z-20 hidden lg:block">
          <img
            src="https://i.ibb.co/gbH3GtgS/download-2.jpg"
            alt="Team working"
            className=" shadow-xl w-[650px] h-[600px] object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
