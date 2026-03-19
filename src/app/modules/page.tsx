import Link from 'next/link';
import { modules } from '@/lib/content';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function ModulesPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="text-zinc-400 hover:text-white transition">
            Home
          </Link>
          <span className="text-zinc-700">/</span>
          <span>Modules</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Course Modules</h1>
        <p className="text-zinc-400 mb-12 max-w-2xl">
          A structured path from transformer foundations to building your own Mercury-style 
          diffusion language model. Each module builds on the previous.
        </p>

        <div className="space-y-6">
          {modules.map((module, moduleIndex) => (
            <div key={module.id} className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-sm text-yellow-500 font-medium">
                      Module {moduleIndex + 1}
                    </span>
                    <h2 className="text-2xl font-bold mt-1">{module.title}</h2>
                    <p className="text-zinc-400 mt-2">{module.description}</p>
                  </div>
                  <div className="text-right text-sm text-zinc-500">
                    {module.lessons.length} lessons
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <Link
                      key={lesson.id}
                      href={`/modules/${module.id}/lesson/${lesson.id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-zinc-500" />
                        <span>{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-500">{lesson.duration}</span>
                        <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-yellow-500 transition" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
