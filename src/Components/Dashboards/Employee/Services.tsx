import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  plus: I('<path d="M5 12h14"/><path d="M12 5v14"/>', 16),
  trash: I('<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>', 16),
  x: I('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>', 12),
};

const DAYS = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Service {
  id: string;
  title: string;
  description: string;
  rate: string;
  rateType: "day" | "hour" | "month" | "year";
  rate_type?: string; 
  skills: string[];
  availability: string[];
  location: string;
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState<{ [key: string]: string }>({});
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [savingServiceId, setSavingServiceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("user_id", session.user.id);
        
        if (data && !error) {
          const mapped = data.map(d => ({
            ...d,
            rateType: d.rate_type || "day"
          })) as Service[];
          setServices(mapped);
        }
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  const addService = () => {
    setServices([{
      id: "temp_" + Date.now(), title: "", description: "", rate: "", rateType: "day", skills: [], availability: [], location: ""
    }, ...services]);
  };

  const updateService = (id: string, field: string, value: any) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const attemptDelete = (id: string) => {
    setServiceToDelete(id);
  };
  
  const confirmDelete = async () => {
    if (serviceToDelete !== null) {
      if (!serviceToDelete.startsWith("temp_")) {
        // Delete from supabase
        await supabase.from("services").delete().eq("id", serviceToDelete);
      }
      setServices(services.filter(s => s.id !== serviceToDelete));
      setServiceToDelete(null);
    }
  };

  const toggleDay = (id: string, day: string) => {
    setServices(prev => prev.map(s => {
      if (s.id !== id) return s;
      const currentAvail = s.availability || [];
      return { ...s, availability: currentAvail.includes(day) ? currentAvail.filter(d => d !== day) : [...currentAvail, day] };
    }));
  };

  const handleSkillChange = (id: string, val: string) => {
    setNewSkill(prev => ({ ...prev, [id]: val }));
  };

  const addSkill = (id: string) => {
    const skill = newSkill[id];
    if (!skill?.trim()) return;
    setServices(prev => prev.map(s => {
      if (s.id !== id) return s;
      const currentSkills = s.skills || [];
      return currentSkills.includes(skill.trim()) ? s : { ...s, skills: [...currentSkills, skill.trim()] };
    }));
    setNewSkill(prev => ({ ...prev, [id]: "" }));
  };

  const removeSkill = (id: string, skillToRemove: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, skills: (s.skills || []).filter(sk => sk !== skillToRemove) } : s));
  };

  const saveService = async (id: string) => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    if (!service.title) {
       alert("Please provide a service title before saving.");
       return;
    }

    setSavingServiceId(id);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      setSavingServiceId(null);
      return;
    }

    const payload = {
      user_id: session.user.id,
      title: service.title,
      description: service.description,
      rate: service.rate,
      rate_type: service.rateType,
      skills: service.skills || [],
      availability: service.availability || [],
      location: service.location,
    };

    if (id.startsWith("temp_")) {
      const { data, error } = await supabase.from("services").insert(payload).select().single();
      if (error) {
        alert("Error creating service: " + error.message);
      } else if (data) {
        setServices(prev => prev.map(s => s.id === id ? { ...s, ...data, rateType: data.rate_type } as Service : s));
        alert("Service created successfully!"); 
      }
    } else {
      const { error } = await supabase.from("services").update(payload).eq("id", id);
      if (error) {
        alert("Error updating service: " + error.message);
      } else {
        alert("Service updated successfully!"); 
      }
    }
    setSavingServiceId(null);
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

      {loading ? (
        <p style={{ color: "#6B7280", fontSize: 14 }}>Loading services...</p>
      ) : services.length === 0 ? (
        <div style={{ padding: 48, textAlign: "center", border: "1.5px dashed #E5E7EB", borderRadius: 12, background: "#fff" }}>
          <p style={{ margin: 0, fontSize: 15, color: "#9CA3AF" }}>You haven't added any services yet. Click 'Add Service' to start.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {services.map((service) => {
            const currentSkills = service.skills || [];
            const currentAvail = service.availability || [];
            
            return (
              <div key={service.id} style={{ background: "#F9FAFB", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 24 }}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Service Title</label>
                    <input placeholder="e.g. Masonry, Data Entry, Delivery" value={service.title} onChange={e => updateService(service.id, "title", e.target.value)} style={inputStyle} />
                  </div>
                  <button onClick={() => attemptDelete(service.id)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", padding: "32px 8px 8px 8px" }}>
                    {Ico.trash}
                  </button>
                </div>

                <label style={labelStyle}>Description</label>
                <textarea placeholder="Describe how you provide value..." value={service.description || ""} onChange={e => updateService(service.id, "description", e.target.value)} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Rate</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input placeholder="e.g. 2500" value={service.rate || ""} onChange={e => updateService(service.id, "rate", e.target.value)} style={{ ...inputStyle, fontFamily: "'DM Mono',monospace", flex: 1 }} />
                      <select value={service.rateType || "day"} onChange={e => updateService(service.id, "rateType", e.target.value)} style={{ ...inputStyle, width: "auto" }}>
                        <option value="hour">per hour</option>
                        <option value="day">per day</option>
                        <option value="month">per month</option>
                        <option value="year">per year</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Primary Location</label>
                      <input placeholder="e.g. Nairobi, Kenya or Remote" value={service.location || ""} onChange={e => updateService(service.id, "location", e.target.value)} style={inputStyle} />
                  </div>
                </div>

                <label style={labelStyle}>Specific Skills</label>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <input placeholder="Type a skill..." value={newSkill[service.id] || ""} onChange={e => handleSkillChange(service.id, e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill(service.id)} style={{ ...inputStyle, marginBottom: 0 }} />
                  <button onClick={() => addSkill(service.id)} style={{ padding: "0 16px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Add</button>
                </div>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                  {currentSkills.map((skill, i) => (
                    <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px 4px 12px", background: "#E5E7EB", color: "#374151", fontSize: 13, borderRadius: 20, fontWeight: 600 }}>
                      {skill}
                      <button onClick={() => removeSkill(service.id, skill)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 10, background: "#D1D5DB", color: "#374151", border: "none", cursor: "pointer", padding: 0 }}>
                        {Ico.x}
                      </button>
                    </span>
                  ))}
                  {currentSkills.length === 0 && <span style={{ fontSize: 13, color: "#9CA3AF" }}>No skills added</span>}
                </div>

                <label style={labelStyle}>Availability</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {DAYS.map(day => {
                    const isActive = currentAvail.includes(day);
                    return (
                      <button key={day} onClick={() => toggleDay(service.id, day)} style={{ padding: "6px 14px", border: isActive ? "1.5px solid #111827" : "1.5px solid #E5E7EB", background: isActive ? "#111827" : "#fff", color: isActive ? "#fff" : "#6B7280", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.1s" }}>
                        {day}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, paddingTop: 16, borderTop: "1.5px solid #F3F4F6" }}>
                  <button disabled={savingServiceId === service.id} onClick={() => saveService(service.id)} style={{ padding: "10px 20px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: savingServiceId === service.id ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", opacity: savingServiceId === service.id ? 0.7 : 1 }}>
                    {savingServiceId === service.id ? "Saving..." : "Save Service"}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {serviceToDelete !== null && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", padding: 32, borderRadius: 12, width: 400, maxWidth: "90%", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Delete Service?</h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#4B5563", lineHeight: 1.5 }}>Are you sure you want to delete this service? This action cannot be undone.</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button onClick={() => setServiceToDelete(null)} style={{ padding: "10px 16px", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={confirmDelete} style={{ padding: "10px 16px", background: "#EF4444", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
