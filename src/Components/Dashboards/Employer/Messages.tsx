import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Message { id: number; text: string; sender: "employer" | "applicant"; time: string; }
interface Conversation { id: number; name: string; role: string; avatar: string; lastMessage: string; time: string; unread: number; online: boolean; }

const MOCK_CONVOS: Conversation[] = [
  { id: 1, name: "Alex Johnson", role: "Frontend Developer", avatar: "https://i.pravatar.cc/150?img=11", lastMessage: "Thanks for the opportunity!", time: "10:42 AM", unread: 2, online: true },
  { id: 2, name: "Maria Garcia", role: "UX Designer", avatar: "https://i.pravatar.cc/150?img=5", lastMessage: "Yes, 3 PM EST works perfect.", time: "Yesterday", unread: 0, online: false },
  { id: 3, name: "David Smith", role: "Backend Engineer", avatar: "https://i.pravatar.cc/150?img=12", lastMessage: "I have updated my portfolio link.", time: "Tue", unread: 0, online: true },
];

const MOCK_MSGS: Message[] = [
  { id: 1, text: "Hi Alex, thanks for applying to the Senior Frontend role.", sender: "employer", time: "10:30 AM" },
  { id: 2, text: "We were very impressed with your portfolio.", sender: "employer", time: "10:31 AM" },
  { id: 3, text: "Hello! Thank you so much for reaching out.", sender: "applicant", time: "10:35 AM" },
  { id: 4, text: "I'm glad you liked it.", sender: "applicant", time: "10:36 AM" },
  { id: 5, text: "Would you be available for a quick 15-min chat sometime this week?", sender: "employer", time: "10:40 AM" },
  { id: 6, text: "Thanks for the opportunity! I will review my schedule and get back to you today.", sender: "applicant", time: "10:42 AM" },
];

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  search: I('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>', 14),
  phone: I('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>', 16),
  video: I('<polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/>', 16),
  more: I('<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>', 16),
  file: I('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>', 16),
  image: I('<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>', 16),
  send: I('<line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>', 14, "currentColor")
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const iconBtn = (color = "#6B7280") => ({ background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "8px", cursor: "pointer", color, display: "flex", alignItems: "center" as const });

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Messages() {
  const [activeChat, setActiveChat] = useState<Conversation>(MOCK_CONVOS[0]);
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");

  const q = search.toLowerCase();
  const filteredConvos = MOCK_CONVOS.filter(c => (!q || c.name.toLowerCase().includes(q)));

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F9FAFB", height: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px}`}</style>

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>Messages</h1>
          <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>Communicate with candidates</p>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", padding: 20, gap: 16, overflow: "hidden" }}>
        
        {/* Left Pane */}
        <div style={{ width: 320, flexShrink: 0, background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: 16, borderBottom: "1px solid #E5E7EB" }}>
            <div style={{ position: "relative" as const }}>
              <span style={{ position: "absolute" as const, left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>{Ico.search}</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages…"
                style={{ width: "100%", padding: "8px 10px 8px 32px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, color: "#111827", background: "#F9FAFB", outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredConvos.map(c => {
               const active = activeChat.id === c.id;
               return (
                 <button key={c.id} onClick={() => setActiveChat(c)} style={{ width: "100%", background: active ? "#F9FAFB" : "#fff", border: "none", borderBottom: "1px solid #E5E7EB", padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, outline: "none" }}>
                   <div style={{ position: "relative" as const, flexShrink: 0 }}>
                      <img src={c.avatar} alt={c.name} style={{ width: 44, height: 44, borderRadius: 22, objectFit: "cover", border: "1.5px solid #E5E7EB" }} />
                      {c.online && <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, background: "#059669", border: "2px solid #fff", borderRadius: "50%" }} />}
                   </div>
                   <div style={{ flex: 1, minWidth: 0, textAlign: "left" as const }}>
                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                       <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</p>
                       <span style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Mono',monospace" }}>{c.time}</span>
                     </div>
                     <p style={{ margin: "0 0 4px", fontSize: 11, color: active ? "#111827" : "#6B7280", fontWeight: active ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.role}</p>
                     <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.lastMessage}</p>
                   </div>
                   {c.unread > 0 && <div style={{ background: "#111827", color: "#fff", fontSize: 10, fontWeight: 700, width: 20, height: 20, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.unread}</div>}
                 </button>
               );
            })}
          </div>
        </div>

        {/* Right Pane */}
        <div style={{ flex: 1, background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          
          {/* Chat Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src={activeChat.avatar} alt={activeChat.name} style={{ width: 40, height: 40, borderRadius: 20, objectFit: "cover", border: "1px solid #E5E7EB" }} />
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>{activeChat.name}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>{activeChat.role}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={iconBtn()}>{Ico.phone}</button>
              <button style={iconBtn()}>{Ico.video}</button>
              <button style={iconBtn()}>{Ico.more}</button>
            </div>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, background: "#F9FAFB", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
             {MOCK_MSGS.map(msg => {
                const isMe = msg.sender === "employer";
                return (
                  <div key={msg.id} style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", gap: 4 }}>
                    <div style={{ background: isMe ? "#111827" : "#fff", color: isMe ? "#fff" : "#111827", border: isMe ? "none" : "1.5px solid #E5E7EB", padding: "10px 14px", fontSize: 13, borderRadius: 10, borderTopRightRadius: isMe ? 2 : 10, borderTopLeftRadius: isMe ? 10 : 2, lineHeight: 1.5 }}>
                      {msg.text}
                    </div>
                    <span style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Mono',monospace" }}>{msg.time}</span>
                  </div>
                );
             })}
          </div>

          {/* Input Area */}
          <div style={{ padding: "16px 20px", borderTop: "1px solid #E5E7EB", background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
               <div style={{ display: "flex", gap: 6, paddingBottom: 6 }}>
                 <button style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", padding: 4 }}>{Ico.file}</button>
                 <button style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", padding: 4 }}>{Ico.image}</button>
               </div>
               <div style={{ flex: 1, position: "relative" as const }}>
                 <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Type a message..." rows={1}
                  style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, color: "#111827", background: "#F9FAFB", outline: "none", fontFamily: "'DM Sans',sans-serif", resize: "none" }} />
               </div>
               <button style={{ background: "#111827", color: "#fff", border: "none", cursor: "pointer", padding: "12px 14px", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                 {Ico.send}
               </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
