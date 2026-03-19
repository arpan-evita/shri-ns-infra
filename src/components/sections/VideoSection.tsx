import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

export const VideoSection = () => {
  return (
    <section className="relative h-[600px] w-full overflow-hidden flex items-center justify-center">
      <img 
        src="https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2067&auto=format&fit=crop" 
        className="absolute inset-0 w-full h-full object-cover"
        alt="Modern Building"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <motion.button 
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-10 group flex items-center justify-center w-24 h-24 rounded-full bg-white/20 border border-white/40 backdrop-blur-sm"
      >
        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
        <Play className="w-10 h-10 text-white fill-white" />
      </motion.button>
    </section>
  );
};
