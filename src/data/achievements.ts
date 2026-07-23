import { Achievement } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-command',
    title: 'Primeiro Passo no Terminal',
    description: 'Execute seu primeiro comando interativo no terminal.',
    icon: 'Terminal',
    xp: 50,
    unlocked: false
  },
  {
    id: 'ach-tab-master',
    title: 'Mestre do Autocomplete',
    description: 'Pressione a tecla TAB para completar um comando ou caminho.',
    icon: 'Zap',
    xp: 50,
    unlocked: false
  },
  {
    id: 'ach-linux-ninja',
    title: 'Linux Ninja',
    description: 'Conclua todos os desafios da categoria Básico de Linux.',
    icon: 'Terminal',
    xp: 150,
    unlocked: false
  },
  {
    id: 'ach-powershell-guru',
    title: 'PowerShell Guru',
    description: 'Conclua seu primeiro desafio no Windows PowerShell.',
    icon: 'Shield',
    xp: 100,
    unlocked: false
  },
  {
    id: 'ach-safety-shield',
    title: 'Protetor de Sistemas',
    description: 'Dispare o alerta de segurança ao tentar um comando perigoso (ex: rm -rf /).',
    icon: 'AlertTriangle',
    xp: 100,
    unlocked: false
  },
  {
    id: 'ach-mission-complete',
    title: 'Herói dos Servidores',
    description: 'Conclua uma missão completa de SysAdmin ou Técnico.',
    icon: 'Award',
    xp: 250,
    unlocked: false
  }
];
