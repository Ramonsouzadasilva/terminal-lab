import React, { useEffect, useState } from 'react';
import { SHORTCUTS } from '../data/shortcuts';
import { Keyboard, Command, Sparkles } from 'lucide-react';

export const ShortcutsMode: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = new Set(activeKeys);
      if (e.ctrlKey) keys.add('Ctrl');
      if (e.altKey) keys.add('Alt');
      if (e.shiftKey) keys.add('Shift');
      if (e.key === 'Tab') keys.add('Tab');
      if (e.key.length === 1) keys.add(e.key.toUpperCase());
      setActiveKeys(keys);
    };

    const handleKeyUp = () => {
      setActiveKeys(new Set());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeKeys]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100 flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-indigo-400" />
          Atalhos de Teclado de Terminal e Sistema
        </h2>
        <p className="text-xs text-slate-400">
          Domine os atalhos essenciais para agilizar sua produtividade no Linux e Windows
        </p>
      </div>

      {/* Interactive Key Detector Banner */}
      <div className="bg-slate-950 border border-indigo-500/30 p-3 rounded-xl flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">Teclas pressionadas no seu teclado físico:</span>
        <div className="flex items-center gap-1.5">
          {activeKeys.size === 0 ? (
            <span className="text-slate-600 italic">Pressione qualquer tecla para testar...</span>
          ) : (
            Array.from(activeKeys).map(k => (
              <span key={k} className="bg-indigo-600 text-white font-bold px-2 py-1 rounded shadow animate-bounce">
                {k}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Shortcuts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 overflow-y-auto pr-1 no-scrollbar">
        {SHORTCUTS.map(sc => (
          <div
            key={sc.id}
            className="bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 p-3.5 rounded-xl transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                  {sc.category} • {sc.os.toUpperCase()}
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{sc.action}</h3>
              </div>

              {/* Visual Key Pill Badges */}
              <div className="flex items-center gap-1">
                {sc.keys.map((k, i) => (
                  <kbd
                    key={i}
                    className="px-2 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-md font-mono text-xs font-bold shadow-inner"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {sc.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
