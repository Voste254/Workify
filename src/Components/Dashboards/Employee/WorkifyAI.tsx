import { useState } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  sparkles: I('<path d="M12 3v18"/><path d="m5 10 14 \n 4"/><path d="m19 10-14 4"/>', 18),
  fileText: I('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>', 16),
  trending: I('<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>', 16),
  target: I('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>', 16),
  check: I('<path d="M20 6 9 17l-5-5"/>', 16),
  close: I('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', 16),
  smartphone: I('<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>', 16)
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" };
const inputOuter = { position: "relative" as const, display: "flex", alignItems: "center", marginBottom: 16 };
const inputIcon = { position: "absolute" as const, left: 14, color: "#9CA3AF" };
const inputStyle = { width: "100%", padding: "12px 16px 12px 40px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, color: "#111827", background: "#fff", outline: "none", fontFamily: "'DM Sans',sans-serif", transition: "border-color 0.15s" };

// ── Main Component ─────────────────────────────────────────────────────────────
export default function WorkifyAI() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [phone, setPhone] = useState("07");
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "sent">("idle");

  const closePayment = () => {
    setSelectedPlan(null);
    setPaymentState("idle");
    setPhone("07");
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentState("processing");
    setTimeout(() => {
      setPaymentState("sent");
    }, 1500);
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F9FAFB", minHeight: "100vh", padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px}`}</style>

      {/* Hero Header */}
      <div style={{ maxWidth: 800, textAlign: "center", marginBottom: 40 }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 16, background: "#111827", color: "#fff", borderRadius: "50%", marginBottom: 20 }}>
          {Ico.sparkles}
        </div>
        <h1 style={{ margin: "0 0 16px", fontSize: 32, fontWeight: 700, color: "#111827" }}>Workify AI</h1>
        <p style={{ margin: 0, fontSize: 16, color: "#6B7280", lineHeight: 1.6 }}>Your intelligent career companion. Draft winning resumes, get personalized career coaching, and land your ideal permanent or casual job faster.</p>
        <span style={{ display: "inline-block", marginTop: 24, fontSize: 12, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.1em", padding: "6px 12px", border: "1.5px solid #111827", borderRadius: 20 }}>Premium Feature</span>
      </div>

      {/* Features Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 960, width: "100%", marginBottom: 60 }}>
        {[
          { icon: Ico.fileText, title: "AI Resume Drafting", desc: "Instantly create tailored resumes based on the exact corporate or casual job description you want." },
          { icon: Ico.trending, title: "Career Coaching", desc: "Gain actionable advice on how to negotiate local Kenyan salaries and prepare for interviews." },
          { icon: Ico.target, title: "Smart Matching", desc: "Get highly accurate job recommendations analyzing your profile against precise employer needs." }
        ].map((feat, i) => (
          <div key={i} style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" as const }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: "#F3F4F6", color: "#111827", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              {feat.icon}
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#111827" }}>{feat.title}</h3>
            <p style={{ margin: 0, fontSize: 14, color: "#6B7280", lineHeight: 1.5 }}>{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* Pricing Title */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700, color: "#111827" }}>Unlock Workify AI Today</h2>
        <p style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>Select the tier that accelerates your career goals.</p>
      </div>

      {/* Pricing Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, maxWidth: 800, width: "100%" }}>
        
        {/* Pro Plan */}
        <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 32, display: "flex", flexDirection: "column" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Pro Upgrade</h3>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#6B7280" }}>Perfect for active job seekers needing an edge.</p>
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: "#111827", fontFamily: "'DM Mono',monospace" }}>KES 499</span>
            <span style={{ fontSize: 14, color: "#6B7280" }}> / mo</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
            {["5 AI Resumes per month", "Standard Cover Letters", "Interview question prep", "Priority matching alerts"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ color: "#111827", marginTop: 2 }}>{Ico.check}</span>
                <span style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>{item}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setSelectedPlan("Pro Upgrade")} style={{ width: "100%", padding: "14px", background: "#fff", color: "#111827", border: "2px solid #111827", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "background 0.1s" }} onMouseOver={e => e.currentTarget.style.background = "#F9FAFB"} onMouseOut={e => e.currentTarget.style.background = "#fff"}>
            Select Pro
          </button>
        </div>

        {/* Elite Plan */}
        <div style={{ background: "#111827", border: "1.5px solid #111827", borderRadius: 12, padding: 32, display: "flex", flexDirection: "column", position: "relative" as const }}>
          <div style={{ position: "absolute", top: -12, right: 32, background: "#fff", color: "#111827", fontSize: 11, fontWeight: 700, padding: "4px 12px", border: "1.5px solid #111827", borderRadius: 12, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Popular</div>
          <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#fff" }}>Elite Career</h3>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#9CA3AF" }}>Comprehensive AI coaching and limitless generation.</p>
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: "#fff", fontFamily: "'DM Mono',monospace" }}>KES 1,299</span>
            <span style={{ fontSize: 14, color: "#9CA3AF" }}> / mo</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
            {["Unlimited AI Resumes", "1-on-1 AI ChatBot Coaching", "Salary Negotiation scripts", "Top-tier employer visibility"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ color: "#fff", marginTop: 2 }}>{Ico.check}</span>
                <span style={{ fontSize: 14, color: "#E5E7EB", fontWeight: 600 }}>{item}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setSelectedPlan("Elite Career")} style={{ width: "100%", padding: "14px", background: "#fff", color: "#111827", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "opacity 0.1s" }} onMouseOver={e => e.currentTarget.style.opacity = "0.9"} onMouseOut={e => e.currentTarget.style.opacity = "1"}>
            Select Elite
          </button>
        </div>

      </div>

      {/* Payment Overlay Modal */}
      {selectedPlan && (
        <div style={{ position: "fixed" as const, inset: 0, zIndex: 50, background: "rgba(17, 24, 39, 0.7)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: 400, borderRadius: 12, overflow: "hidden", border: "1.5px solid #E5E7EB", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
            
            <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>Complete Subscription</h3>
              <button onClick={closePayment} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", display: "flex", padding: 4 }}>{Ico.close}</button>
            </div>

            <div style={{ padding: 24 }}>
               <p style={{ margin: "0 0 20px", fontSize: 14, color: "#374151", fontWeight: 600 }}>You selected the <strong style={{ color: "#111827" }}>{selectedPlan}</strong> plan.</p>

               {paymentState === "idle" && (
                 <form onSubmit={handlePay}>
                   <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, padding: 16, border: "2px solid #059669", borderRadius: 8, background: "#ECFDF5" }}>
                     <div style={{ width: 40, height: 40, borderRadius: 20, background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18 }}>M</div>
                     <div>
                       <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#065F46" }}>Pay via M-PESA</p>
                       <p style={{ margin: 0, fontSize: 12, color: "#047857" }}>Safaricom</p>
                     </div>
                   </div>

                   <label style={labelStyle}>M-PESA Phone Number</label>
                   <div style={inputOuter}>
                     <span style={inputIcon}>{Ico.smartphone}</span>
                     <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="07XX XXX XXX" style={{ ...inputStyle, fontFamily: "'DM Mono',monospace" }} required />
                   </div>

                   <button type="submit" style={{ width: "100%", padding: "14px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                     Pay Now
                   </button>
                 </form>
               )}

               {paymentState === "processing" && (
                 <div style={{ padding: "30px 0", textAlign: "center", color: "#6B7280" }}>
                   <div style={{ margin: "0 auto 16px", width: 40, height: 40, border: "4px solid #E5E7EB", borderTopColor: "#111827", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                   <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" }}>Connecting to Safaricom...</p>
                   <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                 </div>
               )}

               {paymentState === "sent" && (
                 <div style={{ padding: "20px 0", textAlign: "center" }}>
                   <div style={{ display: "inline-flex", padding: 16, background: "#D1FAE5", color: "#059669", borderRadius: "50%", marginBottom: 16 }}>
                      {Ico.check}
                   </div>
                   <h4 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#111827" }}>M-PESA Prompt Sent!</h4>
                   <p style={{ margin: "0 0 24px", fontSize: 14, color: "#6B7280", lineHeight: 1.5 }}>Please check your phone (<strong>{phone}</strong>) and enter your M-PESA PIN to complete the subscription for the {selectedPlan} plan.</p>
                   <button onClick={closePayment} style={{ padding: "10px 24px", background: "#fff", color: "#111827", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                     Close
                   </button>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
