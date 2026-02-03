import { MapPin } from "lucide-react";

const JobCard = () => {
  return (
    <div className="bg-white border rounded-xl p-6 hover:border hover:border-gray-700">

      <h4 className="text-lg font-semibold mb-2">
        Frontend Developer
      </h4>

      <p className="text-gray-500 text-sm mb-2">
        Tech Solutions Ltd
      </p>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          Nairobi County
        </div>
        <div>KES 120,000 - 180,000</div>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        <span className="bg-gray-100 px-2 py-1 text-xs rounded">
          React
        </span>
        <span className="bg-gray-100 px-2 py-1 text-xs rounded">
          TypeScript
        </span>
        <span className="bg-gray-100 px-2 py-1 text-xs rounded">
          Tailwind
        </span>
      </div>

      <button className="bg-slate-800 text-white px-4 py-2 rounded">
        Apply Now
      </button>

    </div>
  );
};

export default JobCard;
