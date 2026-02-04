import { useState } from "react";
import { Search } from "lucide-react";
import BlogCard from "./BlogCard";

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = [
    "All",
    "Career Growth",
    "Interview Tips",
    "CV Writing",
    "Job Market",
    "Time Management",
    "Skill Building",
  ];

  // Blog cards defined ONCE
  const blogCards = [
    <BlogCard
      key="1"
      image="https://images.unsplash.com/photo-1551836022-d5d88e9218df"
      category="Interview Tips"
      title="10 Tips to Ace Your Next Job Interview"
      description="Prepare for success with these proven strategies that will help you stand out..."
      author="Jennifer Walsh"
      avatar="https://randomuser.me/api/portraits/women/44.jpg"
      date="2d ago"
      readTime="8 min read"
    />,

    <BlogCard
      key="2"
      image="https://images.unsplash.com/photo-1552664730-d307ca884978"
      category="Career Growth"
      title="Building a Strong Personal Brand in 2024"
      description="Learn how to establish yourself as an industry expert and attract better opportunities..."
      author="Michael Torres"
      avatar="https://randomuser.me/api/portraits/men/32.jpg"
      date="5d ago"
      readTime="12 min read"
    />,

    <BlogCard
      key="3"
      image="https://i.ibb.co/chrMm7n4/RESUME.jpg"
      category="CV Writing"
      title="The Art of Writing a CV That Gets Noticed"
      description="Discover what recruiters really look for and how to craft a compelling resume..."
      author="Lisa Park"
      avatar="https://randomuser.me/api/portraits/women/68.jpg"
      date="1/26/2026"
      readTime="10 min read"
    />,

    <BlogCard
      key="4"
      image="https://images.unsplash.com/photo-1492724441997-5dc865305da7"
      category="Time Management"
      title="Remote Work: Staying Productive and Connected"
      description="Master the art of working from home with these practical tips and tools..."
      author="David Kim"
      avatar="https://randomuser.me/api/portraits/men/75.jpg"
      date="1/22/2026"
      readTime="7 min read"
    />,
  ];

  // Featured blog (reuse one card)
  const featuredBlog = blogCards[0];

  // Filter logic
  const filteredBlogs = blogCards.filter((card) => {
    const matchesCategory =
      activeCategory === "All" ||
      card.props.category === activeCategory;

    const matchesSearch = card.props.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-10 space-y-10">

      {/* FEATURED BLOG */}
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src={featuredBlog.props.image}
          alt={featuredBlog.props.title}
          className="w-full h-[360px] object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="p-8 text-white max-w-2xl">
            <span className="inline-block bg-green-600 px-3 py-1 rounded-full text-xs mb-3">
              Featured
            </span>
            <h1 className="text-3xl font-bold mb-2">
              {featuredBlog.props.title}
            </h1>
            <p className="text-sm opacity-90">
              {featuredBlog.props.description}
            </p>

            <div className="flex items-center gap-3 mt-4 text-sm">
              <img
                src={featuredBlog.props.avatar}
                className="w-8 h-8 rounded-full"
              />
              <span>{featuredBlog.props.author}</span>
              <span>•</span>
              <span>{featuredBlog.props.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="bg-gray-100 rounded-xl p-4">
        <div className="flex items-center bg-white rounded-full px-4 py-2 border">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search articles..."
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm border transition
                ${
                  activeCategory === cat
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ARTICLE COUNT */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Latest Articles
        </h2>
        <span className="text-sm text-gray-500">
          {filteredBlogs.length} articles
        </span>
      </div>

      {/* BLOG GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs}
      </div>
    </div>
  );
};

export default BlogPage;
