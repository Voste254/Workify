import { useState, useMemo, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";

// ── Types & Config ─────────────────────────────────────────────────────────────
interface Candidate {
  id: string; userId: string; name: string; role: string; location: string; rate: string;
  rating: number; reviews: number; skills: string[]; image: string; isSaved: boolean; available: string; bio: string;
}

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  search: I('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>', 14),
  bookmark: (f: boolean) => I('<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>', 14, f ? "currentColor" : "none"),
  location: I('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', 12),
  star: I('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', 12, "currentColor"),
  mail: I('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>', 12),
  close: I('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', 14),
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const sectionLabel = "m-[0_0_8px] text-[13px] font-bold uppercase tracking-[0.1em] text-gray-400 font-sans";
const iconBtn = (colorClass = "text-gray-500") => `bg-transparent border border-gray-200 rounded-md px-2 py-1.5 cursor-pointer flex items-center ${colorClass} hover:bg-gray-50 transition-colors`;

// ── Candidate Card ─────────────────────────────────────────────────────────────
function CandidateCard({ cand, selected, onSelect, onBookmark }: { cand: Candidate; selected: boolean; onSelect: () => void; onBookmark: () => void }) {
  return (
    <div onClick={onSelect} className={`bg-white border-[1.5px] rounded-lg px-[18px] py-4 cursor-pointer transition-colors duration-150 relative ${selected ? "border-gray-900" : "border-gray-200"}`}>
      <div className="flex gap-3">
        <img src={cand.image} alt={cand.name} className="w-11 h-11 rounded-[10px] border-[1.5px] border-gray-200 object-cover" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between mb-0.5">
            <p className="m-0 text-base font-semibold text-gray-900">{cand.name}</p>
            <button onClick={e => { e.stopPropagation(); onBookmark(); }} className={`bg-transparent border-none cursor-pointer p-0.5 hover:opacity-80 transition-opacity ${cand.isSaved ? "text-amber-600" : "text-gray-400"}`}>
              {Ico.bookmark(cand.isSaved)}
            </button>
          </div>
          <p className="m-0 text-sm text-gray-500">{cand.role}</p>
          <div className="flex gap-2.5 mt-2 flex-wrap">
            <span className="flex items-center gap-[3px] text-[13px] text-gray-400">{Ico.location} {cand.location}</span>
            <span className="flex items-center gap-[3px] text-[13px] text-amber-600 font-semibold">{Ico.star} {cand.rating} <span className="text-gray-400 font-normal">({cand.reviews})</span></span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {cand.skills.map(s => <span key={s} className="text-xs text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded font-medium">{s}</span>)}
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm font-semibold text-gray-900">{cand.rate}</span>
            <span className="text-xs text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded font-semibold uppercase">{cand.available}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Star Rating Component ────────────────────────────────────────────────────────
function InteractiveStars({ rating, onRate }: { rating: number, onRate: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5 cursor-pointer" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map(star => {
        const isFilled = star <= (hover || Math.round(rating));
        return (
          <span
            key={star}
            onMouseEnter={() => setHover(star)}
            onClick={() => onRate(star)}
            className={`flex items-center transition-colors duration-100 ${isFilled ? "text-amber-600" : "text-gray-200"}`}
            title={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            {Ico.star}
          </span>
        );
      })}
    </div>
  );
}

// ── Detail Panel ───────────────────────────────────────────────────────────────
function DetailPanel({ cand, onClose, onBookmark, onRate, onMessage, onInvite }: { 
  cand: Candidate; 
  onClose: () => void; 
  onBookmark: () => void; 
  onRate: (r: number) => void;
  onMessage: () => void;
  onInvite: () => void;
}) {
  return (
    <div className="bg-white border-[1.5px] border-gray-200 rounded-[10px] h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-[18px] border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <img src={cand.image} alt={cand.name} className="w-11 h-11 rounded-[10px] border-[1.5px] border-gray-200 object-cover" />
            <div>
              <p className="m-0 text-[17px] font-bold text-gray-900">{cand.name}</p>
              <p className="m-0 text-sm text-gray-500">{cand.role}</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button onClick={onBookmark} className={iconBtn(cand.isSaved ? "text-amber-600" : "text-gray-400")}>{Ico.bookmark(cand.isSaved)}</button>
            <button onClick={onClose} className={iconBtn()}>{Ico.close}</button>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold px-2.5 py-1 rounded text-amber-600 bg-amber-50">
            <InteractiveStars rating={cand.rating} onRate={onRate} />
            <span>{cand.rating.toFixed(1)} ({cand.reviews} reviews)</span>
          </div>
          <span className="text-[13px] px-2.5 py-1 rounded text-gray-700 bg-gray-100 font-medium">{cand.location}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-[18px]">

        <p className={sectionLabel}>Quick Actions</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button 
            onClick={onMessage}
            className="p-2 bg-gray-900 text-white border-none rounded-md text-sm font-semibold cursor-pointer font-sans flex items-center justify-center gap-1.5 hover:bg-gray-800 transition-colors"
          >
            {Ico.mail} Message
          </button>
          <button 
            onClick={onInvite}
            className="p-2 bg-white text-gray-900 border border-gray-200 rounded-md text-sm font-semibold cursor-pointer font-sans hover:bg-gray-50 transition-colors"
          >
            Invite to Apply
          </button>
        </div>

        <p className={sectionLabel}>About</p>
        <p className="m-[0_0_20px] text-sm text-gray-700 leading-[1.6]">
          {cand.bio
            ? cand.bio
            : `${cand.name} is a highly experienced ${cand.role.toLowerCase()} with a proven track record of delivering scalable solutions. Available ${cand.available.toLowerCase()} for new opportunities.`
          }
        </p>

        <p className={sectionLabel}>Skills</p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {cand.skills.map(s => <span key={s} className="text-[13px] text-gray-700 border border-gray-200 px-2 py-1 rounded bg-white font-medium">{s}</span>)}
        </div>

        <p className={sectionLabel}>Details</p>
        <div className="grid grid-cols-2 gap-2">
          {[["Hourly Rate", cand.rate], ["Availability", cand.available]].map(([label, value]) => (
            <div key={label} className="px-3 py-2.5 rounded-md bg-gray-50 border border-gray-200">
              <p className="m-[0_0_2px] text-xs text-gray-400 uppercase tracking-[0.08em]">{label}</p>
              <p className="m-0 text-sm font-semibold text-gray-900 font-mono">{value}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function FindTalent() {
  const { user, profile: employerProfile } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [ratedIds, setRatedIds] = useState<string[]>([]);
  
  // Feedback states
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: servicesData, error: servicesError }, { data: savedData }] = await Promise.all([
        supabase
          .from("services")
          .select(`id, title, rate, rate_type, skills, availability, location, rating, number_of_reviews, profiles(id, first_name, last_name, bio)`),
        user ? supabase.from("saved_items").select("service_id").eq("user_id", user.id).not("service_id", "is", null) : Promise.resolve({ data: [] })
      ]);

      if (servicesError) { console.error("FindTalent:", servicesError.message); return; }
      
      const savedIds = new Set((savedData || []).map((s: any) => s.service_id));
      const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='1.5'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
      
      setCandidates((servicesData || []).map((s: any) => {
        const p = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
        const days: string[] = s.availability || [];
        const available = days.length > 0 ? days.map((d: string) => d.slice(0, 3)).join(", ") : "—";
        const numericRate = parseFloat(String(s.rate ?? "").replace(/[^0-9.]/g, ""));
        const rateLabel = !isNaN(numericRate) && s.rate
          ? `KES ${numericRate.toLocaleString()} / ${s.rate_type ?? "day"}`
          : "—";
        return {
          id:       s.id,
          name:     `${p?.first_name ?? ""} ${p?.last_name ?? ""}`.trim() || "Service Provider",
          role:     s.title || "Unnamed Service",
          location: s.location || "",
          rate:     rateLabel,
          rating:   s.rating ?? 0,
          reviews:  s.number_of_reviews ?? 0,
          skills:   s.skills || [],
          image:    PLACEHOLDER,
          available,
          bio:      p?.bio || "",
          isSaved:  savedIds.has(s.id),
          userId:   p?.id || "",
        };
      }));
    })();
  }, [user]);

  const q = search.toLowerCase();
  const filtered = useMemo(() => candidates
    .filter(c => (!q || [c.name, c.role, ...c.skills].some(s => s.toLowerCase().includes(q))) && (filterRole === "all" || c.role.includes(filterRole))),
    [candidates, q, filterRole]);

  const selected = candidates.find(c => c.id === selectedId) || null;

  const toggleBookmark = async (id: string) => {
    if (!user) return;
    const cand = candidates.find(c => c.id === id);
    if (!cand) return;

    const newSaved = !cand.isSaved;
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, isSaved: newSaved } : c));

    if (newSaved) {
      await supabase.from("saved_items").insert({ user_id: user.id, service_id: id });
    } else {
      await supabase.from("saved_items").delete().eq("user_id", user.id).eq("service_id", id);
    }
  };

  const handleRate = async (id: string, newRating: number) => {
    if (ratedIds.includes(id)) return;

    const cand = candidates.find(c => c.id === id);
    if (!cand) return;

    setRatedIds(prev => [...prev, id]);

    const totalScore = (cand.rating * cand.reviews) + newRating;
    const newReviews = cand.reviews + 1;
    const finalRating = Number((totalScore / newReviews).toFixed(1));

    setCandidates(prev => prev.map(c => 
      c.id === id ? { ...c, rating: finalRating, reviews: newReviews } : c
    ));

    const { error } = await supabase
      .from("services")
      .update({ rating: finalRating, number_of_reviews: newReviews })
      .eq("id", id);
      
    if (error) {
      console.error("Error saving rating:", error.message);
    }
  };

  const stats = {
    total: candidates.length,
    saved: candidates.filter(c => c.isSaved).length,
    available: candidates.filter(c => c.available === "Immediate").length,
  };

  const handleInvite = async (candidate: Candidate) => {
    if (!user || isInviting) return;
    
    setIsInviting(true);
    const employerName = `${employerProfile?.first_name || "An employer"} ${employerProfile?.last_name || ""}`.trim();
    
    const { error } = await supabase.from("notifications").insert([{
      user_id: candidate.userId,
      title: "New Job Invitation",
      message: `${employerName} has invited you to apply for their project.`,
      type: "invite",
      metadata: {
        employer_id: user.id,
        employer_name: employerName,
        service_id: candidate.id
      }
    }]);

    setIsInviting(false);
    if (!error) {
      setShowInviteSuccess(true);
    } else {
      console.error("Invite error:", error.message);
      alert("Failed to send invitation. Please try again.");
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
        <div>
          <h1 className="m-0 text-xl font-bold text-gray-900">Find Talent</h1>
          <p className="m-0 text-sm text-gray-400 font-mono">Discover top professionals</p>
        </div>
        <div className="flex gap-2">
          {([["Total", stats.total, false], ["Immediate", stats.available, false], ["Saved", stats.saved, true]] as [string, number, boolean][]).map(([label, value, dark]) => (
            <div key={label} className={`px-3.5 py-1.5 rounded-md text-center ${dark ? "bg-gray-900 border-none" : "bg-gray-100 border border-gray-200"}`}>
              <p className={`m-0 text-lg font-bold font-mono ${dark ? "text-white" : "text-gray-900"}`}>{value}</p>
              <p className={`m-0 text-xs uppercase tracking-[0.06em] ${dark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-2.5 flex items-center gap-2.5 flex-wrap">
        <div className="relative flex-1 max-w-[300px]">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">{Ico.search}</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search skills, roles or names…"
            className="w-full py-[7px] pr-2.5 pl-8 border border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50 outline-none focus:bg-white focus:border-gray-300 transition-colors" />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="font-sans px-2.5 py-[7px] border border-gray-200 rounded-md text-sm text-gray-700 bg-gray-50 outline-none cursor-pointer focus:bg-white focus:border-gray-300 transition-colors">
          <option value="all">Any Role Category</option>
          <option value="Engineer">Engineering</option>
          <option value="Designer">Design & UI/UX</option>
        </select>
        <span className="text-sm text-gray-400 ml-auto font-mono">{filtered.length} candidates</span>
      </div>

      {/* Content */}
      <div className={`flex-1 grid gap-4 p-5 items-start ${selected ? "grid-cols-[1fr_380px]" : "grid-cols-1"}`}>
        <div className={`grid gap-3 ${selected ? "grid-cols-1" : "grid-cols-[repeat(auto-fill,minmax(320px,1fr))]"}`}>
          {filtered.length === 0
            ? <div className="p-12 text-center border-[1.5px] border-dashed border-gray-200 rounded-[10px] bg-white col-span-full"><p className="m-0 text-base text-gray-400">No talent matches your search.</p></div>
            : filtered.map(cand => <CandidateCard key={cand.id} cand={cand} selected={selectedId === cand.id} onSelect={() => setSelectedId(p => p === cand.id ? null : cand.id)} onBookmark={() => toggleBookmark(cand.id)} />)
          }
        </div>
        {selected && (
          <div className="sticky top-5 h-[calc(100vh-175px)] overflow-hidden">
            <DetailPanel 
              cand={selected} 
              onClose={() => setSelectedId(null)} 
              onBookmark={() => toggleBookmark(selected.id)} 
              onRate={(rating) => handleRate(selected.id, rating)}
              onMessage={() => setShowComingSoon(true)}
              onInvite={() => handleInvite(selected)}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {showComingSoon && (
        <div className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Messaging Coming Soon</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                We're currently building our real-time messaging system. You'll be able to chat with talent directly very soon!
              </p>
              <button
                onClick={() => setShowComingSoon(false)}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
              >
                Great, thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      {showInviteSuccess && (
        <div className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Invitation Sent!</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Your invitation has been sent to {selected?.name}. They will receive a notification on their dashboard.
              </p>
              <button
                onClick={() => setShowInviteSuccess(false)}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
              >
                Awesome
              </button>
            </div>
          </div>
        </div>
      )}

      {isInviting && (
        <div className="fixed inset-0 z-[10000] bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4">
            <div className="w-6 h-6 border-3 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
            <span className="font-semibold text-gray-900">Sending invitation...</span>
          </div>
        </div>
      )}
    </div>
  );
}
