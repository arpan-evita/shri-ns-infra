import { Link } from 'react-router-dom';

export const AboutBanner = () => {
  return (
    <section className="relative h-[400px] w-full flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
          className="h-full w-full object-cover"
          alt="About Banner Background"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      
      <div className="relative z-10 text-center space-y-4">
        <h1 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tight">About Us</h1>
        <div className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-sm">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-primary">/</span>
          <span className="text-white">About Us</span>
        </div>
      </div>
    </section>
  );
};
