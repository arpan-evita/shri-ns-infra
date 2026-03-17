import { Globe } from 'lucide-react';

export const Partners = () => {
  const logos = [
    { name: "LIGHTHOUSE", icon: <Globe className="w-8 h-8" /> },
    { name: "Photoshoper", icon: <Globe className="w-8 h-8" /> },
    { name: "ASTORRY", icon: <Globe className="w-8 h-8" /> },
    { name: "Brocken", icon: <Globe className="w-8 h-8" /> },
    { name: "MIROLLY", icon: <Globe className="w-8 h-8" /> }
  ];

  return (
    <section className="bg-background-dark py-16 px-6 border-b border-white/5">
      <div className="mx-auto max-w-7xl flex flex-wrap justify-between items-center gap-12 opacity-40">
        {logos.map((logo, idx) => (
          <div key={idx} className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all cursor-pointer">
            <div className="text-white">{logo.icon}</div>
            <span className="text-white font-bold tracking-tighter text-xl">{logo.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
