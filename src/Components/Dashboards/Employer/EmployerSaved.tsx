import { Search, MapPin, Briefcase, BookmarkMinus, MessageSquare, ExternalLink } from "lucide-react";

const SAVED_CANDIDATES = [
  {
    id: 1,
    name: "Alex Johnson",
    title: "Senior Full Stack Engineer",
    location: "New York, NY",
    salary: "$120k - $150k",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    savedDate: "Saved 2 days ago"
  },
  {
    id: 2,
    name: "Samantha Lee",
    title: "Product Designer",
    location: "San Francisco, CA",
    salary: "$110k - $130k",
    skills: ["Figma", "UI/UX", "Prototyping", "User Research"],
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    savedDate: "Saved 1 week ago"
  },
  {
    id: 3,
    name: "Michael Chen",
    title: "Data Scientist",
    location: "Remote",
    salary: "$130k - $160k",
    skills: ["Python", "Machine Learning", "SQL", "Tableau"],
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    savedDate: "Saved 2 weeks ago"
  },
  {
    id: 4,
    name: "Emily Davis",
    title: "Digital Marketing Manager",
    location: "Chicago, IL",
    salary: "$85k - $105k",
    skills: ["SEO", "Content Strategy", "Google Ads", "Analytics"],
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026703d",
    savedDate: "Saved 1 month ago"
  }
];

const EmployerSaved = () => {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 font-sans text-gray-900">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Candidates</h1>
          <p className="text-gray-500 mt-2">Manage and review the talent profiles you've bookmarked.</p>
        </div>
        
        {/* Search / Filter */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search saved candidates..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SAVED_CANDIDATES.map(candidate => (
          <div key={candidate.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4 items-center">
                <img src={candidate.avatar} alt={candidate.name} className="w-16 h-16 rounded-full object-cover border border-gray-100" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                  <p className="text-gray-600 font-medium">{candidate.title}</p>
                </div>
              </div>
              <button 
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                title="Remove from saved"
              >
                <BookmarkMinus size={20} />
              </button>
            </div>

            <div className="space-y-2 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-gray-400" />
                <span>{candidate.salary}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {candidate.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400 font-medium">{candidate.savedDate}</span>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition text-sm">
                  <MessageSquare size={16} />
                  Message
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition text-sm">
                  <ExternalLink size={16} />
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default EmployerSaved;
