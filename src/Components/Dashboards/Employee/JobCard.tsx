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
  logo?: string;
}

export default function JobCard({ title, company, location, salary, type, rating, daysAgo, logo }: JobCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-white border-[1.5px] border-gray-200 hover:border-gray-400 transition-colors p-5 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 border-[1.5px] border-gray-200 bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-900 font-mono flex-shrink-0">
            {logo ?? company.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 leading-snug">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{company}</p>
          </div>
        </div>
        <button onClick={() => setSaved(!saved)} className={`flex-shrink-0 transition-colors ${saved ? "text-amber-500" : "text-gray-300 hover:text-gray-500"}`}>
          <Bookmark size={16} fill={saved ? "currentColor" : "none"}/>
        </button>
      </div>

      {/* Meta */}
      <div className="flex items-center flex-wrap gap-2">
        <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={11}/>{location}</span>
        <span className="text-xs px-2.5 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 font-medium">{type}</span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1.5">
        <div className="flex text-amber-400 text-xs">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < Math.round(rating) ? "★" : "☆"}</span>
          ))}
        </div>
        <span className="text-xs text-gray-400 font-mono">{rating.toFixed(1)}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div>
          <p className="text-sm font-semibold text-gray-900 font-mono">KES {salary}</p>
          <p className="text-xs text-gray-400 mt-0.5">{daysAgo}d ago</p>
        </div>
        <button className="h-9 px-4 bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 transition-colors">
          Apply →
        </button>
      </div>

    </div>
  );
}