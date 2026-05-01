import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  plus:      I('<path d="M5 12h14"/><path d="M12 5v14"/>', 16),
  trash:     I('<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>', 16),
  x:         I('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>', 12),
  chevron:   I('<path d="m6 9 6 6 6-6"/>', 16),
  edit:      I('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>', 14),
  mapPin:    I('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', 13),
  dollar:    I('<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>', 13),
  briefcase: I('<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>', 14),
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

// ── Shared form styles ─────────────────────────────────────────────────────────
const inp = {
  width: "100%", padding: "10px 14px", border: "1.5px solid #E5E7EB",
  borderRadius: 8, fontSize: 14, color: "#111827", background: "#fff",
  outline: "none", fontFamily: "'DM Sans',sans-serif", marginBottom: 16,
} as React.CSSProperties;

const lbl = {
  display: "block", fontSize: 13, fontWeight: 700,
  color: "#374151", marginBottom: 6, fontFamily: "'DM Sans',sans-serif",
} as React.CSSProperties;

// ── ServiceCard ────────────────────────────────────────────────────────────────
function ServiceCard({
  service,
  defaultExpanded,
  onUpdate,
  onDelete,
  onSave,
  saving,
}: {
  service: Service;
  defaultExpanded: boolean;
  onUpdate: (id: string, field: string, value: any) => void;
  onDelete: (id: string) => void;
  onSave: (id: string) => void;
  saving: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [newSkill, setNewSkill] = useState("");

  const currentSkills = service.skills || [];
  const currentAvail  = service.availability || [];
  const isNew         = service.id.startsWith("temp_");

  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (!currentSkills.includes(newSkill.trim())) {
      onUpdate(service.id, "skills", [...currentSkills, newSkill.trim()]);
    }
    setNewSkill("");
  };

  const removeSkill = (sk: string) =>
    onUpdate(service.id, "skills", currentSkills.filter(s => s !== sk));

  const toggleDay = (day: string) =>
    onUpdate(service.id, "availability",
      currentAvail.includes(day)
        ? currentAvail.filter(d => d !== day)
        : [...currentAvail, day]);

  // ── Preview card ─────────────────────────────────────────────────────────────
  if (!expanded) {
    return (
      <div
        onClick={() => setExpanded(true)}
        style={{
          background: "#fff",
          border: "1.5px solid #E5E7EB",
          borderRadius: 12,
          padding: "16px 20px",
          cursor: "pointer",
          transition: "box-shadow 0.15s, border-color 0.15s",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#111827";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#E5E7EB";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
        role="button"
        aria-expanded="false"
        title="Click to view & edit this service"
      >
        {/* Row 1: title + expand hint */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280", flexShrink: 0 }}>
              {Ico.briefcase}
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#111827", fontFamily: "'DM Sans',sans-serif" }}>
              {service.title || <em style={{ color: "#9CA3AF", fontStyle: "italic", fontWeight: 400 }}>Untitled Service</em>}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {service.rate && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#15803D", fontFamily: "'DM Mono',monospace" }}>
                {Ico.dollar} {service.rate}<span style={{ fontWeight: 400, color: "#4ADE80" }}>/{service.rateType}</span>
              </span>
            )}
            <span style={{ color: "#9CA3AF", display: "flex" }}>{Ico.chevron}</span>
          </div>
        </div>

        {/* Row 2: location + availability pills */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          {service.location && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans',sans-serif" }}>
              {Ico.mapPin} {service.location}
            </span>
          )}
          {currentAvail.length > 0 && (
            <div style={{ display: "flex", gap: 4 }}>
              {DAYS.map(d => (
                <span key={d} style={{
                  width: 28, height: 28, borderRadius: "50%", fontSize: 10, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: currentAvail.includes(d) ? "#111827" : "#F3F4F6",
                  color: currentAvail.includes(d) ? "#fff" : "#9CA3AF",
                  fontFamily: "'DM Sans',sans-serif",
                }}>{d[0]}</span>
              ))}
            </div>
          )}
        </div>

        {/* Row 3: skills chips (max 4 + overflow count) */}
        {currentSkills.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {currentSkills.slice(0, 4).map((sk, i) => (
              <span key={i} style={{ padding: "2px 10px", background: "#F3F4F6", color: "#374151", borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
                {sk}
              </span>
            ))}
            {currentSkills.length > 4 && (
              <span style={{ padding: "2px 10px", background: "#E5E7EB", color: "#6B7280", borderRadius: 20, fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>
                +{currentSkills.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Description snippet */}
        {service.description && (
          <p style={{ margin: 0, fontSize: 13, color: "#6B7280", lineHeight: 1.55, fontFamily: "'DM Sans',sans-serif", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {service.description}
          </p>
        )}

        <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", fontFamily: "'DM Sans',sans-serif" }}>
          Click to {Ico.edit} edit
        </p>
      </div>
    );
  }

  // ── Expanded edit form ────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#F9FAFB", border: "1.5px solid #111827", borderRadius: 12, padding: 24, transition: "border-color 0.15s" }}>

      {/* Form header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1.5px solid #E5E7EB" }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#111827", fontFamily: "'DM Sans',sans-serif" }}>
          {isNew ? "New Service" : (service.title || "Edit Service")}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          {!isNew && (
            <button
              onClick={() => setExpanded(false)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", border: "1.5px solid #E5E7EB", color: "#6B7280", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
            >
              Collapse
            </button>
          )}
          <button
            onClick={() => onDelete(service.id)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#FEF2F2", border: "1.5px solid #FECACA", color: "#DC2626", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
          >
            {Ico.trash} Delete
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <label style={lbl}>Service Title</label>
        <input
          placeholder="e.g. Masonry, Data Entry, Delivery"
          value={service.title}
          onChange={e => onUpdate(service.id, "title", e.target.value)}
          style={inp}
        />
      </div>

      {/* Description */}
      <label style={lbl}>Description</label>
      <textarea
        placeholder="Describe how you provide value..."
        value={service.description || ""}
        onChange={e => onUpdate(service.id, "description", e.target.value)}
        style={{ ...inp, minHeight: 80, resize: "vertical" }}
      />

      {/* Rate + Location */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={lbl}>Rate</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="e.g. 2500"
              value={service.rate || ""}
              onChange={e => onUpdate(service.id, "rate", e.target.value)}
              style={{ ...inp, fontFamily: "'DM Mono',monospace", flex: 1 }}
            />
            <select
              value={service.rateType || "day"}
              onChange={e => onUpdate(service.id, "rateType", e.target.value)}
              style={{ ...inp, width: "auto" }}
            >
              <option value="hour">per hour</option>
              <option value="day">per day</option>
              <option value="month">per month</option>
              <option value="year">per year</option>
            </select>
          </div>
        </div>
        <div>
          <label style={lbl}>Primary Location</label>
          <input
            placeholder="e.g. Nairobi, Kenya or Remote"
            value={service.location || ""}
            onChange={e => onUpdate(service.id, "location", e.target.value)}
            style={inp}
          />
        </div>
      </div>

      {/* Skills */}
      <label style={lbl}>Specific Skills</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Type a skill and press Add or Enter…"
          value={newSkill}
          onChange={e => setNewSkill(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addSkill()}
          style={{ ...inp, marginBottom: 0 }}
        />
        <button
          onClick={addSkill}
          style={{ padding: "0 16px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
        >
          Add
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {currentSkills.map((sk, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px 4px 12px", background: "#E5E7EB", color: "#374151", fontSize: 13, borderRadius: 20, fontWeight: 600 }}>
            {sk}
            <button
              onClick={() => removeSkill(sk)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 10, background: "#D1D5DB", color: "#374151", border: "none", cursor: "pointer", padding: 0 }}
            >
              {Ico.x}
            </button>
          </span>
        ))}
        {currentSkills.length === 0 && <span style={{ fontSize: 13, color: "#9CA3AF" }}>No skills added</span>}
      </div>

      {/* Availability */}
      <label style={lbl}>Availability</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {DAYS.map(day => {
          const active = currentAvail.includes(day);
          return (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              style={{
                padding: "6px 14px", border: active ? "1.5px solid #111827" : "1.5px solid #E5E7EB",
                background: active ? "#111827" : "#fff", color: active ? "#fff" : "#6B7280",
                borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.1s",
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24, paddingTop: 16, borderTop: "1.5px solid #F3F4F6" }}>
        {!isNew && (
          <button
            onClick={() => setExpanded(false)}
            style={{ padding: "10px 18px", background: "#fff", border: "1.5px solid #E5E7EB", color: "#374151", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
          >
            Collapse
          </button>
        )}
        <button
          disabled={saving}
          onClick={() => { onSave(service.id); if (!isNew) setExpanded(false); }}
          style={{
            padding: "10px 20px", background: "#111827", color: "#fff", border: "none",
            borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "'DM Sans',sans-serif", opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving…" : "Save Service"}
        </button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ServicesSection() {
  const [services,        setServices]        = useState<Service[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [savingServiceId, setSavingServiceId] = useState<string | null>(null);
  // Track which ids were just freshly added (should open expanded)
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase.from("services").select("*").eq("user_id", session.user.id);
        if (data && !error) {
          setServices(data.map(d => ({ ...d, rateType: d.rate_type || "day" })) as Service[]);
        }
      }
      setLoading(false);
    })();
  }, []);

  const addService = () => {
    const tempId = "temp_" + Date.now();
    setServices(prev => [{ id: tempId, title: "", description: "", rate: "", rateType: "day", skills: [], availability: [], location: "" }, ...prev]);
    setNewIds(prev => new Set(prev).add(tempId));
  };

  const updateService = (id: string, field: string, value: any) =>
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  const saveService = async (id: string) => {
    const service = services.find(s => s.id === id);
    if (!service) return;
    if (!service.title) { alert("Please provide a service title before saving."); return; }

    setSavingServiceId(id);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { setSavingServiceId(null); return; }

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
        setNewIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      }
    } else {
      const { error } = await supabase.from("services").update(payload).eq("id", id);
      if (error) alert("Error updating service: " + error.message);
    }
    setSavingServiceId(null);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    if (!serviceToDelete.startsWith("temp_")) {
      await supabase.from("services").delete().eq("id", serviceToDelete);
    }
    setServices(prev => prev.filter(s => s.id !== serviceToDelete));
    setNewIds(prev => { const n = new Set(prev); n.delete(serviceToDelete); return n; });
    setServiceToDelete(null);
  };

  return (
    <div style={{ marginTop: 32 }}>

      {/* Section header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>Services Offered</h3>
        <button
          onClick={addService}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#111827", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
        >
          {Ico.plus} Add Service
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#6B7280", fontSize: 14 }}>Loading services…</p>
      ) : services.length === 0 ? (
        <div style={{ padding: 48, textAlign: "center", border: "1.5px dashed #E5E7EB", borderRadius: 12, background: "#fff" }}>
          <p style={{ margin: 0, fontSize: 15, color: "#9CA3AF" }}>
            You haven't added any services yet. Click <strong>'Add Service'</strong> to start.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {services.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              defaultExpanded={newIds.has(service.id)}
              onUpdate={updateService}
              onDelete={id => setServiceToDelete(id)}
              onSave={saveService}
              saving={savingServiceId === service.id}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {serviceToDelete !== null && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", padding: 32, borderRadius: 12, width: 400, maxWidth: "90%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Delete Service?</h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#4B5563", lineHeight: 1.5 }}>
              Are you sure you want to delete this service? This action cannot be undone.
            </p>
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
