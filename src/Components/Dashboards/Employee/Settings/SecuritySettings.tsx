import { useState } from "react";

const SecuritySettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const Toggle = ({
    enabled,
    setEnabled,
  }: {
    enabled: boolean;
    setEnabled: (v: boolean) => void;
  }) => (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
        enabled ? "bg-green-600" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
          enabled ? "translate-x-6" : ""
        }`}
      />
    </button>
  );

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Security Settings</h2>

      {/* Password */}
      <div className="flex justify-between items-center border-b py-5">
        <p className="font-medium">Change Password</p>
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="border px-4 py-2 rounded-xl hover:bg-gray-100 transition"
        >
          Update
        </button>
      </div>

      {showPassword && (
        <div className="space-y-4 mb-6">
          {["Old Password", "New Password"].map((label) => (
            <div key={label}>
              <label className="block text-base font-medium mb-2">{label}</label>
              <input
                type="password"
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button className="bg-green-600 text-white px-6 py-2 rounded-xl">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* 2FA */}
      <div className="flex justify-between items-center border-b py-5">
        <div>
          <p className="font-medium">Two-Factor Authentication</p>
          <p className="text-base text-gray-500">
            Add extra protection to your account
          </p>
        </div>
        <Toggle enabled={twoFA} setEnabled={setTwoFA} />
      </div>

      {/* Devices */}
      <div className="flex justify-between items-center border-b py-5">
        <p className="font-medium">Device Management</p>
        <button
          onClick={() => setShowDevices(!showDevices)}
          className="border px-4 py-2 rounded-xl hover:bg-gray-100 transition"
        >
          Manage
        </button>
      </div>

      {showDevices && (
        <div className="mt-4 space-y-3 text-base text-gray-600">
          {[
            ["Chrome - Windows", "Nairobi, Kenya"],
            ["Safari - iPhone", "Mombasa, Kenya"],
          ].map(([name, location]) => (
            <div
              key={name}
              className="p-3 border rounded-xl flex justify-between"
            >
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-gray-500">{location}</p>
              </div>
              <button className="text-red-500 text-base">Log out</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SecuritySettings;