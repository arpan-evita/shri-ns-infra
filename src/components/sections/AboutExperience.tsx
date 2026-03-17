import { Target, Compass, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutExperience = () => {
  return (
    <section className="bg-background-dark py-24 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          {/* Left Side - Image with Overlay */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative group overflow-hidden rounded-sm">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" 
                className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Ajay Sharma"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-8 m-6 border border-white/5">
                <p className="text-slate-300 italic mb-6 leading-relaxed">
                  "Duis vehicula consectetur nisi sit amet cursus. Nullam blandit ligula sit amet eleifend tristique volutpat tristique."
                </p>
                <div className="flex flex-col">
                  <h4 className="text-white font-bold text-xl uppercase tracking-wider">Ajay Sharma</h4>
                  <p className="text-primary text-sm font-bold uppercase tracking-widest">CEO | Founder</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="w-full lg:w-1/2 space-y-12">
            <div className="space-y-4">
              <span className="text-primary text-3xl font-light">About Us</span>
              <h2 className="text-white text-6xl font-black leading-tight uppercase">25 Years Of Experience.</h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                We are a premium real estate advisory working with reputed NCR developers to offer only verified, RERA-approved residential & commercial projects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Vision Card */}
              <div className="bg-white/5 p-8 border border-white/10 hover:border-primary/50 transition-colors group">
                <div className="w-12 h-12 bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <Target className="w-6 h-6 text-primary group-hover:text-black" />
                </div>
                <h3 className="text-white font-bold text-xl mb-4 uppercase tracking-wider">Our Vision</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing. Duis vehicula consectetur nisi sit amet cursus.
                </p>
              </div>

              {/* Mission Card */}
              <div className="bg-white/5 p-8 border border-white/10 hover:border-primary/50 transition-colors group">
                <div className="w-12 h-12 bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <Compass className="w-6 h-6 text-primary group-hover:text-black" />
                </div>
                <h3 className="text-white font-bold text-xl mb-4 uppercase tracking-wider">Our Mission</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing. Duis vehicula consectetur nisi sit amet cursus.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" alt="Ajay Sharma" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white font-bold tracking-tight">Ajay Sharma</h4>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest">CEO | Founder</p>
                </div>
              </div>
              <Link 
                to="/contact" 
                className="px-10 py-4 border border-primary text-primary font-bold uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
