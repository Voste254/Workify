import { useState } from "react";
import { User, Bell, Shield, Clock, Eye } from "lucide-react";

type Tab = "account" | "security" | "notifications" | "activity" | "privacy";

export default function JobSeekerSettings() {
  const [tab, setTab] = useState<Tab>("account");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Settings</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4 bg-white rounded-2xl shadow-sm p-4">
            {[
              ["account", User, "Account", "Profile & preferences"],
              ["security", Shield, "Security", "Password & protection"],
              ["notifications", Bell, "Notifications", "Alerts & emails"],
              ["activity", Clock, "Activity Log", "Recent actions"],
              ["privacy", Eye, "Privacy", "Profile visibility"],
            ].map(([key, Icon, title, desc]) => (
              <button
                key={key}
                onClick={() => setTab(key as Tab)}
                className={`w-full flex gap-3 p-3 rounded-xl mb-2 text-left transition ${
                  tab === key
                    ? "bg-green-100 text-green-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Icon size={18} />
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm p-8">
            {tab === "account" && <AccountTab />}
            {tab === "security" && <SecurityTab />}
            {tab === "notifications" && <NotificationsTab />}
            {tab === "activity" && <ActivityTab />}
            {tab === "privacy" && <PrivacyTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

//////////////////////////////////////////////////////////////
// ACCOUNT TAB
//////////////////////////////////////////////////////////////

const AccountTab = () => (
  <>
    <h2 className="text-xl font-semibold mb-6">Account Information</h2>

    <div className="grid md:grid-cols-2 gap-6">
      <Input label="Full Name" />
      <Input label="Email Address" />
      <Input label="Phone Number" />

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
      <SaveButton />
    </div>
  </>
);

//////////////////////////////////////////////////////////////
// SECURITY TAB
//////////////////////////////////////////////////////////////

const SecurityTab = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Security Settings</h2>

      {/* Password */}
      <Row
        title="Change Password"
        action="Update"
        onClick={() => setShowPassword(!showPassword)}
      />
      {showPassword && (
        <div className="space-y-4 mb-6">
          <Input label="Old Password" type="password" />
          <Input label="New Password" type="password" />
          <div className="flex justify-end">
            <SaveButton />
          </div>
        </div>
      )}

      {/* 2FA */}
      <div className="flex justify-between items-center border-b py-5">
        <div>
          <p className="font-medium">Two-Factor Authentication</p>
          <p className="text-sm text-gray-500">
            Add extra protection to your account
          </p>
        </div>
        <Toggle enabled={twoFA} setEnabled={setTwoFA} />
      </div>

      {/* Devices */}
      <Row
        title="Device Management"
        action="Manage"
        onClick={() => setShowDevices(!showDevices)}
      />
      {showDevices && (
        <div className="mt-4 space-y-3 text-sm text-gray-600">
          <Device name="Chrome - Windows" location="Nairobi, Kenya" />
          <Device name="Safari - iPhone" location="Mombasa, Kenya" />
        </div>
      )}
    </>
  );
};

//////////////////////////////////////////////////////////////
// NOTIFICATIONS
//////////////////////////////////////////////////////////////

const NotificationsTab = () => {
  const [state, setState] = useState({
    jobs: true,
    updates: true,
    promo: false,
    tips: true,
  });

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Notifications</h2>

      {Object.entries({
        jobs: "Email job alerts",
        updates: "Application updates",
        promo: "Promotional emails",
        tips: "Weekly career tips",
      }).map(([key, label]) => (
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

//////////////////////////////////////////////////////////////
// ACTIVITY
//////////////////////////////////////////////////////////////

const ActivityTab = () => (
  <>
    <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
    <ul className="space-y-3 text-gray-600">
      <li>Applied to Frontend Developer – 2 days ago</li>
      <li>Updated profile – 1 week ago</li>
      <li>Changed password – 2 weeks ago</li>
    </ul>
  </>
);

//////////////////////////////////////////////////////////////
// PRIVACY
//////////////////////////////////////////////////////////////

const PrivacyTab = () => {
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState(true);
  const [resume, setResume] = useState(false);

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>

      {[
        ["Profile visible to employers", visible, setVisible],
        ["Allow recruiters to message me", message, setMessage],
        ["Show my resume publicly", resume, setResume],
      ].map(([label, val, setter]: any) => (
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
        <SaveButton />
      </div>
    </>
  );
};

//////////////////////////////////////////////////////////////
// REUSABLE COMPONENTS
//////////////////////////////////////////////////////////////

const Input = ({ label, type = "text" }: any) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input
      type={type}
      className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-600 outline-none"
    />
  </div>
);

const Row = ({ title, action, onClick }: any) => (
  <div className="flex justify-between items-center border-b py-5">
    <p className="font-medium">{title}</p>
    <button
      onClick={onClick}
      className="border px-4 py-2 rounded-xl hover:bg-gray-100 transition"
    >
      {action}
    </button>
  </div>
);

const Device = ({ name, location }: any) => (
  <div className="p-3 border rounded-xl flex justify-between">
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-gray-500">{location}</p>
    </div>
    <button className="text-red-500 text-sm">Log out</button>
  </div>
);

const SaveButton = () => (
  <button className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition">
    Save Changes
  </button>
);

//////////////////////////////////////////////////////////////
// SLIDER TOGGLE (Green Theme)
//////////////////////////////////////////////////////////////

const Toggle = ({ enabled, setEnabled }: any) => (
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