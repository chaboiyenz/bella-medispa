"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

interface Props {
  show:     boolean;
  message?: string;
  onClose:  () => void;
}

export function Toast({ show, message = "Changes saved successfully.", onClose }: Props) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-[200] flex items-center gap-3 px-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 animate-in slide-in-from-right-4 duration-200">
      <span className="w-7 h-7 rounded-full bg-[#17a2b8]/15 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-4 h-4 text-[#17a2b8]" />
      </span>
      <p className="text-sm font-semibold text-[#0F172A]">{message}</p>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="ml-2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
