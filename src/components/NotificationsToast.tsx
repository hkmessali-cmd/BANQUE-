import React from 'react';
import { useBanking } from '../context/BankingContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const NotificationsToast: React.FC = () => {
  const { toasts, dismissToast } = useBanking();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all text-xs ${
            toast.type === 'success'
              ? 'bg-slate-900/95 border-emerald-500/60 text-slate-100'
              : toast.type === 'error'
              ? 'bg-slate-900/95 border-rose-500/60 text-slate-100'
              : toast.type === 'warning'
              ? 'bg-slate-900/95 border-amber-500/60 text-slate-100'
              : 'bg-slate-900/95 border-slate-700 text-slate-100'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="h-4 w-4 text-rose-400" />}
            {toast.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-400" />}
            {toast.type === 'info' && <Info className="h-4 w-4 text-blue-400" />}
          </div>

          <div className="flex-1 space-y-0.5">
            <div className="font-bold text-white flex items-center justify-between">
              <span>{toast.title}</span>
              <span className="text-[10px] text-slate-400 font-mono">{toast.timestamp}</span>
            </div>
            <div className="text-slate-300 text-[11px] leading-relaxed">{toast.message}</div>
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
