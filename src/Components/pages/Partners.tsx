import { MapPin } from "lucide-react";

const companies = [
 
  {
    name: "Google",
    logo: "https://i.ibb.co/1STNwHB/google.jpg",
    location: "California, USA",
    rating: 4.8,
  },
    {
    name: "Equity Bank",
    logo: "https://img.logo.dev/equitybankgroup.com",
    location: "Nairobi, Kenya",
    rating: 4.5,
  },

  {
    name: "Amazon",
    logo: "https://img.logo.dev/amazon.com",
    location: "USA",
    rating: 4.6,
  },
    {
    name: "Twiga Foods",
    logo: "https://img.logo.dev/twiga.com",
    location: "Nairobi, Kenya",
    rating: 4.3,
  },
  {
    name: "Samsung",
    logo: "https://img.logo.dev/samsung.com",
    location: "Seoul, South Korea",
    rating: 4.5,
  },

  {
    name: "Oracle",
    logo: "https://img.logo.dev/oracle.com",
    location: "USA",
    rating: 4.3,
  },
  {
    name: "Intel",
    logo: "https://img.logo.dev/intel.com",
    location: "California, USA",
    rating: 4.3,
  },
  {
    name: "Sony",
    logo: "https://img.logo.dev/sony.com",
    location: "Tokyo, Japan",
    rating: 4.5,
  },
    {
    name: "KCB Group",
    logo: "https://img.logo.dev/kcbgroup.com",
    location: "Nairobi, Kenya",
    rating: 4.4,
  },


  {
    name: "MTN Group",
    logo: "https://img.logo.dev/mtn.com",
    location: "South Africa",
    rating: 4.4,
  },
  {
    name: "Flutterwave",
    logo: "https://img.logo.dev/flutterwave.com",
    location: "Nigeria",
    rating: 4.6,
  },
    {
    name: "IBM",
    logo: "https://img.logo.dev/ibm.com",
    location: "New York, USA",
    rating: 4.4,
  },
  {
    name: "Andela",
    logo: "https://img.logo.dev/andela.com",
    location: "Remote (Africa)",
    rating: 4.7,
  },
    {
    name: "Microsoft",
    logo: "https://img.logo.dev/microsoft.com",
    location: "Washington, USA",
    rating: 4.7,
  },
  {
    name: "Safaricom",
    logo: "https://img.logo.dev/safaricom.co.ke",
    location: "Nairobi, Kenya",
    rating: 4.8,
  },

  {
    name: "Cellulant",
    logo: "https://img.logo.dev/cellulant.io",
    location: "Nairobi, Kenya",
    rating: 4.2,
  },
];


const Partners = () => {
  return (
    <section className="py-16 bg-white px-6 md:px-10 lg:px-20">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Our Trusted Partners
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {companies.map((company, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl hover:border-green-700 transition-all duration-300 flex items-center space-x-4 p-5"
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center p-2">
              <img
                src={company.logo}
                alt={company.name}
                className="w-10 h-10 object-contain"
                onError={(e) =>
                  (e.currentTarget.src =
                    'https://via.placeholder.com/80x80?text=Logo')
                }
              />
            </div>

            <div>
              <div className="flex items-center space-x-1 text-yellow-400 mb-1">
                <span>★</span>
                <span className="text-gray-500 text-sm">
                  {company.rating.toFixed(1)}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">{company.name}</h3>
              <p className="text-gray-500 text-sm flex items-center mt-1">
                <MapPin size={14} className="mr-1 text-gray-400" />
                {company.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Partners;
