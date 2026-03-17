import { ChevronRight } from 'lucide-react';

export const Projects = () => {
  const projects = [
    {
      title: "Astrus Capella",
      location: "Noida",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop"
    },
    {
      title: "SKA Divine",
      location: "Noida",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section className="bg-background-dark py-16 md:py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16 gap-8 text-left">
          <div className="space-y-4">
            <span className="text-primary text-2xl md:text-4xl font-light uppercase tracking-tight">Our Project</span>
            <h2 className="text-white text-4xl md:text-6xl font-black leading-tight uppercase tracking-tighter">Delivering Quality Homes & Smart Investments</h2>
            <p className="text-slate-400 max-w-xl text-base md:text-lg font-medium leading-relaxed">
              We represent some of the most prestigious developments in the region, ensuring every investment provides long-term value and excellence.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project, idx) => (
            <div key={idx} className="group relative overflow-hidden border border-white/5">
              <img 
                src={project.image} 
                className="w-full h-[350px] md:h-[450px] object-cover transition-transform duration-[5s] group-hover:scale-110"
                alt={project.title}
              />
              <div className="absolute bottom-0 left-0 bg-black/90 p-6 md:p-10 w-full md:w-3/4 border-t border-r border-white/10 text-left">
                <p className="text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-2">{project.location}</p>
                <h3 className="text-white text-2xl md:text-4xl font-black mb-4 uppercase tracking-tighter leading-none">{project.title}</h3>
                <a href="#" className="text-white font-black text-[10px] md:text-xs uppercase flex items-center gap-2 hover:gap-4 transition-all tracking-[0.2em]">
                  VIEW PROJECT <ChevronRight className="w-4 h-4 text-primary" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
