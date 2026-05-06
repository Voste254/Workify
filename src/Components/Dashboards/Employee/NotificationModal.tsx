import { BellOff } from "lucide-react";

const NotificationModal = () => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 shadow-xl rounded-2xl p-6 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          0 New
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <BellOff className="text-gray-300" size={28} />
        </div>
        <p className="text-gray-900 font-semibold mb-1">No new notifications</p>
        <p className="text-gray-500 text-sm max-w-[200px]">
          We'll notify you when something important happens.
        </p>
      </div>

      <button className="w-full mt-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors border-t border-gray-50 pt-4">
        View all notifications
      </button>
    </div>
  );
};

export default NotificationModal;
