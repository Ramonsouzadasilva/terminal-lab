import React, { useState } from 'react';
import { Challenge, CategoryLevel, OSKind } from '../types';
import { CHALLENGES } from '../data/challenges';
import { CheckCircle2, Circle, HelpCircle, ArrowRight, Award, Zap, Lightbulb, Sparkles } from 'lucide-react';

interface TrainingModeProps {
  currentOS: OSKind;
  completedChallengeIds: string[];
  onSelectChallenge: (challenge: Challenge) => void;
  activeChallenge: Challenge | null;
}

export const TrainingMode: React.FC<TrainingModeProps> = ({
  currentOS,
  completedChallengeIds,
  onSelectChallenge,
  activeChallenge
}) => {
  const [selectedLevel, setSelectedLevel] = useState<CategoryLevel>('basico');
  const [showHint, setShowHint] = useState(false);

  const filteredChallenges = CHALLENGES.filter(
    c => (c.os === currentOS || c.id.startsWith('git-')) && c.level === selectedLevel
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100 flex flex-col h-full space-y-4">
      {/* Header & Level Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Modo Treinamento Guiado
          </h2>
          <p className="text-xs text-slate-400">
            Aprenda passo a passo resolvendo desafios interativos no terminal
          </p>
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedLevel('basico')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedLevel === 'basico'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Básico
          </button>
          <button
            onClick={() => setSelectedLevel('intermediario')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedLevel === 'intermediario'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Intermediário
          </button>
          <button
            onClick={() => setSelectedLevel('avancado')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedLevel === 'avancado'
                ? 'bg-purple-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Avançado
          </button>
        </div>
      </div>

      {/* Active Challenge Box */}
      {activeChallenge ? (
        <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Desafio Ativo • +{activeChallenge.xp} XP
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  OS: {activeChallenge.os.toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mt-1">
                {activeChallenge.title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {activeChallenge.description}
          </p>

          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg font-mono text-xs text-emerald-400">
            <span className="text-slate-500 font-bold block mb-1">OBJETIVO / TAREFA:</span>
            {activeChallenge.task}
          </div>

          {/* Hint Section */}
          {showHint ? (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Dica: </span>
                {activeChallenge.hint}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowHint(true)}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Precisa de uma dica?
            </button>
          )}

          <div className="text-[11px] text-slate-400 italic">
            💡 Digite o comando diretamente na janela do terminal interativo para validar.
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/40 border border-dashed border-slate-800 p-6 rounded-xl text-center text-slate-400">
          <Award className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
          <p className="text-sm font-semibold">Nenhum desafio selecionado</p>
          <p className="text-xs text-slate-500 mt-1">Escolha um dos desafios da lista abaixo para começar a treinar.</p>
        </div>
      )}

      {/* Challenges List */}
      <div className="space-y-2 flex-1 overflow-y-auto pr-1 no-scrollbar">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Lista de Desafios ({selectedLevel.toUpperCase()})
        </h4>

        {filteredChallenges.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4 text-center">
            Nenhum desafio encontrado para este nível no ambiente selecionado.
          </p>
        ) : (
          filteredChallenges.map(ch => {
            const isCompleted = completedChallengeIds.includes(ch.id);
            const isSelected = activeChallenge?.id === ch.id;

            return (
              <div
                key={ch.id}
                onClick={() => {
                  onSelectChallenge(ch);
                  setShowHint(false);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 text-slate-100 shadow-md'
                    : isCompleted
                    ? 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                  )}
                  <div>
                    <h5 className="font-bold text-xs">{ch.title}</h5>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{ch.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-amber-400">+{ch.xp} XP</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
