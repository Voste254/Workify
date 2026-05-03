import { useState, useEffect } from "react";
import { Search, ArrowLeft, ThumbsUp, MessageSquare } from "lucide-react";
import Pagination from "./Pagination";
import BlogCard from "./BlogCard";

const PAGE_SIZE = 6;

const blogData = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
    category: "Interview Tips",
    title: "10 Tips to Ace Your Next Job Interview",
    description: "Prepare for success with these proven strategies that will help you stand out...",
    author: "Emma Kerubo",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "2d ago",
    readTime: "8 min read"
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    category: "Career Growth",
    title: "Building a Strong Personal Brand in 2026",
    description: "Learn how to establish yourself as an industry expert and attract better opportunities...",
    author: "Andrew Otieno",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "5d ago",
    readTime: "12 min read"
  },
  {
    id: "3",
    image: "https://i.ibb.co/chrMm7n4/RESUME.jpg",
    category: "CV Writing",
    title: "The Art of Writing a CV That Gets Noticed",
    description: "Discover what recruiters really look for and how to craft a compelling resume...",
    author: "Rose Njoki",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    date: "1/26/2026",
    readTime: "10 min read"
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    category: "Time Management",
    title: "Remote Work: Staying Productive and Connected",
    description: "Master the art of working from home with these practical tips and tools...",
    author: "Walter Sankale",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    date: "1/22/2026",
    readTime: "7 min read"
  }
];

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState<typeof blogData[0] | null>(null);

  const categories = [
    "All",
    "Career Growth",
    "Interview Tips",
    "CV Writing",
    "Job Market",
    "Time Management",
    "Skill Building",
  ];

  // Filter logic
  const filteredBlogs = blogData.filter((b) => {
    const matchesCategory =
      activeCategory === "All" ||
      b.category === activeCategory;

    const matchesSearch = b.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [activeCategory, search]);

  const totalPages  = Math.max(1, Math.ceil(filteredBlogs.length / PAGE_SIZE));
  const pagedBlogs  = filteredBlogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (selectedBlog) {
    return (
      <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-6">
        <button 
          onClick={() => setSelectedBlog(null)}
          className="flex items-center text-gray-500 hover:text-gray-900 transition font-medium"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to blogs
        </button>
        
        <div className="bg-white rounded-2xl overflow-hidden border shadow-sm">
          <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-[400px] object-cover" />
          <div className="p-8 lg:p-12">
            <span className="inline-block bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              {selectedBlog.category}
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900 leading-tight">{selectedBlog.title}</h1>
            
            <div className="flex items-center gap-4 mb-8 text-gray-500 border-b border-gray-100 pb-8">
              <img src={selectedBlog.avatar} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-gray-900 text-base">{selectedBlog.author}</p>
                <p className="text-sm mt-0.5">{selectedBlog.date} • {selectedBlog.readTime}</p>
              </div>
            </div>

            <div className="text-gray-700 leading-relaxed text-lg mb-10 space-y-6">
              <p className="text-xl font-medium text-gray-900">{selectedBlog.description}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>

            <div className="flex items-center gap-6 border-t border-gray-100 pt-6">
              <button className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition">
                <ThumbsUp size={22} /> <span className="font-semibold text-base">Like</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition">
                <MessageSquare size={22} /> <span className="font-semibold text-base">Comment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Featured blog
  const featuredBlog = blogData[1];

  return (
    <div className="p-6 lg:p-10 space-y-10">
      {/* FEATURED BLOG */}
      <div 
        className="relative rounded-2xl overflow-hidden cursor-pointer group"
        onClick={() => setSelectedBlog(featuredBlog)}
      >
        <img
          src={featuredBlog.image}
          alt={featuredBlog.title}
          className="w-full h-[360px] object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="p-8 text-white max-w-2xl">
            <span className="inline-block bg-green-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
              Featured
            </span>
            <h1 className="text-4xl font-bold mb-3 leading-tight">
              {featuredBlog.title}
            </h1>
            <p className="text-base opacity-90 line-clamp-2">
              {featuredBlog.description}
            </p>

            <div className="flex items-center gap-3 mt-5 text-sm font-medium">
              <img
                src={featuredBlog.avatar}
                className="w-8 h-8 rounded-full border-2 border-white/20"
              />
              <span>{featuredBlog.author}</span>
              <span className="opacity-60">•</span>
              <span className="opacity-90">{featuredBlog.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="bg-gray-100 rounded-xl p-4">
        <div className="flex items-center bg-white rounded-full px-4 py-2 border shadow-sm">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search articles..."
            className="bg-transparent outline-none w-full text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition
                ${
                  activeCategory === cat
                    ? "bg-gray-900 text-white border-gray-900 shadow-md"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:text-gray-900"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ARTICLE COUNT */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Latest Articles
        </h2>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {filteredBlogs.length} articles
        </span>
      </div>

      {/* BLOG GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagedBlogs.map(b => (
          <BlogCard
            key={b.id}
            image={b.image}
            category={b.category}
            title={b.title}
            description={b.description}
            author={b.author}
            avatar={b.avatar}
            date={b.date}
            readTime={b.readTime}
            onClick={() => setSelectedBlog(b)}
          />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} variant="tailwind" />
    </div>
  );
};

export default BlogPage;
