import { Briefcase, Rocket, Wallet, Building2 } from "lucide-react";

const offerings = [
  {
    title: "Career Opportunities",
    description:
      "Find jobs and internships that match your skills and goals. We connect you directly with employers who value your potential. Whether you’re a fresh graduate or an experienced professional, Workify ensures you land in the right position that fuels your career growth.",
    icon: Briefcase,
    image:
      "https://i.ibb.co/1Yg5tN43/Career-growth-or-career-development-improvement-or-progress-to-success-in-work-job-promotion-and-sal.jpgdfsnd",
  },
  {
    title: "Support for Entrepreneurs",
    description:
      "Workify empowers innovators by helping them showcase their projects, get mentorship, and connect with investors or co-founders. We provide a platform where great ideas meet the right support, creating pathways for start-ups to thrive and scale globally.",
    icon: Rocket,
    image:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=60",
  },
  {
    title: "Freelancer Payments",
    description:
      "Easily get paid for your gigs and contracts. Our secure wallet system ensures that freelancers receive their payments safely and on time. We bridge the gap between clients and talent with transparent, hassle-free payment management for every project.",
    icon: Wallet,
    image:
      "https://images.unsplash.com/photo-1522205408450-add114ad53fe?auto=format&fit=crop&w=800&q=60",
  },
  {
    title: "Company Partnerships",
    description:
      "We collaborate with organizations to create career programs, upskilling workshops, and job placements for Workify users. By bridging education, skills, and employment, we help companies grow with the right talent while shaping the workforce of tomorrow.",
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=60",
  },
];

const Offerings = () => {
  return (
    <section className="py-20 bg-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-center text-indigo-600 font-semibold mb-2 uppercase tracking-wide">
          What We Offer
        </h3>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Empowering You with the Best Opportunities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {offerings.map((offer, index) => {
            const Icon = offer.icon;
            return (
              <div
                key={index}
                className="bg-white  overflow-hidden  hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-52 object-cover"
                  />
                  <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-all duration-300 group-hover:bg-indigo-600 group-hover:scale-110">
                    <Icon
                      className="text-indigo-600 transition-all duration-300 group-hover:text-white"
                      size={30}
                    />
                  </div>
                </div>

                {/* Text */}
                <div className="pt-12 pb-10 px-6 text-center min-h-[280px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {offer.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {offer.description}
                    </p>
                  </div>
                  <a
                    href="#"
                    className="text-indigo-600 text-sm font-medium hover:underline inline-flex items-center justify-center mt-6"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Offerings;
