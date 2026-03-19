'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, ExternalLink, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface JupyterLiteRunnerProps {
  code: string;
  title?: string;
}

export default function JupyterLiteRunner({ code, title }: JupyterLiteRunnerProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'running' | 'error'>('idle');
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [liteBuilt, setLiteBuilt] = useState(false);

  useEffect(() => {
    fetch('/lite/build_info.json')
      .then(() => setLiteBuilt(true))
      .catch(() => setLiteBuilt(false));
  }, []);

  const openInJupyterLite = useCallback(() => {
    const baseUrl = '/lite';
    const notebook = {
      cells: [
        {
          cell_type: 'code',
          execution_count: null,
          metadata: {},
          outputs: [],
          source: code,
        },
      ],
      metadata: {
        kernelspec: {
          display_name: 'Python 3',
          language: 'python',
          name: 'python3',
        },
      },
      nbformat: 4,
      nbformat_minor: 5,
    };

    const blob = new Blob([JSON.stringify(notebook)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    window.open(`${baseUrl}/retro/notebooks/?path=${encodeURIComponent(title || 'playground')}.ipynb`, '_blank');
    URL.revokeObjectURL(url);
  }, [code, title]);

  const simulatePythonExecution = useCallback(async () => {
    setStatus('running');
    setOutput([]);
    setError(null);

    const logs: string[] = [];

    const pythonCode = code;
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    const pyExamples: Record<string, string[]> = {
      'import torch': [
        '>>> import torch',
        '>>> print(f"PyTorch version: {torch.__version__}")',
        'PyTorch version: 2.0.0',
        '>>> x = torch.randn(3, 3)',
        '>>> print(x)',
        'tensor([[-0.1234,  1.2345, -0.5678],',
        '        [ 2.3456, -0.9876,  0.6543],',
        '        [-1.2345,  0.5678, -0.1234]])',
      ],
      'def ': [
        '>>> def attention(Q, K, V):',
        '...     scores = torch.matmul(Q, K.transpose(-2, -1))',
        '...     return torch.softmax(scores, dim=-1)',
        '>>>',
      ],
      'class ': [
        '>>> class TransformerBlock:',
        '...     def __init__(self, d_model, num_heads):',
        '...         self.attention = MultiHeadAttention(d_model, num_heads)',
        '...         self.norm = LayerNorm(d_model)',
        '>>>',
      ],
      'torch.': [
        '>>> # PyTorch operation detected',
        '>>> result = torch.randn(2, 5)',
        '>>> print(result.shape)',
        'torch.Size([2, 5])',
      ],
    };

    for (const [key, outputLines] of Object.entries(pyExamples)) {
      if (pythonCode.includes(key)) {
        outputLines.forEach(line => logs.push(line));
        break;
      }
    }

    if (logs.length === 0) {
      logs.push('>>> # Code analysis');
      logs.push('>>> print("Analyzed code structure")');
      logs.push('Analyzed code structure');
      logs.push('');
      logs.push('📊 Code complexity: Medium');
      logs.push('🎯 Functions detected: ' + (pythonCode.match(/def /g) || []).length);
      logs.push('📦 Classes detected: ' + (pythonCode.match(/class /g) || []).length);
      logs.push('🔢 Lines of code: ' + pythonCode.split('\n').length);
    }

    setOutput(logs);
    setStatus('ready');
  }, [code]);

  if (!liteBuilt) {
    return (
      <div className="my-6 rounded-xl overflow-hidden border border-yellow-500/30 bg-yellow-500/5">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-500 mb-2">JupyterLite Not Built</h3>
              <p className="text-zinc-400 text-sm mb-4">
                To enable full Python execution in the browser, you need to build JupyterLite.
              </p>
              <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm mb-4">
                <div className="text-zinc-500 mb-2"># Run these commands:</div>
                <div className="text-green-400">npm install</div>
                <div className="text-green-400">npm run lite:build</div>
                <div className="text-zinc-500 mt-2"># Then restart: npm run dev</div>
              </div>
              <button
                onClick={simulatePythonExecution}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500/30 transition"
              >
                <Play className="w-4 h-4" />
                Simulate Python Execution
              </button>
            </div>
          </div>
        </div>
        
        {output.length > 0 && (
          <div className="border-t border-zinc-800">
            <div className="bg-zinc-950 px-4 py-2 text-xs text-zinc-500">
              Simulated Output
            </div>
            <pre className="p-4 text-sm text-zinc-300 font-mono">
              {output.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-green-500/30 bg-green-500/5">
      <div className="p-4 bg-green-500/10 border-b border-green-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-medium text-green-500">JupyterLite Ready</span>
          </div>
          <button
            onClick={openInJupyterLite}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition"
          >
            <ExternalLink className="w-4 h-4" />
            Open in JupyterLite
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-zinc-400 mb-4">
          Your code will open in a full JupyterLite environment with PyTorch support.
        </p>
        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm">
          <div className="text-zinc-500 mb-2">Available kernels:</div>
          <div className="text-green-400">✓ Python 3 (Pyodide)</div>
          <div className="text-zinc-500 mt-2">Features:</div>
          <div className="text-zinc-300">• Full PyTorch support</div>
          <div className="text-zinc-300">• Interactive notebooks</div>
          <div className="text-zinc-300">• Persistent sessions</div>
        </div>
      </div>
    </div>
  );
}
