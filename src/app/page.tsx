import Link from 'next/link';
import { modules } from '@/lib/content';
import { BookOpen, Zap, Code, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            <span className="font-bold text-lg">Diffusion from Scratch</span>
          </div>
          <nav className="flex gap-6">
            <Link href="/modules" className="text-zinc-400 hover:text-white transition">
              Modules
            </Link>
            <a href="#about" className="text-zinc-400 hover:text-white transition">
              About
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Build Diffusion Language Models
            </h1>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Learn to build Mercury-style parallel text generation models from the ground up. 
              No prerequisites needed—just Python and curiosity.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/modules/1-transformer-foundations/lesson/1-1-attention-mechanism"
                className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
              >
                Start Learning
              </Link>
              <Link 
                href="/modules"
                className="px-6 py-3 border border-zinc-700 rounded-lg hover:border-zinc-500 transition"
              >
                Browse Modules
              </Link>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 px-6 bg-zinc-950">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Diffusion for Language?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                <Zap className="w-10 h-10 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">10-100x Faster</h3>
                <p className="text-zinc-400">
                  Generate all tokens in parallel instead of sequentially. 
                  Same quality, fraction of the latency.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                <Code className="w-10 h-10 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Code-First Approach</h3>
                <p className="text-zinc-400">
                  Build every concept from scratch. No black boxes—just 
                  PyTorch and clear explanations.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                <Users className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Inspired by Mercury</h3>
                <p className="text-zinc-400">
                  Based on Inception Labs research. Learn the same techniques 
                  powering production diffusion LLMs.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">8 Modules • 29 Lessons</h2>
            <p className="text-zinc-400 text-center mb-12">From transformers to Mercury in 8 guided modules</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {modules.map((module, i) => (
                <div key={module.id} className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition">
                  <div className="text-sm text-yellow-500 mb-2">Module {i + 1}</div>
                  <h3 className="font-semibold mb-1">{module.title}</h3>
                  <p className="text-sm text-zinc-500">{module.lessons.length} lessons</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-zinc-500">
          <p>Built for learners, by learners. MIT License.</p>
        </div>
      </footer>
    </div>
  );
}
