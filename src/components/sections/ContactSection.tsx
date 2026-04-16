import { Facebook, Twitter, Linkedin, MapPin, Globe, ArrowRight, Star, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { sendLeadEmail } from '@/lib/emailService';
import { toast } from '@/lib/toast';

export const ContactSection = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
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
          message: formData.message,
          source: 'Contact Page'
        }]);

      if (dbError) throw dbError;

      // 2. Send Email
      await sendLeadEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        subject: `New General Enquiry: ${formData.name}`
      });

      toast.success('Thank you! Your request has been sent successfully.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error: any) {
      console.error('Lead submission error:', error);
      toast.error('Oops! Something went wrong. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

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
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-white text-xs font-bold uppercase">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-primary" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-white text-xs font-bold uppercase">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-primary" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-white text-xs font-bold uppercase">Phone Number</label>
              <input 
                type="text" 
                required
                placeholder="+91 98765 43210" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-primary" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-white text-xs font-bold uppercase">Message</label>
              <textarea 
                rows={4} 
                required
                placeholder="Tell us about your project or interest..." 
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-primary resize-none"
              ></textarea>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-bold py-4 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Request'} 
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
            <div className="space-y-4">
              <h4 className="text-primary text-xs font-bold uppercase flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Office Address
              </h4>
              <p className="text-slate-400 text-sm">
                Second Floor, Wave City<br />KingWood Enclave, Wave City<br />Ghaziabad, UP 201015
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
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=75&w=800&auto=format&fit=crop&fm=webp" 
                className="w-full h-[600px] object-cover"
                alt="Luxury Villa"
                loading="lazy"
                decoding="async"
                width={800}
                height={600}
              />
              <div className="absolute top-8 right-8 w-32 h-48 rounded-sm overflow-hidden border-4 border-white/20 shadow-2xl rotate-6">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=75&w=200&auto=format&fit=crop&fm=webp" 
                  className="w-full h-full object-cover"
                  alt="Building"
                  loading="lazy"
                  decoding="async"
                  width={200}
                  height={300}
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
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=75&w=100&auto=format&fit=crop&fm=webp" 
                    className="w-12 h-12 rounded-full object-cover"
                    alt="Vikram Malhotra"
                    loading="lazy"
                    decoding="async"
                    width={48}
                    height={48}
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

