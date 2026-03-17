import { ChevronRight } from 'lucide-react';

export const PropertyDetailsCTA = () => {
  return (
    <section className="relative min-h-[600px] w-full flex items-center">
      <img 
        src="https://images.unsplash.com/photo-1503387762-592dee58c460?q=80&w=2070&auto=format&fit=crop" 
        className="absolute inset-0 w-full h-full object-cover"
        alt="Modern Architecture"
      />
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-1/2 space-y-6">
          <span className="text-primary text-4xl font-light">Get Property Details</span>
          <h2 className="text-white text-6xl font-black">Of Our Next Project.</h2>
          <p className="text-slate-300 text-lg max-w-md">
            Looking for the right property in <span className="text-white font-bold">Delhi & NCR</span>? Share your details and get verified listings, pricing, and site visit assistance from our team.
          </p>
          <button className="border border-primary px-10 py-4 text-white font-bold flex items-center gap-2 hover:bg-primary hover:text-black transition-all">
            GET DETAILS NOW <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="w-full lg:w-1/2 bg-black/80 p-12 rounded-sm">
          <h3 className="text-white text-4xl font-black mb-8">Get Property Details</h3>
          <form className="space-y-6">
            <input type="text" placeholder="Name" className="w-full bg-transparent border-b border-white/30 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            <input type="email" placeholder="Email" className="w-full bg-transparent border-b border-white/30 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            <input type="text" placeholder="Phone" className="w-full bg-transparent border-b border-white/30 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            <button className="w-full border border-primary text-primary font-bold py-4 hover:bg-primary hover:text-black transition-all">
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
