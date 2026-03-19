'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Copy, Check, Loader2, Terminal, Zap, BookOpen, Code2 } from 'lucide-react';

const EXAMPLE_PROMPTS = [
  { title: 'Attention Mechanism', prompt: 'Write a multi-head attention mechanism in PyTorch' },
  { title: 'Transformer Block', prompt: 'Create a transformer encoder block with residual connections' },
  { title: 'Diffusion Sampling', prompt: 'Implement masked diffusion sampling for text generation' },
  { title: 'Training Loop', prompt: 'Write a training loop for a masked diffusion language model' },
];

export default function CodeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateCode = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    setGeneratedCode('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate code');
      }

      setGeneratedCode(data.code);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold">Diffusion from Scratch</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered
          </div>
          <h1 className="text-4xl font-bold mb-4">Code Generator</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Generate PyTorch code for diffusion language models and transformers.
            Describe what you need and let AI do the work.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="font-semibold mb-2">Learn by Example</h3>
            <p className="text-sm text-zinc-400">
              Generate clean, well-documented code that follows best practices.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
              <Code2 className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="font-semibold mb-2">PyTorch Native</h3>
            <p className="text-sm text-zinc-400">
              Output code that integrates seamlessly with your existing PyTorch projects.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <Terminal className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-semibold mb-2">Copy & Run</h3>
            <p className="text-sm text-zinc-400">
              One-click copy to clipboard. Run the code in your own environment.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">
            What code do you want to generate?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Write a masked diffusion language model in PyTorch"
            className="w-full h-32 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg resize-none focus:outline-none focus:border-yellow-500 text-white placeholder-zinc-500"
          />
        </div>

        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-zinc-500">
            Powered by GPT-4
          </p>
          <button
            onClick={generateCode}
            disabled={isLoading || !prompt.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Code
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {generatedCode && (
          <div className="rounded-xl overflow-hidden border border-zinc-800">
            <div className="bg-zinc-800 px-4 py-2 flex items-center justify-between">
              <span className="text-sm text-zinc-400">Generated Python Code</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-2 px-3 py-1 text-sm text-zinc-400 hover:text-white transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-zinc-900 overflow-x-auto">
              <code className="text-sm text-green-400 font-mono whitespace-pre">
                {generatedCode}
              </code>
            </pre>
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Example Prompts</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {EXAMPLE_PROMPTS.map((example, i) => (
              <button
                key={i}
                onClick={() => setPrompt(example.prompt)}
                className="text-left p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition"
              >
                <div className="text-sm font-medium text-yellow-500 mb-1">
                  {example.title}
                </div>
                <div className="text-sm text-zinc-400">
                  {example.prompt}
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
