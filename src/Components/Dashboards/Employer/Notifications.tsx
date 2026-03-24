import { useState } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  bell: I('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>', 14),
  briefcase: I('<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>', 14),
  check: I('<path d="M20 6 9 17l-5-5"/>', 14),
  user: I('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', 14),
  star: I('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', 14),
  dots: I('<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>', 14)
};

// ── Mock Data ──────────────────────────────────────────────────────────────────
type NotifType = "application" | "system" | "rating" | "message";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
}

const MOCK_NOTIFS: Notification[] = [
  { id: "1", type: "application", title: "New Application Received", message: "Sarah Wanjiku applied for Senior DevOps Engineer.", time: "10 mins ago", read: false, avatar: "https://i.pravatar.cc/150?img=5" },
  { id: "2", type: "application", title: "New Application Received", message: "John Omondi applied for Construction Foreman.", time: "2 hours ago", read: false, avatar: "https://i.pravatar.cc/150?img=11" },
  { id: "3", type: "message", title: "New Message", message: "Brian Mutisya sent you a message regarding the interview.", time: "1 day ago", read: true },
  { id: "4", type: "rating", title: "New Rating Received", message: "You received a 5-star rating for the recent Gig project.", time: "2 days ago", read: true },
  { id: "5", type: "system", title: "Job Posting Expiring Soon", message: "Your 'Marketing Manager' job post will expire in 2 days. Renew now to keep it active.", time: "3 days ago", read: true }
];

// ── Shared styles ──────────────────────────────────────────────────────────────
const tabBtn = (active: boolean) => ({ padding: "10px 16px", borderBottom: `2px solid ${active ? "#111827" : "transparent"}`, color: active ? "#111827" : "#6B7280", fontSize: 13, fontWeight: 700, cursor: "pointer", background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", outline: "none", fontFamily: "'DM Sans',sans-serif", transition: "all 0.15s" });

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Notifications() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifs.filter(n => !n.read).length;
  const filteredNotifs = filter === "all" ? notifs : notifs.filter(n => !n.read);

  const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, read: true })));
  const markAsRead = (id: string) => setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id: string) => setNotifs(notifs.filter(n => n.id !== id));

  const getIcon = (type: NotifType) => {
    switch(type) {
      case "application": return { i: Ico.briefcase, bg: "#DBEAFE", col: "#2563EB" };
      case "message":     return { i: Ico.user,      bg: "#FEF3C7", col: "#D97706" };
      case "rating":      return { i: Ico.star,      bg: "#D1FAE5", col: "#059669" };
      case "system":      return { i: Ico.bell,      bg: "#F3F4F6", col: "#6B7280" };
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F9FAFB", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px}`}</style>

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
             Notifications {unreadCount > 0 && <span style={{ background: "#DC2626", color: "#fff", fontSize: 11, padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>{unreadCount} new</span>}
          </h1>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "#9CA3AF" }}>Stay updated on platform activity</p>
        </div>
        <button onClick={markAllRead} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#fff", color: "#374151", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          {Ico.check} Mark all as read
        </button>
      </div>

      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto", width: "100%" }}>
        
        {/* Tabs */}
        <div style={{ display: "flex", gap: 16, borderBottom: "1.5px solid #E5E7EB", marginBottom: 24 }}>
          <button style={tabBtn(filter === "all")} onClick={() => setFilter("all")}>All Notifications</button>
          <button style={tabBtn(filter === "unread")} onClick={() => setFilter("unread")}>Unread Only</button>
        </div>

        {/* List */}
        <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
           {filteredNotifs.length === 0 ? (
             <div style={{ padding: 60, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>No notifications found.</div>
           ) : (
             <div style={{ display: "flex", flexDirection: "column" }}>
               {filteredNotifs.map((n, idx) => {
                 const icn = getIcon(n.type);
                 return (
                   <div key={n.id} onClick={() => markAsRead(n.id)} style={{ display: "flex", gap: 16, padding: "20px 24px", alignItems: "flex-start", borderBottom: idx < filteredNotifs.length - 1 ? "1px solid #E5E7EB" : "none", background: n.read ? "#fff" : "#F8FAFC", cursor: "pointer", transition: "background 0.15s" }}>
                     
                     <div style={{ position: "relative" as const }}>
                       {n.avatar ? (
                         <img src={n.avatar} alt="Sender" style={{ width: 44, height: 44, borderRadius: 22, objectFit: "cover", border: "1.5px solid #E5E7EB" }} />
                       ) : (
                         <div style={{ width: 44, height: 44, borderRadius: 22, background: icn.bg, color: icn.col, display: "flex", alignItems: "center", justifyContent: "center" }}>
                           {icn.i}
                         </div>
                       )}
                       {!n.read && <div style={{ position: "absolute", top: 0, right: 0, width: 12, height: 12, background: "#3B82F6", border: "2px solid #fff", borderRadius: "50%" }} />}
                     </div>

                     <div style={{ flex: 1, minWidth: 0 }}>
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                         <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: n.read ? 600 : 700, color: "#111827" }}>{n.title}</p>
                         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                           <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Mono',monospace" }}>{n.time}</span>
                           <button onClick={(e) => { e.stopPropagation(); deleteNotif(n.id); }} title="Delete" style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", padding: 4 }}>
                             {Ico.dots}
                           </button>
                         </div>
                       </div>
                       <p style={{ margin: 0, fontSize: 13, color: n.read ? "#6B7280" : "#374151", lineHeight: 1.5 }}>{n.message}</p>
                     </div>
                     
                   </div>
                 );
               })}
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
