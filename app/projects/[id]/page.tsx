import { projectsData } from '@/data/projects';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectCaseStudy({ params }: PageProps) {
  const { id } = await params;
  const project = projectsData.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-950 text-white selection:bg-amber-500/20 py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Navigation Breadcrumb */}
        <Link 
          href="/" 
          className="inline-flex items-center text-xs font-mono uppercase tracking-widest text-stone-500 hover:text-amber-500 transition-colors"
        >
          ← Back to Selected Works
        </Link>

        {/* Header Block & CTA Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-900">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xs font-mono text-stone-500 uppercase tracking-wider">
              <span>{project.client}</span>
              <span>•</span>
              <span>{project.year}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-white leading-tight">
              {project.title}
            </h1>
          </div>

          {/* Premium Call-to-Action Link Button */}
          <div className="shrink-0">
            <a 
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono text-xs uppercase tracking-widest font-bold px-6 py-4 rounded-xl shadow-lg transition-all duration-300 transform active:scale-[0.98]"
            >
              Launch Live Project ↗
            </a>
          </div>
        </div>

        {/* High-Fidelity Framed Website Screenshot Display Container */}
        <div className="relative border border-stone-800 bg-stone-900/10 rounded-2xl overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 to-transparent pointer-events-none z-10" />
          <img 
            src={project.image} 
            alt={`${project.client} Production User Interface Mockup`} 
            className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-700"
          />
        </div>

        {/* Technical Roles Grid Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-stone-900 bg-stone-900/10 rounded-xl font-mono text-xs">
          <div>
            <span className="block text-stone-600 uppercase tracking-wider mb-1">Role</span>
            <span className="text-stone-300">{project.role}</span>
          </div>
          <div>
            <span className="block text-stone-600 uppercase tracking-wider mb-1">Core Tech Stack Layout</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {project.tags.map((tag) => (
                <span key={tag} className="text-[10px] bg-stone-900 px-2.5 py-1 rounded border border-stone-800 text-stone-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Deep-Dive Architectural Text Content Breakdown */}
        <div className="space-y-6 font-light text-stone-400 leading-relaxed text-base">
          <p>{project.description}</p>
          <div className="h-px bg-stone-900 my-8" />
          <h2 className="text-sm font-mono tracking-widest uppercase text-white">System Architecture & Production Performance</h2>
          <p>
            The production build executes optimized script deployment methodologies to clear sub-second core content delivery milestones. 
            By engineering structural component boundaries with granular scope isolation, client-side resource operations remain locked strictly to transactional areas.
          </p>
          <p>
            This layout ensures that when a mobile device triggers lookup operations via external network endpoints (such as barcode matrix inputs), layout compilation renders efficiently without content shifting.
          </p>
        </div>

      </div>
    </main>
  );
}