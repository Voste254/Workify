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
  { id: 1, title: "10 Essential Interview Tips for Software Engineers", category: "Interview Tips", date: "Oct 12, 2023", status: "Published" },
  { id: 2, title: "How to Build a Standout CV in 2024", category: "CV Writing", date: "Oct 10, 2023", status: "Draft" },
  { id: 3, title: "The Current State of the Remote Job Market", category: "Job Market", date: "Oct 01, 2023", status: "Published" },
];

const EmployerBlog = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState("");

  return (
    <div className="bg-gray-50 min-h-screen p-10 max-w-[1152px] mx-auto font-sans text-gray-900 flex flex-col gap-10">
      
      {/* Header */}
      <div>
        <h1 className="text-[30px] font-bold m-0 mb-2">Blog & Insights</h1>
        <p className="text-gray-500 m-0 text-base">Publish articles, share industry insights, and connect with job seekers.</p>
      </div>

      {/* Editor Section */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-[20px] font-semibold m-0 mb-6">Create New Post</h2>
        
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Post Title</label>
              <input 
                type="text" 
                placeholder="Enter an engaging title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[15px] outline-none text-gray-900 focus:border-gray-300 transition-colors duration-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[15px] outline-none text-gray-900 cursor-pointer focus:border-gray-300 transition-colors duration-200"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Cover Image</label>
            <label className="flex flex-col items-center justify-center w-full h-[128px] border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
              <div className="flex flex-col items-center pt-5 pb-6">
                <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                <p className="m-0 mb-2 text-sm text-gray-500"><strong className="font-semibold text-gray-700">Click to upload</strong> or drag and drop</p>
                <p className="m-0 text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Content</label>
            <div className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden flex flex-col focus-within:border-gray-300 transition-colors duration-200">
              <div className="flex items-center flex-wrap gap-2 px-3 py-2 border-b border-gray-200 bg-white">
                <button className="bg-transparent border-none p-1.5 cursor-pointer text-gray-500 rounded hover:bg-gray-100 transition-colors"><Bold size={16} /></button>
                <button className="bg-transparent border-none p-1.5 cursor-pointer text-gray-500 rounded hover:bg-gray-100 transition-colors"><Italic size={16} /></button>
                <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                <button className="bg-transparent border-none p-1.5 cursor-pointer text-gray-500 rounded hover:bg-gray-100 transition-colors"><Link2 size={16} /></button>
                <button className="bg-transparent border-none p-1.5 cursor-pointer text-gray-500 rounded hover:bg-gray-100 transition-colors"><List size={16} /></button>
                <button className="bg-transparent border-none p-1.5 cursor-pointer text-gray-500 rounded hover:bg-gray-100 transition-colors"><ImageIcon size={16} /></button>
              </div>
              <textarea 
                rows={8}
                placeholder="Write your insights here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 bg-transparent border-none outline-none font-mono text-sm resize-y text-gray-900 min-h-[150px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end flex-wrap gap-3 pt-2">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 border-none rounded-lg font-medium cursor-pointer text-sm hover:bg-gray-200 transition-colors">
              <Save size={18} />
              Save Draft
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white border-none rounded-lg font-medium cursor-pointer text-sm hover:bg-gray-800 transition-colors">
              <Send size={18} />
              Post Blog
            </button>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-[20px] font-semibold m-0 mb-6">Recent Posts</h2>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm">
                  <th className="px-6 py-4 font-medium border-b border-gray-200">Title</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-200">Category</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-200">Date</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-200">Status</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_POSTS.map((post) => (
                  <tr key={post.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="px-2.5 py-1 bg-gray-100 rounded-md">{post.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{post.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${post.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="bg-transparent border-none text-sm font-medium text-blue-600 cursor-pointer mr-4 hover:text-blue-800 transition-colors">Edit</button>
                      <button className="bg-transparent border-none text-sm font-medium text-red-600 cursor-pointer hover:text-red-800 transition-colors">Delete</button>
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
