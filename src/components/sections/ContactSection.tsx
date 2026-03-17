import { Facebook, Twitter, Linkedin, MapPin, Globe, ArrowRight, Star } from 'lucide-react';

export const ContactSection = () => {
  return (
    <section className="bg-[#1a170e] py-24 px-6">
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row gap-16">
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-2">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">REACH OUT</span>
            <h2 className="text-white text-5xl font-black">Request a Call Back</h2>
            <p className="text-slate-400 max-w-md">
              Partner with Shri NS Infra to bring your architectural vision to life. Our specialists are ready to discuss your next premium development.
            </p>
          </div>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-white text-xs font-bold uppercase">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-white text-xs font-bold uppercase">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-white text-xs font-bold uppercase">Phone Number</label>
              <input type="text" placeholder="+91 98765 43210" className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-white text-xs font-bold uppercase">Message</label>
              <textarea rows={4} placeholder="Tell us about your project or interest..." className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-primary resize-none"></textarea>
            </div>
            <button className="w-full bg-primary text-black font-bold py-4 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
              Submit Request <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
            <div className="space-y-4">
              <h4 className="text-primary text-xs font-bold uppercase flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Office Address
              </h4>
              <p className="text-slate-400 text-sm">
                4th Floor, Skyline Towers<br />Business District, Sector 12<br />Noida, UP 201301
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-primary text-xs font-bold uppercase flex items-center gap-2">
                <Globe className="w-4 h-4" /> Follow Us
              </h4>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:text-primary transition-all"><Facebook className="w-4 h-4" /></a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:text-primary transition-all"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:text-primary transition-all"><Linkedin className="w-4 h-4" /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 relative">
          <div className="sticky top-32 space-y-8">
            <div className="relative rounded-sm overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
                className="w-full h-[600px] object-cover"
                alt="Luxury Villa"
              />
              <div className="absolute top-8 right-8 w-32 h-48 rounded-sm overflow-hidden border-4 border-white/20 shadow-2xl rotate-6">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                  className="w-full h-full object-cover"
                  alt="Building"
                />
              </div>
              
              <div className="absolute bottom-8 left-8 right-8 bg-black/40 backdrop-blur-md p-8 rounded-sm border border-white/10">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-primary fill-primary" />)}
                </div>
                <p className="text-white italic mb-6">
                  "Shri NS Infra delivered beyond our expectations. Their attention to structural integrity and aesthetic detail is truly premium."
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" 
                    className="w-12 h-12 rounded-full object-cover"
                    alt="Vikram Malhotra"
                  />
                  <div>
                    <h5 className="text-white font-bold">Vikram Malhotra</h5>
                    <p className="text-primary text-xs font-bold uppercase tracking-widest">PROJECT DIRECTOR, NEXUS CORP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
