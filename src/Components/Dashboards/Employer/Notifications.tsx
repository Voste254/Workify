import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";

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

// ── Types ──────────────────────────────────────────────────────────────────────
type NotifType = "application" | "system" | "rating" | "message" | "invite" | string;

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  metadata?: any;
}

const daysAgo = (dateStr: string) => {
  const n = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  return n === 0 ? "Today" : n === 1 ? "Yesterday" : `${n}d ago`;
};

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Notifications() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setNotifs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();

    if (!user) return;
    const channel = supabase
      .channel("employer-notifications")
      .on("postgres_changes", { 
        event: "*", 
        schema: "public", 
        table: "notifications",
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const unreadCount = notifs.filter(n => !n.is_read).length;
  const filteredNotifs = filter === "all" ? notifs : notifs.filter(n => !n.is_read);

  const markAllRead = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    
    if (!error) {
      setNotifs(notifs.map(n => ({ ...n, is_read: true })));
    }
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
    
    if (!error) {
      setNotifs(notifs.map(n => n.id === id ? { ...n, is_read: true } : n));
    }
  };

  const deleteNotif = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);
    
    if (!error) {
      setNotifs(notifs.filter(n => n.id !== id));
    }
  };

  const getIcon = (type: NotifType) => {
    switch(type) {
      case "application": return { i: Ico.briefcase, bgClass: "bg-blue-100", textClass: "text-blue-600" };
      case "invite":      return { i: Ico.star,      bgClass: "bg-indigo-100", textClass: "text-indigo-600" };
      case "message":     return { i: Ico.user,      bgClass: "bg-amber-100", textClass: "text-amber-600" };
      case "rating":      return { i: Ico.star,      bgClass: "bg-emerald-100", textClass: "text-emerald-600" };
      default:            return { i: Ico.bell,      bgClass: "bg-gray-100", textClass: "text-gray-500" };
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
        <div>
          <h1 className="m-0 text-lg font-bold text-gray-900 flex items-center gap-2">
             Notifications {unreadCount > 0 && <span className="bg-red-600 text-white text-[11px] px-2 py-0.5 rounded-xl font-bold">{unreadCount} new</span>}
          </h1>
          <p className="m-[2px_0_0] text-[13px] text-gray-400">Stay updated on platform activity</p>
        </div>
        <button onClick={markAllRead} className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-semibold cursor-pointer font-sans hover:bg-gray-50 transition-colors">
          {Ico.check} Mark all as read
        </button>
      </div>

      <div className="p-6 max-w-[900px] mx-auto w-full">
        
        {/* Tabs */}
        <div className="flex gap-4 border-b-[1.5px] border-gray-200 mb-6">
          <button className={`px-4 py-2.5 border-b-2 bg-transparent border-t-0 border-l-0 border-r-0 outline-none cursor-pointer font-sans text-[13px] font-bold transition-all duration-150 ${filter === "all" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`} onClick={() => setFilter("all")}>All Notifications</button>
          <button className={`px-4 py-2.5 border-b-2 bg-transparent border-t-0 border-l-0 border-r-0 outline-none cursor-pointer font-sans text-[13px] font-bold transition-all duration-150 ${filter === "unread" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`} onClick={() => setFilter("unread")}>Unread Only</button>
        </div>

        {/* List */}
        <div className="bg-white border-[1.5px] border-gray-200 rounded-[10px] overflow-hidden shadow-sm">
           {loading ? (
             <div className="p-16 text-center text-gray-400 text-sm">Loading notifications...</div>
           ) : filteredNotifs.length === 0 ? (
             <div className="p-16 text-center text-gray-400 text-sm">No notifications found.</div>
           ) : (
             <div className="flex flex-col">
               {filteredNotifs.map((n, idx) => {
                 const icn = getIcon(n.type);
                 return (
                   <div key={n.id} onClick={() => !n.is_read && markAsRead(n.id)} className={`flex gap-4 px-6 py-5 items-start cursor-pointer transition-colors duration-150 ${idx < filteredNotifs.length - 1 ? "border-b border-gray-200" : "border-none"} ${n.is_read ? "bg-white hover:bg-gray-50" : "bg-blue-50/40 hover:bg-blue-50/60"}`}>
                     
                     <div className="relative shrink-0">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center ${icn.bgClass} ${icn.textClass}`}>
                          {icn.i}
                        </div>
                       {!n.is_read && <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 border-2 border-white rounded-full" />}
                     </div>

                     <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-start">
                         <p className={`m-[0_0_4px] text-sm text-gray-900 ${n.is_read ? "font-semibold" : "font-bold"}`}>{n.title}</p>
                         <div className="flex items-center gap-3">
                           <span className="text-xs text-gray-400 font-mono">{daysAgo(n.created_at)}</span>
                           <button onClick={(e) => { e.stopPropagation(); deleteNotif(n.id); }} title="Delete" className="bg-transparent border-none text-gray-400 cursor-pointer p-1 hover:text-gray-600 transition-colors">
                             {Ico.dots}
                           </button>
                         </div>
                       </div>
                       <p className={`m-0 text-[13px] leading-relaxed ${n.is_read ? "text-gray-500" : "text-gray-700"}`}>{n.message}</p>
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
