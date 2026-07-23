import React from 'react';
import { AlertTriangle, ShieldAlert, X, Check } from 'lucide-react';

interface DangerousCommandModalProps {
  alertData: {
    title: string;
    description: string;
    command: string;
  } | null;
  onClose: () => void;
}

export const DangerousCommandModal: React.FC<DangerousCommandModalProps> = ({
  alertData,
  onClose
}) => {
  if (!alertData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border-2 border-rose-500 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-rose-500">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-base text-rose-400">{alertData.title}</h3>
            <span className="text-xs text-slate-400 font-mono">SIMULAÇÃO DE ALERTA CRÍTICO</span>
          </div>
        </div>

        <div className="bg-black/80 border border-rose-500/30 p-3 rounded-xl font-mono text-xs text-rose-300">
          <span className="text-slate-500 font-bold block mb-1">COMANDO DIGITADO:</span>
          {alertData.command}
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed">
          <p className="font-semibold text-slate-100">O que aconteceria no sistema real?</p>
          <p>{alertData.description}</p>
          <div className="pt-2 text-[11px] text-emerald-400 font-semibold border-t border-slate-800">
            ✅ <span className="text-slate-200">Proteção Ativa:</span> O Terminal Master interceptou este comando e impediu qualquer dano simulated!
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-all"
          >
            Entendido, continuar praticando
          </button>
        </div>
      </div>
    </div>
  );
};
