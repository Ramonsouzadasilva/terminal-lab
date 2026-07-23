import React from 'react';
import { OSKind, AppMode, TerminalTheme } from '../types';
import { Terminal, BookOpen, ShieldAlert, GitCompare, Keyboard, Award, Volume2, VolumeX, Sparkles, FolderTree } from 'lucide-react';

interface HeaderProps {
  currentOS: OSKind;
  setCurrentOS: (os: OSKind) => void;
  activeMode: AppMode;
  setActiveMode: (mode: AppMode) => void;
  xp: number;
  level: number;
  theme: TerminalTheme;
  setTheme: (t: TerminalTheme) => void;
  audioEnabled: boolean;
  setAudioEnabled: (a: boolean) => void;
  showVFSSidebar: boolean;
  setShowVFSSidebar: (s: boolean | ((prev: boolean) => boolean)) => void;
  onOpenAIAssist: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentOS,
  setCurrentOS,
  activeMode,
  setActiveMode,
  xp,
  level,
  theme,
  setTheme,
  audioEnabled,
  setAudioEnabled,
  showVFSSidebar,
  setShowVFSSidebar,
  onOpenAIAssist
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 gap-3">
          
          {/* Brand & OS Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-mono font-bold text-lg">
                &gt;_
              </div>
              <div>
                <h1 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                  Terminal Master
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-medium">
                    v2.5
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Treinamento Interativo de Comandos Linux e Windows</p>
              </div>
            </div>

            {/* Audio & VFS toggle on mobile */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setShowVFSSidebar(prev => !prev)}
                className={`p-2 rounded-lg border transition-colors ${showVFSSidebar ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                title="Arquivos Virtuais"
              >
                <FolderTree className="w-4 h-4" />
              </button>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300"
              >
                {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </button>
            </div>
          </div>

          {/* OS Environment Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setCurrentOS('linux')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentOS === 'linux'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-base">🐧</span> Linux Bash
            </button>
            <button
              onClick={() => setCurrentOS('powershell')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentOS === 'powershell'
                  ? 'bg-blue-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-base">🪟</span> PowerShell
            </button>
            <button
              onClick={() => setCurrentOS('cmd')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentOS === 'cmd'
                  ? 'bg-slate-200 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-base">💻</span> Windows CMD
            </button>
          </div>

          {/* Right Utilities & XP Badges */}
          <div className="hidden lg:flex items-center gap-3">
            {/* VFS Sidebar Toggle */}
            <button
              onClick={() => setShowVFSSidebar(prev => !prev)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                showVFSSidebar
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Alternar Árvore de Arquivos Virtuais"
            >
              <FolderTree className="w-4 h-4 text-emerald-400" />
              <span>Arquivos VFS</span>
            </button>

            {/* AI Assistant Trigger */}
            <button
              onClick={onOpenAIAssist}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border border-purple-400/30 shadow-lg shadow-purple-500/10 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>Assistente AI</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 rounded-lg border border-slate-800 bg-slate-800/60 text-slate-300 hover:bg-slate-700/80 transition-colors"
              title={audioEnabled ? "Sons de digitação ativados" : "Sons desativados"}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Level & XP Badge */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
                {level}
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Nível {level}</div>
                <div className="text-xs font-mono font-bold text-amber-400">{xp} XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Mode */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          <button
            onClick={() => setActiveMode('terminal')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeMode === 'terminal'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Terminal Livre</span>
          </button>

          <button
            onClick={() => setActiveMode('training')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeMode === 'training'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Modo Treinamento</span>
          </button>

          <button
            onClick={() => setActiveMode('missions')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeMode === 'missions'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <span>Modo Missões</span>
          </button>

          <button
            onClick={() => setActiveMode('comparison')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeMode === 'comparison'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <GitCompare className="w-4 h-4 text-amber-400" />
            <span>Comparação de Comandos</span>
          </button>

          <button
            onClick={() => setActiveMode('shortcuts')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeMode === 'shortcuts'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Keyboard className="w-4 h-4 text-indigo-400" />
            <span>Atalhos do Teclado</span>
          </button>

          <button
            onClick={() => setActiveMode('progress')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeMode === 'progress'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Award className="w-4 h-4 text-rose-400" />
            <span>Progresso &amp; Conquistas</span>
          </button>
        </div>
      </div>
    </header>
  );
};
