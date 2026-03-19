import Link from 'next/link';
import { notFound } from 'next/navigation';
import { modules, getModule } from '@/lib/content';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

export function generateStaticParams() {
  return modules.map((module) => ({
    module: module.id,
  }));
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params;
  const module = getModule(moduleId);
  
  if (!module) {
    notFound();
  }

  const moduleIndex = modules.findIndex(m => m.id === module.id);

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/modules" className="text-zinc-400 hover:text-white transition flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Modules
          </Link>
          <span className="text-zinc-700">/</span>
          <span>{module.title}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <span className="text-yellow-500 font-medium">Module {moduleIndex + 1}</span>
        <h1 className="text-4xl font-bold mt-2 mb-4">{module.title}</h1>
        <p className="text-zinc-400 text-lg mb-8">{module.description}</p>

        <div className="space-y-4">
          {module.lessons.map((lesson, index) => (
            <Link
              key={lesson.id}
              href={`/modules/${module.id}/lesson/${lesson.id}`}
              className="flex items-center justify-between p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-yellow-500/50 transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-yellow-500 transition">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1">{lesson.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm text-zinc-500">{lesson.duration}</span>
                <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-yellow-500 transition" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
