'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, ChevronDown, ChevronUp, Shield, AlertTriangle } from 'lucide-react';

interface CodePlaygroundProps {
  code: string;
  language?: 'python' | 'javascript';
  title?: string;
}

export default function CodePlayground({ code: initialCode, language = 'python', title }: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sandboxRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
    }
  }, []);

  const runCodeInSandbox = useCallback((codeToRun: string) => {
    const sandbox = sandboxRef.current;
    if (!sandbox) return [];

    const logs: string[] = [];

    try {
      const escapedCode = codeToRun
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$');

      const sandboxCode = `
        (function() {
          const logs = [];
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;
          
          console.log = function(...args) {
            logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
            parent.postMessage({ type: 'log', message: logs[logs.length - 1] }, '*');
          };
          
          console.error = function(...args) {
            logs.push('ERROR: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
            parent.postMessage({ type: 'error', message: logs[logs.length - 1] }, '*');
          };
          
          console.warn = function(...args) {
            logs.push('WARN: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
            parent.postMessage({ type: 'warn', message: logs[logs.length - 1] }, '*');
          };

          try {
            const result = eval(\`${escapedCode}\`);
            if (result !== undefined) {
              const resultStr = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
              logs.push('=> ' + resultStr);
              parent.postMessage({ type: 'result', message: '=> ' + resultStr }, '*');
            }
          } catch (e) {
            logs.push('ERROR: ' + e.message);
            parent.postMessage({ type: 'error', message: 'ERROR: ' + e.message }, '*');
          }

          console.log = originalLog;
          console.error = originalError;
          console.warn = originalWarn;
          
          return logs;
        })()
      `;

      const blob = new Blob([sandboxCode], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      const iframe = document.createElement('iframe');
      iframe.sandbox = 'allow-scripts';
      iframe.style.display = 'none';
      iframe.src = url;

      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'log' || event.data?.type === 'error' || 
            event.data?.type === 'warn' || event.data?.type === 'result') {
          logs.push(event.data.message);
          setOutput([...logs]);
        }
      };

      window.addEventListener('message', handleMessage);
      document.body.appendChild(iframe);

      setTimeout(() => {
        window.removeEventListener('message', handleMessage);
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      }, 1000);

    } catch (error: any) {
      logs.push('ERROR: ' + error.message);
    }

    return logs;
  }, []);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput([]);
    
    const logs: string[] = [];
    
    if (language === 'javascript') {
      runCodeInSandbox(code);
      setIsRunning(false);
      return;
    }

    logs.push('Python execution:');
    logs.push('');
    logs.push('Option 1: Run with JupyterLite');
    logs.push('  npm run lite:build && npm run dev');
    logs.push('  Then visit /lite in your browser');
    logs.push('');
    logs.push('Option 2: Try JavaScript instead');
    logs.push('  Change language to JavaScript to test concepts');
    logs.push('');
    logs.push('PyTorch concepts work the same way in both languages!');
    
    setOutput(logs);
    setIsRunning(false);
  }, [code, language, runCodeInSandbox]);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const resetCode = useCallback(() => {
    setCode(initialCode);
    setOutput([]);
  }, [initialCode]);

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
      <div className="bg-zinc-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-zinc-400">
            {title || `Code Playground - ${language}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="p-1.5 text-zinc-400 hover:text-white transition rounded hover:bg-zinc-700"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={resetCode}
            className="p-1.5 text-zinc-400 hover:text-white transition rounded hover:bg-zinc-700"
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="p-1.5 text-zinc-400 hover:text-white transition rounded hover:bg-zinc-700"
            title="Toggle output"
          >
            {showOutput ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {showWarning && language === 'javascript' && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 flex items-center gap-2 text-yellow-500 text-sm">
          <Shield className="w-4 h-4" />
          <span>JavaScript code runs in a sandboxed iframe for security. Python requires JupyterLite.</span>
        </div>
      )}
      
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-zinc-900 text-green-400 font-mono text-sm p-4 resize-none focus:outline-none"
          style={{ minHeight: '200px' }}
          spellCheck={false}
          placeholder={`Enter ${language} code here...`}
        />
      </div>
      
      <div className="px-4 py-3 bg-zinc-800/50 border-t border-zinc-800 flex items-center gap-4">
        <button
          onClick={runCode}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
        
        {language === 'python' && (
          <a
            href="/lite"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm border border-zinc-600 text-zinc-300 rounded-lg hover:bg-zinc-700 transition"
          >
            Open JupyterLite
          </a>
        )}
      </div>

      <div ref={sandboxRef} style={{ display: 'none' }} />

      {showOutput && output.length > 0 && (
        <div className="border-t border-zinc-800">
          <div className="bg-zinc-950 px-4 py-2 flex items-center gap-2 text-xs text-zinc-400">
            <Terminal className="w-3 h-3" />
            Output
          </div>
          <pre className="p-4 text-sm text-zinc-300 font-mono whitespace-pre-wrap max-h-64 overflow-auto">
            {output.map((line, i) => (
              <div 
                key={i} 
                className={
                  line.startsWith('ERROR') ? 'text-red-400' : 
                  line.startsWith('WARN') ? 'text-yellow-400' :
                  line.startsWith('=>') ? 'text-green-400' : ''
                }
              >
                {line}
              </div>
            ))}
          </pre>
        </div>
      )}

      {showOutput && output.length === 0 && !isRunning && (
        <div className="border-t border-zinc-800">
          <div className="bg-zinc-950 px-4 py-2 flex items-center gap-2 text-xs text-zinc-500">
            <Terminal className="w-3 h-3" />
            Output
          </div>
          <div className="p-4 text-sm text-zinc-500 italic">
            Click &quot;Run Code&quot; to see output
          </div>
        </div>
      )}
    </div>
  );
}
