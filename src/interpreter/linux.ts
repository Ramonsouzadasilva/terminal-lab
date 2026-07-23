import { CommandContext, CommandResult, VFSNode } from '../types';
import { formatPath, getNodeAtPath, resolvePath, createNodeAtPath, deleteNodeAtPath } from '../vfs';

export function executeLinuxCommand(
  input: string,
  ctx: CommandContext
): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { output: '' };

  const tokens = parseCommandLine(trimmed);
  const cmd = tokens[0]?.toLowerCase();
  const args = tokens.slice(1);

  const currentParts = resolvePath([], ctx.currentPath, false);
  const currentDirNode = getNodeAtPath(ctx.vfs, currentParts);

  // Handle echo redirect (e.g. echo "texto" > arquivo.txt)
  if (cmd === 'echo') {
    const rawArgs = trimmed.substring(5).trim();
    if (rawArgs.includes('>') || rawArgs.includes('>>')) {
      const isAppend = rawArgs.includes('>>');
      const parts = rawArgs.split(isAppend ? '>>' : '>');
      let content = parts[0].trim().replace(/^['"]|['"]$/g, '');
      const filename = parts[1].trim();

      if (!filename) return { output: 'bash: erro de sintaxe próximo ao token inesperado', error: true };

      let existing = '';
      if (isAppend && currentDirNode?.children?.[filename]?.type === 'file') {
        existing = (currentDirNode.children[filename].content || '') + '\n';
      }

      createNodeAtPath(ctx.vfs, currentParts, filename, 'file', existing + content, ctx.user);
      return { output: '' };
    } else {
      const text = rawArgs.replace(/^['"]|['"]$/g, '');
      return { output: text };
    }
  }

  switch (cmd) {
    case 'pwd':
      return { output: ctx.currentPath || '/' };

    case 'whoami':
      return { output: ctx.user || 'aluno' };

    case 'uname':
      if (args.includes('-a')) {
        return { output: 'Linux terminal-master 5.15.0-88-generic #98-Ubuntu SMP Mon Oct 2 15:18:56 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux' };
      }
      return { output: 'Linux' };

    case 'clear':
      return { output: '', clearScreen: true };

    case 'history':
      return { output: 'Mostrando últimos comandos do histórico...' };

    case 'sudo': {
      if (args.length === 0) return { output: 'uso: sudo -h | -K | -k | -V | -v | [comando...]', error: true };
      const subCmd = args[0];
      const subArgs = args.slice(1);
      const subRes = executeLinuxCommand([subCmd, ...subArgs].join(' '), { ...ctx, user: 'root' });
      return {
        output: [
          { id: Math.random().toString(), type: 'system', text: '[sudo] senha para aluno: ********' },
          ...(typeof subRes.output === 'string'
            ? [{ id: Math.random().toString(), type: subRes.error ? 'error' as const : 'output' as const, text: subRes.output }]
            : subRes.output)
        ],
        newPath: subRes.newPath,
        clearScreen: subRes.clearScreen,
        dangerAlert: subRes.dangerAlert
      };
    }

    case 'cd': {
      const target = args[0] || '~';
      const newParts = resolvePath(currentParts, target, false);
      const targetNode = getNodeAtPath(ctx.vfs, newParts);

      if (!targetNode) {
        return { output: `bash: cd: ${target}: Arquivo ou diretório não encontrado`, error: true };
      }
      if (targetNode.type !== 'dir') {
        return { output: `bash: cd: ${target}: Não é um diretório`, error: true };
      }

      return { output: '', newPath: formatPath(newParts, false) };
    }

    case 'ls': {
      const showAll = args.some(a => a.includes('a'));
      const showLong = args.some(a => a.includes('l'));
      
      let targetPath = currentParts;
      const pathArg = args.find(a => !a.startsWith('-'));
      if (pathArg) {
        targetPath = resolvePath(currentParts, pathArg, false);
      }

      const dirNode = getNodeAtPath(ctx.vfs, targetPath);
      if (!dirNode) return { output: `ls: impossível acessar '${pathArg}': Arquivo ou diretório não encontrado`, error: true };
      if (dirNode.type === 'file') {
        return { output: `${dirNode.permissions} 1 ${dirNode.owner} ${dirNode.owner} ${dirNode.size} ${dirNode.name}` };
      }

      const children = dirNode.children || {};
      let keys = Object.keys(children);
      if (!showAll) {
        keys = keys.filter(k => !k.startsWith('.'));
      }

      if (keys.length === 0) return { output: '' };

      if (showLong) {
        let totalBlocks = keys.reduce((acc, k) => acc + (children[k].size || 4096), 0);
        let lines: string[] = [`total ${Math.ceil(totalBlocks / 1024)}`];

        if (showAll) {
          lines.push(`drwxr-xr-x 4 ${dirNode.owner} ${dirNode.owner} 4096 .`);
          lines.push(`drwxr-xr-x 8 root root 4096 ..`);
        }

        for (const k of keys) {
          const item = children[k];
          const isDir = item.type === 'dir';
          const perms = item.permissions || (isDir ? 'drwxr-xr-x' : '-rw-r--r--');
          const prefix = isDir && !perms.startsWith('d') ? 'd' + perms : (isDir ? perms : (perms.startsWith('-') ? perms : '-' + perms));
          const owner = item.owner || 'aluno';
          const size = item.size || (isDir ? 4096 : 120);
          const dateStr = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('pt-BR', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'Jul 22 10:00';
          
          lines.push(`${prefix} 1 ${owner} ${owner} ${size.toString().padStart(6, ' ')} ${dateStr} ${item.name}`);
        }
        return { output: lines.join('\n') };
      } else {
        return { output: keys.join('  ') };
      }
    }

    case 'mkdir': {
      if (args.length === 0) return { output: 'mkdir: falta um operando', error: true };
      const dirName = args.find(a => !a.startsWith('-'));
      if (!dirName) return { output: 'mkdir: nome de diretório inválido', error: true };

      const created = createNodeAtPath(ctx.vfs, currentParts, dirName, 'dir', '', ctx.user);
      if (!created) return { output: `mkdir: impossível criar o diretório '${dirName}': Falha no sistema de arquivos`, error: true };
      return { output: '' };
    }

    case 'rm': {
      const isRecursive = args.some(a => a.includes('r') || a.includes('R'));
      const isForce = args.some(a => a.includes('f'));
      const targetArg = args.find(a => !a.startsWith('-'));

      if (!targetArg) return { output: 'rm: falta operando', error: true };

      // Danger check
      if ((targetArg === '/' || targetArg === '/*') && isRecursive && isForce) {
        return {
          output: 'rm: recusando-se a remover \'/\' de forma recursiva por segurança!',
          dangerAlert: {
            title: '⚠️ COMANDO PERIGOSO DETECTADO: rm -rf /',
            description: 'No Linux real, executar "rm -rf /" como superusuário apaga TODO o sistema de arquivos, destruindo o sistema operacional, logs, programas e arquivos de usuários.',
            command: 'rm -rf /'
          }
        };
      }

      const targetParts = resolvePath(currentParts, targetArg, false);
      const targetNode = getNodeAtPath(ctx.vfs, targetParts);

      if (!targetNode) {
        if (!isForce) return { output: `rm: não foi possível remover '${targetArg}': Arquivo ou diretório não encontrado`, error: true };
        return { output: '' };
      }

      if (targetNode.type === 'dir' && !isRecursive) {
        return { output: `rm: impossível remover '${targetArg}': É um diretório`, error: true };
      }

      const parentParts = targetParts.slice(0, -1);
      const name = targetParts[targetParts.length - 1];
      deleteNodeAtPath(ctx.vfs, parentParts, name);
      return { output: '' };
    }

    case 'cat': {
      if (args.length === 0) return { output: 'cat: falta um nome de arquivo', error: true };
      const fileName = args[0];
      const fileParts = resolvePath(currentParts, fileName, false);
      const fileNode = getNodeAtPath(ctx.vfs, fileParts);

      if (!fileNode) return { output: `cat: ${fileName}: Arquivo ou diretório não encontrado`, error: true };
      if (fileNode.type === 'dir') return { output: `cat: ${fileName}: É um diretório`, error: true };

      return { output: fileNode.content || '' };
    }

    case 'grep': {
      if (args.length < 2) return { output: 'uso: grep [opções] PADRÃO [ARQUIVO...]', error: true };
      const isIgnoreCase = args.some(a => a === '-i');
      const nonFlags = args.filter(a => !a.startsWith('-'));
      const pattern = nonFlags[0];
      const fileName = nonFlags[1];

      if (!pattern || !fileName) return { output: 'grep: parâmetros insuficientes', error: true };

      const fileParts = resolvePath(currentParts, fileName, false);
      const fileNode = getNodeAtPath(ctx.vfs, fileParts);

      if (!fileNode) return { output: `grep: ${fileName}: Arquivo não encontrado`, error: true };
      if (fileNode.type === 'dir') return { output: `grep: ${fileName}: É um diretório`, error: true };

      const lines = (fileNode.content || '').split('\n');
      const regex = new RegExp(pattern, isIgnoreCase ? 'i' : '');
      const matched = lines.filter(line => regex.test(line));

      if (matched.length === 0) return { output: '' };
      return { output: matched.join('\n') };
    }

    case 'chmod': {
      if (args.length < 2) return { output: 'uso: chmod MODE ARQUIVO', error: true };
      const mode = args[0];
      const fileName = args[1];
      const fileParts = resolvePath(currentParts, fileName, false);
      const fileNode = getNodeAtPath(ctx.vfs, fileParts);

      if (!fileNode) return { output: `chmod: impossível acessar '${fileName}': Arquivo não encontrado`, error: true };

      if (/^[0-7]{3}$/.test(mode)) {
        const numToPerm = (n: string) => {
          const val = parseInt(n, 10);
          return (val & 4 ? 'r' : '-') + (val & 2 ? 'w' : '-') + (val & 1 ? 'x' : '-');
        };
        const p1 = numToPerm(mode[0]);
        const p2 = numToPerm(mode[1]);
        const p3 = numToPerm(mode[2]);
        fileNode.permissions = `${p1}${p2}${p3}`;
      } else if (mode.includes('+x')) {
        fileNode.permissions = (fileNode.permissions || 'rw-r--r--').replace(/r-/g, 'rx');
      }

      return { output: `Permissões de '${fileName}' alteradas para ${fileNode.permissions}` };
    }

    case 'chown': {
      if (args.length < 2) return { output: 'uso: chown USUARIO:GRUPO ARQUIVO', error: true };
      const ownerGroup = args[0];
      const fileName = args[1];
      const fileParts = resolvePath(currentParts, fileName, false);
      const fileNode = getNodeAtPath(ctx.vfs, fileParts);

      if (!fileNode) return { output: `chown: impossível acessar '${fileName}': Arquivo não encontrado`, error: true };

      const [owner, group] = ownerGroup.split(':');
      fileNode.owner = owner;
      if (group) fileNode.group = group;

      return { output: `Propridade de '${fileName}' alterada para ${ownerGroup}` };
    }

    case 'cp': {
      if (args.length < 2) return { output: 'cp: operandos de arquivo ausentes', error: true };
      const nonFlags = args.filter(a => !a.startsWith('-'));
      const srcName = nonFlags[0];
      const destName = nonFlags[1];

      const srcParts = resolvePath(currentParts, srcName, false);
      const srcNode = getNodeAtPath(ctx.vfs, srcParts);

      if (!srcNode) return { output: `cp: impossível obter estado de '${srcName}': Arquivo não encontrado`, error: true };

      createNodeAtPath(ctx.vfs, currentParts, destName, srcNode.type, srcNode.content || '', ctx.user);
      return { output: '' };
    }

    case 'mv': {
      if (args.length < 2) return { output: 'mv: operandos de arquivo ausentes', error: true };
      const srcName = args[0];
      const destName = args[1];

      const srcParts = resolvePath(currentParts, srcName, false);
      const srcNode = getNodeAtPath(ctx.vfs, srcParts);

      if (!srcNode) return { output: `mv: impossível obter estado de '${srcName}': Arquivo não encontrado`, error: true };

      createNodeAtPath(ctx.vfs, currentParts, destName, srcNode.type, srcNode.content || '', ctx.user);
      const parentParts = srcParts.slice(0, -1);
      deleteNodeAtPath(ctx.vfs, parentParts, srcParts[srcParts.length - 1]);

      return { output: '' };
    }

    case 'ps':
      return {
        output: [
          '  PID TTY          TIME CMD',
          '    1 ?        00:00:02 systemd',
          '  245 ?        00:00:00 sshd',
          '  890 ?        00:00:01 nginx',
          ' 1024 pts/0    00:00:00 bash',
          ' 1450 pts/0    00:00:00 ps'
        ].join('\n')
      };

    case 'top':
      return {
        output: [
          'top - 19:20:49 up 45 days, 3:12, 1 user, load average: 0.15, 0.08, 0.04',
          'Tasks: 112 total,   1 running, 111 sleeping,   0 stopped,   0 zombie',
          '%Cpu(s):  2.3 us,  1.0 sy,  0.0 ni, 96.5 id,  0.2 wa,  0.0 hi,  0.0 si',
          'MiB Mem :   7980.2 total,   4120.5 free,   2150.1 used,   1709.6 buff/cache',
          '',
          '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
          '  890 www-data  20   0  145200   9800   4500 S   1.8   0.1   0:15.20 nginx',
          ' 1024 aluno     20   0   22400   5200   3100 S   0.5   0.1   0:01.40 bash',
          '    1 root      20   0  168400  12400   8200 S   0.1   0.2   0:08.50 systemd'
        ].join('\n')
      };

    case 'kill': {
      if (args.length === 0) return { output: 'kill: uso: kill [-s sinal|-p] pid...', error: true };
      const pid = args.find(a => !a.startsWith('-'));
      return { output: `[SISTEMA] Sinal SIGTERM enviado para o processo PID ${pid}. Processo finalizado.` };
    }

    case 'systemctl': {
      if (args.length < 2) return { output: 'uso: systemctl [status|start|stop|restart] NOME_SERVIÇO', error: true };
      const action = args[0];
      const service = args[1];

      if (action === 'status') {
        return {
          output: `● ${service}.service - ${service.toUpperCase()} Web Server / Daemon Service\n   Loaded: loaded (/lib/systemd/system/${service}.service; enabled; vendor preset: enabled)\n   Active: active (running) since Mon 2026-07-20 14:00:00 UTC\n   Main PID: 890 (${service})\n     Tasks: 2 (limit: 4915)\n    Memory: 12.4M\n       CPU: 1.2s`
        };
      }
      return { output: `[systemctl] Serviço '${service}' ${action === 'start' ? 'iniciado' : action === 'stop' ? 'interrompido' : 'reiniciado'} com sucesso.` };
    }

    case 'apt':
    case 'apt-get': {
      if (args.length === 0) return { output: 'apt: uso: apt [update|install|remove] pacote', error: true };
      const action = args[0];
      const pkg = args[1] || 'htop';

      if (action === 'update') {
        return {
          output: [
            'Atingido:1 http://br.archive.ubuntu.com/ubuntu jammy InRelease',
            'Obter:2 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]',
            'Lendo listas de pacotes... Pronto',
            'Todos os pacotes estão atualizados.'
          ].join('\n')
        };
      } else if (action === 'install') {
        return {
          output: [
            `Lendo listas de pacotes... Pronto`,
            `Construindo árvore de dependências... Pronto`,
            `Os seguintes pacotes adicionais serão instalados: ${pkg}`,
            `Baixando ${pkg}_2.4.0_amd64.deb ... 100%`,
            `Descompactando ${pkg} (2.4.0) ...`,
            `Configurando ${pkg} (2.4.0) ...`,
            `[SUCESSO] Instalação do pacote '${pkg}' concluída!`
          ].join('\n')
        };
      }
      return { output: `Ação do APT '${action}' concluída.` };
    }

    case 'git': {
      if (args.length === 0) return { output: 'git: uso: git [--version] [--help] <comando> [<args>]', error: true };
      const sub = args[0];
      if (sub === 'status') {
        return {
          output: 'No ramo main\nSua ramificação está atualizada com \'origin/main\'.\n\nNada a submeter, diretório de trabalho limpo'
        };
      } else if (sub === 'init') {
        return { output: `Repositório Git vazio inicializado em ${ctx.currentPath}/.git/` };
      }
      return { output: `[git] Comando 'git ${sub}' executado com sucesso.` };
    }

    case 'ssh': {
      if (args.length === 0) return { output: 'uso: ssh usuario@hostname', error: true };
      const host = args[0];
      return {
        output: [
          `Conectando a ${host}...`,
          `Autenticidade do host '${host}' estabelecida.`,
          `Sua última conexão foi em Mon Jul 20 18:32:01 2026 de 192.168.1.5`,
          `Bem-vindo ao servidor remoto Debian Linux!`
        ].join('\n')
      };
    }

    case 'man': {
      if (args.length === 0) return { output: 'Qual página de manual você deseja?', error: true };
      const targetCmd = args[0];
      return {
        output: `PÁGINA DO MANUAL DE AJUDA: ${targetCmd.toUpperCase()}(1)\n\nNOME\n       ${targetCmd} - comando essencial do sistema operacional Linux\n\nSINOPSI\n       ${targetCmd} [OPÇÃO]... [ARQUIVO]...\n\nDESCRIÇÃO\n       Executa a operação de ${targetCmd} no sistema de arquivos virtual do Terminal Master.\n       Consulte as categorias de treinamento para desafios práticos com este comando.`
      };
    }

    case 'help':
      return {
        output: [
          '=== SISTEMA DE AJUDA DO LINUX TERMINAL ===',
          'Comandos disponíveis nesta simulação:',
          '  Navegação:       pwd, cd, ls, find',
          '  Arquivos:        mkdir, rm, cp, mv, cat, grep, echo, chmod, chown',
          '  Processos:       ps, top, kill, systemctl',
          '  Administração:   sudo, apt, whoami, uname, ssh, git',
          '  Utilitários:     clear, history, man, help',
          '',
          'Dica: Use Tab para autocompletar e setas para cima/baixo para histórico.'
        ].join('\n')
      };

    default:
      return {
        output: `bash: ${cmd}: comando não encontrado. Digite 'help' para ver os comandos disponíveis.`,
        error: true
      };
  }
}

function parseCommandLine(text: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if ((char === '"' || char === "'") && (!inQuotes || quoteChar === char)) {
      inQuotes = !inQuotes;
      quoteChar = inQuotes ? char : '';
    } else if (char === ' ' && !inQuotes) {
      if (current) {
        result.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }
  if (current) result.push(current);
  return result;
}
