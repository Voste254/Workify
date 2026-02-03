const NotificationModal = () => {
  return (
    <div className="absolute right-6 top-16 w-80 bg-white border rounded-lg p-4 z-50">
      <h3 className="font-semibold mb-4">Notifications</h3>

      <div className="space-y-3 text-sm">
        <div className="border-b pb-2">
          New Job Match in Nairobi <br />
          <span className="text-gray-500">2 minutes ago</span>
        </div>
        <div className="border-b pb-2">
          Application Shortlisted <br />
          <span className="text-gray-500">1 hour ago</span>
        </div>
        <div>
          New Blog Post Published <br />
          <span className="text-gray-500">3 hours ago</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
