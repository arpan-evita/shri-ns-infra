import { Link } from 'react-router-dom';

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
        <h1 className="text-white text-3xl md:text-7xl font-black uppercase tracking-tight leading-none">{title}</h1>
        <div className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-primary">/</span>
          <span className="text-white">{title}</span>
        </div>
      </div>
    </section>
  );
};
