"use client";

export default function ProfileSettings() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl">
      <h3 className="text-2xl font-bold mb-6">
        Personal & Public Profile
      </h3>

      <div className="space-y-6">

        {/* Full Name + Designation */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              className="w-full border p-3 rounded-md placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Designation
            </label>
            <input
              type="text"
              placeholder="Enter designation"
              className="w-full border p-3 rounded-md placeholder-gray-400"
            />
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">
              Official Email
            </label>
            <input
              type="email"
              placeholder="Enter official email"
              className="w-full border p-3 rounded-md placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Contact Number
            </label>
            <input
              type="text"
              placeholder="Enter contact number"
              className="w-full border p-3 rounded-md placeholder-gray-400"
            />
          </div>
        </div>

        {/* Constituency */}
        <div>
          <label className="block mb-1 font-medium">
            Constituency
          </label>
          <input
            type="text"
            placeholder="Enter constituency"
            className="w-full border p-3 rounded-md placeholder-gray-400"
          />
        </div>

        {/* Public Bio */}
        <div>
          <label className="block mb-1 font-medium">
            Public Bio
          </label>
          <textarea
            rows={4}
            placeholder="Write a short public bio..."
            className="w-full border p-3 rounded-md placeholder-gray-400"
          />
        </div>

        {/* Save Button */}
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}