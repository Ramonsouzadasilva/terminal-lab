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
  },
  // --- DESAFIOS DE GIT & CONTROLE DE VERSÃO ---
  {
    id: 'git-b1',
    os: 'linux',
    level: 'basico',
    title: 'Inicializar Repositório Git',
    description: 'Transforme o diretório atual em um repositório controlado por versão.',
    task: 'Execute o comando `git init` para criar um novo repositório Git local.',
    expectedCommands: ['git init'],
    hint: 'Digite `git init` para criar a pasta oculta `.git`.',
    explanation: 'O comando `git init` cria um novo repositório Git e prepara o diretório para rastrear arquivos.',
    xp: 60
  },
  {
    id: 'git-b2',
    os: 'linux',
    level: 'basico',
    title: 'Verificar Status do Git',
    description: 'Inspecione quais arquivos foram modificados ou estão na área de staging.',
    task: 'Execute `git status` para verificar o estado do repositório.',
    expectedCommands: ['git status'],
    hint: 'O comando `git status` mostra a branch atual e arquivos alterados.',
    explanation: 'O `git status` exibe o estado do diretório de trabalho e da área de preparação (staging area).',
    xp: 60
  },
  {
    id: 'git-b3',
    os: 'linux',
    level: 'basico',
    title: 'Adicionar Arquivos ao Staging',
    description: 'Prepare arquivos para serem gravados no histórico do projeto.',
    task: 'Execute `git add .` para adicionar todos os arquivos do diretório atual à área de staging.',
    expectedCommands: ['git add .', 'git add -A', 'git add *'],
    hint: 'Use `git add .` para incluir todas as alterações.',
    explanation: 'O `git add` adiciona arquivos alterados à área de preparação para o próximo commit.',
    xp: 70
  },
  {
    id: 'git-b4',
    os: 'linux',
    level: 'basico',
    title: 'Criar um Commit',
    description: 'Grave um ponto de restauração no histórico com uma mensagem descritiva.',
    task: 'Execute um commit com a mensagem "Primeiro commit": `git commit -m "Primeiro commit"`.',
    expectedCommands: ['git commit -m "Primeiro commit"', 'git commit -m "Initial commit"'],
    hint: 'Sintaxe: `git commit -m "Sua mensagem aqui"`',
    explanation: 'O `git commit` grava permanentemente o instantâneo das alterações salvas no staging no histórico do Git.',
    xp: 80
  },
  {
    id: 'git-i1',
    os: 'linux',
    level: 'intermediario',
    title: 'Visualizar Histórico com Git Log',
    description: 'Consulte o histórico de alterações e autores dos commits anteriores.',
    task: 'Execute `git log` ou `git log --oneline` para ver a lista de commits.',
    expectedCommands: ['git log', 'git log --oneline'],
    hint: 'Digite `git log` para ver o histórico detalhado ou `git log --oneline` para formato resumido.',
    explanation: 'O `git log` mostra a linha do tempo de commits com código hash, autor, data e mensagem de cada versão.',
    xp: 90
  },
  {
    id: 'git-i2',
    os: 'linux',
    level: 'intermediario',
    title: 'Gerenciar Branches',
    description: 'Crie e alterne para uma nova ramificação de desenvolvimento chamada "feature".',
    task: 'Execute `git checkout -b feature` ou `git branch feature` para criar uma nova branch.',
    expectedCommands: ['git checkout -b feature', 'git branch feature', 'git switch -c feature'],
    hint: 'Use `git checkout -b feature` para criar e alternar ao mesmo tempo.',
    explanation: 'Branches permitem desenvolver novas funcionalidades de forma isolada sem afetar o código principal (main).',
    xp: 100
  },
  {
    id: 'git-i3',
    os: 'linux',
    level: 'intermediario',
    title: 'Configurar Identidade do Git',
    description: 'Defina seu nome e e-mail que aparecerão na assinatura dos seus commits.',
    task: 'Configure seu nome com `git config --global user.name "Aluno Dev"`.',
    expectedCommands: ['git config --global user.name "Aluno Dev"', 'git config user.name "Aluno Dev"'],
    hint: 'Sintaxe: `git config --global user.name "Seu Nome"`',
    explanation: 'O `git config` define as preferências de usuário que o Git utiliza para identificar o autor de cada commit.',
    xp: 90
  },
  {
    id: 'git-a1',
    os: 'linux',
    level: 'avancado',
    title: 'Clonar Repositório Remoto',
    description: 'Baixe um projeto existente diretamente de uma URL remota.',
    task: 'Execute `git clone https://github.com/aluno/meu-projeto.git` no terminal.',
    expectedCommands: ['git clone https://github.com/aluno/meu-projeto.git', 'git clone https://github.com/aluno/projeto.git'],
    hint: 'Sintaxe: `git clone <URL>`',
    explanation: 'O `git clone` faz a cópia exata de um repositório hospedado no GitHub/GitLab para o seu computador local.',
    xp: 130
  }
];
