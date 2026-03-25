import { useState } from "react";
import { Send, Save, Image as ImageIcon, Link2, List, Bold, Italic } from "lucide-react";

const CATEGORIES = [
  "Career Growth",
  "Interview Tips",
  "CV Writing",
  "Job Market",
  "Time Management",
  "Skill Building",
];

const RECENT_POSTS = [
  {
    id: 1,
    title: "10 Essential Interview Tips for Software Engineers",
    category: "Interview Tips",
    date: "Oct 12, 2023",
    status: "Published",
  },
  {
    id: 2,
    title: "How to Build a Standout CV in 2024",
    category: "CV Writing",
    date: "Oct 10, 2023",
    status: "Draft",
  },
  {
    id: 3,
    title: "The Current State of the Remote Job Market",
    category: "Job Market",
    date: "Oct 01, 2023",
    status: "Published",
  },
];

const EmployerBlog = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState("");

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 font-sans text-gray-900">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog & Insights</h1>
        <p className="text-gray-500 mt-2">Publish articles, share industry insights, and connect with job seekers.</p>
      </div>

      {/* Editor Section */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">Create New Post</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Post Title</label>
              <input 
                type="text" 
                placeholder="Enter an engaging title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Content</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 focus-within:ring-2 focus-within:ring-black focus-within:bg-white transition">
              {/* Fake Toolbar */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-white">
                <button className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition"><Bold size={16} /></button>
                <button className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition"><Italic size={16} /></button>
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <button className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition"><Link2 size={16} /></button>
                <button className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition"><List size={16} /></button>
                <button className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition"><ImageIcon size={16} /></button>
              </div>
              <textarea 
                rows={8}
                placeholder="Write your insights here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 bg-transparent outline-none resize-y"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition">
              <Save size={18} />
              Save Draft
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition">
              <Send size={18} />
              Post Blog
            </button>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Recent Posts</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm">
                  <th className="px-6 py-4 font-medium border-b border-gray-200">Title</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-200">Category</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-200">Date</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-200">Status</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {RECENT_POSTS.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="px-2.5 py-1 bg-gray-100 rounded-md">{post.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{post.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        post.status === "Published" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition mr-4">Edit</button>
                      <button className="text-sm font-medium text-red-600 hover:text-red-800 transition">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default EmployerBlog;
