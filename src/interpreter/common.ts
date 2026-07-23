import { CommandContext, CommandResult, OSKind } from '../types';
import { executeLinuxCommand } from './linux';
import { executePowerShellCommand } from './powershell';
import { executeCMDCommand } from './cmd';
import { getNodeAtPath, resolvePath } from '../vfs';

export function runCommand(input: string, ctx: CommandContext): CommandResult {
  switch (ctx.os) {
    case 'linux':
      return executeLinuxCommand(input, ctx);
    case 'powershell':
      return executePowerShellCommand(input, ctx);
    case 'cmd':
      return executeCMDCommand(input, ctx);
    default:
      return executeLinuxCommand(input, ctx);
  }
}

export function getAutocompleteSuggestions(input: string, ctx: CommandContext): { completion: string; options: string[] } {
  const trimmed = input.trimStart();
  const tokens = trimmed.split(/\s+/);
  const lastToken = tokens[tokens.length - 1] || '';

  const isWindows = ctx.os !== 'linux';
  const commandsList = ctx.os === 'linux'
    ? ['ls', 'cd', 'pwd', 'mkdir', 'rm', 'cp', 'mv', 'cat', 'grep', 'chmod', 'chown', 'ps', 'top', 'kill', 'systemctl', 'apt', 'ssh', 'git', 'whoami', 'clear', 'sudo', 'uname', 'man', 'history']
    : ctx.os === 'powershell'
    ? ['Get-Process', 'Get-Service', 'Get-ChildItem', 'Set-Location', 'New-Item', 'Remove-Item', 'Start-Service', 'Stop-Service', 'Get-Content', 'Select-String', 'Clear-Host', 'Write-Host', 'ls', 'dir', 'cd', 'pwd', 'rm', 'cat']
    : ['dir', 'cd', 'cls', 'mkdir', 'copy', 'move', 'del', 'ipconfig', 'tasklist', 'taskkill', 'type', 'echo', 'systeminfo', 'ver', 'help'];

  // If first token or typing command name
  if (tokens.length === 1 && !lastToken.includes('/') && !lastToken.includes('\\')) {
    const matches = commandsList.filter(c => c.toLowerCase().startsWith(lastToken.toLowerCase()));
    if (matches.length === 1) {
      return { completion: matches[0], options: [] };
    }
    return { completion: lastToken, options: matches };
  }

  // Git Subcommands autocomplete
  if (tokens[0].toLowerCase() === 'git' && tokens.length === 2) {
    const gitSubs = ['init', 'status', 'add', 'commit', 'log', 'branch', 'checkout', 'clone', 'diff', 'remote', 'push', 'pull', 'config', 'switch'];
    const matches = gitSubs.filter(s => s.toLowerCase().startsWith(lastToken.toLowerCase()));
    if (matches.length === 1) {
      return { completion: `git ${matches[0]}`, options: [] };
    }
    return { completion: input, options: matches.map(m => `git ${m}`) };
  }

  // File/Path autocomplete
  let searchDirParts = resolvePath([], ctx.currentPath, isWindows);
  let prefix = lastToken;

  if (lastToken.includes('/') || lastToken.includes('\\')) {
    const sep = lastToken.includes('/') ? '/' : '\\';
    const lastSepIdx = Math.max(lastToken.lastIndexOf('/'), lastToken.lastIndexOf('\\'));
    const dirPart = lastToken.substring(0, lastSepIdx);
    prefix = lastToken.substring(lastSepIdx + 1);
    searchDirParts = resolvePath(searchDirParts, dirPart, isWindows);
  }

  const node = getNodeAtPath(ctx.vfs, searchDirParts);
  if (!node || node.type !== 'dir' || !node.children) {
    return { completion: lastToken, options: [] };
  }

  const childNames = Object.keys(node.children);
  const matches = childNames.filter(name => name.toLowerCase().startsWith(prefix.toLowerCase()));

  if (matches.length === 1) {
    const matchName = matches[0];
    const isDir = node.children[matchName].type === 'dir';
    const suffix = isDir ? (isWindows ? '\\' : '/') : '';

    let completedToken = matchName + suffix;
    if (lastToken.includes('/') || lastToken.includes('\\')) {
      const lastSepIdx = Math.max(lastToken.lastIndexOf('/'), lastToken.lastIndexOf('\\'));
      completedToken = lastToken.substring(0, lastSepIdx + 1) + matchName + suffix;
    }

    const newTokens = [...tokens.slice(0, -1), completedToken];
    return { completion: newTokens.join(' '), options: [] };
  }

  return { completion: input, options: matches };
}
