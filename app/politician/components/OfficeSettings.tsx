"use client";

export default function OfficeSettings() {
  return (
    <div className="bg-white text-black p-8 rounded-xl shadow-lg max-w-4xl">
      <h3 className="text-2xl font-semibold mb-6">
        Office Settings
      </h3>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Office Address"
          className="w-full border p-2 rounded-md"
        />

        <input
          type="text"
          placeholder="Office Contact Number"
          className="w-full border p-2 rounded-md"
        />

        <textarea
          placeholder="Office Description"
          className="w-full border p-2 rounded-md"
        />

        <button className="bg-indigo-600 text-white px-6 py-2 rounded-md">
          Save Office Details
        </button>
      </div>
    </div>
  );
}