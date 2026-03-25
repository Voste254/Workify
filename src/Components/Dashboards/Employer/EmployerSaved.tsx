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
    <div style={{ padding: "40px", maxWidth: "1152px", margin: "0 auto", fontFamily: "'DM Sans', sans-serif", color: "#111827", display: "flex", flexDirection: "column", gap: "32px", boxSizing: "border-box" }}>
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "30px", fontWeight: "700", margin: "0 0 8px 0" }}>Saved Candidates</h1>
          <p style={{ color: "#6b7280", margin: "0", fontSize: "16px" }}>Manage and review the talent profiles you've bookmarked.</p>
        </div>
        
        {/* Search */}
        <div style={{ position: "relative", width: "288px" }}>
          <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input 
            type="text" 
            placeholder="Search saved candidates..."
            style={{ width: "100%", padding: "10px 16px 10px 40px", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", fontFamily: "inherit", fontSize: "14px", boxSizing: "border-box", outline: "none", color: "#111827" }}
          />
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "24px" }}>
        {SAVED_CANDIDATES.map(candidate => (
          <div key={candidate.id} style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <img src={candidate.avatar} alt={candidate.name} style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: "1px solid #f3f4f6" }} />
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 4px 0", color: "#111827" }}>{candidate.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                    <p style={{ margin: 0, color: "#4b5563", fontSize: "14px", fontWeight: "500" }}>{candidate.title}</p>
                    <span style={{ padding: "2px 8px", backgroundColor: "#eef2ff", color: "#4f46e5", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", borderRadius: "9999px", letterSpacing: "0.05em" }}>
                      {candidate.jobType}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                title="Remove from saved"
                style={{ cursor: "pointer", background: "none", border: "none", color: "#9ca3af", padding: "8px", borderRadius: "8px" }}
              >
                <BookmarkMinus size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px", fontSize: "14px", color: "#4b5563" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin size={16} style={{ color: "#9ca3af" }} />
                <span>{candidate.location}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Briefcase size={16} style={{ color: "#9ca3af" }} />
                <span>{candidate.salary}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
              {candidate.skills.map(skill => (
                <span key={skill} style={{ padding: "4px 12px", backgroundColor: "#f3f4f6", color: "#374151", fontSize: "12px", fontWeight: "500", borderRadius: "9999px" }}>
                  {skill}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid #f3f4f6", marginTop: "auto", flexWrap: "wrap", gap: "16px" }}>
              <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "500" }}>{candidate.savedDate}</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", backgroundColor: "#f3f4f6", color: "#374151", border: "none", borderRadius: "8px", fontFamily: "inherit", fontWeight: "500", cursor: "pointer", fontSize: "14px" }}>
                  <MessageSquare size={16} />
                  Message
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", backgroundColor: "#111827", color: "#ffffff", border: "none", borderRadius: "8px", fontFamily: "inherit", fontWeight: "500", cursor: "pointer", fontSize: "14px" }}>
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
