import { Hero } from "@/components/sections/Hero";

export const HomePage = () => {
  return (
    <div className="flex flex-col gap-24 pb-24">
      <Hero />
      
      {/* About Preview Section */}
      <section className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop" 
            className="w-full rounded-sm"
            alt="Real Estate Advisory"
          />
          <div className="absolute -bottom-8 -right-8 bg-[#c4a661] p-10 hidden md:block">
            <div className="text-black text-5xl font-black">15+</div>
            <div className="text-black font-bold uppercase tracking-widest text-sm">Years Experience</div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-[#c4a661] text-4xl font-light">About</span>
            <h2 className="text-white text-6xl font-black">Shri NS Infra</h2>
          </div>
          <p className="text-white text-xl italic font-medium leading-relaxed">
            " We are a premium real estate advisory working with reputed NCR developers to offer only verified, RERA-approved residential & commercial projects. "
          </p>
          <p className="text-slate-400 leading-relaxed">
            Shri NS Infra is a trusted name in Delhi NCR real estate. We specialize in luxury residential apartments, premium plots, and high-yield commercial spaces. Our team ensures every project we represent meets the highest standards of quality and legality.
          </p>
          <button className="border border-[#c4a661] px-10 py-4 text-white font-bold hover:bg-[#c4a661] hover:text-black transition-all">
            MORE ABOUT US
          </button>
        </div>
      </section>

      {/* Featured Properties Preview - Placeholder for now */}
      <section className="bg-[#0f0d08] py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-4 mb-16 text-center">
            <span className="text-[#c4a661] text-4xl font-light">Featured</span>
            <h2 className="text-white text-6xl font-black uppercase">Our Properties</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="col-span-full text-center py-12 text-slate-500 border border-white/5 bg-white/5">
              Connect Supabase to fetch live properties
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
