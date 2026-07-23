import { CommandContext, CommandResult, GitState, GitCommit } from '../types';
import { resolvePath, getNodeAtPath, createNodeAtPath } from '../vfs';

export function getInitialGitState(): GitState {
  return {
    initialized: false,
    currentBranch: 'main',
    branches: ['main'],
    stagedFiles: [],
    commits: [],
    userConfig: {
      name: 'Aluno Dev',
      email: 'aluno@terminalmaster.io'
    },
    remotes: {}
  };
}

export function executeGitCommand(
  input: string,
  ctx: CommandContext
): CommandResult {
  const trimmed = input.trim();
  const tokens = parseGitLine(trimmed);
  
  // Basic git command tokens
  const args = tokens.slice(1); // tokens[0] is 'git'
  const subCmd = args[0]?.toLowerCase();

  // Ensure git state exists
  if (!ctx.gitState) {
    ctx.gitState = getInitialGitState();
  }

  const gitState = ctx.gitState;
  const currentParts = resolvePath([], ctx.currentPath, ctx.os !== 'linux');
  const currentDirNode = getNodeAtPath(ctx.vfs, currentParts);

  if (!subCmd || subCmd === '--help' || subCmd === '-h') {
    return {
      output: [
        'uso: git [--version] [--help] <comando> [<args>]',
        '',
        'Comandos Git mais utilizados nesta simulação:',
        '   init       Inicializa um novo repositório Git local',
        '   status     Exibe o estado do diretório de trabalho e da área de staging',
        '   add        Adiciona conteúdo de arquivos ao índice (staging area)',
        '   commit     Grava as alterações da área de staging no histórico',
        '   log        Exibe os logs e o histórico de commits do repositório',
        '   branch     Lista, cria ou exclui ramificações (branches)',
        '   checkout   Alterna entre branches ou restaura arquivos',
        '   clone      Clona um repositório para um novo diretório',
        '   diff       Exibe alterações entre commits, staging e diretório de trabalho',
        '   remote     Gerencia repositórios remotos vinculados',
        '   push       Atualiza referências remotas e arquivos associados',
        '   pull       Busca e integra alterações de um repositório remoto',
        '   config     Configura variáveis do Git (ex: user.name, user.email)',
        '',
        "Veja 'git <comando> --help' para mais informações sobre um comando específico."
      ].join('\n')
    };
  }

  // Check version
  if (subCmd === '--version' || subCmd === '-v' || subCmd === 'version') {
    return { output: 'git version 2.43.0' };
  }

  // Handle 'git init'
  if (subCmd === 'init') {
    gitState.initialized = true;
    if (!gitState.branches.includes('main')) {
      gitState.branches = ['main'];
      gitState.currentBranch = 'main';
    }
    // Create .git node in current dir
    createNodeAtPath(ctx.vfs, currentParts, '.git', 'dir', '', ctx.user);

    return {
      output: `Repositório Git vazio inicializado em ${ctx.currentPath}/.git/`
    };
  }

  // Handle 'git clone' (can be executed even if not initialized yet)
  if (subCmd === 'clone') {
    const url = args[1];
    if (!url) {
      return { output: 'fatal: Você precisa especificar um repositório para clonar.\nuso: git clone <url> [<diretório>]', error: true };
    }

    let repoName = 'meu-projeto';
    if (url.includes('/')) {
      const parts = url.split('/');
      repoName = parts[parts.length - 1].replace(/\.git$/, '') || 'meu-projeto';
    }

    // Create cloned directory in VFS
    createNodeAtPath(ctx.vfs, currentParts, repoName, 'dir', '', ctx.user);
    const repoParts = [...currentParts, repoName];
    
    createNodeAtPath(ctx.vfs, repoParts, 'README.md', 'file', '# ' + repoName + '\nProjeto clonado via Git!', ctx.user);
    createNodeAtPath(ctx.vfs, repoParts, 'index.js', 'file', 'console.log("Olá do projeto " + repoName);', ctx.user);
    createNodeAtPath(ctx.vfs, repoParts, '.git', 'dir', '', ctx.user);

    gitState.initialized = true;
    gitState.currentBranch = 'main';
    gitState.branches = ['main'];
    gitState.stagedFiles = [];
    gitState.remotes['origin'] = url;
    gitState.commits = [
      {
        id: Math.random().toString(16).substring(2, 9),
        message: 'Initial commit from clone',
        author: gitState.userConfig.name + ' <' + gitState.userConfig.email + '>',
        date: new Date().toUTCString(),
        branch: 'main'
      }
    ];

    return {
      output: [
        `Clonando em '${repoName}'...`,
        `remote: Enumerating objects: 6, done.`,
        `remote: Counting objects: 100% (6/6), done.`,
        `remote: Compressing objects: 100% (4/4), done.`,
        `remote: Total 6 (delta 0), reused 6 (delta 0), pack-reused 0`,
        `Recebendo objetos: 100% (6/6), concluído.`
      ].join('\n')
    };
  }

  // For all other commands, check if repo is initialized
  if (!gitState.initialized) {
    return {
      output: 'fatal: not a git repository (or any of the parent directories): .git\n(Execute \'git init\' para inicializar um repositório nesta pasta)',
      error: true
    };
  }

  // Handle 'git config'
  if (subCmd === 'config') {
    if (args.includes('--list') || args.includes('-l')) {
      return {
        output: [
          `user.name=${gitState.userConfig.name}`,
          `user.email=${gitState.userConfig.email}`,
          `core.repositoryformatversion=0`,
          `core.filemode=true`,
          `core.bare=false`,
          `init.defaultBranch=main`
        ].join('\n')
      };
    }

    if (args.includes('user.name')) {
      const idx = args.indexOf('user.name');
      const val = args[idx + 1];
      if (val) {
        gitState.userConfig.name = val.replace(/^['"]|['"]$/g, '');
        return { output: `[git config] user.name definido para: ${gitState.userConfig.name}` };
      }
    }

    if (args.includes('user.email')) {
      const idx = args.indexOf('user.email');
      const val = args[idx + 1];
      if (val) {
        gitState.userConfig.email = val.replace(/^['"]|['"]$/g, '');
        return { output: `[git config] user.email definido para: ${gitState.userConfig.email}` };
      }
    }

    return { output: `Configuração atualizada: ${gitState.userConfig.name} <${gitState.userConfig.email}>` };
  }

  // Handle 'git status'
  if (subCmd === 'status') {
    const branchName = gitState.currentBranch;
    const children = currentDirNode?.children || {};
    const existingFiles = Object.keys(children).filter(k => k !== '.git');

    const staged = gitState.stagedFiles;
    const untracked = existingFiles.filter(f => !staged.includes(f) && gitState.commits.length === 0);

    let outputLinesStr: string[] = [
      `No ramo ${branchName}`
    ];

    if (gitState.remotes['origin']) {
      outputLinesStr.push(`Sua ramificação está atualizada com 'origin/${branchName}'.`);
    }

    outputLinesStr.push('');

    if (staged.length > 0) {
      outputLinesStr.push('Mudanças a serem submetidas (staged):');
      outputLinesStr.push('  (use "git restore --staged <arquivo>..." para remover do staging)');
      staged.forEach(f => {
        outputLinesStr.push(`\t\x1b[32mnovo arquivo:   ${f}\x1b[0m`);
      });
      outputLinesStr.push('');
    }

    if (untracked.length > 0) {
      outputLinesStr.push('Arquivos não monitorados (untracked):');
      outputLinesStr.push('  (use "git add <arquivo>..." para incluir na submissão)');
      untracked.forEach(f => {
        outputLinesStr.push(`\t\x1b[31m${f}\x1b[0m`);
      });
      outputLinesStr.push('');
    }

    if (staged.length === 0 && untracked.length === 0) {
      outputLinesStr.push('Nada a submeter, diretório de trabalho limpo');
    }

    return { output: outputLinesStr.join('\n') };
  }

  // Handle 'git add'
  if (subCmd === 'add') {
    const target = args[1];
    if (!target) {
      return { output: 'nada especificado, nada adicionado.\nTalvez você queira dizer \'git add .\'?', error: true };
    }

    const children = currentDirNode?.children || {};
    const existingFiles = Object.keys(children).filter(k => k !== '.git');

    if (target === '.' || target === '-A' || target === '--all') {
      gitState.stagedFiles = Array.from(new Set([...gitState.stagedFiles, ...existingFiles]));
      return { output: `${existingFiles.length} arquivo(s) adicionado(s) à área de staging.` };
    }

    if (existingFiles.includes(target)) {
      if (!gitState.stagedFiles.includes(target)) {
        gitState.stagedFiles.push(target);
      }
      return { output: `Arquivo '${target}' adicionado à área de staging.` };
    } else {
      return { output: `fatal: o caminho '${target}' não corresponde a nenhum arquivo`, error: true };
    }
  }

  // Handle 'git commit'
  if (subCmd === 'commit') {
    let msgIndex = args.indexOf('-m');
    if (msgIndex === -1) msgIndex = args.indexOf('-message');

    const msg = msgIndex !== -1 ? args[msgIndex + 1]?.replace(/^['"]|['"]$/g, '') : null;

    if (!msg) {
      return { output: 'erro: nenhuma mensagem de commit informada. Use -m "Sua mensagem"', error: true };
    }

    if (gitState.stagedFiles.length === 0) {
      return { output: `No ramo ${gitState.currentBranch}\nNada a submeter, diretório de trabalho limpo (use 'git add' primeiro)` };
    }

    const hash = Math.random().toString(16).substring(2, 9);
    const newCommit: GitCommit = {
      id: hash,
      message: msg,
      author: `${gitState.userConfig.name} <${gitState.userConfig.email}>`,
      date: new Date().toUTCString(),
      branch: gitState.currentBranch
    };

    const count = gitState.stagedFiles.length;
    gitState.commits.unshift(newCommit); // newest first
    gitState.stagedFiles = [];

    return {
      output: `[${gitState.currentBranch} ${hash}] ${msg}\n ${count} arquivo(s) alterado(s), ${count * 12} inserções(+)`
    };
  }

  // Handle 'git log'
  if (subCmd === 'log') {
    if (gitState.commits.length === 0) {
      return { output: 'fatal: o ramo atual ' + gitState.currentBranch + ' não possui nenhum commit ainda.' };
    }

    const isOneLine = args.includes('--oneline');

    if (isOneLine) {
      const lines = gitState.commits.map(c => `\x1b[33m${c.id}\x1b[0m (${c.branch}) ${c.message}`);
      return { output: lines.join('\n') };
    }

    const lines: string[] = [];
    gitState.commits.forEach(c => {
      lines.push(`\x1b[33mcommit ${c.id}\x1b[0m (HEAD -> \x1b[32m${c.branch}\x1b[0m)`);
      lines.push(`Author: ${c.author}`);
      lines.push(`Date:   ${c.date}`);
      lines.push('');
      lines.push(`    ${c.message}`);
      lines.push('');
    });

    return { output: lines.join('\n') };
  }

  // Handle 'git branch'
  if (subCmd === 'branch') {
    const newBranchName = args[1];
    if (!newBranchName || newBranchName.startsWith('-')) {
      // List branches
      const lines = gitState.branches.map(b => {
        return b === gitState.currentBranch ? `* \x1b[32m${b}\x1b[0m` : `  ${b}`;
      });
      return { output: lines.join('\n') };
    } else {
      // Create new branch
      if (gitState.branches.includes(newBranchName)) {
        return { output: `fatal: Uma ramificação chamada '${newBranchName}' já existe.`, error: true };
      }
      gitState.branches.push(newBranchName);
      return { output: `Ramificação '${newBranchName}' criada com sucesso.` };
    }
  }

  // Handle 'git checkout' or 'git switch'
  if (subCmd === 'checkout' || subCmd === 'switch') {
    let targetBranch = args[1];
    const isCreate = args.includes('-b') || subCmd === 'switch' && args.includes('-c');

    if (isCreate) {
      const idx = args.indexOf('-b') !== -1 ? args.indexOf('-b') : args.indexOf('-c');
      targetBranch = args[idx + 1];
      if (targetBranch) {
        if (!gitState.branches.includes(targetBranch)) {
          gitState.branches.push(targetBranch);
        }
        gitState.currentBranch = targetBranch;
        return { output: `Alternado para uma nova ramificação '${targetBranch}'` };
      }
    }

    if (!targetBranch) {
      return { output: 'erro: informe o nome da branch para qual deseja alternar', error: true };
    }

    if (gitState.branches.includes(targetBranch)) {
      gitState.currentBranch = targetBranch;
      return { output: `Alternado para o ramo '${targetBranch}'` };
    } else {
      return { output: `error: caminho/ramificação '${targetBranch}' não corresponde a nenhum arquivo conhecido pelo git`, error: true };
    }
  }

  // Handle 'git diff'
  if (subCmd === 'diff') {
    const children = currentDirNode?.children || {};
    const existingFiles = Object.keys(children).filter(k => k !== '.git');

    if (existingFiles.length === 0) {
      return { output: 'Nenhuma alteração detectada.' };
    }

    const lines: string[] = [];
    existingFiles.forEach(file => {
      lines.push(`diff --git a/${file} b/${file}`);
      lines.push(`index 83db48f..1a2b3c4 100644`);
      lines.push(`--- a/${file}`);
      lines.push(`+++ b/${file}`);
      lines.push(`@@ -1,3 +1,5 @@`);
      lines.push(`+ // Linhas adicionadas recentemente no arquivo ${file}`);
      lines.push(`+ console.log("Versão atualizada");`);
    });

    return { output: lines.join('\n') };
  }

  // Handle 'git remote'
  if (subCmd === 'remote') {
    const subAction = args[1];
    if (subAction === '-v' || args.includes('-v')) {
      const remotesList = Object.entries(gitState.remotes);
      if (remotesList.length === 0) {
        return { output: 'Nenhum repositório remoto configurado.' };
      }
      const out = remotesList.map(([name, url]) => `${name}\t${url} (fetch)\n${name}\t${url} (push)`).join('\n');
      return { output: out };
    }

    if (subAction === 'add') {
      const name = args[2] || 'origin';
      const url = args[3] || 'https://github.com/aluno/meu-repositorio.git';
      gitState.remotes[name] = url;
      return { output: `Repositório remoto '${name}' adicionado vinculando a ${url}` };
    }

    return { output: Object.keys(gitState.remotes).join('\n') || 'origin' };
  }

  // Handle 'git push'
  if (subCmd === 'push') {
    const remote = args[1] || 'origin';
    const branch = args[2] || gitState.currentBranch;
    const url = gitState.remotes[remote] || `https://github.com/aluno/meu-repositorio.git`;

    return {
      output: [
        `Enumerando objetos: ${gitState.commits.length * 3 + 3}, concluído.`,
        `Contando objetos: 100% (${gitState.commits.length * 3 + 3}/${gitState.commits.length * 3 + 3}), concluído.`,
        `Empacotando objetos: 100% (4/4), concluído.`,
        `Enviando alterações para ${url}`,
        `   a1b2c3d..e5f6g7h  ${branch} -> ${branch}`,
        `Ramo '${branch}' configurado para rastrear o ramo remoto '${branch}' de '${remote}'.`
      ].join('\n')
    };
  }

  // Handle 'git pull'
  if (subCmd === 'pull') {
    return {
      output: [
        `De https://github.com/aluno/meu-repositorio`,
        ` * branch            main       -> FETCH_HEAD`,
        `Já está atualizado.`
      ].join('\n')
    };
  }

  // Default fallback for unknown git subcommands
  return {
    output: `git: '${subCmd}' não é um comando do git. Veja 'git --help'.`,
    error: true
  };
}

function parseGitLine(text: string): string[] {
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
