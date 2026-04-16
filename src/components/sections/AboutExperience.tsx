import { Target, Compass } from 'lucide-react';
import founderImg from '../../assets/founder.webp';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AboutExperience = () => {
  return (
    <section className="bg-background-dark py-16 md:py-24 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Left Side - Image with Overlay */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative group overflow-hidden rounded-sm">
              <img 
                src={founderImg} 
                className="w-full aspect-[4/5] object-cover"
                alt="Ajay Sharma"
                loading="lazy"
                decoding="async"
                width={600}
                height={750}
              />
              {/* Floating Avatar for Detail */}
              <div className="absolute -top-6 -right-6 w-20 h-20 md:w-32 md:h-32 bg-primary p-1 md:p-1.5 rounded-full hidden lg:block animate-bounce-slow">
                 <img src={founderImg} className="w-full h-full object-cover rounded-full border-4 border-black" alt="Ajay Sharma detail" loading="lazy" decoding="async" width={128} height={128} />
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-6 md:p-8 m-4 md:m-6 border border-white/5">
                <p className="text-slate-300 italic mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                  "Leading the vision for sustainable urban development in NCR."
                </p>
                <div className="flex flex-col text-left">
                  <h4 className="text-white font-bold text-lg md:text-xl uppercase tracking-wider">Ajay Sharma</h4>
                  <p className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mt-1">CEO | Founder</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 space-y-8 md:space-y-12 text-left"
          >
            <div className="space-y-4">
              <span className="text-primary text-lg md:text-2xl font-light uppercase tracking-tight">About Us</span>
              <h2 className="text-white text-3xl md:text-5xl font-black leading-tight uppercase tracking-tighter">25 Years Of Experience.</h2>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl">
                We are a premium real estate advisory working with reputed NCR developers to offer only verified, RERA-approved residential & commercial projects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Vision Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 p-6 md:p-8 border border-white/10 hover:border-primary/50 transition-colors group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <Target className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-black" />
                </div>
                <h3 className="text-white font-bold text-lg md:text-xl mb-4 uppercase tracking-wider">Our Vision</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  To redefine the real estate landscape through transparency, integrity, and verified excellence.
                </p>
              </motion.div>

              {/* Mission Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 p-6 md:p-8 border border-white/10 hover:border-primary/50 transition-colors group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <Compass className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-black" />
                </div>
                <h3 className="text-white font-bold text-lg md:text-xl mb-4 uppercase tracking-wider">Our Mission</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  Empowering investors with deep market insights and exclusive access to the best properties.
                </p>
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center gap-6 md:gap-8 pt-6 md:pt-8 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-[#1a1c23] shrink-0">
                  <img src={founderImg} alt="Ajay Sharma" className="w-full h-full object-cover" loading="lazy" decoding="async" width={48} height={48} />
                </div>
                <div>
                  <h4 className="text-white font-bold tracking-tight text-sm md:text-base">Ajay Sharma</h4>
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">CEO | Founder</p>
                </div>
              </div>
              <Link 
                to="/contact" 
                className="w-full sm:w-auto px-10 py-4 border border-primary text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-black transition-all text-center"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
