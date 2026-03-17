import { Phone, Mail, MapPin, Facebook, Twitter, Youtube, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#0f0d08] pt-24 pb-12 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <div className="text-[#c4a661]">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-white uppercase">Shri NS Infra</h2>
            </div>
            <p className="text-slate-400 leading-relaxed">
              We are a premium real estate advisory working with reputed NCR developers to offer only verified, RERA-approved projects.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-[#c4a661]" />
                <span>+91 9999999999</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-5 h-5 text-[#c4a661]" />
                <span>info@shrinsinfra.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
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

          <div>
            <h3 className="text-white text-2xl font-bold mb-8 border-b-2 border-[#c4a661] inline-block pb-2">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Properties', path: '/properties' },
                { name: 'Contact', path: '/contact' },
                { name: 'Blog', path: '/blog' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-slate-400 hover:text-[#c4a661] flex items-center gap-2 transition-colors">
                    <ChevronRight className="w-4 h-4 text-[#c4a661]" /> {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-2xl font-bold mb-8 border-b-2 border-[#c4a661] inline-block pb-2">Top Areas</h3>
            <ul className="space-y-4">
              {['Noida', 'Greater Noida', 'Gurgaon', 'Delhi NCR'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-[#c4a661] flex items-center gap-2 transition-colors">
                    <ChevronRight className="w-4 h-4 text-[#c4a661]" /> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 p-8 rounded-sm">
            <h3 className="text-white text-2xl font-bold mb-8">Newsletter</h3>
            <form className="space-y-4">
              <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-white/30 py-2 text-white text-sm focus:outline-none focus:border-[#c4a661] transition-colors" />
              <button className="w-full border border-[#c4a661] text-[#c4a661] font-bold py-3 text-sm hover:bg-[#c4a661] hover:text-black transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white">Privacy policy</a>
            <a href="#" className="hover:text-white">Terms and conditions</a>
          </div>
          <p className="text-sm text-slate-500 text-center">
            &copy; {new Date().getFullYear()} Shri NS Infra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
