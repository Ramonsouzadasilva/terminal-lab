export type OSKind = 'linux' | 'powershell' | 'cmd';

export type AppMode = 'terminal' | 'training' | 'missions' | 'comparison' | 'shortcuts' | 'progress';

export type TerminalTheme = 'matrix' | 'classic' | 'powershell' | 'amber' | 'cyberpunk' | 'solarized';

export interface VFSNode {
  name: string;
  type: 'file' | 'dir';
  content?: string;
  permissions?: string; // e.g. "rwxr-xr-x" or "755"
  owner?: string;
  group?: string;
  size?: number;
  updatedAt?: Date;
  children?: Record<string, VFSNode>;
}

export interface TerminalOutputLine {
  id: string;
  type: 'prompt' | 'output' | 'error' | 'success' | 'warning' | 'info' | 'system' | 'custom';
  text: string;
  promptText?: string;
  timestamp?: string;
  html?: boolean;
}

export interface CommandContext {
  os: OSKind;
  currentPath: string; // e.g. "/home/aluno" or "C:\\Users\\Aluno"
  vfs: VFSNode;
  envVars: Record<string, string>;
  user: string; // "aluno" or "Administrator" or "root"
  hostname: string;
}

export interface CommandResult {
  output: string | TerminalOutputLine[];
  newPath?: string;
  clearScreen?: boolean;
  error?: boolean;
  warning?: string;
  dangerAlert?: {
    title: string;
    description: string;
    command: string;
  };
}

export type CategoryLevel = 'basico' | 'intermediario' | 'avancado';

export interface Challenge {
  id: string;
  os: OSKind;
  level: CategoryLevel;
  title: string;
  description: string;
  task: string;
  expectedCommands: string[]; // regex or literal strings
  expectedVFSCheck?: (vfs: VFSNode, currentPath: string, lastCommand: string) => boolean;
  hint: string;
  explanation: string;
  xp: number;
}

export interface MissionStep {
  id: string;
  title: string;
  description: string;
  hint: string;
  check: (vfs: VFSNode, currentPath: string, lastCommand: string, outputText: string) => boolean;
  completed: boolean;
  explanation: string;
}

export interface Mission {
  id: string;
  title: string;
  os: OSKind;
  badge: string;
  description: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Expert';
  xpReward: number;
  steps: MissionStep[];
  completed: boolean;
}

export interface ComparisonItem {
  id: string;
  category: 'Navegação' | 'Manipulação de Arquivos' | 'Processos' | 'Rede & Sistema' | 'Permissões & Usuários' | 'Busca & Filtros';
  concept: string;
  description: string;
  linux: string;
  powershell: string;
  cmd: string;
  explanation: string;
}

export interface ShortcutItem {
  id: string;
  keys: string[];
  os: OSKind | 'all';
  action: string;
  description: string;
  category: 'Terminal' | 'Navegação' | 'Edição' | 'Sistema';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  completedChallengeIds: string[];
  completedMissionIds: string[];
  unlockedAchievementIds: string[];
  commandHistory: {
    command: string;
    os: OSKind;
    timestamp: string;
    success: boolean;
  }[];
  streakDays: number;
  lastActiveDate: string;
}
