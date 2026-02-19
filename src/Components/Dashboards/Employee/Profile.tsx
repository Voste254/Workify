import { useState } from "react";
import { Edit2, Upload } from "lucide-react";

const counties = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Kiambu",
  "Uasin Gishu",
  "Machakos",
  "Kajiado",
];

const MyProfile = () => {
  const [editMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState({
    name: "John Mwangi",
    service: "Data Analyst",
    location: "Nairobi",
    rate: "2500",
    skills: ["Excel", "SQL", "Power BI"],
    availability: ["Monday", "Tuesday", "Friday"],
    bio: "Passionate about solving real world problems using data.",
  });

  const [newSkill, setNewSkill] = useState("");

  const toggleSkill = (day: string) => {
    setProfile((prev) => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter((d) => d !== day)
        : [...prev.availability, day],
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill],
      });
      setNewSkill("");
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Profile</h2>

        <button
          onClick={() => setEditMode(!editMode)}
          className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded"
        >
          <Edit2 size={16} />
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="border border-gray-400 rounded-xl p-6">

          {/* Avatar */}
          <div className="flex flex-col items-center">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover mb-3"
            />

            {editMode && (
              <button className="text-sm text-green-600 flex gap-2 items-center">
                <Upload size={14} />
                Upload Photo
              </button>
            )}
          </div>

          {/* Rating */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">Employer Rating</p>
            <div className="text-yellow-500 text-lg">★★★★☆</div>
            <p className="text-sm text-gray-500">4.2 / 5</p>
          </div>

          {/* CV Upload */}
          <div className="mt-6">
            <p className="text-sm font-medium mb-2">CV / Resume</p>
            <button className="w-full border border-green-600 text-green-600 py-2 rounded">
              Upload CV
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 border border-gray-400 rounded-xl p-6">

          {/* Name */}
          <div className="mb-4">
            <label className="text-sm">Full Name</label>
            <input
              disabled={!editMode}
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          {/* Service */}
          <div className="mb-4">
            <label className="text-sm">Service Offered</label>
            <input
              disabled={!editMode}
              value={profile.service}
              onChange={(e) =>
                setProfile({ ...profile, service: e.target.value })
              }
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="text-sm">Location</label>
            <select
              disabled={!editMode}
              value={profile.location}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
              className="w-full border rounded p-2 mt-1"
            >
              {counties.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Rate */}
          <div className="mb-4">
            <label className="text-sm">Daily Rate (KES)</label>
            <input
              disabled={!editMode}
              value={profile.rate}
              onChange={(e) =>
                setProfile({ ...profile, rate: e.target.value })
              }
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          {/* Skills */}
          <div className="mb-4">
            <label className="text-sm">Skills</label>

            <div className="flex gap-2 mt-1">
              <input
                disabled={!editMode}
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="border rounded p-2 flex-1"
              />
              {editMode && (
                <button
                  onClick={addSkill}
                  className="px-4 bg-green-600 text-white rounded"
                >
                  Add
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="mb-4">
            <label className="text-sm">Available Days</label>

            <div className="flex flex-wrap gap-2 mt-2">
              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((day) => (
                <button
                  key={day}
                  disabled={!editMode}
                  onClick={() => toggleSkill(day)}
                  className={`px-3 py-1 border rounded ${
                    profile.availability.includes(day)
                      ? "bg-green-600 text-white"
                      : ""
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="text-sm">About Me</label>
            <textarea
              disabled={!editMode}
              value={profile.bio}
              onChange={(e) =>
                setProfile({ ...profile, bio: e.target.value })
              }
              className="w-full border rounded p-2 mt-1"
              rows={4}
            />
          </div>

          {/* Save */}
          {editMode && (
            <button className="px-6 py-2 bg-green-600 text-white rounded">
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
