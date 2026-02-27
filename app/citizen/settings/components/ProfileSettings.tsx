export default function ProfileSettings() {
  return (
    <div className="bg-white text-black p-8 rounded-xl shadow-lg max-w-3xl">
      <h3 className="text-2xl font-semibold mb-6">Profile & Account</h3>

      {/* Avatar Section */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl">
          N
        </div>
        <button className="bg-gray-800 text-white px-4 py-2 rounded-md">
          Upload Photo
        </button>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-6">
        <Input label="Full Name" />
        <Input label="Email" />
        <Input label="Phone" />
        <Input label="City / Region" />
      </div>

      {/* Stats */}
      <div className="mt-8 bg-gray-100 p-4 rounded-lg">
        <h4 className="font-semibold mb-3">Account Stats</h4>
        <p>Total Issues Raised: 12</p>
        <p>Issues Resolved: 8</p>
        <p>Member Since: Jan 2026</p>
      </div>

      <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md">
        Save Changes
      </button>
    </div>
  );
}

function Input({ label }: { label: string }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input className="w-full border border-gray-300 rounded-md p-2" />
    </div>
  );
}