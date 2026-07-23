import { CommandContext, CommandResult } from '../types';
import { formatPath, getNodeAtPath, resolvePath, createNodeAtPath, deleteNodeAtPath } from '../vfs';

export function executePowerShellCommand(
  input: string,
  ctx: CommandContext
): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { output: '' };

  const tokens = parseCommandLine(trimmed);
  const rawCmd = tokens[0] || '';
  const cmdLower = rawCmd.toLowerCase();
  const args = tokens.slice(1);

  const currentParts = resolvePath([], ctx.currentPath || 'C:\\Users\\Aluno', true);
  const currentDirNode = getNodeAtPath(ctx.vfs, currentParts);

  // Normalize aliases
  let canonical = cmdLower;
  if (['dir', 'ls', 'gci'].includes(cmdLower)) canonical = 'get-childitem';
  if (['cd', 'chdir', 'sl'].includes(cmdLower)) canonical = 'set-location';
  if (['pwd', 'gl'].includes(cmdLower)) canonical = 'get-location';
  if (['mkdir', 'ni'].includes(cmdLower)) canonical = 'new-item';
  if (['rm', 'del', 'ri', 'erase', 'rd', 'rmdir'].includes(cmdLower)) canonical = 'remove-item';
  if (['cp', 'copy', 'ci'].includes(cmdLower)) canonical = 'copy-item';
  if (['mv', 'move', 'mi'].includes(cmdLower)) canonical = 'move-item';
  if (['cat', 'type', 'gc'].includes(cmdLower)) canonical = 'get-content';
  if (['grep'].includes(cmdLower)) canonical = 'select-string';
  if (['ps', 'gps'].includes(cmdLower)) canonical = 'get-process';
  if (['cls', 'clear'].includes(cmdLower)) canonical = 'clear-host';
  if (['echo', 'write-output'].includes(cmdLower)) canonical = 'write-host';

  switch (canonical) {
    case 'get-location':
      return { output: `Path\n----\n${formatPath(currentParts, true)}` };

    case 'clear-host':
      return { output: '', clearScreen: true };

    case 'write-host': {
      const text = args.join(' ').replace(/^['"]|['"]$/g, '');
      return { output: text };
    }

    case 'set-location': {
      const target = args[0] || 'C:\\Users\\Aluno';
      const newParts = resolvePath(currentParts, target, true);
      const targetNode = getNodeAtPath(ctx.vfs, newParts);

      if (!targetNode) {
        return {
          output: `Set-Location : Cannot find path '${target}' because it does not exist.`,
          error: true
        };
      }
      if (targetNode.type !== 'dir') {
        return {
          output: `Set-Location : Path '${target}' is a file, not a directory.`,
          error: true
        };
      }

      return { output: '', newPath: formatPath(newParts, true) };
    }

    case 'get-childitem': {
      let targetPath = currentParts;
      if (args.length > 0 && !args[0].startsWith('-')) {
        targetPath = resolvePath(currentParts, args[0], true);
      }

      const dirNode = getNodeAtPath(ctx.vfs, targetPath);
      if (!dirNode) return { output: `Get-ChildItem : Cannot find path '${args[0]}' because it does not exist.`, error: true };

      const children = dirNode.children || {};
      const keys = Object.keys(children);

      const header = `
    Directory: ${formatPath(targetPath, true)}

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----`;

      const rows = keys.map(k => {
        const item = children[k];
        const isDir = item.type === 'dir';
        const mode = isDir ? 'd-----' : '-a----';
        const dateStr = item.updatedAt ? new Date(item.updatedAt).toLocaleString('pt-BR') : '22/07/2026 10:00';
        const length = isDir ? '' : (item.size || 120).toString().padStart(6, ' ');
        return `${mode.padEnd(20, ' ')} ${dateStr.padEnd(20, ' ')} ${length.padStart(7, ' ')} ${item.name}`;
      });

      return { output: [header, ...rows].join('\n') };
    }

    case 'new-item': {
      let name = args.find(a => !a.startsWith('-')) || 'NovaPasta';
      let type: 'file' | 'dir' = 'dir';

      if (args.includes('-ItemType') || args.includes('-type')) {
        const idx = Math.max(args.indexOf('-ItemType'), args.indexOf('-type'));
        if (args[idx + 1]?.toLowerCase() === 'file') type = 'file';
      } else if (name.includes('.')) {
        type = 'file';
      }

      createNodeAtPath(ctx.vfs, currentParts, name, type, '', 'Aluno');

      return {
        output: `
    Directory: ${formatPath(currentParts, true)}

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
${type === 'dir' ? 'd-----' : '-a----'}       ${new Date().toLocaleString('pt-BR')}              0 ${name}`
      };
    }

    case 'remove-item': {
      const targetArg = args.find(a => !a.startsWith('-'));
      const isRecurse = args.some(a => a.toLowerCase().includes('recurse') || a === '-r');
      const isForce = args.some(a => a.toLowerCase().includes('force') || a === '-f');

      if (!targetArg) return { output: 'Remove-Item : Missing target item parameter.', error: true };

      if ((targetArg.toUpperCase().includes('SYSTEM32') || targetArg === 'C:\\') && isRecurse && isForce) {
        return {
          output: 'Remove-Item : Access denied to critical Windows operating system directory!',
          dangerAlert: {
            title: '⚠️ COMANDO DESTRUTIVO EM WINDOWS DETECTADO',
            description: 'Executar "Remove-Item -Recurse -Force C:\\Windows\\System32" apagaria DLLs essenciais do Windows, inutilizando o computador e forçando a reinstalação do SO.',
            command: 'Remove-Item -Recurse -Force C:\\Windows\\System32'
          }
        };
      }

      const targetParts = resolvePath(currentParts, targetArg, true);
      const parentParts = targetParts.slice(0, -1);
      const name = targetParts[targetParts.length - 1];

      const deleted = deleteNodeAtPath(ctx.vfs, parentParts, name);
      if (!deleted) return { output: `Remove-Item : Cannot find path '${targetArg}' because it does not exist.`, error: true };

      return { output: '' };
    }

    case 'get-content': {
      if (args.length === 0) return { output: 'Get-Content : CmdletBinding parameter missing.', error: true };
      const fileName = args[0];
      const fileParts = resolvePath(currentParts, fileName, true);
      const fileNode = getNodeAtPath(ctx.vfs, fileParts);

      if (!fileNode) return { output: `Get-Content : Cannot find path '${fileName}' because it does not exist.`, error: true };
      if (fileNode.type === 'dir') return { output: `Get-Content : Path '${fileName}' is a directory.`, error: true };

      return { output: fileNode.content || '' };
    }

    case 'select-string': {
      if (args.length < 2) return { output: 'Select-String : Specify -Pattern and target file.', error: true };
      let pattern = args[0];
      let fileName = args[1];

      if (args.includes('-Pattern')) {
        const pIdx = args.indexOf('-Pattern');
        pattern = args[pIdx + 1];
        fileName = args.find((a, i) => i !== pIdx && i !== pIdx + 1 && !a.startsWith('-')) || fileName;
      }

      const fileParts = resolvePath(currentParts, fileName, true);
      const fileNode = getNodeAtPath(ctx.vfs, fileParts);

      if (!fileNode) return { output: `Select-String : Cannot find path '${fileName}'.`, error: true };

      const lines = (fileNode.content || '').split('\n');
      const matched = lines.filter(l => l.toLowerCase().includes(pattern.toLowerCase()));

      const rows = matched.map((l, i) => `${fileName}:${i + 1}:${l}`);
      return { output: rows.join('\n') };
    }

    case 'get-process': {
      return {
        output: [
          'Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName',
          '-------  ------    -----      -----     ------     --  -- -----------',
          '    420      18    24500      38000       4.12   1024   1 powershell',
          '   1150      42   120000     185000      28.50   4820   1 explorer',
          '    280      12    15000      22000       1.20   2100   1 svchost',
          '    850      35    89000     110000      14.30   5500   1 msedge'
        ].join('\n')
      };
    }

    case 'get-service': {
      return {
        output: [
          'Status   Name               DisplayName',
          '------   ----               -----------',
          'Running  Spooler            Print Spooler',
          'Running  wuauserv           Windows Update',
          'Stopped  w32time            Windows Time',
          'Running  WinDefend          Microsoft Defender Antivirus Service',
          'Stopped  ssh-agent          OpenSSH Authentication Agent'
        ].join('\n')
      };
    }

    case 'start-service':
    case 'stop-service': {
      const serviceName = args[0] || 'Spooler';
      const isStart = canonical === 'start-service';
      return {
        output: `[PowerShell] Status do serviço '${serviceName}' alterado para '${isStart ? 'Running' : 'Stopped'}'.`
      };
    }

    case 'get-help': {
      const targetCmd = args[0] || 'Get-ChildItem';
      return {
        output: `
NAME
    ${targetCmd}

SYNOPSIS
    Gets the items and child items in one or more specified locations in Windows PowerShell.

SYNTAX
    ${targetCmd} [[-Path] <String[]>] [-Recurse] [-Filter <String>] [<CommonParameters>]

DESCRIPTION
    The ${targetCmd} cmdlet gets the items in one or more specified locations.
    Use Get-Help -Detailed for comprehensive documentation.`
      };
    }

    default:
      return {
        output: `${rawCmd} : The term '${rawCmd}' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if a path was included, verify that the path is correct and try again.`,
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
