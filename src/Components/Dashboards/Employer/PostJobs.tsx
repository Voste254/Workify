import { useState } from "react";

const PostJobPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    experience: "",
    description: "",
    requirements: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // later connect to backend
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto border border-gray-300 shadow-xl rounded-2xl p-8">
        
        <h1 className="text-2xl font-bold mb-6">
          Post a New Job
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g. Frontend Developer"
            />
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Your Company"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Nairobi, Kenya"
              />
            </div>

          </div>

          {/* Job Type + Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
                <option>Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Salary (Optional)
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="e.g. KES 80,000 - 120,000"
              />
            </div>

          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Required Experience
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g. 2+ years"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Describe the responsibilities..."
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              required
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="List required skills and qualifications..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="reset"
              className="px-6 py-3 rounded-xl border hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition shadow-md"
            >
              Publish Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;