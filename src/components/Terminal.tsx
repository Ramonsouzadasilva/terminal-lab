import React, { useState, useRef, useEffect } from 'react';
import { OSKind, TerminalOutputLine, CommandContext, TerminalTheme, CommandResult } from '../types';
import { runCommand, getAutocompleteSuggestions } from '../interpreter/common';
import { Sparkles, Trash2, Copy, Check, Terminal as TerminalIcon, Maximize2, Minimize2, Palette } from 'lucide-react';

interface TerminalProps {
  os: OSKind;
  context: CommandContext;
  onUpdateContext: (updater: (prev: CommandContext) => CommandContext) => void;
  outputLines: TerminalOutputLine[];
  setOutputLines: React.Dispatch<React.SetStateAction<TerminalOutputLine[]>>;
  theme: TerminalTheme;
  setTheme: (t: TerminalTheme) => void;
  audioEnabled: boolean;
  onCommandExecuted?: (cmd: string, res: CommandResult) => void;
  onOpenAIAssist: (cmd?: string) => void;
}

export const TerminalComp: React.FC<TerminalProps> = ({
  os,
  context,
  onUpdateContext,
  outputLines,
  setOutputLines,
  theme,
  setTheme,
  audioEnabled,
  onCommandExecuted,
  onOpenAIAssist
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Audio typing sound effect via Web Audio API synthesizer
  const playTypeSound = () => {
    if (!audioEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400 + Math.random() * 200, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {}
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputLines]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const getPromptString = () => {
    const path = context.currentPath;
    if (os === 'linux') {
      const user = context.user || 'aluno';
      const host = context.hostname || 'terminal-master';
      return `${user}@${host}:${path}$ `;
    } else if (os === 'powershell') {
      return `PS ${path}> `;
    } else {
      return `${path}>`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    playTypeSound();

    // Tab Autocomplete
    if (e.key === 'Tab') {
      e.preventDefault();
      const suggestions = getAutocompleteSuggestions(inputVal, context);
      if (suggestions.completion) {
        setInputVal(suggestions.completion);
      }
      setAutoCompleteOptions(suggestions.options || []);
      return;
    } else {
      setAutoCompleteOptions([]);
    }

    // Command execution
    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = inputVal.trim();
      const promptText = getPromptString();

      // Add prompt line
      const newPromptLine: TerminalOutputLine = {
        id: Math.random().toString(),
        type: 'prompt',
        text: cmd,
        promptText,
        timestamp: new Date().toLocaleTimeString()
      };

      if (!cmd) {
        setOutputLines(prev => [...prev, newPromptLine]);
        setInputVal('');
        return;
      }

      // Record command history
      setHistory(prev => [...prev, cmd]);
      setHistoryIdx(-1);

      // Execute command
      const result = runCommand(cmd, context);

      if (result.newPath) {
        onUpdateContext(prev => ({ ...prev, currentPath: result.newPath! }));
      }

      if (result.clearScreen) {
        setOutputLines([]);
      } else {
        const resultLines: TerminalOutputLine[] = [];
        if (typeof result.output === 'string') {
          if (result.output) {
            resultLines.push({
              id: Math.random().toString(),
              type: result.error ? 'error' : 'output',
              text: result.output
            });
          }
        } else if (Array.isArray(result.output)) {
          resultLines.push(...result.output);
        }

        setOutputLines(prev => [...prev, newPromptLine, ...resultLines]);
      }

      setInputVal('');

      if (onCommandExecuted) {
        onCommandExecuted(cmd, result);
      }
      return;
    }

    // History navigation (Up/Down)
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(history[nextIdx] || '');
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(-1);
        setInputVal('');
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
      return;
    }

    // Keyboard Shortcuts
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setOutputLines([]);
      return;
    }

    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      const promptText = getPromptString();
      setOutputLines(prev => [
        ...prev,
        { id: Math.random().toString(), type: 'prompt', text: inputVal + '^C', promptText }
      ]);
      setInputVal('');
      return;
    }
  };

  // Theme styling configurations
  const themeStyles = {
    matrix: 'bg-black text-emerald-400 border-emerald-500/30',
    classic: 'bg-slate-950 text-slate-100 border-slate-800',
    powershell: 'bg-[#012456] text-slate-100 border-blue-600/50',
    amber: 'bg-[#120a00] text-amber-400 border-amber-600/30',
    cyberpunk: 'bg-[#0b031a] text-cyan-300 border-pink-500/30',
    solarized: 'bg-[#fdf6e3] text-[#073642] border-[#2aa198]/30'
  }[theme];

  const fontSizeClass = {
    sm: 'text-xs',
    base: 'text-sm',
    lg: 'text-base'
  }[fontSize];

  const handleCopyOutput = () => {
    const text = outputLines
      .map(l => (l.type === 'prompt' ? `${l.promptText}${l.text}` : l.text))
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200 ${themeStyles} ${
        isFullScreen ? 'fixed inset-2 z-50 rounded-none' : 'h-[580px]'
      }`}
      onClick={focusInput}
    >
      {/* Terminal Title Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300 font-semibold ml-2">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {os === 'linux' ? 'Bash Terminal — Ubuntu 22.04' : os === 'powershell' ? 'Windows PowerShell v7.4' : 'Prompt de Comando — Windows CMD'}
            </span>
          </div>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-2 text-xs">
          {/* Theme Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700">
              <Palette className="w-3 h-3 text-cyan-400" />
              <span className="capitalize">{theme}</span>
            </button>
            <div className="absolute right-0 mt-1 hidden group-hover:flex flex-col bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-1 z-50 w-32">
              <button onClick={() => setTheme('matrix')} className="px-2 py-1 text-left text-xs text-emerald-400 hover:bg-slate-800 rounded">Matrix</button>
              <button onClick={() => setTheme('classic')} className="px-2 py-1 text-left text-xs text-slate-200 hover:bg-slate-800 rounded">Classic Dark</button>
              <button onClick={() => setTheme('powershell')} className="px-2 py-1 text-left text-xs text-blue-400 hover:bg-slate-800 rounded">Power Blue</button>
              <button onClick={() => setTheme('amber')} className="px-2 py-1 text-left text-xs text-amber-400 hover:bg-slate-800 rounded">Retro Amber</button>
              <button onClick={() => setTheme('cyberpunk')} className="px-2 py-1 text-left text-xs text-pink-400 hover:bg-slate-800 rounded">Cyberpunk</button>
              <button onClick={() => setTheme('solarized')} className="px-2 py-1 text-left text-xs text-yellow-700 hover:bg-slate-800 rounded">Solarized Light</button>
            </div>
          </div>

          {/* Font Size Adjust */}
          <div className="flex items-center bg-slate-800 rounded border border-slate-700 p-0.5 text-[11px]">
            <button onClick={() => setFontSize('sm')} className={`px-1.5 py-0.5 rounded ${fontSize === 'sm' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>A-</button>
            <button onClick={() => setFontSize('base')} className={`px-1.5 py-0.5 rounded ${fontSize === 'base' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>A</button>
            <button onClick={() => setFontSize('lg')} className={`px-1.5 py-0.5 rounded ${fontSize === 'lg' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>A+</button>
          </div>

          <button onClick={() => onOpenAIAssist()} className="p-1.5 rounded bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30" title="Pedir Ajuda AI">
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button onClick={handleCopyOutput} className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700" title="Copiar Saída">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button onClick={() => setOutputLines([])} className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700" title="Limpar Tela">
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700">
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Screen Container */}
      <div className={`flex-1 p-4 overflow-y-auto font-mono ${fontSizeClass} leading-relaxed font-normal`}>
        
        {/* Welcome Header */}
        <div className="mb-4 opacity-80 text-xs border-b border-dashed border-current/20 pb-3 space-y-1">
          <p className="font-semibold">
            {os === 'linux' ? 'Linux Terminal Master [Versão 5.15.0-88-generic]' : os === 'powershell' ? 'Windows PowerShell 7.4.0 (x64)' : 'Microsoft Windows [Versão 10.0.19045.3803]'}
          </p>
          <p className="text-[11px] opacity-70">
            Digite <span className="font-bold underline">help</span> para listar comandos. Use <span className="font-bold border px-1 rounded">Tab</span> para autocompletar e setas <span className="font-bold border px-1 rounded">↑/↓</span> para o histórico.
          </p>
        </div>

        {/* Output lines */}
        {outputLines.map(line => (
          <div key={line.id} className="my-1 whitespace-pre-wrap break-all">
            {line.type === 'prompt' ? (
              <div className="flex items-start gap-1">
                <span className="font-bold text-cyan-400 shrink-0">{line.promptText}</span>
                <span className="font-medium">{line.text}</span>
              </div>
            ) : line.type === 'error' ? (
              <div className="text-rose-400 bg-rose-950/30 border-l-2 border-rose-500 pl-2 py-0.5 my-1 rounded-r">
                {line.text}
              </div>
            ) : line.type === 'system' ? (
              <div className="text-amber-300 italic opacity-90 my-0.5">
                {line.text}
              </div>
            ) : line.type === 'success' ? (
              <div className="text-emerald-400 font-medium">
                {line.text}
              </div>
            ) : (
              <div>{line.text}</div>
            )}
          </div>
        ))}

        {/* Active Command Line Input */}
        <div className="flex items-center gap-1 mt-1">
          <span className="font-bold text-cyan-400 shrink-0 select-none">
            {getPromptString()}
          </span>
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent outline-none border-none p-0 font-mono text-inherit focus:ring-0"
              autoFocus
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
            />
            {/* Blinking pipe cursor effect */}
            <span className="w-2 h-4 bg-current inline-block animate-pulse -ml-1 opacity-80" />
          </div>
        </div>

        {/* Autocomplete Options Suggestion Banner */}
        {autoCompleteOptions.length > 0 && (
          <div className="mt-2 p-2 bg-slate-900/95 border border-cyan-500/30 rounded-lg text-xs font-mono flex flex-wrap gap-2 text-cyan-300">
            <span className="text-slate-400 font-bold">Sugestões (Tab):</span>
            {autoCompleteOptions.map((opt, i) => (
              <span key={i} className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 hover:bg-cyan-500/20 cursor-pointer" onClick={() => setInputVal(opt)}>
                {opt}
              </span>
            ))}
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
