interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: Props) {
  const menuItems = [
    { id: "profile", label: "Profile" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
    { id: "preferences", label: "Preferences" },
  ];

  return (
    <div className="w-64 bg-white shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Settings</h2>
      <ul className="space-y-3">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`cursor-pointer p-2 rounded-md ${
              activeTab === item.id
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}