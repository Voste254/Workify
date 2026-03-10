const AccountSettings = () => (
  <>
    <h2 className="text-xl font-semibold mb-6">Account Information</h2>

    <div className="grid md:grid-cols-2 gap-6">
      {["Full Name", "Email Address", "Phone Number"].map((label) => (
        <div key={label}>
          <label className="block text-sm font-medium mb-2">{label}</label>
          <input className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-600 outline-none" />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium mb-2">
          Account Type
        </label>
        <select className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-600 outline-none">
          <option>Job Seeker</option>
          <option>Employer</option>
          <option>Both</option>
        </select>
      </div>
    </div>

    <div className="flex justify-end mt-6">
      <button className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition">
        Save Changes
      </button>
    </div>
  </>
);

export default AccountSettings;