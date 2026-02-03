import { MapPin, Bookmark } from "lucide-react";
import { useState } from "react";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  type: "Internship" | "Contractual" | "Permanent";
  rating: number;
  daysAgo: number;
}

const JobCard = ({
  title,
  company,
  location,
  salary,
  type,
  rating,
  daysAgo,
}: JobCardProps) => {
  const [saved, setSaved] = useState(false);

  return (
    <div className="border border-green-300 hover:border-green-800 rounded-xl p-6 bg-white">

      {/* Top Row */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-gray-600">{company}</p>
        </div>

        <button onClick={() => setSaved(!saved)}>
          <Bookmark
            size={20}
            className={saved ? "text-green-600 fill-green-600" : "text-gray-400"}
          />
        </button>
      </div>

      {/* Location + Days */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          {location}
        </div>
        <span>{daysAgo} days ago</span>
      </div>

      {/* Type Badge */}
      <div className="mb-3">
        <span className="text-xs px-3 py-1 rounded-full border bg-gray-100">
          {type}
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex text-yellow-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>
              {i < Math.round(rating) ? "★" : "☆"}
            </span>
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      </div>

      {/* Salary + Apply */}
      <div className="flex justify-between items-center">
        <span className="font-semibold text-green-700">
          KES {salary}
        </span>

        <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
          Apply
        </button>
      </div>
    </div>
  );
};

export default JobCard;
