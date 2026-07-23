import React, { useState, useEffect } from 'react';
import { OSKind, AppMode, TerminalTheme, CommandContext, TerminalOutputLine, Challenge, Mission, UserProgress, CommandResult } from './types';
import { createInitialVFS, formatPath } from './vfs';
import { CHALLENGES } from './data/challenges';
import { MISSIONS } from './data/missions';
import { INITIAL_ACHIEVEMENTS } from './data/achievements';
import { Header } from './components/Header';
import { TerminalComp } from './components/Terminal';
import { VFSViewer } from './components/VFSViewer';
import { TrainingMode } from './components/TrainingMode';
import { MissionsMode } from './components/MissionsMode';
import { ComparisonMode } from './components/ComparisonMode';
import { ShortcutsMode } from './components/ShortcutsMode';
import { ProgressDashboard } from './components/ProgressDashboard';
import { DangerousCommandModal } from './components/DangerousCommandModal';
import { AIAssistantModal } from './components/AIAssistantModal';

export default function App() {
  const [currentOS, setCurrentOS] = useState<OSKind>('linux');
  const [activeMode, setActiveMode] = useState<AppMode>('terminal');
  const [vfs, setVfs] = useState(() => createInitialVFS());
  const [theme, setTheme] = useState<TerminalTheme>('matrix');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showVFSSidebar, setShowVFSSidebar] = useState(true);

  // Command Context
  const [context, setContext] = useState<CommandContext>({
    os: 'linux',
    currentPath: '/home/aluno',
    vfs: vfs,
    envVars: { PATH: '/usr/local/bin:/usr/bin:/bin' },
    user: 'aluno',
    hostname: 'terminal-master'
  });

  // Terminal Output History
  const [outputLines, setOutputLines] = useState<TerminalOutputLine[]>([
    {
      id: 'welcome-1',
      type: 'system',
      text: '==========================================================='
    },
    {
      id: 'welcome-2',
      type: 'success',
      text: '🚀 BEM-VINDO AO TERMINAL MASTER — TREINAMENTO DE COMANDOS'
    },
    {
      id: 'welcome-3',
      type: 'info',
      text: 'Selecione o SO no topo (Linux, PowerShell ou CMD) e digite comandos para praticar.'
    },
    {
      id: 'welcome-4',
      type: 'system',
      text: '==========================================================='
    }
  ]);

  // Gamification Progress
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('terminal_master_progress');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      xp: 0,
      level: 1,
      completedChallengeIds: [],
      completedMissionIds: [],
      unlockedAchievementIds: [],
      commandHistory: [],
      streakDays: 1,
      lastActiveDate: new Date().toISOString().substring(0, 10)
    };
  });

  // Active Exercises
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(CHALLENGES[0]);
  const [activeMission, setActiveMission] = useState<Mission | null>(MISSIONS[0]);

  // Modals
  const [dangerousAlert, setDangerousAlert] = useState<{ title: string; description: string; command: string } | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalCommand, setAiModalCommand] = useState<string>('');

  // Sync OS switch to context & default path & default theme
  useEffect(() => {
    let newPath = '/home/aluno';
    let newTheme: TerminalTheme = 'matrix';
    let newUser = 'aluno';

    if (currentOS === 'powershell') {
      newPath = 'C:\\Users\\Aluno';
      newTheme = 'powershell';
      newUser = 'Aluno';
    } else if (currentOS === 'cmd') {
      newPath = 'C:\\Users\\Aluno';
      newTheme = 'classic';
      newUser = 'Aluno';
    }

    setTheme(newTheme);
    setContext(prev => ({
      ...prev,
      os: currentOS,
      currentPath: newPath,
      user: newUser
    }));

    // Find first challenge for new OS
    const firstCh = CHALLENGES.find(c => c.os === currentOS);
    if (firstCh) setActiveChallenge(firstCh);
  }, [currentOS]);

  // Sync VFS reference in context
  useEffect(() => {
    setContext(prev => ({ ...prev, vfs }));
  }, [vfs]);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('terminal_master_progress', JSON.stringify(progress));
  }, [progress]);

  // Add XP helper & unlock achievement
  const addXP = (amount: number, achievementId?: string) => {
    setProgress(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 200) + 1;
      const newUnlocked = achievementId && !prev.unlockedAchievementIds.includes(achievementId)
        ? [...prev.unlockedAchievementIds, achievementId]
        : prev.unlockedAchievementIds;

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        unlockedAchievementIds: newUnlocked
      };
    });
  };

  // Handle Command Execution Validation
  const handleCommandExecuted = (cmdStr: string, result: CommandResult) => {
    // Unlock first command achievement
    if (!progress.unlockedAchievementIds.includes('ach-first-command')) {
      addXP(50, 'ach-first-command');
    }

    // Dangerous command alert
    if (result.dangerAlert) {
      setDangerousAlert(result.dangerAlert);
      addXP(100, 'ach-safety-shield');
    }

    const trimmedCmd = cmdStr.trim();

    // Challenge auto-validation
    if (activeChallenge && activeChallenge.os === currentOS) {
      const matchExact = activeChallenge.expectedCommands.some(
        exp => trimmedCmd.toLowerCase() === exp.toLowerCase() || trimmedCmd.toLowerCase().startsWith(exp.toLowerCase())
      );
      const matchVFS = activeChallenge.expectedVFSCheck
        ? activeChallenge.expectedVFSCheck(vfs, context.currentPath, trimmedCmd)
        : false;

      if ((matchExact || matchVFS) && !progress.completedChallengeIds.includes(activeChallenge.id)) {
        // Mark completed
        setProgress(prev => ({
          ...prev,
          completedChallengeIds: [...prev.completedChallengeIds, activeChallenge.id]
        }));
        addXP(activeChallenge.xp);

        // Append congratulations message
        setOutputLines(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            type: 'success',
            text: `🎉 DESAFIO CONCLUÍDO: "${activeChallenge.title}" (+${activeChallenge.xp} XP)`
          },
          {
            id: Math.random().toString(),
            type: 'system',
            text: `💡 Explicação: ${activeChallenge.explanation}`
          }
        ]);
      }
    }

    // Mission Step auto-validation
    if (activeMission && activeMission.os === currentOS) {
      let updatedSteps = [...activeMission.steps];
      let stepCompletedThisTurn = false;

      updatedSteps = updatedSteps.map(step => {
        if (!step.completed && step.check(vfs, context.currentPath, trimmedCmd, typeof result.output === 'string' ? result.output : '')) {
          stepCompletedThisTurn = true;
          return { ...step, completed: true };
        }
        return step;
      });

      if (stepCompletedThisTurn) {
        const allDone = updatedSteps.every(s => s.completed);
        const updatedMission = { ...activeMission, steps: updatedSteps, completed: allDone };
        setActiveMission(updatedMission);

        setOutputLines(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            type: 'success',
            text: `🎯 ETAPA DA MISSÃO CONCLUÍDA!`
          }
        ]);

        if (allDone && !progress.completedMissionIds.includes(activeMission.id)) {
          setProgress(prev => ({
            ...prev,
            completedMissionIds: [...prev.completedMissionIds, activeMission.id]
          }));
          addXP(activeMission.xpReward, 'ach-mission-complete');

          setOutputLines(prev => [
            ...prev,
            {
              id: Math.random().toString(),
              type: 'success',
              text: `🏆 MISSÃO COMPLETA: "${activeMission.title}" (+${activeMission.xpReward} XP)`
            }
          ]);
        }
      }
    }
  };

  const handleTestCommandFromComparison = (cmdToTest: string, targetOS: OSKind) => {
    setCurrentOS(targetOS);
    setActiveMode('terminal');
    setOutputLines(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        type: 'info',
        text: `💡 [Modo Comparação] Comando preparado para teste em ${targetOS.toUpperCase()}: ${cmdToTest}`
      }
    ]);
  };

  const handleResetProgress = () => {
    if (window.confirm('Tem certeza de que deseja resetar todo o seu progresso e XP?')) {
      const initial: UserProgress = {
        xp: 0,
        level: 1,
        completedChallengeIds: [],
        completedMissionIds: [],
        unlockedAchievementIds: [],
        commandHistory: [],
        streakDays: 1,
        lastActiveDate: new Date().toISOString().substring(0, 10)
      };
      setProgress(initial);
      setVfs(createInitialVFS());
      localStorage.removeItem('terminal_master_progress');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Header
        currentOS={currentOS}
        setCurrentOS={setCurrentOS}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        xp={progress.xp}
        level={progress.level}
        theme={theme}
        setTheme={setTheme}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        showVFSSidebar={showVFSSidebar}
        setShowVFSSidebar={setShowVFSSidebar}
        onOpenAIAssist={() => {
          setAiModalCommand('');
          setAiModalOpen(true);
        }}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Main Center Area (Terminal or Selected Mode) */}
        <div className={`${showVFSSidebar ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4 transition-all duration-300`}>
          {activeMode === 'terminal' && (
            <TerminalComp
              os={currentOS}
              context={context}
              onUpdateContext={setContext}
              outputLines={outputLines}
              setOutputLines={setOutputLines}
              theme={theme}
              setTheme={setTheme}
              audioEnabled={audioEnabled}
              onCommandExecuted={handleCommandExecuted}
              onOpenAIAssist={(cmd) => {
                setAiModalCommand(cmd || '');
                setAiModalOpen(true);
              }}
            />
          )}

          {activeMode === 'training' && (
            <div className="grid grid-cols-1 gap-4">
              <TrainingMode
                currentOS={currentOS}
                completedChallengeIds={progress.completedChallengeIds}
                onSelectChallenge={setActiveChallenge}
                activeChallenge={activeChallenge}
                onOpenAIAssist={(cmd) => {
                  setAiModalCommand(cmd || '');
                  setAiModalOpen(true);
                }}
              />
              <div className="mt-2">
                <TerminalComp
                  os={currentOS}
                  context={context}
                  onUpdateContext={setContext}
                  outputLines={outputLines}
                  setOutputLines={setOutputLines}
                  theme={theme}
                  setTheme={setTheme}
                  audioEnabled={audioEnabled}
                  onCommandExecuted={handleCommandExecuted}
                  onOpenAIAssist={(cmd) => {
                    setAiModalCommand(cmd || '');
                    setAiModalOpen(true);
                  }}
                />
              </div>
            </div>
          )}

          {activeMode === 'missions' && (
            <div className="grid grid-cols-1 gap-4">
              <MissionsMode
                currentOS={currentOS}
                completedMissionIds={progress.completedMissionIds}
                activeMission={activeMission}
                onSelectMission={setActiveMission}
                onOpenAIAssist={(cmd) => {
                  setAiModalCommand(cmd || '');
                  setAiModalOpen(true);
                }}
              />
              <div className="mt-2">
                <TerminalComp
                  os={currentOS}
                  context={context}
                  onUpdateContext={setContext}
                  outputLines={outputLines}
                  setOutputLines={setOutputLines}
                  theme={theme}
                  setTheme={setTheme}
                  audioEnabled={audioEnabled}
                  onCommandExecuted={handleCommandExecuted}
                  onOpenAIAssist={(cmd) => {
                    setAiModalCommand(cmd || '');
                    setAiModalOpen(true);
                  }}
                />
              </div>
            </div>
          )}

          {activeMode === 'comparison' && (
            <ComparisonMode onTestCommand={handleTestCommandFromComparison} />
          )}

          {activeMode === 'shortcuts' && (
            <ShortcutsMode />
          )}

          {activeMode === 'progress' && (
            <ProgressDashboard
              progress={progress}
              onResetProgress={handleResetProgress}
            />
          )}
        </div>

        {/* Right Virtual File System Sidebar */}
        {showVFSSidebar && (
          <div className="lg:col-span-4 h-[580px] sticky top-24">
            <VFSViewer
              vfs={vfs}
              currentPath={context.currentPath}
              isWindows={currentOS !== 'linux'}
              onResetVFS={() => setVfs(createInitialVFS())}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Terminal Master © 2026 — Plataforma Interativa de Treinamento em Linux &amp; Windows</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Linux Bash</span>
            <span>•</span>
            <span>Windows PowerShell</span>
            <span>•</span>
            <span>Windows CMD</span>
          </div>
        </div>
      </footer>

      {/* Dangerous Command Warning Modal */}
      <DangerousCommandModal
        alertData={dangerousAlert}
        onClose={() => setDangerousAlert(null)}
      />

      {/* AI Assistant Helper Modal */}
      <AIAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        os={currentOS}
        initialCommand={aiModalCommand}
      />
    </div>
  );
}
