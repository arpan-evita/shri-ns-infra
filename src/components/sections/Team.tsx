import { Facebook, Twitter, Linkedin } from 'lucide-react';
import founderImg from '../../assets/founder.png';
import pawanImg from '../../assets/pawan.png';
import { motion } from 'framer-motion';

export const Team = () => {
  const members = [
    { name: "Ajay Sharma", role: "CEO | Founder", image: founderImg },
    { name: "Pawan Soam", role: "VP - SALES", image: pawanImg },
    { name: "Gaurav Singh", role: "Manager Operations", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop" }
  ];

  return (
    <section className="bg-background-dark py-16 md:py-24 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 text-left"
        >
          <div className="space-y-3 md:space-y-4">
            <span className="text-primary text-xl md:text-2xl font-light uppercase tracking-tight">Our Team</span>
            <h2 className="text-white text-3xl md:text-5xl font-black leading-tight uppercase tracking-tighter">Meet With Expert Team.</h2>
          </div>
          <button className="hidden md:block border border-primary px-8 py-3 text-white font-bold hover:bg-primary hover:text-black transition-all uppercase tracking-widest text-sm">
            VIEW ALL TEAM
          </button>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((member, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="group text-left"
            >
              <div className="relative overflow-hidden mb-6 rounded-sm">
                <img 
                  src={member.image} 
                  className="w-full h-[350px] md:h-[450px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 font-bold"
                  alt={member.name}
                />
                <div className="absolute bottom-4 left-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href="#" className="text-white hover:text-primary"><Facebook className="w-4 h-4" /></a>
                  <a href="#" className="text-white hover:text-primary"><Twitter className="w-4 h-4" /></a>
                  <a href="#" className="text-white hover:text-primary"><Linkedin className="w-4 h-4" /></a>
                </div>
              </div>
              <h3 className="text-white text-xl md:text-2xl font-black uppercase tracking-tight mb-1">{member.name}</h3>
              <p className="text-primary font-black uppercase tracking-widest text-[10px]">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
