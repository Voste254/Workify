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
    <div style={{ background: "#F9FAFB", minHeight: "100vh", padding: "40px", maxWidth: "1152px", margin: "0 auto", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#111827", display: "flex", flexDirection: "column", gap: "40px", boxSizing: "border-box" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}`}</style>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "30px", fontWeight: "700", margin: "0 0 8px 0" }}>Blog & Insights</h1>
        <p style={{ color: "#6b7280", margin: "0", fontSize: "16px" }}>Publish articles, share industry insights, and connect with job seekers.</p>
      </div>

      {/* Editor Section */}
      <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", boxSizing: "border-box" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 24px 0" }}>Create New Post</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Post Title</label>
              <input 
                type="text" 
                placeholder="Enter an engaging title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", padding: "10px 16px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", fontFamily: "inherit", fontSize: "15px", boxSizing: "border-box", outline: "none", color: "#111827" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%", padding: "10px 16px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", fontFamily: "inherit", fontSize: "15px", boxSizing: "border-box", outline: "none", color: "#111827", cursor: "pointer" }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Cover Image</label>
            <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "128px", border: "2px dashed #d1d5db", borderRadius: "8px", backgroundColor: "#f9fafb", cursor: "pointer" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "20px", paddingBottom: "24px" }}>
                <ImageIcon style={{ width: "32px", height: "32px", marginBottom: "12px", color: "#9ca3af" }} />
                <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#6b7280" }}><strong style={{ fontWeight: "600", color: "#374151" }}>Click to upload</strong> or drag and drop</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input type="file" style={{ display: "none" }} accept="image/*" />
            </label>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Content</label>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", backgroundColor: "#f9fafb", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px", padding: "8px 12px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}>
                <button style={{ background: "none", border: "none", padding: "6px", cursor: "pointer", color: "#6b7280", borderRadius: "4px" }}><Bold size={16} /></button>
                <button style={{ background: "none", border: "none", padding: "6px", cursor: "pointer", color: "#6b7280", borderRadius: "4px" }}><Italic size={16} /></button>
                <div style={{ width: "1px", height: "16px", backgroundColor: "#d1d5db", margin: "0 4px" }}></div>
                <button style={{ background: "none", border: "none", padding: "6px", cursor: "pointer", color: "#6b7280", borderRadius: "4px" }}><Link2 size={16} /></button>
                <button style={{ background: "none", border: "none", padding: "6px", cursor: "pointer", color: "#6b7280", borderRadius: "4px" }}><List size={16} /></button>
                <button style={{ background: "none", border: "none", padding: "6px", cursor: "pointer", color: "#6b7280", borderRadius: "4px" }}><ImageIcon size={16} /></button>
              </div>
              <textarea 
                rows={8}
                placeholder="Write your insights here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ width: "100%", padding: "16px", backgroundColor: "transparent", border: "none", outline: "none", fontFamily: "'DM Mono', monospace", fontSize: "14px", resize: "vertical", boxSizing: "border-box", color: "#111827" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap", gap: "12px", paddingTop: "8px" }}>
            <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", backgroundColor: "#f3f4f6", color: "#374151", border: "none", borderRadius: "8px", fontFamily: "inherit", fontWeight: "500", cursor: "pointer", fontSize: "14px" }}>
              <Save size={18} />
              Save Draft
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 24px", backgroundColor: "#111827", color: "#ffffff", border: "none", borderRadius: "8px", fontFamily: "inherit", fontWeight: "500", cursor: "pointer", fontSize: "14px" }}>
              <Send size={18} />
              Post Blog
            </button>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 24px 0" }}>Recent Posts</h2>
        <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse", minWidth: "600px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb", color: "#6b7280", fontSize: "14px" }}>
                  <th style={{ padding: "16px 24px", fontWeight: "500", borderBottom: "1px solid #e5e7eb" }}>Title</th>
                  <th style={{ padding: "16px 24px", fontWeight: "500", borderBottom: "1px solid #e5e7eb" }}>Category</th>
                  <th style={{ padding: "16px 24px", fontWeight: "500", borderBottom: "1px solid #e5e7eb" }}>Date</th>
                  <th style={{ padding: "16px 24px", fontWeight: "500", borderBottom: "1px solid #e5e7eb" }}>Status</th>
                  <th style={{ padding: "16px 24px", fontWeight: "500", borderBottom: "1px solid #e5e7eb", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_POSTS.map((post) => (
                  <tr key={post.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "16px 24px", fontWeight: "500", color: "#111827" }}>{post.title}</td>
                    <td style={{ padding: "16px 24px", fontSize: "14px", color: "#4b5563" }}>
                      <span style={{ padding: "4px 10px", backgroundColor: "#f3f4f6", borderRadius: "6px" }}>{post.category}</span>
                    </td>
                    <td style={{ padding: "16px 24px", fontSize: "14px", color: "#6b7280" }}>{post.date}</td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ 
                        padding: "4px 10px", 
                        fontSize: "12px", 
                        fontWeight: "600", 
                        borderRadius: "9999px",
                        backgroundColor: post.status === "Published" ? "#d1fae5" : "#fef3c7",
                        color: post.status === "Published" ? "#047857" : "#b45309"
                      }}>
                        {post.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <button style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "500", color: "#2563eb", cursor: "pointer", marginRight: "16px" }}>Edit</button>
                      <button style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "500", color: "#dc2626", cursor: "pointer" }}>Delete</button>
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
