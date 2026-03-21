import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching testimonials:', error);
      } else if (data && data.length > 0) {
        setTestimonials(data);
      } else {
        // Fallback to static data if table is empty
        setTestimonials([{
          name: "Rohit Malhotra",
          content: "What I liked most about Shri NS Infra is their market knowledge and transparency. They suggested genuine options that matched my requirements instead of pushing random projects. Complete peace of mind.",
          location: "Delhi"
        }]);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials]);

  const current = testimonials[currentIndex];

  if (!current) return null;

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
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/3 space-y-4 md:space-y-6"
        >
          <h2 className="text-white text-2xl md:text-3xl font-black leading-tight uppercase tracking-tighter">Trusted From Over 2,500 Client</h2>
          <div className="h-1 w-20 bg-primary" />
          <Quote className="w-16 h-16 md:w-24 md:h-24 text-primary fill-primary opacity-40 animate-pulse" />
        </motion.div>

        <div className="w-full lg:w-2/3 min-h-[250px] relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="space-y-6 md:space-y-8"
            >
              <p className="text-white text-xl md:text-3xl font-medium leading-relaxed italic">
                " {current.content} "
              </p>
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < (current.rating || 5) ? 'text-primary fill-primary' : 'text-white/20'}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <h4 className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter">{current.name}</h4>
                <p className="text-primary font-black uppercase tracking-widest text-[10px]">— {current.location}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {testimonials.length > 1 && (
            <div className="flex gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1 transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-primary' : 'w-4 bg-white/20'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
