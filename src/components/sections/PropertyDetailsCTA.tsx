import { useState } from 'react';
import { ChevronRight, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { sendLeadEmail } from '@/lib/emailService';
import { motion } from 'framer-motion';

export const PropertyDetailsCTA = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
      const { error: supabaseError } = await supabase
        .from('leads')
        .insert([{ 
          name: formData.name, 
          email: formData.email, 
          phone: formData.phone,
          message: 'Lead from Next Project CTA'
        }]);

      if (supabaseError) throw supabaseError;

      // 2. Send Email via Resend
      await sendLeadEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Property Inquiry (Next Project): ${formData.name}`
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Submission Error:', error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-[600px] w-full flex items-center overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=75&w=1200&auto=format&fit=crop&fm=webp" 
        className="absolute inset-0 w-full h-full object-cover"
        alt="Modern Architecture"
        loading="lazy"
        decoding="async"
        width={1200}
        height={600}
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 flex flex-col lg:flex-row items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full lg:w-1/2 space-y-6"
        >
          <span className="text-primary text-3xl font-light">Get Property Details</span>
          <h2 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter">Of Our Next Project.</h2>
          <p className="text-slate-300 text-lg max-w-md font-medium leading-relaxed">
            Looking for the right property in <span className="text-white font-bold">Delhi & NCR</span>? Share your details and get verified listings, pricing, and site visit assistance from our team.
          </p>
          <button className="border border-primary px-10 py-5 text-white font-bold flex items-center gap-2 hover:bg-primary hover:text-black transition-all uppercase tracking-widest text-sm">
            GET DETAILS NOW <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-1/2 bg-black/80 p-8 md:p-12 border border-white/10 relative"
        >
          {submitted ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <CheckCircle className="w-16 h-16 text-primary" />
              <div className="space-y-2">
                 <h3 className="text-white text-3xl font-black uppercase">Success!</h3>
                 <p className="text-slate-400 font-medium">Our expert will contact you shortly.</p>
              </div>
              <button onClick={() => setSubmitted(false)} className="text-primary font-bold uppercase text-[10px] tracking-widest hover:underline">Send another inquiry</button>
            </div>
          ) : (
            <>
              <h3 className="text-white text-4xl font-black mb-10 uppercase tracking-tighter">Get Property Details</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input 
                  required
                  type="text" 
                  placeholder="Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-transparent border-b border-white/30 py-3 text-white focus:outline-none focus:border-primary transition-colors font-medium" 
                />
                <input 
                  required
                  type="email" 
                  placeholder="Email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-transparent border-b border-white/30 py-3 text-white focus:outline-none focus:border-primary transition-colors font-medium" 
                />
                <input 
                  required
                  type="text" 
                  placeholder="Phone" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-transparent border-b border-white/30 py-3 text-white focus:outline-none focus:border-primary transition-colors font-medium" 
                />
                <button 
                  disabled={loading}
                  className="w-full bg-primary text-black font-black py-5 hover:bg-white transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : 'Send Inquiry'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

