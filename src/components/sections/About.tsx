
export const About = () => {
  return (
    <section className="bg-background-dark py-24 px-6">
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row gap-16 items-center">
        <div className="w-full lg:w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop" 
            className="w-full rounded-sm"
            alt="Real Estate Keys"
          />
          <div className="mt-8 flex items-center gap-4">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" 
              className="w-20 h-20 rounded-full object-cover border-2 border-primary"
              alt="Ajay Sharma"
            />
            <div>
              <h4 className="text-white font-bold text-xl">Ajay Sharma</h4>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider">CEO | Founder</p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-2">
            <span className="text-primary text-4xl font-light">About</span>
            <h2 className="text-white text-6xl font-black">Shri NS Infra</h2>
          </div>
          <p className="text-white text-xl italic font-medium leading-relaxed">
            " We are a premium real estate advisory working with reputed NCR developers to offer only verified, RERA-approved residential & commercial projects. "
          </p>
          <p className="text-slate-400 leading-relaxed">
            Shri NS Infra is a trusted name in Delhi NCR real estate. We specialize in luxury residential apartments, premium plots, and high-yield commercial spaces. Our team ensures every project we represent meets the highest standards of quality and legality.
          </p>
          <button className="border border-primary px-10 py-4 text-white font-bold hover:bg-primary hover:text-black transition-all">
            MORE ABOUT US
          </button>
        </div>
      </div>
    </section>
  );
};
