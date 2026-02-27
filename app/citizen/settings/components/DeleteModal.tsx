"use client";

interface Props {
  onClose: () => void;
}

export default function DeleteModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Delete Account</h3>
        <p className="text-sm mb-6">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border"
          >
            Cancel
          </button>

          <button className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}