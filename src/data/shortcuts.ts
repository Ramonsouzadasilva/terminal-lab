import { ShortcutItem } from '../types';

export const SHORTCUTS: ShortcutItem[] = [
  {
    id: 'sc-1',
    keys: ['Ctrl', 'L'],
    os: 'all',
    action: 'Limpar Tela (Clear)',
    description: 'Limpa a tela do terminal mantendo o prompt pronto no topo.',
    category: 'Terminal'
  },
  {
    id: 'sc-2',
    keys: ['Ctrl', 'C'],
    os: 'all',
    action: 'Cancelar Comando',
    description: 'Cancela o comando atualmente em execução ou limpa a linha de digitação.',
    category: 'Terminal'
  },
  {
    id: 'sc-3',
    keys: ['Tab'],
    os: 'all',
    action: 'Autocompletar',
    description: 'Preenche automaticamente caminhos de arquivos e nomes de comandos.',
    category: 'Navegação'
  },
  {
    id: 'sc-4',
    keys: ['Setas (↑ / ↓)'],
    os: 'all',
    action: 'Navegar no Histórico',
    description: 'Percorre os últimos comandos digitados no terminal.',
    category: 'Navegação'
  },
  {
    id: 'sc-5',
    keys: ['Ctrl', 'R'],
    os: 'linux',
    action: 'Busca Reversa no Histórico',
    description: 'Procura em comandos anteriores no Bash conforme você digita.',
    category: 'Navegação'
  },
  {
    id: 'sc-6',
    keys: ['Ctrl', 'D'],
    os: 'linux',
    action: 'Sair / EOF',
    description: 'Encerra a sessão atual do shell ou fecha a entrada de dados.',
    category: 'Terminal'
  },
  {
    id: 'sc-7',
    keys: ['Win', 'R'],
    os: 'powershell',
    action: 'Janela Executar do Windows',
    description: 'Abre a caixa de diálogo do Windows para rodar `cmd`, `powershell` ou aplicativos.',
    category: 'Sistema'
  },
  {
    id: 'sc-8',
    keys: ['Ctrl', 'Shift', 'Esc'],
    os: 'powershell',
    action: 'Gerenciador de Tarefas',
    description: 'Abre diretamente o Gerenciador de Tarefas do Windows.',
    category: 'Sistema'
  },
  {
    id: 'sc-9',
    keys: ['Alt', 'Tab'],
    os: 'all',
    action: 'Alternar Janelas',
    description: 'Alterna rapidamente entre janelas e terminais abertos.',
    category: 'Sistema'
  },
  {
    id: 'sc-10',
    keys: ['Win', 'L'],
    os: 'powershell',
    action: 'Bloquear Máquina',
    description: 'Bloqueia instantaneamente a tela do Windows por segurança.',
    category: 'Sistema'
  }
];
