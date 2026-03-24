import { useState } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  plus: I('<path d="M5 12h14"/><path d="M12 5v14"/>', 16),
  trash: I('<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>', 16),
};

const COUNTIES = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Remote"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Service {
  id: number;
  title: string;
  description: string;
  rate: string;
  skills: string[];
  availability: string[];
  location: string;
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      title: "Data Analyst / Administrative Support",
      description: "I help businesses make data-driven decisions and manage back-office logistics.",
      rate: "2500",
      skills: ["Excel", "SQL", "Data Entry"],
      availability: ["Mon", "Tue"],
      location: "Nairobi",
    },
  ]);
  const [newSkill, setNewSkill] = useState("");

  const addService = () => {
    setServices([...services, {
      id: Date.now(), title: "", description: "", rate: "", skills: [], availability: [], location: "Nairobi"
    }]);
  };

  const updateService = (id: number, field: string, value: any) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const deleteService = (id: number) => setServices(services.filter(s => s.id !== id));

  const toggleDay = (id: number, day: string) => {
    setServices(prev => prev.map(s => {
      if (s.id !== id) return s;
      return { ...s, availability: s.availability.includes(day) ? s.availability.filter(d => d !== day) : [...s.availability, day] };
    }));
  };

  const addSkill = (id: number) => {
    if (!newSkill.trim()) return;
    setServices(prev => prev.map(s => s.id === id && !s.skills.includes(newSkill) ? { ...s, skills: [...s.skills, newSkill] } : s));
    setNewSkill("");
  };

  // ── Shared Styles ────────────────────────────────────────────────────────────
  const inputStyle = { width: "100%", padding: "10px 14px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, color: "#111827", background: "#fff", outline: "none", fontFamily: "'DM Sans',sans-serif", marginBottom: 16 };
  const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" };

  return (
    <div style={{ marginTop: 32 }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>Services Offered</h3>
        <button onClick={addService} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#111827", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          {Ico.plus} Add Service
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {services.map((service) => (
          <div key={service.id} style={{ background: "#F9FAFB", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 24 }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Service Title</label>
                <input placeholder="e.g. Masonry, Data Entry, Delivery" value={service.title} onChange={e => updateService(service.id, "title", e.target.value)} style={inputStyle} />
              </div>
              <button onClick={() => deleteService(service.id)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", padding: "32px 8px 8px 8px" }}>
                {Ico.trash}
              </button>
            </div>

            <label style={labelStyle}>Description</label>
            <textarea placeholder="Describe how you provide value..." value={service.description} onChange={e => updateService(service.id, "description", e.target.value)} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                 <label style={labelStyle}>Rate (KES / day)</label>
                 <input placeholder="e.g. 2500" value={service.rate} onChange={e => updateService(service.id, "rate", e.target.value)} style={{ ...inputStyle, fontFamily: "'DM Mono',monospace" }} />
              </div>
              <div>
                 <label style={labelStyle}>Primary Location</label>
                 <select value={service.location} onChange={e => updateService(service.id, "location", e.target.value)} style={inputStyle}>
                   {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
              </div>
            </div>

            <label style={labelStyle}>Specific Skills</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input placeholder="Type a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill(service.id)} style={{ ...inputStyle, marginBottom: 0 }} />
              <button onClick={() => addSkill(service.id)} style={{ padding: "0 16px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Add</button>
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {service.skills.map((skill, i) => (
                <span key={i} style={{ padding: "4px 12px", background: "#E5E7EB", color: "#374151", fontSize: 13, borderRadius: 20, fontWeight: 600 }}>
                  {skill}
                </span>
              ))}
              {service.skills.length === 0 && <span style={{ fontSize: 13, color: "#9CA3AF" }}>No skills added</span>}
            </div>

            <label style={labelStyle}>Availability</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {DAYS.map(day => {
                const isActive = service.availability.includes(day);
                return (
                  <button key={day} onClick={() => toggleDay(service.id, day)} style={{ padding: "6px 14px", border: isActive ? "1.5px solid #111827" : "1.5px solid #E5E7EB", background: isActive ? "#111827" : "#fff", color: isActive ? "#fff" : "#6B7280", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.1s" }}>
                    {day}
                  </button>
                );
              })}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
