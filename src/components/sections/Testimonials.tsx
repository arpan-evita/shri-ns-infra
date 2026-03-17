import { Quote } from 'lucide-react';

export const Testimonials = () => {
  return (
    <section className="bg-background-dark py-16 md:py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
          className="w-full h-full object-cover"
          alt="Office background"
        />
      </div>
      <div className="mx-auto max-w-7xl relative z-10 flex flex-col lg:flex-row gap-10 md:gap-16 items-center text-left">
        <div className="w-full lg:w-1/3 space-y-4 md:space-y-6">
          <h2 className="text-white text-2xl md:text-4xl font-black leading-tight uppercase tracking-tighter">Trusted From Over 2,500 Client</h2>
          <div className="h-1 w-20 bg-primary" />
          <Quote className="w-16 h-16 md:w-24 md:h-24 text-primary fill-primary opacity-40" />
        </div>
        <div className="w-full lg:w-2/3 space-y-6 md:space-y-8">
          <p className="text-white text-xl md:text-3xl font-medium leading-relaxed italic">
            " What I liked most about Shri NS Infra is their market knowledge and transparency. They suggested genuine options that matched my requirements instead of pushing random projects. Complete peace of mind. "
          </p>
          <div>
            <h4 className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter">Rohit Malhotra</h4>
            <p className="text-primary font-black uppercase tracking-widest text-[10px]">— Delhi</p>
          </div>
        </div>
      </div>
    </section>
  );
};
