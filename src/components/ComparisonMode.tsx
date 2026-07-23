import React, { useState } from 'react';
import { COMPARISONS } from '../data/comparisons';
import { OSKind } from '../types';
import { GitCompare, Search, Terminal, ArrowRight, Check } from 'lucide-react';

interface ComparisonModeProps {
  onTestCommand: (cmd: string, targetOS: OSKind) => void;
}

export const ComparisonMode: React.FC<ComparisonModeProps> = ({ onTestCommand }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['Todos', 'Navegação', 'Manipulação de Arquivos', 'Processos', 'Rede & Sistema', 'Busca & Filtros'];

  const filtered = COMPARISONS.filter(item => {
    const matchesCat = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesSearch =
      item.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.linux.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.powershell.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cmd.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100 flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-amber-400" />
            Tabela de Equivalência e Comparação
          </h2>
          <p className="text-xs text-slate-400">
            Compare o comando equivalente entre Linux Bash, Windows PowerShell e CMD
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar comando (ex: ls, dir...)"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 gap-4 flex-1 overflow-y-auto pr-1 no-scrollbar">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs italic">
            Nenhum comando encontrado para o termo de busca informado.
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-mono text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 mt-1">{item.concept}</h3>
                </div>
                <p className="text-xs text-slate-400 max-w-md hidden sm:block text-right">{item.description}</p>
              </div>

              {/* 3 OS Command Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Linux */}
                <div className="bg-slate-900 border border-emerald-500/30 rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-1.5">
                    <span>🐧 Linux Bash</span>
                  </div>
                  <code className="bg-black/60 px-2 py-1.5 rounded font-mono text-xs text-emerald-300 block mb-2 break-all">
                    {item.linux}
                  </code>
                  <button
                    onClick={() => onTestCommand(item.linux, 'linux')}
                    className="flex items-center justify-center gap-1.5 w-full py-1 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                  >
                    <Terminal className="w-3 h-3" /> Testar no Linux
                  </button>
                </div>

                {/* PowerShell */}
                <div className="bg-slate-900 border border-blue-500/30 rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-semibold text-blue-400 mb-1.5">
                    <span>🪟 Windows PowerShell</span>
                  </div>
                  <code className="bg-black/60 px-2 py-1.5 rounded font-mono text-xs text-blue-300 block mb-2 break-all">
                    {item.powershell}
                  </code>
                  <button
                    onClick={() => onTestCommand(item.powershell, 'powershell')}
                    className="flex items-center justify-center gap-1.5 w-full py-1 rounded text-[11px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                  >
                    <Terminal className="w-3 h-3" /> Testar no PowerShell
                  </button>
                </div>

                {/* CMD */}
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>💻 Windows CMD</span>
                  </div>
                  <code className="bg-black/60 px-2 py-1.5 rounded font-mono text-xs text-slate-200 block mb-2 break-all">
                    {item.cmd}
                  </code>
                  <button
                    onClick={() => onTestCommand(item.cmd, 'cmd')}
                    className="flex items-center justify-center gap-1.5 w-full py-1 rounded text-[11px] font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
                  >
                    <Terminal className="w-3 h-3" /> Testar no CMD
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800 italic">
                💡 <span className="font-semibold text-slate-300">Explicação:</span> {item.explanation}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
