import { BellOff, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  type: string;
}

const NotificationModal = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && data) {
        setNotifications(data);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, [user]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="absolute right-0 mt-2 w-85 bg-white border border-gray-100 shadow-2xl rounded-2xl p-0 z-50 animate-in fade-in zoom-in duration-200 origin-top-right overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-100 border-t-blue-600 rounded-full animate-spin mb-3" />
            <p className="text-sm text-gray-400">Loading...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-4 hover:bg-gray-50 transition-colors relative group ${!n.is_read ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className={`text-sm font-bold ${!n.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                    {n.title}
                  </p>
                  {!n.is_read && (
                    <button 
                      onClick={() => markAsRead(n.id)}
                      className="opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity"
                      title="Mark as read"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-2">
                  {n.message}
                </p>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                  {new Date(n.created_at).toLocaleDateString()} · {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <BellOff className="text-gray-300" size={28} />
            </div>
            <p className="text-gray-900 font-semibold mb-1">No notifications yet</p>
            <p className="text-gray-500 text-xs max-w-[200px]">
              We'll notify you when you receive an invitation or update.
            </p>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50/50 border-t border-gray-50">
        <button className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
