import React from 'react';
import { UserProgress, Achievement } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { Award, Zap, Trophy, Shield, Terminal, RotateCcw, CheckCircle, Flame } from 'lucide-react';

interface ProgressDashboardProps {
  progress: UserProgress;
  onResetProgress: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ progress, onResetProgress }) => {
  const achievements: Achievement[] = INITIAL_ACHIEVEMENTS.map(ach => ({
    ...ach,
    unlocked: progress.unlockedAchievementIds.includes(ach.id)
  }));

  const linuxCompleted = progress.completedChallengeIds.filter(id => id.startsWith('linux')).length;
  const psCompleted = progress.completedChallengeIds.filter(id => id.startsWith('ps')).length;
  const cmdCompleted = progress.completedChallengeIds.filter(id => id.startsWith('cmd')).length;

  const linuxPct = Math.min(100, Math.round((linuxCompleted / 9) * 100));
  const psPct = Math.min(100, Math.round((psCompleted / 4) * 100));
  const cmdPct = Math.min(100, Math.round((cmdCompleted / 3) * 100));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100 flex flex-col h-full space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-rose-400" />
            Painel de Progresso &amp; Conquistas
          </h2>
          <p className="text-xs text-slate-400">
            Acompanhe sua pontuação, nível de maestria por sistema operacional e insígnias conquistadas
          </p>
        </div>

        <button
          onClick={onResetProgress}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/60 text-rose-300 border border-rose-500/30 hover:bg-rose-900/60 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Resetar Progresso</span>
        </button>
      </div>

      {/* Top XP Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Level Card */}
        <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xl">
            {progress.level}
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Nível Atual</div>
            <div className="text-lg font-bold text-slate-100">
              {progress.level < 3 ? 'Aprendiz CLI' : progress.level < 6 ? 'Especialista em Terminal' : 'SysAdmin Supremo'}
            </div>
            <div className="text-xs font-mono text-amber-400">{progress.xp} XP acumulados</div>
          </div>
        </div>

        {/* Desafios Concluídos */}
        <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xl">
            {progress.completedChallengeIds.length}
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Desafios Concluídos</div>
            <div className="text-lg font-bold text-slate-100">
              {progress.completedChallengeIds.length} / 16
            </div>
            <div className="text-xs text-emerald-400 font-mono">
              {Math.round((progress.completedChallengeIds.length / 16) * 100)}% concluído
            </div>
          </div>
        </div>

        {/* Streak Days */}
        <div className="bg-slate-950 border border-rose-500/30 rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold text-xl">
            <Flame className="w-6 h-6 text-rose-500 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Ofensiva de Estudo</div>
            <div className="text-lg font-bold text-slate-100">1 Dia Ativo</div>
            <div className="text-xs text-rose-400 font-mono">Mantenha a rotina!</div>
          </div>
        </div>
      </div>

      {/* Progress Bars per OS */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Nível de Domínio por Sistema Operacional
        </h3>

        {/* Linux Master Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold font-mono">
            <span className="text-emerald-400 flex items-center gap-1">🐧 Linux Master</span>
            <span>{linuxPct}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${linuxPct}%` }} />
          </div>
        </div>

        {/* PowerShell Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold font-mono">
            <span className="text-blue-400 flex items-center gap-1">🪟 Windows PowerShell</span>
            <span>{psPct}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
            <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${psPct}%` }} />
          </div>
        </div>

        {/* CMD Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold font-mono">
            <span className="text-slate-300 flex items-center gap-1">💻 Windows CMD</span>
            <span>{cmdPct}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
            <div className="bg-slate-300 h-full transition-all duration-500" style={{ width: `${cmdPct}%` }} />
          </div>
        </div>
      </div>

      {/* Achievements Insígnias */}
      <div className="space-y-2 flex-1 overflow-y-auto pr-1 no-scrollbar">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Conquistas &amp; Insígnias
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-3 rounded-xl border flex items-center gap-3 ${
                ach.unlocked
                  ? 'bg-amber-950/30 border-amber-500/40 text-slate-100 shadow'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
                ach.unlocked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-600'
              }`}>
                🏆
              </div>

              <div>
                <h4 className="font-bold text-xs flex items-center gap-1.5">
                  {ach.title}
                  {ach.unlocked && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                </h4>
                <p className="text-[11px] text-slate-400">{ach.description}</p>
                <span className="text-[10px] font-mono text-amber-400 font-bold">+{ach.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
