import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Properties', path: '/properties' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className={`fixed top-0 z-50 w-full px-6 lg:px-20 transition-all duration-300 ${
        isScrolled 
          ? 'py-4 bg-[hsl(0,0%,10%)]/95 backdrop-blur-md border-b border-white/10 shadow-lg' 
          : 'py-6 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <img src={logoImg} alt="Shri NS Infra" className="h-12 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`text-sm font-bold transition-all duration-300 pb-1 ${
                isActive(link.path) 
                  ? "text-[#c4a661] border-b-2 border-[#c4a661]" 
                  : "text-slate-300 hover:text-[#c4a661]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-[80vw] max-w-sm bg-[#0a0a0a] border-l border-white/10 z-50 md:hidden flex flex-col pt-24 px-8 overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button 
          className="absolute top-6 right-6 text-white p-2 hover:text-[#c4a661] transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-8 h-8" />
        </button>

        <div className="flex flex-col gap-6 w-full mt-4">
          <Link to="/" className="mb-8" onClick={() => setIsOpen(false)}>
             <img src={logoImg} alt="Shri NS Infra" className="h-10 w-auto" />
          </Link>
          
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              onClick={() => setIsOpen(false)}
              className={`text-lg font-black uppercase tracking-widest transition-all w-full border-b border-white/5 pb-4 ${
                isActive(link.path) ? "text-[#c4a661]" : "text-white hover:text-[#c4a661] hover:translate-x-2"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};
