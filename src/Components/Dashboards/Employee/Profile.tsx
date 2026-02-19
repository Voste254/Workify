import { useState } from "react";
import { Edit2, Upload } from "lucide-react";
import Services from "./Services";


const MyProfile = () => {
  const [editMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState({
    name: "Okutah Voste",
     });

  


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
          <Services/>


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
