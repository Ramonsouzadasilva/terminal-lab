import { Challenge } from '../types';

export const CHALLENGES: Challenge[] = [
  // --- BÁSICO: LINUX ---
  {
    id: 'linux-b1',
    os: 'linux',
    level: 'basico',
    title: 'Onde estou?',
    description: 'Aprenda a identificar o diretório atual em que você está trabalhando.',
    task: 'Execute o comando para exibir o caminho completo do diretório atual (Print Working Directory).',
    expectedCommands: ['pwd'],
    hint: 'O comando significa "Print Working Directory" e possui 3 letras.',
    explanation: 'O comando `pwd` exibe o caminho absoluto do diretório onde o terminal está posicionado.',
    xp: 50
  },
  {
    id: 'linux-b2',
    os: 'linux',
    level: 'basico',
    title: 'Listando Conteúdos',
    description: 'Veja quais arquivos e diretórios estão na sua pasta atual.',
    task: 'Execute o comando para listar os arquivos e pastas do diretório atual.',
    expectedCommands: ['ls', 'ls -l', 'ls -la', 'ls -a'],
    hint: 'Digite `ls` para listar os arquivos simples.',
    explanation: 'O comando `ls` (list) exibe os arquivos e pastas. Com `-la`, mostra permissões, tamanhos e arquivos ocultos.',
    xp: 50
  },
  {
    id: 'linux-b3',
    os: 'linux',
    level: 'basico',
    title: 'Criando um Diretório',
    description: 'Aprenda a organizar seus projetos criando pastas.',
    task: 'Crie uma nova pasta chamada "projetos".',
    expectedCommands: ['mkdir projetos'],
    expectedVFSCheck: (vfs, path) => {
      return path.includes('aluno') && !!vfs.children?.home?.children?.aluno?.children?.projetos;
    },
    hint: 'Use o comando `mkdir` seguido do nome da pasta: `mkdir projetos`.',
    explanation: 'O comando `mkdir` (make directory) cria um novo diretório no caminho especificado.',
    xp: 60
  },
  {
    id: 'linux-b4',
    os: 'linux',
    level: 'basico',
    title: 'Navegando entre Pastas',
    description: 'Entre na pasta de projetos que você acabou de criar.',
    task: 'Entre na pasta "projetos" usando o comando de navegação.',
    expectedCommands: ['cd projetos', 'cd ~/projetos', 'cd /home/aluno/projetos'],
    hint: 'Use `cd projetos` para mudar de diretório.',
    explanation: 'O comando `cd` (change directory) altera o diretório atual do seu terminal.',
    xp: 60
  },
  {
    id: 'linux-b5',
    os: 'linux',
    level: 'basico',
    title: 'Lendo Arquivos',
    description: 'Exiba o conteúdo do relatório localizado na pasta de documentos.',
    task: 'Execute `cat /home/aluno/documentos/relatorio.txt` ou navegue e use `cat relatorio.txt`.',
    expectedCommands: ['cat relatorio.txt', 'cat documentos/relatorio.txt', 'cat /home/aluno/documentos/relatorio.txt'],
    hint: 'O comando `cat` (concatenate) imprime o texto de um arquivo no terminal.',
    explanation: 'O comando `cat` lê o conteúdo de um arquivo e o imprime diretamente na saída do terminal.',
    xp: 70
  },

  // --- INTERMEDIÁRIO: LINUX ---
  {
    id: 'linux-i1',
    os: 'linux',
    level: 'intermediario',
    title: 'Filtrando com Grep',
    description: 'Procure por uma palavra-chave específica dentro de um arquivo.',
    task: 'Procure a palavra "Linux" dentro do arquivo `relatorio.txt` usando o `grep`.',
    expectedCommands: ['grep Linux relatorio.txt', 'grep -i linux relatorio.txt', 'grep Linux /home/aluno/documentos/relatorio.txt'],
    hint: 'Sintaxe: `grep <palavra> <arquivo>`',
    explanation: 'O `grep` busca padrões de texto utilizando expressões regulares em arquivos de texto.',
    xp: 100
  },
  {
    id: 'linux-i2',
    os: 'linux',
    level: 'intermediario',
    title: 'Permissões Executáveis',
    description: 'Dê permissão de execução a um script de configuração.',
    task: 'Torne o script `setup.sh` executável na pasta downloads com `chmod 755 setup.sh` ou `chmod +x setup.sh`.',
    expectedCommands: ['chmod 755 setup.sh', 'chmod +x setup.sh', 'chmod 755 /home/aluno/downloads/setup.sh'],
    hint: 'Navegue até `downloads` ou especifique o caminho completo com `chmod 755 setup.sh`.',
    explanation: 'O `chmod` altera as permissões de leitura (r), escrita (w) e execução (x) do arquivo.',
    xp: 110
  },
  {
    id: 'linux-i3',
    os: 'linux',
    level: 'intermediario',
    title: 'Monitorando Processos',
    description: 'Verifique quais programas estão rodando no sistema.',
    task: 'Exiba a lista de processos ativos usando `ps` ou `top`.',
    expectedCommands: ['ps', 'ps aux', 'top'],
    hint: 'Digite `ps aux` para ver todos os processos com detalhes.',
    explanation: 'O `ps aux` exibe um instantâneo dos processos do sistema, incluindo PID, consumo de CPU e usuário.',
    xp: 100
  },

  // --- AVANÇADO: LINUX ---
  {
    id: 'linux-a1',
    os: 'linux',
    level: 'avancado',
    title: 'Gerenciando Serviços com Systemctl',
    description: 'Verifique e inicie o servidor web Nginx.',
    task: 'Verifique o status do serviço nginx usando `systemctl status nginx`.',
    expectedCommands: ['systemctl status nginx', 'sudo systemctl status nginx'],
    hint: 'Sintaxe: `systemctl status <nome-do-serviço>`',
    explanation: 'O `systemctl` é o utilitário central do systemd para controlar e inspecionar serviços do Linux.',
    xp: 150
  },

  // --- WINDOWS POWERSHELL ---
  {
    id: 'ps-b1',
    os: 'powershell',
    level: 'basico',
    title: 'Listando Itens no PowerShell',
    description: 'Exiba os arquivos do diretório atual usando o cmdlet do PowerShell.',
    task: 'Execute `Get-ChildItem` ou seu alias `ls`/`dir`.',
    expectedCommands: ['Get-ChildItem', 'dir', 'ls', 'gci'],
    hint: 'No PowerShell, o cmdlet oficial é `Get-ChildItem`.',
    explanation: 'O `Get-ChildItem` obtém os itens e arquivos em um local especificado.',
    xp: 50
  },
  {
    id: 'ps-b2',
    os: 'powershell',
    level: 'basico',
    title: 'Criando Novo Item',
    description: 'Crie um arquivo ou pasta com New-Item.',
    task: 'Crie uma pasta chamada "Projetos" usando `New-Item -ItemType Directory -Name Projetos` ou `mkdir Projetos`.',
    expectedCommands: ['mkdir Projetos', 'New-Item -ItemType Directory -Name Projetos', 'New-Item Projetos -type directory'],
    hint: 'Pode usar `mkdir Projetos` ou `New-Item Projetos`.',
    explanation: 'No PowerShell, `New-Item` é o cmdlet versátil para criar arquivos, diretórios e chaves de registro.',
    xp: 60
  },
  {
    id: 'ps-i1',
    os: 'powershell',
    level: 'intermediario',
    title: 'Verificando Processos',
    description: 'Inspecione os processos em execução no Windows.',
    task: 'Execute `Get-Process` para listar o consumo de memória e CPU dos programas.',
    expectedCommands: ['Get-Process', 'gps', 'ps'],
    hint: 'Cmdlet: `Get-Process`.',
    explanation: 'O `Get-Process` retorna objetos detalhados de cada processo em execução no sistema.',
    xp: 100
  },
  {
    id: 'ps-a1',
    os: 'powershell',
    level: 'avancado',
    title: 'Gerenciando Serviços',
    description: 'Verifique o estado dos serviços do Windows.',
    task: 'Execute `Get-Service` para visualizar os serviços instalados e seu status (Running/Stopped).',
    expectedCommands: ['Get-Service'],
    hint: 'Cmdlet: `Get-Service`.',
    explanation: 'O `Get-Service` exibe informações sobre os serviços do Windows registrados na máquina.',
    xp: 150
  },

  // --- WINDOWS CMD ---
  {
    id: 'cmd-b1',
    os: 'cmd',
    level: 'basico',
    title: 'Listando no Prompt de Comando',
    description: 'Exiba os arquivos e diretórios no formato clássico do CMD.',
    task: 'Execute o comando `dir`.',
    expectedCommands: ['dir'],
    hint: 'Digite `dir` no terminal do Prompt de Comando.',
    explanation: 'O comando `dir` lista o conteúdo de arquivos, subdiretórios, tamanho e espaço livre em disco.',
    xp: 50
  },
  {
    id: 'cmd-b2',
    os: 'cmd',
    level: 'basico',
    title: 'Limpando a Tela',
    description: 'Limpe o histórico visual da tela do CMD.',
    task: 'Execute o comando `cls`.',
    expectedCommands: ['cls'],
    hint: 'Digite `cls` (Clear Screen).',
    explanation: 'O comando `cls` limpa todas as mensagens do console atual.',
    xp: 50
  },
  {
    id: 'cmd-i1',
    os: 'cmd',
    level: 'intermediario',
    title: 'Configurações de Rede',
    description: 'Descubra o endereço IP e gateway padrão da máquina.',
    task: 'Execute `ipconfig` para verificar a interface de rede.',
    expectedCommands: ['ipconfig', 'ipconfig /all'],
    hint: 'Digite `ipconfig`.',
    explanation: 'O `ipconfig` é a ferramenta de linha de comando fundamental do Windows para diagnóstico de rede e IP.',
    xp: 100
  }
];
