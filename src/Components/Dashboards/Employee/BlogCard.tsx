import { Bookmark } from "lucide-react";
import { useState } from "react";

export interface BlogCardProps {
  image: string;
  category: string;
  title: string;
  description: string;
  author: string;
  avatar: string;
  date: string;
  readTime: string;
}

const BlogCard = ({
  image,
  category,
  title,
  description,
  author,
  avatar,
  date,
  readTime,
}: BlogCardProps) => {
  const [saved, setSaved] = useState(false);

  return (
    <div className="border rounded-xl overflow-hidden bg-white">

      {/* Image Section */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />

        {/* Category Badge */}
        <span className="absolute top-4 left-4 text-xs px-3 py-1 rounded-full bg-white text-gray-700 font-medium">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Divider */}
        <div className="border-t mb-4"></div>

        {/* Author Row */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt={author}
              className="w-8 h-8 rounded-full object-cover"
            />

            <div>
              <p className="text-sm font-medium">{author}</p>
              <p className="text-xs text-gray-500">
                {date} • {readTime}
              </p>
            </div>
          </div>

          {/* Bookmark */}
          <button onClick={() => setSaved(!saved)}>
            <Bookmark
              size={18}
              className={
                saved
                  ? "text-green-600 fill-green-600"
                  : "text-gray-400"
              }
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
