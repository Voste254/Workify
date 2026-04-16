import { Search, MapPin, Briefcase, BookmarkMinus, MessageSquare, ExternalLink } from "lucide-react";

const SAVED_CANDIDATES = [
  {
    id: 1,
    name: "Onyango Omondi",
    title: "Masonry & Construction Worker",
    location: "Kisumu, Kenya",
    salary: "KES 1,500 / day",
    skills: ["Masonry", "Plumbing", "Heavy Lifting"],
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    savedDate: "Saved 2 days ago",
    jobType: "Casual"
  },
  {
    id: 2,
    name: "Wanjiku Njoroge",
    title: "Senior Full Stack Engineer",
    location: "Nairobi, Kenya",
    salary: "KES 150k - 200k / month",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    savedDate: "Saved 1 week ago",
    jobType: "Full-Time"
  },
  {
    id: 3,
    name: "Kamau Mbugua",
    title: "Delivery Driver",
    location: "Thika, Kenya",
    salary: "KES 20,000 / month",
    skills: ["Valid License", "Logistics", "Time Management"],
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    savedDate: "Saved 2 weeks ago",
    jobType: "Contractual"
  },
  {
    id: 4,
    name: "Amina Hassan",
    title: "Customer Support Agent",
    location: "Mombasa, Kenya",
    salary: "KES 35,000 - 50,000 / month",
    skills: ["Communication", "Zendesk", "Problem Solving", "Bilingual"],
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026703d",
    savedDate: "Saved 1 month ago",
    jobType: "Part-Time"
  }
];

const EmployerSaved = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-10 max-w-[1152px] mx-auto font-sans text-gray-900 flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[30px] font-bold m-0 mb-2">Saved Candidates</h1>
          <p className="text-gray-500 m-0 text-base">Manage and review the talent profiles you've bookmarked.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-72">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search saved candidates..."
            className="w-full py-2.5 pr-4 pl-10 bg-white border border-gray-200 rounded-lg font-sans text-sm outline-none text-gray-900 focus:border-gray-300 transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-6">
        {SAVED_CANDIDATES.map(candidate => (
          <div key={candidate.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4 items-center">
                <img src={candidate.avatar} alt={candidate.name} className="w-16 h-16 rounded-full object-cover border border-gray-100" />
                <div>
                  <h3 className="text-[18px] font-semibold m-[0_0_4px] text-gray-900">{candidate.name}</h3>
                  <div className="flex items-center flex-wrap gap-2">
                    <p className="m-0 text-gray-600 text-sm font-medium">{candidate.title}</p>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-full tracking-[0.05em]">
                      {candidate.jobType}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                title="Remove from saved"
                className="cursor-pointer bg-transparent border-none text-gray-400 p-2 rounded-lg hover:bg-gray-50 hover:text-gray-600 transition-colors"
              >
                <BookmarkMinus size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-6 text-sm text-gray-600">
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

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto flex-wrap gap-4">
              <span className="text-xs text-gray-400 font-medium">{candidate.savedDate}</span>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 border-none rounded-lg font-medium cursor-pointer text-sm hover:bg-gray-200 transition-colors">
                  <MessageSquare size={16} />
                  Message
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white border-none rounded-lg font-medium cursor-pointer text-sm hover:bg-gray-800 transition-colors">
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
