import React from 'react';

export const Navbar = () => {
  return (
    <header className="absolute top-0 z-50 w-full px-6 lg:px-20 py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-[#c4a661]">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white uppercase">Shri NS Infra</h2>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-sm font-bold text-[#c4a661] border-b-2 border-[#c4a661] pb-1" href="/">Home</a>
          <a className="text-sm font-bold text-slate-300 hover:text-[#c4a661] transition-colors" href="/about">About Us</a>
          <a className="text-sm font-bold text-slate-300 hover:text-[#c4a661] transition-colors" href="/properties">Properties</a>
          <a className="text-sm font-bold text-slate-300 hover:text-[#c4a661] transition-colors" href="/blog">Blog</a>
          <a className="text-sm font-bold text-slate-300 hover:text-[#c4a661] transition-colors" href="/contact">Contact Us</a>
        </nav>
      </div>
    </header>
  );
};
