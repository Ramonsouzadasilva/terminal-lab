import { ComparisonItem } from '../types';

export const COMPARISONS: ComparisonItem[] = [
  {
    id: 'comp-1',
    category: 'Navegação',
    concept: 'Listar conteúdo do diretório',
    description: 'Exibe os arquivos e pastas no caminho atual.',
    linux: 'ls -la',
    powershell: 'Get-ChildItem (ou dir / ls)',
    cmd: 'dir',
    explanation: 'No Linux, `ls -la` lista permissões e arquivos ocultos. No PowerShell, `Get-ChildItem` retorna objetos ricos. No CMD, `dir` mostra tabela tradicional.'
  },
  {
    id: 'comp-2',
    category: 'Navegação',
    concept: 'Diretório atual (Onde estou?)',
    description: 'Retorna o caminho absoluto da pasta onde o terminal está posicionado.',
    linux: 'pwd',
    powershell: 'Get-Location (ou pwd / gl)',
    cmd: 'cd (sem parâmetros)',
    explanation: 'No Linux e PowerShell usa-se `pwd` ou `Get-Location`. No CMD digita-se apenas `cd` sem argumentos para ver a pasta atual.'
  },
  {
    id: 'comp-3',
    category: 'Navegação',
    concept: 'Mudar de diretório',
    description: 'Navega para outra pasta no sistema.',
    linux: 'cd /caminho/pasta',
    powershell: 'Set-Location C:\\caminho (ou cd)',
    cmd: 'cd C:\\caminho',
    explanation: 'O comando `cd` é aceito em todos os três ambientes por conta de compatibilidade e aliases.'
  },
  {
    id: 'comp-4',
    category: 'Manipulação de Arquivos',
    concept: 'Criar uma nova pasta',
    description: 'Cria um novo diretório no sistema de arquivos.',
    linux: 'mkdir projetos',
    powershell: 'New-Item -ItemType Directory -Name projetos (ou mkdir)',
    cmd: 'mkdir projetos (ou md)',
    explanation: 'O alias `mkdir` funciona no Linux, PowerShell e CMD.'
  },
  {
    id: 'comp-5',
    category: 'Manipulação de Arquivos',
    concept: 'Remover arquivo ou pasta',
    description: 'Exclui definitivamente um elemento do disco.',
    linux: 'rm arquivo.txt (ou rm -rf pasta)',
    powershell: 'Remove-Item arquivo.txt (ou rm / del)',
    cmd: 'del arquivo.txt (ou rmdir /s /q pasta)',
    explanation: 'Atenção ao remover pastas inteiras: no Linux é `rm -rf`, no PowerShell `Remove-Item -Recurse`, e no CMD `rmdir /s /q`.'
  },
  {
    id: 'comp-6',
    category: 'Manipulação de Arquivos',
    concept: 'Ler conteúdo de arquivo de texto',
    description: 'Imprime o texto de um arquivo na tela.',
    linux: 'cat arquivo.txt',
    powershell: 'Get-Content arquivo.txt (ou cat / type)',
    cmd: 'type arquivo.txt',
    explanation: 'No Linux a ferramenta padrão é o `cat`. No Windows CMD é o `type`. No PowerShell é o cmdlet `Get-Content`.'
  },
  {
    id: 'comp-7',
    category: 'Manipulação de Arquivos',
    concept: 'Copiar arquivo',
    description: 'Duplica um arquivo para outro local.',
    linux: 'cp orig.txt dest.txt',
    powershell: 'Copy-Item orig.txt dest.txt (ou copy / cp)',
    cmd: 'copy orig.txt dest.txt',
    explanation: 'No Linux usa-se `cp`, no CMD `copy`, e no PowerShell o cmdlet `Copy-Item`.'
  },
  {
    id: 'comp-8',
    category: 'Processos',
    concept: 'Listar processos ativos',
    description: 'Exibe a lista de programas e processos executando na memória.',
    linux: 'ps aux (ou top)',
    powershell: 'Get-Process (ou ps / gps)',
    cmd: 'tasklist',
    explanation: 'O Linux utiliza `ps aux` ou o monitor `top`. O CMD utiliza `tasklist` e o PowerShell o cmdlet `Get-Process`.'
  },
  {
    id: 'comp-9',
    category: 'Processos',
    concept: 'Finalizar um processo',
    description: 'Encerra a execução de um processo por PID ou Nome.',
    linux: 'kill -9 <PID>',
    powershell: 'Stop-Process -Id <PID> (ou kill)',
    cmd: 'taskkill /f /pid <PID>',
    explanation: 'No Linux envia-se o sinal SIGKILL via `kill -9`. No CMD usa-se `taskkill /f /im nome.exe`.'
  },
  {
    id: 'comp-10',
    category: 'Rede & Sistema',
    concept: 'Verificar endereço IP e adaptador',
    description: 'Mostra os IPs, máscara de sub-rede e gateway padrão.',
    linux: 'ip a (ou ifconfig)',
    powershell: 'Get-NetIPAddress (ou ipconfig)',
    cmd: 'ipconfig /all',
    explanation: 'Nas distribuições Linux modernas o padrão é `ip a` ou `ip addr`. No Windows utiliza-se `ipconfig` ou `Get-NetIPAddress`.'
  },
  {
    id: 'comp-11',
    category: 'Busca & Filtros',
    concept: 'Filtrar linhas com texto específico',
    description: 'Busca por um trecho de texto em um arquivo ou saída de comando.',
    linux: 'grep "termo" arquivo.txt',
    powershell: 'Select-String -Pattern "termo" arquivo.txt',
    cmd: 'findstr "termo" arquivo.txt',
    explanation: 'No Linux a ferramenta suprema é o `grep`. No CMD utiliza-se `findstr` e no PowerShell o cmdlet `Select-String`.'
  },
  {
    id: 'comp-12',
    category: 'Navegação',
    concept: 'Limpar a tela do terminal',
    description: 'Remove o texto anterior do terminal para limpar o visual.',
    linux: 'clear (ou Ctrl + L)',
    powershell: 'Clear-Host (ou cls / clear)',
    cmd: 'cls',
    explanation: 'Tanto `clear` quanto `cls` são amplamente aceitos via aliases no PowerShell.'
  }
];
