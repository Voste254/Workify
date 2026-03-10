import { useState } from "react";

const PrivacySettings = () => {
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState(true);
  const [resume, setResume] = useState(false);

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

  const items = [
    ["Profile visible to employers", visible, setVisible],
    ["Allow recruiters to message me", message, setMessage],
    ["Show my resume publicly", resume, setResume],
  ] as const;

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>

      {items.map(([label, val, setter]) => (
        <div
          key={label}
          className="flex justify-between items-center border-b py-4"
        >
          <span>{label}</span>
          <Toggle enabled={val} setEnabled={setter} />
        </div>
      ))}

      <div className="flex justify-between mt-8">
        <button className="text-red-600 font-medium hover:underline">
          Close My Account
        </button>
        <button className="bg-green-600 text-white px-6 py-2 rounded-xl">
          Save Changes
        </button>
      </div>
    </>
  );
};

export default PrivacySettings;