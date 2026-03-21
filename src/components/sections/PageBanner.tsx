import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  image?: string;
}

export const PageBanner = ({ 
  title, 
  image = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
}: PageBannerProps) => {
  return (
    <section className="relative h-[250px] md:h-[400px] w-full flex items-center justify-center overflow-hidden pt-12 md:pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          src={image} 
          className="h-full w-full object-cover"
          alt={`${title} Banner Background`}
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      
      <div className="relative z-10 text-center space-y-4 px-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-white text-3xl md:text-7xl font-black uppercase tracking-tight leading-none"
        >
          {title}
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs"
        >
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-primary">/</span>
          <span className="text-white">{title}</span>
        </motion.div>
      </div>
    </section>
  );
};
