import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'warning'
            ? AlertCircle
            : Info;

        const borderStyle =
          toast.type === 'success'
            ? 'border-emerald-500/40 bg-slate-900/95 text-emerald-300'
            : toast.type === 'warning'
            ? 'border-amber-500/40 bg-slate-900/95 text-amber-300'
            : 'border-sky-500/40 bg-slate-900/95 text-sky-300';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur-md transition-all duration-300 ${borderStyle}`}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-slate-300/80 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
