import { Phone, Mail, MapPin, Facebook, Twitter, Youtube, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

export const Footer = () => {
  return (
    <footer className="bg-[#0f0d08] pt-16 md:pt-24 pb-8 md:pb-12 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-16 mb-16 md:mb-20">
          <div className="col-span-2 lg:col-span-1 space-y-6 md:space-y-8">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="Shri NS Infra" className="h-10 md:h-12 w-auto" />
            </div>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              We are a premium real estate advisory working with reputed NCR developers to offer only verified, RERA-approved projects.
            </p>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-3 text-slate-300 text-sm md:text-base">
                <Phone className="w-5 h-5 text-[#c4a661]" />
                <span>+91 9999999999</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm md:text-base">
                <Mail className="w-5 h-5 text-[#c4a661]" />
                <span>info@shrinsinfra.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm md:text-base">
                <MapPin className="w-5 h-5 text-[#c4a661]" />
                <span>Noida, NCR</span>
              </div>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#c4a661] hover:text-black transition-all"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#c4a661] hover:text-black transition-all"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#c4a661] hover:text-black transition-all"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-white text-lg md:text-2xl font-bold mb-6 md:mb-8 border-b-2 border-[#c4a661] inline-block pb-2">Quick Links</h3>
            <ul className="space-y-3 md:space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Properties', path: '/properties' },
                { name: 'Contact', path: '/contact' },
                { name: 'Blog', path: '/blog' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-slate-400 hover:text-[#c4a661] flex items-center gap-1 md:gap-2 transition-colors text-sm md:text-base">
                    <ChevronRight className="w-4 h-4 text-[#c4a661] shrink-0" /> <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
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

          <div className="col-span-2 lg:col-span-1 bg-white/5 p-6 md:p-8 rounded-sm">
            <h3 className="text-white text-xl md:text-2xl font-bold mb-6 md:mb-8">Get Property Details</h3>
            <form className="space-y-4">
              <input type="text" placeholder="Name" className="w-full bg-transparent border-b border-white/30 py-2 text-white text-sm focus:outline-none focus:border-[#c4a661] transition-colors" />
              <input type="email" placeholder="Email" className="w-full bg-transparent border-b border-white/30 py-2 text-white text-sm focus:outline-none focus:border-[#c4a661] transition-colors" />
              <input type="text" placeholder="Phone" className="w-full bg-transparent border-b border-white/30 py-2 text-white text-sm focus:outline-none focus:border-[#c4a661] transition-colors" />
              <button className="w-full border border-[#c4a661] text-[#c4a661] font-bold py-3 text-sm hover:bg-[#c4a661] hover:text-black transition-all uppercase tracking-widest mt-2">
                Send
              </button>
            </form>
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
