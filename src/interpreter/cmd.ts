import { CommandContext, CommandResult } from '../types';
import { formatPath, getNodeAtPath, resolvePath, createNodeAtPath, deleteNodeAtPath } from '../vfs';

export function executeCMDCommand(
  input: string,
  ctx: CommandContext
): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { output: '' };

  const tokens = parseCommandLine(trimmed);
  const cmd = tokens[0]?.toLowerCase();
  const args = tokens.slice(1);

  const currentParts = resolvePath([], ctx.currentPath || 'C:\\Users\\Aluno', true);
  const currentDirNode = getNodeAtPath(ctx.vfs, currentParts);

  switch (cmd) {
    case 'cls':
      return { output: '', clearScreen: true };

    case 'ver':
      return { output: 'Microsoft Windows [Versão 10.0.19045.3803]' };

    case 'echo':
      return { output: args.join(' ').replace(/^['"]|['"]$/g, '') };

    case 'cd':
    case 'chdir': {
      if (args.length === 0) {
        return { output: formatPath(currentParts, true) };
      }
      const target = args[0];
      const newParts = resolvePath(currentParts, target, true);
      const targetNode = getNodeAtPath(ctx.vfs, newParts);

      if (!targetNode) {
        return { output: 'O sistema não pode encontrar o caminho especificado.', error: true };
      }
      if (targetNode.type !== 'dir') {
        return { output: 'O nome do diretório é inválido.', error: true };
      }

      return { output: '', newPath: formatPath(newParts, true) };
    }

    case 'dir': {
      let targetPath = currentParts;
      if (args.length > 0 && !args[0].startsWith('/')) {
        targetPath = resolvePath(currentParts, args[0], true);
      }

      const dirNode = getNodeAtPath(ctx.vfs, targetPath);
      if (!dirNode) return { output: 'O sistema não pode encontrar o caminho especificado.', error: true };

      const children = dirNode.children || {};
      const keys = Object.keys(children);

      const formattedPath = formatPath(targetPath, true);
      let fileCount = 0;
      let dirCount = 0;
      let totalBytes = 0;

      const lines: string[] = [
        ` O volume na unidade C não tem nome.`,
        ` O Número de Série do Volume é 8A2F-4B1C`,
        ``,
        ` Pasta de ${formattedPath}`,
        ``,
        `22/07/2026  10:00    <DIR>          .`,
        `22/07/2026  10:00    <DIR>          ..`
      ];

      for (const k of keys) {
        const item = children[k];
        const isDir = item.type === 'dir';
        const dateStr = '22/07/2026  10:00';
        if (isDir) {
          dirCount++;
          lines.push(`${dateStr}    <DIR>          ${item.name}`);
        } else {
          fileCount++;
          const sz = item.size || 120;
          totalBytes += sz;
          lines.push(`${dateStr}            ${sz.toString().padStart(8, ' ')} ${item.name}`);
        }
      }

      lines.push(`               ${fileCount} arquivo(s)     ${totalBytes} bytes`);
      lines.push(`               ${dirCount + 2} pasta(s)   45.210.890.240 bytes livres`);

      return { output: lines.join('\n') };
    }

    case 'mkdir':
    case 'md': {
      if (args.length === 0) return { output: 'A sintaxe do comando está incorreta.', error: true };
      const dirName = args[0];
      createNodeAtPath(ctx.vfs, currentParts, dirName, 'dir', '', 'Aluno');
      return { output: '' };
    }

    case 'del':
    case 'erase': {
      if (args.length === 0) return { output: 'A sintaxe do comando está incorreta.', error: true };
      const targetArg = args.find(a => !a.startsWith('/')) || args[0];

      if (targetArg.toUpperCase().includes('SYSTEM32') || targetArg.toUpperCase().includes('WINDOWS') || (targetArg === '*.*' && args.some(a => a.toLowerCase() === '/f' || a.toLowerCase() === '/s'))) {
        return {
          output: 'Acesso negado. Impossível excluir arquivos do sistema Windows!',
          dangerAlert: {
            title: '⚠️ COMANDO PERIGOSO DETECTADO: DEL SYSTEM32',
            description: 'No Prompt de Comando (CMD), o comando "del /f /s /q C:\\Windows\\System32" força a exclusão de executáveis cruciais do sistema operacional.',
            command: 'del /f /s /q C:\\Windows\\System32'
          }
        };
      }

      const targetParts = resolvePath(currentParts, targetArg, true);
      const parentParts = targetParts.slice(0, -1);
      const name = targetParts[targetParts.length - 1];

      const deleted = deleteNodeAtPath(ctx.vfs, parentParts, name);
      if (!deleted) return { output: 'Could Not Find ' + targetArg, error: true };

      return { output: '' };
    }

    case 'copy': {
      if (args.length < 2) return { output: 'A sintaxe do comando está incorreta.', error: true };
      const srcName = args[0];
      const destName = args[1];

      const srcParts = resolvePath(currentParts, srcName, true);
      const srcNode = getNodeAtPath(ctx.vfs, srcParts);

      if (!srcNode) return { output: 'O sistema não pode encontrar o arquivo especificado.', error: true };

      createNodeAtPath(ctx.vfs, currentParts, destName, srcNode.type, srcNode.content || '', 'Aluno');
      return { output: '        1 arquivo(s) copiado(s).' };
    }

    case 'move': {
      if (args.length < 2) return { output: 'A sintaxe do comando está incorreta.', error: true };
      const srcName = args[0];
      const destName = args[1];

      const srcParts = resolvePath(currentParts, srcName, true);
      const srcNode = getNodeAtPath(ctx.vfs, srcParts);

      if (!srcNode) return { output: 'O sistema não pode encontrar o arquivo especificado.', error: true };

      createNodeAtPath(ctx.vfs, currentParts, destName, srcNode.type, srcNode.content || '', 'Aluno');
      const parentParts = srcParts.slice(0, -1);
      deleteNodeAtPath(ctx.vfs, parentParts, srcParts[srcParts.length - 1]);

      return { output: '        1 arquivo(s) movido(s).' };
    }

    case 'type': {
      if (args.length === 0) return { output: 'A sintaxe do comando está incorreta.', error: true };
      const fileName = args[0];
      const fileParts = resolvePath(currentParts, fileName, true);
      const fileNode = getNodeAtPath(ctx.vfs, fileParts);

      if (!fileNode) return { output: 'O sistema não pode encontrar o arquivo especificado.', error: true };
      if (fileNode.type === 'dir') return { output: 'Acesso negado.', error: true };

      return { output: fileNode.content || '' };
    }

    case 'ipconfig': {
      const showAll = args.some(a => a.toLowerCase() === '/all');
      const lines = [
        '',
        'Configuração de IP do Windows',
        '',
        'Adaptador de Rede Sem Fio Wi-Fi:',
        '',
        '   Sufixo DNS específico de conexão. . . . . : home.local',
        '   Endereço IPv6 de link local . . . . . . . : fe80::a1b2:c3d4:e5f6%12',
        '   Endereço IPv4. . . . . . . . . . . . . . . : 192.168.1.105',
        '   Mascara de Sub-rede . . . . . . . . . . . : 255.255.255.0',
        '   Gateway Padrão. . . . . . . . . . . . . . : 192.168.1.1'
      ];

      if (showAll) {
        lines.push(
          '   Endereço Físico (MAC) . . . . . . . . . . : 00-1A-2B-3C-4D-5E',
          '   DHCP Habilitado . . . . . . . . . . . . . : Sim',
          '   Servidores DNS . . . . . . . . . . . . . . : 8.8.8.8, 1.1.1.1'
        );
      }
      return { output: lines.join('\n') };
    }

    case 'tasklist': {
      return {
        output: [
          'Nome da imagem                 PID Nome da sessão      Nº da sessão Uso de memória',
          '========================= ======== ================ ============ ==============',
          'System Idle Process              0 Services                    0            8 K',
          'System                           4 Services                    0          280 K',
          'explorer.exe                  3412 Console                     1       85.420 K',
          'cmd.exe                       4010 Console                     1        4.120 K',
          'chrome.exe                    5890 Console                     1      245.000 K'
        ].join('\n')
      };
    }

    case 'taskkill': {
      if (args.length === 0) return { output: 'ERRO: Sintaxe incorreta. Digite "TASKKILL /?" para obter a sintaxe.', error: true };
      const proc = args.find(a => !a.startsWith('/')) || args[args.length - 1];
      return { output: `SUCESSO: O processo com PID/Nome "${proc}" foi finalizado.` };
    }

    case 'systeminfo': {
      return {
        output: [
          'Nome do host:                  TERMINAL-WIN10',
          'Nome do SO:                    Microsoft Windows 10 Pro',
          'Versão do SO:                  10.0.19045 N/A Compilação 19045',
          'Fabricante do SO:              Microsoft Corporation',
          'Configuração do SO:            Estação de trabalho autônoma',
          'Processador(es):               1 Processador(es) instalado(s).',
          '                               [01]: Intel64 Family 6 Model 158 Stepping 10 ~3000 Mhz',
          'Memória física total:          8.192 MB',
          'Memória física disponível:     4.512 MB'
        ].join('\n')
      };
    }

    case 'help': {
      return {
        output: [
          'Para obter mais informações sobre um comando específico, digite HELP nome_do_comando',
          'CD         Exibe o nome do diretório atual ou altera o diretório.',
          'CLS        Limpa a tela.',
          'COPY       Copia um ou mais arquivos para outro local.',
          'DEL        Exclui um ou mais arquivos.',
          'DIR        Exibe uma lista de arquivos e subdiretórios em um diretório.',
          'IPCONFIG   Exibe os valores de configuração de rede IP do Windows.',
          'MKDIR      Cria um diretório.',
          'MOVE       Move um ou mais arquivos de um diretório para outro.',
          'TASKKILL   Encerra ou interrompe um processo.',
          'TASKLIST   Exibe todos os processos em execução no momento.',
          'TYPE       Exibe o conteúdo de um arquivo de texto.',
          'VER        Exibe a versão do Windows.'
        ].join('\n')
      };
    }

    default:
      return {
        output: `'${cmd}' não é reconhecido como um comando interno ou externo, um programa operável ou um arquivo em lotes.`,
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
