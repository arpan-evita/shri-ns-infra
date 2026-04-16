import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Linkedin, Youtube, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { sendLeadEmail } from '@/lib/emailService';
import { motion } from 'framer-motion';

export const ContactInfo = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('leads')
      .insert([
        { 
          name: formData.name, 
          email: formData.email, 
          phone: formData.phone, 
          message: formData.message 
        }
      ]);

    if (!error) {
      // Send Email via Resend
      await sendLeadEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        subject: `New Professional Inquiry: ${formData.name}`
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } else {
      alert("Error submitting request. Please try again.");
    }
    setLoading(false);
  };

  return (
    <section className="bg-background-dark py-16 md:py-24 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Side: Contact Details */}
          <motion.div 
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="space-y-10 md:space-y-12 text-left"
          >
            <div className="space-y-4">
              <span className="text-primary text-xl md:text-3xl font-light uppercase tracking-tight">Contact Us</span>
              <h2 className="text-white text-4xl md:text-6xl font-black uppercase leading-tight tracking-tighter">Get In Touch With Professionals.</h2>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl font-medium">
                Looking for the right property in Delhi & NCR? Share your details and get verified listings, pricing, and site visit assistance from our team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-[10px] md:text-xs mb-2">Call Us</h4>
                    <p className="text-slate-400 text-sm font-bold">+91 93121 21411</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-[10px] md:text-xs mb-2">Email Us</h4>
                    <p className="text-slate-400 text-sm font-bold">shrinsinfra@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-[10px] md:text-xs mb-2">Office Address</h4>
                    <p className="text-slate-400 text-sm font-bold">Second Floor, Wave City<br /><span className="text-xs font-medium text-slate-500">KingWood Enclave, Wave City<br />Ghaziabad, UP 201015</span></p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-[10px] md:text-xs mb-2">Working Hours</h4>
                    <p className="text-slate-400 text-sm font-bold">Mon - Sat: 10AM - 7PM</p>
                    <p className="text-slate-400 text-xs font-medium uppercase">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-6">Follow Our Socials</h4>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {[Facebook, Twitter, Linkedin, Youtube].map((Icon, idx) => (
                  <motion.a 
                    key={idx} 
                    href="#"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 + 0.5 }}
                    className="w-10 h-10 md:w-12 md:h-12 bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all"
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="bg-white/5 p-8 md:p-12 border border-white/10 relative overflow-hidden rounded-sm text-left"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white text-3xl font-black uppercase tracking-tighter">Thank You!</h3>
                  <p className="text-slate-400 text-sm md:text-base font-medium">Your message has been received. Our expert will reach out shortly.</p>
                </div>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-white text-3xl md:text-4xl font-black mb-10 uppercase tracking-tighter leading-none">Send Us A Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="space-y-1">
                    <label className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your full name" 
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors font-medium placeholder:text-white/10" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com" 
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors font-medium placeholder:text-white/10" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Phone Number</label>
                    <input 
                      required
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 99999 99999" 
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors font-medium placeholder:text-white/10" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Message</label>
                    <textarea 
                      required
                      rows={3} 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us about your property requirements..." 
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none font-medium placeholder:text-white/10"
                    ></textarea>
                  </div>
                  <button 
                    disabled={loading}
                    className="w-full bg-primary text-black font-black py-5 flex items-center justify-center gap-2 hover:bg-white transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> ESTABLISHING...</>
                    ) : (
                      <>SEND MESSAGE <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};


