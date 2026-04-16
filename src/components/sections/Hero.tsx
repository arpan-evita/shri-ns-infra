import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Facebook, Twitter, Linkedin, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { sendLeadEmail } from '@/lib/emailService';
import { toast } from '@/lib/toast';

export const Hero = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Save to Supabase
      const { error: dbError } = await supabase
        .from('leads')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          source: 'Hero Slider'
        }]);

      if (dbError) throw dbError;

      // 2. Send Email
      await sendLeadEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `New Hero Inquiry: ${formData.name}`
      });

      toast.success('Thank you! We will call you back shortly.');
      setFormData({ name: '', email: '', phone: '' });
    } catch (error: any) {
      console.error('Hero lead error:', error);
      toast.error('Oops! Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          preload="none"
          className="h-full w-full object-cover"
        >
          <source src="/banner-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 flex flex-col-reverse lg:flex-row items-center gap-12 pt-32 md:pt-40 pb-20">
        {/* Left: Form */}
        <motion.div 
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
          className="w-full lg:w-1/2 bg-black/40 backdrop-blur-md p-6 md:p-10 rounded-sm border border-white/10"
        >
          <h2 className="text-2xl md:text-3xl font-black text-white mb-6 md:mb-8 uppercase tracking-tight">Request A Call Back</h2>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <input 
              type="text" 
              required
              placeholder="Name" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-transparent border-b border-white/30 py-3 text-white text-sm focus:outline-none focus:border-[#c4a661] transition-colors" 
            />
            <input 
              type="email" 
              required
              placeholder="Email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-transparent border-b border-white/30 py-3 text-white text-sm focus:outline-none focus:border-[#c4a661] transition-colors" 
            />
            <input 
              type="text" 
              required
              placeholder="Phone" 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-transparent border-b border-white/30 py-3 text-white text-sm focus:outline-none focus:border-[#c4a661] transition-colors" 
            />
            <button 
              type="submit"
              disabled={loading}
              className="w-full sm:w-48 border border-[#c4a661] text-[#c4a661] font-bold py-4 text-sm hover:bg-[#c4a661] hover:text-black transition-all uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Inquiry'}
            </button>
          </form>
        </motion.div>

        {/* Right: Content */}
        <motion.div 
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
          className="w-full lg:w-1/2 text-left space-y-4 md:space-y-6"
        >
          <div className="space-y-1">
            <h3 className="text-[#c4a661] text-2xl md:text-4xl font-light leading-tight uppercase tracking-tighter">Premium Residential &</h3>
            <h3 className="text-[#c4a661] text-2xl md:text-4xl font-light leading-tight uppercase tracking-tighter">Commercial</h3>
          </div>
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-none uppercase tracking-tighter">Properties In NCR</h1>
          <p className="text-slate-300 text-sm md:text-lg max-w-md font-medium leading-relaxed">
            RERA approved projects with trusted developers across Noida, Greater Noida & Delhi NCR.
          </p>
          <div className="flex items-center gap-6 md:gap-8 pt-4">
            <button className="border border-[#c4a661] px-8 md:px-10 py-3 md:py-4 text-white text-xs md:text-sm font-bold hover:bg-[#c4a661] hover:text-black transition-all uppercase tracking-widest">
              DISCOVER WORK
            </button>
            <button className="group relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#c4a661]/20 border border-[#c4a661]/40">
              <div className="absolute inset-0 rounded-full bg-[#c4a661]/20 animate-ping"></div>
              <Play className="w-4 h-4 md:w-6 md:h-6 text-[#c4a661] fill-[#c4a661]" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Social Sidebar */}
      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-8 z-20">
        <a href="#" className="text-white hover:text-[#c4a661] transition-colors"><Facebook className="w-5 h-5" /></a>
        <a href="#" className="text-white hover:text-[#c4a661] transition-colors"><Twitter className="w-5 h-5" /></a>
        <a href="#" className="text-white hover:text-[#c4a661] transition-colors"><Linkedin className="w-5 h-5" /></a>
      </div>
    </section>
  );
};
