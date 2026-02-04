import BlogCard from "./BlogCard";

const BlogPreview = () => {
  return (
    <div className="mb-12">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Career Insights</h2>
        <button className="text-green-600 text-sm font-medium">
          View All →
        </button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <BlogCard
          image="https://images.unsplash.com/photo-1551836022-d5d88e9218df"
          category="Interview Tips"
          title="10 Tips to Ace Your Next Job Interview"
          description="Prepare for success with these proven strategies that will help you stand out..."
          author="Jennifer Walsh"
          avatar="https://randomuser.me/api/portraits/women/44.jpg"
          date="2d ago"
          readTime="8 min read"
        />

        <BlogCard
          image="https://images.unsplash.com/photo-1552664730-d307ca884978"
          category="Career Growth"
          title="Building a Strong Personal Brand in 2024"
          description="Learn how to establish yourself as an industry expert and attract better opportunities..."
          author="Michael Torres"
          avatar="https://randomuser.me/api/portraits/men/32.jpg"
          date="5d ago"
          readTime="12 min read"
        />

        <BlogCard
          image="https://i.ibb.co/chrMm7n4/RESUME.jpg"
          category="CV Writing"
          title="The Art of Writing a CV That Gets Noticed"
          description="Discover what recruiters really look for and how to craft a compelling resume..."
          author="Lisa Park"
          avatar="https://randomuser.me/api/portraits/women/68.jpg"
          date="1/26/2026"
          readTime="10 min read"
        />

        <BlogCard
          image="https://images.unsplash.com/photo-1492724441997-5dc865305da7"
          category="Time Management"
          title="Remote Work: Staying Productive and Connected"
          description="Master the art of working from home with these practical tips and tools..."
          author="David Kim"
          avatar="https://randomuser.me/api/portraits/men/75.jpg"
          date="1/22/2026"
          readTime="7 min read"
        />

      </div>
    </div>
  );
};

export default BlogPreview;
