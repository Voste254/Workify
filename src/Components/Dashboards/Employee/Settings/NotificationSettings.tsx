import { useState } from "react";

const NotificationSettings = () => {
  const [state, setState] = useState({
    jobs: true,
    updates: true,
    promo: false,
    tips: true,
  });

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

  const options = {
    jobs: "Email job alerts",
    updates: "Application updates",
    promo: "Promotional emails",
    tips: "Weekly career tips",
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Notifications</h2>

      {Object.entries(options).map(([key, label]) => (
        <div
          key={key}
          className="flex justify-between items-center border-b py-4"
        >
          <span>{label}</span>
          <Toggle
            enabled={state[key as keyof typeof state]}
            setEnabled={() =>
              setState({ ...state, [key]: !state[key as keyof typeof state] })
            }
          />
        </div>
      ))}
    </>
  );
};

export default NotificationSettings;