import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Clock,
  Eye,
} from "lucide-react";

type TabType =
  | "account"
  | "security"
  | "notifications"
  | "activity"
  | "privacy";

const JobSeekerSettings = () => {
  const [activeTab, setActiveTab] = useState<TabType>("account");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Settings</h1>
          <p className="text-gray-500 mt-1">Home / Settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <div className="lg:w-1/4 bg-white rounded-2xl shadow-sm p-4 h-fit">

            <SidebarItem
              icon={<User size={18} />}
              title="Account"
              description="Profile & preferences"
              active={activeTab === "account"}
              onClick={() => setActiveTab("account")}
            />

            <SidebarItem
              icon={<Shield size={18} />}
              title="Security"
              description="Password & protection"
              active={activeTab === "security"}
              onClick={() => setActiveTab("security")}
            />

            <SidebarItem
              icon={<Bell size={18} />}
              title="Notifications"
              description="Alerts & emails"
              active={activeTab === "notifications"}
              onClick={() => setActiveTab("notifications")}
            />

            <SidebarItem
              icon={<Clock size={18} />}
              title="Activity Log"
              description="Recent actions"
              active={activeTab === "activity"}
              onClick={() => setActiveTab("activity")}
            />

            <SidebarItem
              icon={<Eye size={18} />}
              title="Privacy"
              description="Profile visibility"
              active={activeTab === "privacy"}
              onClick={() => setActiveTab("privacy")}
            />
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm p-8">

            {activeTab === "account" && <AccountTab />}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "activity" && <ActivityTab />}
            {activeTab === "privacy" && <PrivacyTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerSettings;

////////////////////////////////////////////////////////////////////////////////
// Sidebar Item
////////////////////////////////////////////////////////////////////////////////

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem = ({
  icon,
  title,
  description,
  active,
  onClick,
}: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-start gap-3 p-3 rounded-xl mb-2 text-left transition ${
      active
        ? "bg-green-100 text-green-600"
        : "hover:bg-gray-100 text-gray-700"
    }`}
  >
    <div>{icon}</div>
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </button>
);

////////////////////////////////////////////////////////////////////////////////
// ACCOUNT TAB
////////////////////////////////////////////////////////////////////////////////

const AccountTab = () => (
  <>
    <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <Input label="Full Name" defaultValue="Kevin Anderson" />
      <Input label="Email Address" defaultValue="k.anderson@example.com" />
      <Input label="Phone Number" defaultValue="(436) 486-3538" />
      <Input label="Job Title" defaultValue="Web Designer" />

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-2">Bio</label>
        <textarea
          rows={4}
          className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-600 outline-none"
          defaultValue="Passionate web designer with 8+ years experience."
        />
      </div>
    </div>

    <div className="flex justify-end mt-6">
      <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition">
        Save Changes
      </button>
    </div>
  </>
);

////////////////////////////////////////////////////////////////////////////////
// SECURITY TAB
////////////////////////////////////////////////////////////////////////////////

const SecurityTab = () => (
  <>
    <h2 className="text-xl font-semibold mb-6">Security Settings</h2>

    <SettingRow
      title="Change Password"
      description="Update your account password regularly."
      button="Update"
    />

    <SettingRow
      title="Two-Factor Authentication"
      description="Add extra protection to your account."
      button="Enable"
    />

    <SettingRow
      title="Device Management"
      description="Manage devices currently logged in."
      button="Manage"
    />
  </>
);

////////////////////////////////////////////////////////////////////////////////
// NOTIFICATIONS TAB
////////////////////////////////////////////////////////////////////////////////

const NotificationsTab = () => (
  <>
    <h2 className="text-xl font-semibold mb-6">Notifications</h2>

    <ToggleRow label="Email job alerts" />
    <ToggleRow label="Application updates" />
    <ToggleRow label="Promotional emails" />
    <ToggleRow label="Weekly career tips" />
  </>
);

////////////////////////////////////////////////////////////////////////////////
// ACTIVITY TAB
////////////////////////////////////////////////////////////////////////////////

const ActivityTab = () => (
  <>
    <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>

    <ul className="space-y-4 text-gray-600">
      <li>Applied to Frontend Developer – 2 days ago</li>
      <li>Updated profile information – 1 week ago</li>
      <li>Changed password – 2 weeks ago</li>
    </ul>
  </>
);

////////////////////////////////////////////////////////////////////////////////
// PRIVACY TAB
////////////////////////////////////////////////////////////////////////////////

const PrivacyTab = () => (
  <>
    <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>

    <ToggleRow label="Make profile visible to employers" />
    <ToggleRow label="Allow recruiters to message me" />
    <ToggleRow label="Show my resume publicly" />


<div className="flex justify-between">
    <div className="mt-8 inline-block">
      <button className="text-red-600 font-medium hover:underline">
        Close My Account
      </button>
    </div>
        <div className="mt-8 inline-block">
      <button className="bg-green-600 text-white rounded-md p-1 px-2 font-medium">
        Save Changes
      </button>
    </div>
</div>

  </>
);

////////////////////////////////////////////////////////////////////////////////
// Reusable Components
////////////////////////////////////////////////////////////////////////////////

interface InputProps {
  label: string;
  defaultValue: string;
}

const Input = ({ label, defaultValue }: InputProps) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input
      defaultValue={defaultValue}
      className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-600 outline-none"
    />
  </div>
);

interface SettingRowProps {
  title: string;
  description: string;
  button: string;
}

const SettingRow = ({
  title,
  description,
  button,
}: SettingRowProps) => (
  <div className="flex justify-between items-center border-b py-5">
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <button className="border px-4 py-2 rounded-xl hover:bg-gray-100 transition">
      {button}
    </button>
  </div>
);

interface ToggleRowProps {
  label: string;
}

const ToggleRow = ({ label }: ToggleRowProps) => (
  <div className="flex justify-between items-center border-b py-4">
    <span className="text-gray-700">{label}</span>
    <input type="checkbox" className="w-5 h-5 accent-green-600" />
  </div>
);