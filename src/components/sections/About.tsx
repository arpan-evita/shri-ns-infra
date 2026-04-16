import founderImg from '../../assets/founder.webp';
import { motion } from 'framer-motion';

export const About = () => {
  return (
    <section className="bg-background-dark py-24 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full lg:w-1/2 relative"
        >
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=75&w=800&auto=format&fit=crop&fm=webp" 
            className="w-full rounded-sm"
            alt="Real Estate Keys"
            loading="lazy"
            decoding="async"
            width={800}
            height={600}
          />
          <div className="mt-8 flex items-center gap-4">
            <img 
              src={founderImg}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary"
              alt="Ajay Sharma"
              loading="lazy"
              decoding="async"
              width={64}
              height={64}
            />
            <div>
              <h4 className="text-white font-bold text-xl">Ajay Sharma</h4>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider">CEO | Founder</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="w-full lg:w-1/2 space-y-8"
        >
          <div className="space-y-2">
            <span className="text-primary text-3xl md:text-4xl font-light">About</span>
            <h2 className="text-white text-4xl md:text-5xl font-black">Shri NS Infra</h2>
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
        </motion.div>
      </div>
    </section>
  );
};
