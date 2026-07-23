import { Mission } from '../types';

export const MISSIONS: Mission[] = [
  {
    id: 'mission-sysadmin-linux',
    title: 'Missão: Administrador Linux',
    os: 'linux',
    badge: '🐧 SysAdmin Master',
    description: 'Um novo servidor Ubuntu foi provisionado. Sua missão é criar a estrutura de diretórios do projeto, configurar as permissões adequadas, verificar os serviços ativos e monitorar os processos.',
    difficulty: 'Médio',
    xpReward: 350,
    completed: false,
    steps: [
      {
        id: 'step-1',
        title: 'Passo 1: Criar pasta do projeto',
        description: 'Crie uma pasta chamada "empresa" na sua home.',
        hint: 'Execute `mkdir empresa`',
        explanation: 'Criou o diretório de trabalho principal para a infraestrutura.',
        completed: false,
        check: (vfs, path, lastCmd) => {
          return lastCmd.includes('mkdir empresa') || !!vfs.children?.home?.children?.aluno?.children?.empresa;
        }
      },
      {
        id: 'step-2',
        title: 'Passo 2: Navegar até a pasta',
        description: 'Entre na pasta "empresa".',
        hint: 'Execute `cd empresa`',
        explanation: 'Mudou a sessão de trabalho para a pasta `/home/aluno/empresa`.',
        completed: false,
        check: (vfs, path) => path.endsWith('/empresa') || path.endsWith('empresa')
      },
      {
        id: 'step-3',
        title: 'Passo 3: Criar script de backup',
        description: 'Crie um arquivo chamado "backup.sh" com o comando echo.',
        hint: 'Execute `echo "tar -czf backup.tar.gz /var/www" > backup.sh`',
        explanation: 'Arquivo de script de backup gerado com sucesso.',
        completed: false,
        check: (vfs, path, lastCmd) => {
          return lastCmd.includes('backup.sh');
        }
      },
      {
        id: 'step-4',
        title: 'Passo 4: Alterar permissões para 755',
        description: 'Dê permissão de execução ao script "backup.sh".',
        hint: 'Execute `chmod 755 backup.sh` ou `chmod +x backup.sh`',
        explanation: 'Permissões alteradas. Dono agora tem permissão de execução.',
        completed: false,
        check: (vfs, path, lastCmd) => lastCmd.includes('chmod') && lastCmd.includes('backup.sh')
      },
      {
        id: 'step-5',
        title: 'Passo 5: Verificar o serviço Nginx',
        description: 'Verifique o status do serviço Nginx do servidor.',
        hint: 'Execute `systemctl status nginx`',
        explanation: 'Verificado que o servidor web Nginx está ativo e pronto.',
        completed: false,
        check: (vfs, path, lastCmd) => lastCmd.includes('systemctl') && lastCmd.includes('nginx')
      }
    ]
  },
  {
    id: 'mission-tecnico-windows',
    title: 'Missão: Técnico Windows',
    os: 'powershell',
    badge: '🪟 Suporte Técnico Windows',
    description: 'Um usuário relata lentidão na estação de trabalho Windows. Diagnostique a rede, identifique o consumo de processos e verifique o estado dos serviços essenciais.',
    difficulty: 'Médio',
    xpReward: 300,
    completed: false,
    steps: [
      {
        id: 'step-w1',
        title: 'Passo 1: Diagnosticar Endereço IP',
        description: 'Verifique as configurações de IP da máquina.',
        hint: 'Execute `ipconfig` ou `Get-NetIPAddress`',
        explanation: 'Verificado que o IP é 192.168.1.105 com Gateway 192.168.1.1.',
        completed: false,
        check: (vfs, path, lastCmd) => lastCmd.toLowerCase().includes('ipconfig')
      },
      {
        id: 'step-w2',
        title: 'Passo 2: Inspecionar Processos',
        description: 'Exiba a lista de processos ativos no PowerShell para encontrar travamentos.',
        hint: 'Execute `Get-Process`',
        explanation: 'Processos inspecionados com sucesso.',
        completed: false,
        check: (vfs, path, lastCmd) => lastCmd.toLowerCase().includes('get-process') || lastCmd === 'ps' || lastCmd === 'gps'
      },
      {
        id: 'step-w3',
        title: 'Passo 3: Gerenciar Serviço Spooler',
        description: 'Inspecione os serviços do sistema para verificar o Spooler de Impressão.',
        hint: 'Execute `Get-Service`',
        explanation: 'Serviço Spooler verificado.',
        completed: false,
        check: (vfs, path, lastCmd) => lastCmd.toLowerCase().includes('get-service')
      }
    ]
  }
];
