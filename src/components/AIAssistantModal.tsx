import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, Loader2, BookOpen } from 'lucide-react';
import { OSKind } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  os: OSKind;
  initialCommand?: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  os,
  initialCommand
}) => {
  const [promptInput, setPromptInput] = useState(initialCommand || '');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAskAI = async () => {
    if (!promptInput.trim()) return;
    setLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptInput, os, command: promptInput })
      });
      const data = await res.json();
      setAiResponse(data.reply || 'Sem resposta disponível.');
    } catch (err) {
      setAiResponse('Ocorreu um erro ao consultar o assistente de IA. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-purple-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Bot className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              Assistente de Terminal AI
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </h3>
            <p className="text-xs text-slate-400">Tire dúvidas sobre comandos e parâmetros do {os.toUpperCase()}</p>
          </div>
        </div>

        {/* Input prompt */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            Digite um comando para explicar ou faça uma pergunta em linguagem natural:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ex: Como compactar uma pasta tar.gz? ou Explique chmod 755"
              value={promptInput}
              onChange={e => setPromptInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAskAI()}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none focus:border-purple-500"
            />
            <button
              onClick={handleAskAI}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Perguntar</span>
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <span className="text-slate-500 font-bold">Exemplos:</span>
          {['ls -la flags', 'Como matar processo no Windows?', 'chmod 755', 'Diferença entre apt e yum'].map(chip => (
            <button
              key={chip}
              onClick={() => {
                setPromptInput(chip);
              }}
              className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-lg font-mono transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* AI Answer Box */}
        {aiResponse && (
          <div className="bg-slate-950 border border-purple-500/20 p-4 rounded-xl space-y-2 max-h-64 overflow-y-auto text-xs leading-relaxed text-slate-200">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-[11px]">
              <BookOpen className="w-3.5 h-3.5" /> RESPOSTA DA INTELIGÊNCIA ARTIFICIAL
            </div>
            <div className="whitespace-pre-wrap font-sans text-slate-300">
              {aiResponse}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
