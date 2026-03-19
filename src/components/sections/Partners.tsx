import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export const Partners = () => {
  const logos = [
    { name: "LIGHTHOUSE", icon: <Globe className="w-8 h-8" /> },
    { name: "Photoshoper", icon: <Globe className="w-8 h-8" /> },
    { name: "ASTORRY", icon: <Globe className="w-8 h-8" /> },
    { name: "Brocken", icon: <Globe className="w-8 h-8" /> },
    { name: "MIROLLY", icon: <Globe className="w-8 h-8" /> }
  ];

  return (
    <section className="bg-background-dark py-16 px-6 border-b border-white/5 overflow-hidden">
      <div className="mx-auto max-w-7xl flex flex-wrap justify-between items-center gap-12 opacity-40">
        {logos.map((logo, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all cursor-pointer"
          >
            <div className="text-white">{logo.icon}</div>
            <span className="text-white font-bold tracking-tighter text-xl">{logo.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
