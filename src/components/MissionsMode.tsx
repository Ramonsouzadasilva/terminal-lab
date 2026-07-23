import React, { useState } from 'react';
import { Mission, OSKind } from '../types';
import { MISSIONS } from '../data/missions';
import { ShieldAlert, CheckCircle2, Circle, Trophy, ArrowRight, Sparkles } from 'lucide-react';

interface MissionsModeProps {
  currentOS: OSKind;
  completedMissionIds: string[];
  activeMission: Mission | null;
  onSelectMission: (mission: Mission) => void;
}

export const MissionsMode: React.FC<MissionsModeProps> = ({
  currentOS,
  completedMissionIds,
  activeMission,
  onSelectMission
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100 flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-purple-400" />
          Modo Missões de Infraestrutura
        </h2>
        <p className="text-xs text-slate-400">
          Enfrente cenários reais de administração de servidores e suporte técnico
        </p>
      </div>

      {/* Active Mission Overview */}
      {activeMission ? (
        <div className="bg-slate-950/90 border border-purple-500/30 rounded-xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{activeMission.badge.split(' ')[0]}</span>
                <h3 className="text-base font-bold text-slate-100">
                  {activeMission.title}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {activeMission.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-lg font-mono font-bold">
                Dificuldade: {activeMission.difficulty}
              </span>
              <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg font-mono font-bold">
                +{activeMission.xpReward} XP
              </span>
            </div>
          </div>

          {/* Checklist Steps */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Etapas da Missão ({activeMission.steps.filter(s => s.completed).length} / {activeMission.steps.length})
            </h4>

            {activeMission.steps.map((step, idx) => (
              <div
                key={step.id}
                className={`p-3 rounded-lg border flex items-start gap-3 ${
                  step.completed
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs">{step.title}</h5>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                  <p className="text-[11px] font-mono text-emerald-400/90 mt-1">{step.hint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Available Missions Selection */}
      <div className="space-y-2 flex-1 overflow-y-auto pr-1 no-scrollbar">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Selecione uma Missão
        </h4>

        {MISSIONS.map(m => {
          const isCompleted = completedMissionIds.includes(m.id);
          const isSelected = activeMission?.id === m.id;

          return (
            <div
              key={m.id}
              onClick={() => onSelectMission(m)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-purple-950/40 border-purple-500 text-slate-100 shadow-md'
                  : isCompleted
                  ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                  : 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-xl shrink-0">
                  {m.badge.split(' ')[0]}
                </div>
                <div>
                  <h5 className="font-bold text-sm flex items-center gap-2">
                    {m.title}
                    {isCompleted && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                        Concluída
                      </span>
                    )}
                  </h5>
                  <p className="text-xs text-slate-400 line-clamp-1">{m.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-amber-400">+{m.xpReward} XP</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
