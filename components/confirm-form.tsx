"use client";

import { useState, type ReactNode } from "react";

export function ConfirmForm({
  action,
  message,
  children,
  className,
  hiddenFields,
}: {
  action: (formData: FormData) => void | Promise<void>;
  message: string;
  children: ReactNode;
  className?: string;
  hiddenFields?: Record<string, string>;
}) {
  const [confirming, setConfirming] = useState(false);

  const fields = hiddenFields
    ? Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))
    : null;

  if (confirming) {
    return (
      <div className={`rounded-xl border border-coral-200 bg-coral-50 p-3 ${className ?? ""}`}>
        <p className="text-[10px] leading-4 text-coral-800">{message}</p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-lg border border-coral-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-mist-50"
          >
            Cancel
          </button>
          <form action={action}>
            {fields}
            <button
              type="submit"
              className="rounded-lg bg-coral-500 px-2.5 py-1.5 text-[10px] font-semibold text-white hover:bg-coral-600"
            >
              Yes, delete
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg text-[10px] font-semibold text-coral-600 transition hover:bg-coral-50 hover:text-coral-700 ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
