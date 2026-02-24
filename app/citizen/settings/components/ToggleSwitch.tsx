"use client";

interface Props {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

export default function ToggleSwitch({ enabled, setEnabled }: Props) {
  return (
    <div
      onClick={() => setEnabled(!enabled)}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
        enabled ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
          enabled ? "translate-x-6" : ""
        }`}
      />
    </div>
  );
}