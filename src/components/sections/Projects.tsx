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
    <section className="bg-background-dark py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div className="space-y-4">
            <span className="text-primary text-4xl font-light">Our Project</span>
            <h2 className="text-white text-6xl font-black">Delivering Quality Homes & Smart Investments</h2>
            <p className="text-slate-400 max-w-xl">
              We represent some of the most prestigious developments in the region, ensuring every investment provides long-term value and excellence.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project, idx) => (
            <div key={idx} className="group relative overflow-hidden">
              <img 
                src={project.image} 
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                alt={project.title}
              />
              <div className="absolute bottom-0 left-0 bg-black/80 p-8 w-full md:w-2/3">
                <p className="text-slate-400 text-sm mb-1">{project.location}</p>
                <h3 className="text-white text-3xl font-bold mb-4">{project.title}</h3>
                <a href="#" className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
                  READ MORE <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
