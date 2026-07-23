import { VFSNode } from '../types';

export function createInitialVFS(): VFSNode {
  return {
    name: '',
    type: 'dir',
    permissions: 'rwxr-xr-x',
    owner: 'root',
    children: {
      'home': {
        name: 'home',
        type: 'dir',
        permissions: 'rwxr-xr-x',
        owner: 'root',
        children: {
          'aluno': {
            name: 'aluno',
            type: 'dir',
            permissions: 'rwxr-xr-x',
            owner: 'aluno',
            group: 'aluno',
            children: {
              'documentos': {
                name: 'documentos',
                type: 'dir',
                permissions: 'rwxr-xr-x',
                owner: 'aluno',
                children: {
                  'relatorio.txt': {
                    name: 'relatorio.txt',
                    type: 'file',
                    content: 'Relatório Trimestral de Redes e Segurança:\nStatus: Todos os sistemas operacionais.\nServidor Linux: Online (Uptime: 45 dias)\nPowerShell Scripts: Executados com sucesso.',
                    permissions: 'rw-r--r--',
                    owner: 'aluno',
                    size: 184,
                    updatedAt: new Date(2026, 6, 20, 14, 30)
                  },
                  'anotacoes.md': {
                    name: 'anotacoes.md',
                    type: 'file',
                    content: '# Anotações de Comandos\n- ls -la: lista arquivos ocultos\n- chmod 755: permissão total para dono e leitura/execução para outros\n- Get-Process: lista processos no PowerShell',
                    permissions: 'rw-r--r--',
                    owner: 'aluno',
                    size: 210,
                    updatedAt: new Date(2026, 6, 21, 10, 15)
                  }
                }
              },
              'downloads': {
                name: 'downloads',
                type: 'dir',
                permissions: 'rwxr-xr-x',
                owner: 'aluno',
                children: {
                  'setup.sh': {
                    name: 'setup.sh',
                    type: 'file',
                    content: '#!/bin/bash\necho "Iniciando instalação..."\nsleep 1\necho "Configurando ambiente..."\necho "Concluído!"',
                    permissions: 'rwxr-xr-x',
                    owner: 'aluno',
                    size: 112,
                    updatedAt: new Date(2026, 6, 18, 9, 0)
                  }
                }
              },
              'projetos': {
                name: 'projetos',
                type: 'dir',
                permissions: 'rwxr-xr-x',
                owner: 'aluno',
                children: {
                  'index.html': {
                    name: 'index.html',
                    type: 'file',
                    content: '<!DOCTYPE html>\n<html>\n<head><title>Meu App</title></head>\n<body><h1>Terminal Master</h1></body>\n</html>',
                    permissions: 'rw-r--r--',
                    owner: 'aluno',
                    size: 120,
                    updatedAt: new Date(2026, 6, 22, 11, 45)
                  },
                  'app.js': {
                    name: 'app.js',
                    type: 'file',
                    content: 'console.log("Aplicação em execução...");\nfunction init() { return true; }\ninit();',
                    permissions: 'rw-r--r--',
                    owner: 'aluno',
                    size: 85,
                    updatedAt: new Date(2026, 6, 22, 12, 0)
                  }
                }
              },
              '.bashrc': {
                name: '.bashrc',
                type: 'file',
                content: '# Alias personalizados\nalias ll="ls -la"\nalias cls="clear"\nexport PATH=$PATH:/usr/local/bin',
                permissions: 'rw-r--r--',
                owner: 'aluno',
                size: 95,
                updatedAt: new Date(2026, 6, 1, 8, 0)
              }
            }
          }
        }
      },
      'etc': {
        name: 'etc',
        type: 'dir',
        permissions: 'rwxr-xr-x',
        owner: 'root',
        children: {
          'passwd': {
            name: 'passwd',
            type: 'file',
            content: 'root:x:0:0:root:/root:/bin/bash\naluno:x:1000:1000:Aluno Master:/home/aluno:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin',
            permissions: 'rw-r--r--',
            owner: 'root',
            size: 160,
            updatedAt: new Date(2026, 0, 15, 12, 0)
          },
          'hostname': {
            name: 'hostname',
            type: 'file',
            content: 'terminal-master',
            permissions: 'rw-r--r--',
            owner: 'root',
            size: 15,
            updatedAt: new Date(2026, 0, 15, 12, 0)
          }
        }
      },
      'var': {
        name: 'var',
        type: 'dir',
        permissions: 'rwxr-xr-x',
        owner: 'root',
        children: {
          'log': {
            name: 'log',
            type: 'dir',
            permissions: 'rwxr-xr-x',
            owner: 'root',
            children: {
              'syslog': {
                name: 'syslog',
                type: 'file',
                content: 'Jul 22 10:00:01 terminal-master systemd[1]: Starting Network Service...\nJul 22 10:00:02 terminal-master systemd[1]: Started Network Service.\nJul 22 10:05:12 terminal-master sshd[1234]: Accepted password for aluno from 192.168.1.10',
                permissions: 'rw-r-----',
                owner: 'root',
                size: 240,
                updatedAt: new Date(2026, 6, 22, 10, 5)
              }
            }
          }
        }
      },
      'C:': {
        name: 'C:',
        type: 'dir',
        permissions: 'rwxr-xr-x',
        owner: 'SYSTEM',
        children: {
          'Users': {
            name: 'Users',
            type: 'dir',
            permissions: 'rwxr-xr-x',
            owner: 'SYSTEM',
            children: {
              'Aluno': {
                name: 'Aluno',
                type: 'dir',
                permissions: 'rwxr-xr-x',
                owner: 'Aluno',
                children: {
                  'Documents': {
                    name: 'Documents',
                    type: 'dir',
                    permissions: 'rwxr-xr-x',
                    owner: 'Aluno',
                    children: {
                      'projeto_powershell.ps1': {
                        name: 'projeto_powershell.ps1',
                        type: 'file',
                        content: 'Write-Host "Iniciando script PowerShell..." -ForegroundColor Green\nGet-Service | Where-Object Status -eq "Running"\nGet-Process | Sort-Object CPU -Descending | Select-Object -First 5',
                        permissions: 'rw-r--r--',
                        owner: 'Aluno',
                        size: 210,
                        updatedAt: new Date(2026, 6, 22, 15, 0)
                      }
                    }
                  },
                  'Downloads': {
                    name: 'Downloads',
                    type: 'dir',
                    permissions: 'rwxr-xr-x',
                    owner: 'Aluno',
                    children: {
                      'installer.exe': {
                        name: 'installer.exe',
                        type: 'file',
                        content: '[BINARY EXECUTABLE SIMULATION]',
                        permissions: 'rwxr-xr-x',
                        owner: 'Aluno',
                        size: 154000,
                        updatedAt: new Date(2026, 6, 19, 16, 20)
                      }
                    }
                  },
                  'Desktop': {
                    name: 'Desktop',
                    type: 'dir',
                    permissions: 'rwxr-xr-x',
                    owner: 'Aluno',
                    children: {}
                  }
                }
              }
            }
          },
          'Windows': {
            name: 'Windows',
            type: 'dir',
            permissions: 'rwxr-xr-x',
            owner: 'SYSTEM',
            children: {
              'System32': {
                name: 'System32',
                type: 'dir',
                permissions: 'rwxr-xr-x',
                owner: 'SYSTEM',
                children: {
                  'cmd.exe': {
                    name: 'cmd.exe',
                    type: 'file',
                    content: '[WINDOWS COMMAND PROCESSOR SIMULATOR]',
                    permissions: 'rwxr-xr-x',
                    owner: 'SYSTEM',
                    size: 300000,
                    updatedAt: new Date(2026, 1, 1, 0, 0)
                  },
                  'drivers': {
                    name: 'drivers',
                    type: 'dir',
                    permissions: 'rwxr-xr-x',
                    owner: 'SYSTEM',
                    children: {
                      'etc': {
                        name: 'etc',
                        type: 'dir',
                        permissions: 'rwxr-xr-x',
                        owner: 'SYSTEM',
                        children: {
                          'hosts': {
                            name: 'hosts',
                            type: 'file',
                            content: '127.0.0.1 localhost\n::1 localhost\n192.168.1.100 servidor-local',
                            permissions: 'rw-r--r--',
                            owner: 'SYSTEM',
                            size: 78,
                            updatedAt: new Date(2026, 2, 10, 11, 0)
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          'Program Files': {
            name: 'Program Files',
            type: 'dir',
            permissions: 'rwxr-xr-x',
            owner: 'SYSTEM',
            children: {}
          }
        }
      }
    }
  };
}

export function normalizePath(pathStr: string, isWindows: boolean = false): string[] {
  let cleaned = pathStr.trim().replace(/\\/g, '/');
  if (isWindows && /^[a-zA-Z]:/.test(cleaned)) {
    const drive = cleaned.substring(0, 2).toUpperCase();
    const rest = cleaned.substring(2);
    const parts = rest.split('/').filter(Boolean);
    return [drive, ...parts];
  }
  return cleaned.split('/').filter(Boolean);
}

export function formatPath(parts: string[], isWindows: boolean = false): string {
  if (isWindows) {
    if (parts.length === 0) return 'C:\\';
    if (parts[0].endsWith(':')) {
      return parts.join('\\');
    }
    return 'C:\\' + parts.join('\\');
  } else {
    if (parts.length === 0) return '/';
    return '/' + parts.join('/');
  }
}

export function resolvePath(currentParts: string[], targetPathStr: string, isWindows: boolean = false): string[] {
  let raw = targetPathStr.trim().replace(/\\/g, '/');
  if (!raw || raw === '.') return [...currentParts];

  let parts: string[] = [];

  if (raw === '~' || raw === '~/') {
    return isWindows ? ['C:', 'Users', 'Aluno'] : ['home', 'aluno'];
  }

  if (raw.startsWith('~/')) {
    const base = isWindows ? ['C:', 'Users', 'Aluno'] : ['home', 'aluno'];
    const rest = raw.substring(2).split('/').filter(Boolean);
    parts = [...base, ...rest];
  } else if (raw.startsWith('/') || (isWindows && /^[a-zA-Z]:/.test(raw))) {
    parts = normalizePath(raw, isWindows);
  } else {
    parts = [...currentParts];
    const targetSegments = raw.split('/').filter(Boolean);
    for (const seg of targetSegments) {
      if (seg === '.') continue;
      if (seg === '..') {
        if (parts.length > 0) parts.pop();
      } else {
        parts.push(seg);
      }
    }
  }
  return parts;
}

export function getNodeAtPath(root: VFSNode, parts: string[]): VFSNode | null {
  let current: VFSNode = root;
  for (const part of parts) {
    if (current.type !== 'dir' || !current.children) return null;
    const matchKey = Object.keys(current.children).find(
      k => k.toLowerCase() === part.toLowerCase()
    );
    if (!matchKey) return null;
    current = current.children[matchKey];
  }
  return current;
}

export function createNodeAtPath(
  root: VFSNode,
  parts: string[],
  name: string,
  type: 'file' | 'dir',
  content: string = '',
  owner: string = 'aluno'
): boolean {
  const dirNode = getNodeAtPath(root, parts);
  if (!dirNode || dirNode.type !== 'dir') return false;
  if (!dirNode.children) dirNode.children = {};

  dirNode.children[name] = {
    name,
    type,
    content: type === 'file' ? content : undefined,
    permissions: type === 'dir' ? 'rwxr-xr-x' : 'rw-r--r--',
    owner,
    size: content.length,
    updatedAt: new Date(),
    children: type === 'dir' ? {} : undefined
  };
  return true;
}

export function deleteNodeAtPath(root: VFSNode, dirParts: string[], nodeName: string): boolean {
  const dirNode = getNodeAtPath(root, dirParts);
  if (!dirNode || dirNode.type !== 'dir' || !dirNode.children) return false;
  const matchKey = Object.keys(dirNode.children).find(k => k.toLowerCase() === nodeName.toLowerCase());
  if (matchKey) {
    delete dirNode.children[matchKey];
    return true;
  }
  return false;
}
