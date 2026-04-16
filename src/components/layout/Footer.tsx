import { useState } from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Youtube, ChevronRight, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { sendLeadEmail } from '@/lib/emailService';

export const Footer = () => {
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
          message: 'Lead from Footer Form'
        }]);

      if (supabaseError) throw supabaseError;

      // 2. Send Email via Resend
      await sendLeadEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `New Property Detail Inquiry: ${formData.name}`
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Submission Error:', error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#0f0d08] pt-16 md:pt-24 pb-8 md:pb-12 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-12 md:gap-16 mb-16 md:mb-20">
          <div className="col-span-2 lg:col-span-3 space-y-6 md:space-y-8">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Shri NS Infra" className="h-10 md:h-12 w-auto" loading="lazy" decoding="async" width={120} height={48} />
            </div>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              We are a premium real estate advisory working with reputed NCR developers to offer only verified, RERA-approved projects.
            </p>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-3 text-slate-300 text-sm md:text-base">
                <Phone className="w-5 h-5 text-[#c4a661]" />
                <span>+91 93121 21411</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm md:text-base">
                <Mail className="w-5 h-5 text-[#c4a661]" />
                <span>shrinsinfra@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm md:text-base">
                <MapPin className="w-5 h-5 text-[#c4a661]" />
                <span>Ghaziabad, NCR</span>
              </div>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#c4a661] hover:text-black transition-all"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#c4a661] hover:text-black transition-all"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#c4a661] hover:text-black transition-all"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-white text-lg md:text-2xl font-bold mb-6 md:mb-8 border-b-2 border-[#c4a661] inline-block pb-2">Quick Links</h3>
            <ul className="space-y-3 md:space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Properties', path: '/properties' },
                { name: 'Contact', path: '/contact' },
                { name: 'Blog', path: '/blog' },
                { name: 'List Your Project', path: '/submit-project' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-slate-400 hover:text-[#c4a661] flex items-center gap-1 md:gap-2 transition-colors text-sm md:text-base">
                    <ChevronRight className="w-4 h-4 text-[#c4a661] shrink-0" /> <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-white text-lg md:text-2xl font-bold mb-6 md:mb-8 border-b-2 border-[#c4a661] inline-block pb-2">Top Areas</h3>
            <ul className="space-y-3 md:space-y-4">
              {['Noida', 'Greater Noida', 'Gurgaon', 'Delhi NCR'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-[#c4a661] flex items-center gap-1 md:gap-2 transition-colors text-sm md:text-base">
                    <ChevronRight className="w-4 h-4 text-[#c4a661] shrink-0" /> <span className="truncate">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-5 bg-white/5 p-6 md:p-10 lg:p-12 rounded-sm overflow-hidden min-h-[350px] transition-all duration-500">
            <h3 className="text-white text-xl md:text-2xl font-bold mb-6 md:mb-8">Get Property Details</h3>
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8 animate-in fade-in zoom-in duration-500">
                <CheckCircle className="w-12 h-12 text-[#c4a661]" />
                <p className="text-white font-bold uppercase tracking-widest text-xs">Request Received!</p>
                <p className="text-slate-400 text-xs">We will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  required
                  type="text" 
                  placeholder="Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-transparent border-b border-white/30 py-2 text-white text-sm focus:outline-none focus:border-[#c4a661] transition-colors" 
                />
                <input 
                  required
                  type="email" 
                  placeholder="Email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-transparent border-b border-white/30 py-2 text-white text-sm focus:outline-none focus:border-[#c4a661] transition-colors" 
                />
                <input 
                  required
                  type="text" 
                  placeholder="Phone" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-transparent border-b border-white/30 py-2 text-white text-sm focus:outline-none focus:border-[#c4a661] transition-colors" 
                />
                <button 
                  disabled={loading}
                  className="w-full border border-[#c4a661] text-[#c4a661] font-bold py-3 text-sm hover:bg-[#c4a661] hover:text-black transition-all uppercase tracking-widest mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 md:pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6 md:gap-8 text-xs md:text-sm text-slate-500">
            <a href="#" className="hover:text-white">Privacy policy</a>
            <a href="#" className="hover:text-white">Terms and conditions</a>
          </div>
          <p className="text-xs md:text-sm text-slate-500 text-center">
            &copy; {new Date().getFullYear()} Shri NS Infra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

