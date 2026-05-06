import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, BookmarkMinus, User, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";

interface SavedCandidate {
  id: string;
  savedItemId: string;
  name: string;
  profession: string;
  location: string;
  bio: string;
  skills: string[];
  emptype: string;
  savedAt: string;
}

const EmployerSaved = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<SavedCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const fetchSaved = async () => {
      setLoading(true);

      // Fetch saved items where the employer saved a candidate (user_id)
      const { data: savedItems, error } = await supabase
        .from("saved_items")
        .select("id, candidate_id, created_at")
        .eq("user_id", user.id)
        .not("candidate_id", "is", null)
        .order("created_at", { ascending: false });

      if (error || !savedItems || savedItems.length === 0) {
        setCandidates([]);
        setLoading(false);
        return;
      }

      // Fetch profiles for those candidates
      const candidateIds = savedItems.map(s => s.candidate_id).filter(Boolean);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, profession, seeker_location, bio, skills, employment_type")
        .in("id", candidateIds);

      const profileMap: Record<string, any> = {};
      (profiles || []).forEach(p => { profileMap[p.id] = p; });

      const mapped: SavedCandidate[] = savedItems
        .filter(s => profileMap[s.candidate_id])
        .map(s => {
          const p = profileMap[s.candidate_id];
          return {
            id: s.candidate_id,
            savedItemId: s.id,
            name: `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Unknown",
            profession: p.profession || "Not specified",
            location: p.seeker_location || "Not specified",
            bio: p.bio || "",
            skills: Array.isArray(p.skills) ? p.skills : [],
            emptype: p.employment_type || "",
            savedAt: new Date(s.created_at).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" }),
          };
        });

      setCandidates(mapped);
      setLoading(false);
    };
    fetchSaved();
  }, [user?.id]);

  const handleRemove = async (savedItemId: string) => {
    setRemoving(savedItemId);
    const { error } = await supabase.from("saved_items").delete().eq("id", savedItemId);
    if (!error) {
      setCandidates(prev => prev.filter(c => c.savedItemId !== savedItemId));
      if (expandedId === savedItemId) setExpandedId(null);
    }
    setRemoving(null);
  };

  const q = search.toLowerCase();
  const filtered = candidates.filter(c =>
    !q || c.name.toLowerCase().includes(q) || c.profession.toLowerCase().includes(q)
  );

  return (
    <div className="bg-gray-50 min-h-screen p-10 max-w-[1152px] mx-auto font-sans text-gray-900 flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[30px] font-bold m-0 mb-2">Saved Candidates</h1>
          <p className="text-gray-500 m-0 text-base">
            {loading ? "Loading..." : `${candidates.length} candidate${candidates.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-72">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search saved candidates..."
            className="w-full py-2.5 pr-4 pl-10 bg-white border border-gray-200 rounded-lg font-sans text-sm outline-none text-gray-900 focus:border-gray-300 transition-colors"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-[3px] border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl py-16 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <User size={28} />
          </div>
          <p className="text-lg font-semibold text-gray-700 m-0 mb-1">
            {candidates.length === 0 ? "No saved candidates yet" : "No results found"}
          </p>
          <p className="text-sm text-gray-400 m-0">
            {candidates.length === 0 ? "Save candidates from the Find Talent section to see them here." : "Try adjusting your search."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(candidate => {
            const isExpanded = expandedId === candidate.savedItemId;
            return (
              <div
                key={candidate.savedItemId}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-sm"
              >
                {/* Collapsed row — always visible */}
                <div
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : candidate.savedItemId)}
                >
                  {/* Avatar initial */}
                  <div className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-base font-bold text-gray-700 font-mono flex-shrink-0">
                    {candidate.name.charAt(0)}
                  </div>

                  {/* Name + profession */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-gray-900 m-0 truncate">{candidate.name}</p>
                    <p className="text-sm text-gray-500 m-0 truncate">{candidate.profession}</p>
                  </div>

                  {/* Saved date */}
                  <span className="text-xs text-gray-400 font-medium flex-shrink-0 hidden sm:block">Saved {candidate.savedAt}</span>

                  {/* Expand icon */}
                  <div className="text-gray-400 flex-shrink-0">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-6 pb-5 pt-0 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={15} className="text-gray-400 flex-shrink-0" />
                        {candidate.location}
                      </div>
                      {candidate.emptype && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Briefcase size={15} className="text-gray-400 flex-shrink-0" />
                          {candidate.emptype}
                        </div>
                      )}
                    </div>

                    {candidate.bio && (
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed">{candidate.bio}</p>
                    )}

                    {candidate.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {candidate.skills.map(skill => (
                          <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemove(candidate.savedItemId); }}
                        disabled={removing === candidate.savedItemId}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 border-none rounded-lg font-medium cursor-pointer text-sm hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <BookmarkMinus size={16} />
                        {removing === candidate.savedItemId ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployerSaved;
