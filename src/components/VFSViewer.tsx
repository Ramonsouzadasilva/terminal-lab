import React, { useState } from 'react';
import { VFSNode } from '../types';
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown, Lock, Shield, HardDrive, RefreshCw } from 'lucide-react';

interface VFSViewerProps {
  vfs: VFSNode;
  currentPath: string;
  isWindows: boolean;
  onSelectPath?: (pathStr: string) => void;
  onResetVFS?: () => void;
}

export const VFSViewer: React.FC<VFSViewerProps> = ({
  vfs,
  currentPath,
  isWindows,
  onResetVFS
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'home': true,
    'home/aluno': true,
    'C:': true,
    'C:/Users': true,
    'C:/Users/Aluno': true
  });

  const toggleExpand = (pathKey: string) => {
    setExpanded(prev => ({ ...prev, [pathKey]: !prev[pathKey] }));
  };

  const renderNode = (node: VFSNode, pathKey: string, depth: number = 0) => {
    const isDir = node.type === 'dir';
    const isExpanded = !!expanded[pathKey];
    const isCurrent = currentPath.toLowerCase().includes(node.name.toLowerCase());

    return (
      <div key={pathKey} className="select-none font-mono text-xs">
        <div
          onClick={() => isDir && toggleExpand(pathKey)}
          className={`flex items-center gap-1.5 py-1 px-2 rounded hover:bg-slate-800/80 cursor-pointer transition-colors ${
            isCurrent ? 'text-emerald-400 font-semibold' : 'text-slate-300'
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {isDir ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
            </>
          ) : (
            <>
              <span className="w-3.5 shrink-0" />
              <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            </>
          )}

          <span className="truncate">{node.name}</span>

          {node.permissions && (
            <span className="ml-auto text-[10px] text-slate-500 font-mono hidden sm:inline">
              {node.permissions}
            </span>
          )}
        </div>

        {isDir && isExpanded && node.children && (
          <div>
            {Object.keys(node.children).map(childName => {
              const child = node.children![childName];
              const newKey = `${pathKey}/${childName}`;
              return renderNode(child, newKey, depth + 1);
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col h-full text-slate-200">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
            Sistema de Arquivos Virtual (VFS)
          </h3>
        </div>
        {onResetVFS && (
          <button
            onClick={onResetVFS}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Restaurar estado do sistema de arquivos"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-0.5">
        {renderNode(vfs, 'root', 0)}
      </div>

      <div className="pt-2 mt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-emerald-400" /> VFS em Memória
        </span>
        <span className="font-mono text-slate-500">{isWindows ? 'C:\\' : '/'}</span>
      </div>
    </div>
  );
};
