"use client";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-3 text-sm text-slate-300">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-white">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
