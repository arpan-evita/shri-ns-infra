/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Globe, 
  Mail, 
  Phone,
  ArrowRight,
  Play,
  ChevronRight,
  Quote,
  Star,
  MapPin
} from 'lucide-react';

const Navbar = () => {
  return (
    <header className="absolute top-0 z-50 w-full px-6 lg:px-20 py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-primary">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white uppercase">Shri NS Infra</h2>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-sm font-bold text-primary border-b-2 border-primary pb-1" href="#">Home</a>
          <a className="text-sm font-bold text-slate-300 hover:text-primary transition-colors" href="#">About Us</a>
          <a className="text-sm font-bold text-slate-300 hover:text-primary transition-colors" href="#">Project</a>
          <a className="text-sm font-bold text-slate-300 hover:text-primary transition-colors" href="#">Blog</a>
          <a className="text-sm font-bold text-slate-300 hover:text-primary transition-colors" href="#">Contact Us</a>
        </nav>
      </div>
    </header>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
          className="h-full w-full object-cover"
          alt="Modern Cityscape"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 flex flex-col lg:flex-row items-center gap-12 pt-20">
        {/* Left: Form */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/2 bg-black/40 backdrop-blur-md p-10 rounded-sm border border-white/10"
        >
          <h2 className="text-3xl font-black text-white mb-8">Request A Call Back</h2>
          <form className="space-y-6">
            <input type="text" placeholder="Name" className="w-full bg-transparent border-b border-white/30 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            <input type="email" placeholder="Email" className="w-full bg-transparent border-b border-white/30 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            <input type="text" placeholder="Email" className="w-full bg-transparent border-b border-white/30 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            <button className="w-full sm:w-48 border border-primary text-primary font-bold py-4 hover:bg-primary hover:text-black transition-all">
              Send
            </button>
          </form>
        </motion.div>

        {/* Right: Content */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/2 text-left space-y-6"
        >
          <h3 className="text-primary text-4xl font-light leading-tight">Premium Residential &</h3>
          <h3 className="text-primary text-4xl font-light leading-tight">Commercial</h3>
          <h1 className="text-white text-6xl md:text-8xl font-black leading-none">Properties In NCR</h1>
          <p className="text-slate-300 text-lg max-w-md">
            RERA approved projects with trusted developers across Noida, Greater Noida & Delhi NCR.
          </p>
          <div className="flex items-center gap-8 pt-4">
            <button className="border border-primary px-10 py-4 text-white font-bold hover:bg-primary hover:text-black transition-all">
              DISCOVER WORK
            </button>
            <button className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border border-primary/40">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
              <Play className="w-6 h-6 text-primary fill-primary" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Social Sidebar */}
      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-8 z-20">
        <a href="#" className="text-white hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
        <a href="#" className="text-white hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
        <a href="#" className="text-white hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section className="bg-background-dark py-24 px-6">
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row gap-16 items-center">
        <div className="w-full lg:w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop" 
            className="w-full rounded-sm"
            alt="Real Estate Keys"
            referrerPolicy="no-referrer"
          />
          <div className="mt-8 flex items-center gap-4">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" 
              className="w-20 h-20 rounded-full object-cover border-2 border-primary"
              alt="Ajay Sharma"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="text-white font-bold text-xl">Ajay Sharma</h4>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider">CEO | Founder</p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-2">
            <span className="text-primary text-4xl font-light">About</span>
            <h2 className="text-white text-6xl font-black">Shri NS Infra</h2>
          </div>
          <p className="text-white text-xl italic font-medium leading-relaxed">
            " We are a premium real estate advisory working with reputed NCR developers to offer only verified, RERA-approved residential & commercial projects. "
          </p>
          <p className="text-slate-400 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam accumsan convallis mattis. Suspendisse potenti. Maecenas justo tortor, blandit a facilisis eu, gravida facilisis magna. Vivamus imperdiet purus id viverra sagittis. Aenean eleifend feugiat sagittis. Nulla interdum diam purus, a maximus quam pretium eu.
          </p>
          <button className="border border-primary px-10 py-4 text-white font-bold hover:bg-primary hover:text-black transition-all">
            MORE ABOUT US
          </button>
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "Astrus Capella",
      location: "Noida",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop"
    },
    {
      title: "SKA Divine",
      location: "Noida",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section className="bg-background-dark py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div className="space-y-4">
            <span className="text-primary text-4xl font-light">Our Project</span>
            <h2 className="text-white text-6xl font-black">Delivering Quality Homes & Smart Investments</h2>
            <p className="text-slate-400 max-w-xl">
              Our Project ipsum dolor sit amet, consectetur adipiscing elit. Nullam accumsan convallis mattis. Suspendisse potenti.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project, idx) => (
            <div key={idx} className="group relative overflow-hidden">
              <img 
                src={project.image} 
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                alt={project.title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 bg-black/80 p-8 w-full md:w-2/3">
                <p className="text-slate-400 text-sm mb-1">{project.location}</p>
                <h3 className="text-white text-3xl font-bold mb-4">{project.title}</h3>
                <a href="#" className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
                  READ MORE <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const VideoSection = () => {
  return (
    <section className="relative h-[600px] w-full overflow-hidden flex items-center justify-center">
      <img 
        src="https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2067&auto=format&fit=crop" 
        className="absolute inset-0 w-full h-full object-cover"
        alt="Modern Building"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <button className="relative z-10 group flex items-center justify-center w-24 h-24 rounded-full bg-white/20 border border-white/40 backdrop-blur-sm">
        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
        <Play className="w-10 h-10 text-white fill-white" />
      </button>
    </section>
  );
};

const Partners = () => {
  const logos = [
    { name: "LIGHTHOUSE", icon: <Globe className="w-8 h-8" /> },
    { name: "Photoshoper", icon: <Globe className="w-8 h-8" /> },
    { name: "ASTORRY", icon: <Globe className="w-8 h-8" /> },
    { name: "Brocken", icon: <Globe className="w-8 h-8" /> },
    { name: "MIROLLY", icon: <Globe className="w-8 h-8" /> }
  ];

  return (
    <section className="bg-background-dark py-16 px-6 border-b border-white/5">
      <div className="mx-auto max-w-7xl flex flex-wrap justify-between items-center gap-12 opacity-40">
        {logos.map((logo, idx) => (
          <div key={idx} className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all cursor-pointer">
            <div className="text-white">{logo.icon}</div>
            <span className="text-white font-bold tracking-tighter text-xl">{logo.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const Testimonials = () => {
  return (
    <section className="bg-background-dark py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
          className="w-full h-full object-cover"
          alt="Office background"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="mx-auto max-w-7xl relative z-10 flex flex-col lg:flex-row gap-16 items-center">
        <div className="w-full lg:w-1/3 space-y-6">
          <h2 className="text-white text-4xl font-black leading-tight">Trusted From Over 2,500 Client</h2>
          <Quote className="w-24 h-24 text-primary fill-primary opacity-40" />
        </div>
        <div className="w-full lg:w-2/3 space-y-8">
          <p className="text-white text-3xl font-medium leading-relaxed">
            " What I liked most about Shri NS Infra is their market knowledge and transparency. They suggested genuine options that matched my requirements instead of pushing random projects. Thanks to them, I successfully closed a deal in West Delhi with complete peace of mind. "
          </p>
          <div>
            <h4 className="text-white font-bold text-2xl">Rohit Malhotra</h4>
            <p className="text-primary font-semibold">— Delhi</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Team = () => {
  const members = [
    { name: "Ajay Sharma", role: "CEO | Founder", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" },
    { name: "Vikram Singh", role: "Sales Director", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" },
    { name: "John Doe", role: "Project Manager", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop" }
  ];

  return (
    <section className="bg-background-dark py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-4">
            <span className="text-primary text-4xl font-light">Our Team</span>
            <h2 className="text-white text-6xl font-black">Meet With Expert Team.</h2>
          </div>
          <button className="hidden md:block border border-primary px-8 py-3 text-white font-bold hover:bg-primary hover:text-black transition-all">
            VIEW ALL TEAM
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((member, idx) => (
            <div key={idx} className="group">
              <div className="relative overflow-hidden mb-6">
                <img 
                  src={member.image} 
                  className="w-full h-[450px] object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  alt={member.name}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href="#" className="text-white hover:text-primary"><Facebook className="w-4 h-4" /></a>
                  <a href="#" className="text-white hover:text-primary"><Twitter className="w-4 h-4" /></a>
                  <a href="#" className="text-white hover:text-primary"><Linkedin className="w-4 h-4" /></a>
                </div>
              </div>
              <h3 className="text-white text-2xl font-bold">{member.name}</h3>
              <p className="text-primary font-semibold">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PropertyDetailsCTA = () => {
  return (
    <section className="relative min-h-[600px] w-full flex items-center">
      <img 
        src="https://images.unsplash.com/photo-1503387762-592dee58c460?q=80&w=2070&auto=format&fit=crop" 
        className="absolute inset-0 w-full h-full object-cover"
        alt="Modern Architecture"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-1/2 space-y-6">
          <span className="text-primary text-4xl font-light">Get Property Details</span>
          <h2 className="text-white text-6xl font-black">Of Our Next Project.</h2>
          <p className="text-slate-300 text-lg max-w-md">
            Looking for the right property in <span className="text-white font-bold">Delhi & NCR</span>? Share your details and get verified listings, pricing, and site visit assistance from our team.
          </p>
          <button className="border border-primary px-10 py-4 text-white font-bold flex items-center gap-2 hover:bg-primary hover:text-black transition-all">
            GET DETAILS NOW <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="w-full lg:w-1/2 bg-black/80 p-12 rounded-sm">
          <h3 className="text-white text-4xl font-black mb-8">Get Property Details</h3>
          <form className="space-y-6">
            <input type="text" placeholder="Name" className="w-full bg-transparent border-b border-white/30 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            <input type="email" placeholder="Email" className="w-full bg-transparent border-b border-white/30 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            <input type="text" placeholder="Email" className="w-full bg-transparent border-b border-white/30 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            <button className="w-full border border-primary text-primary font-bold py-4 hover:bg-primary hover:text-black transition-all">
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
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
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-white text-xs font-bold uppercase">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-white text-xs font-bold uppercase">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-white text-xs font-bold uppercase">Phone Number</label>
              <input type="text" placeholder="+91 98765 43210" className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-white text-xs font-bold uppercase">Message</label>
              <textarea rows={4} placeholder="Tell us about your project or interest..." className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-primary resize-none"></textarea>
            </div>
            <button className="w-full bg-primary text-black font-bold py-4 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
              Submit Request <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
            <div className="space-y-4">
              <h4 className="text-primary text-xs font-bold uppercase flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Office Address
              </h4>
              <p className="text-slate-400 text-sm">
                4th Floor, Skyline Towers<br />Business District, Sector 12<br />Mumbai, MH 400051
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
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
                className="w-full h-[600px] object-cover"
                alt="Luxury Villa"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-8 right-8 w-32 h-48 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl rotate-6">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                  className="w-full h-full object-cover"
                  alt="Building"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="absolute bottom-8 left-8 right-8 bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-primary fill-primary" />)}
                </div>
                <p className="text-white italic mb-6">
                  "Shri NS Infra delivered beyond our expectations. Their attention to structural integrity and aesthetic detail is truly premium."
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" 
                    className="w-12 h-12 rounded-full object-cover"
                    alt="Vikram Malhotra"
                    referrerPolicy="no-referrer"
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

const Footer = () => {
  return (
    <footer className="bg-background-dark pt-24 pb-12 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <div className="text-primary">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-white uppercase">Shri NS Infra</h2>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-primary" />
                <span>9999999999</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-5 h-5 text-primary" />
                <span>info@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Location</span>
              </div>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white text-2xl font-bold mb-8 border-b-2 border-primary inline-block pb-2">Quick Links</h3>
            <ul className="space-y-4">
              {['Home', 'About', 'Projects', 'Contact', 'Blog', 'Privacy policy', 'Sitemap'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-primary flex items-center gap-2 transition-colors">
                    <ChevronRight className="w-4 h-4 text-primary" /> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-2xl font-bold mb-8 border-b-2 border-primary inline-block pb-2">Properties</h3>
            <ul className="space-y-4">
              {['Astrus Capella', 'SKA Divine', 'Entilla 4CS', 'Karyan'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-primary flex items-center gap-2 transition-colors">
                    <ChevronRight className="w-4 h-4 text-primary" /> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 p-8 rounded-sm">
            <h3 className="text-white text-2xl font-bold mb-8">Get Property Details</h3>
            <form className="space-y-4">
              <input type="text" placeholder="Name" className="w-full bg-transparent border-b border-white/30 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors" />
              <input type="email" placeholder="Email" className="w-full bg-transparent border-b border-white/30 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors" />
              <input type="text" placeholder="Phone" className="w-full bg-transparent border-b border-white/30 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors" />
              <button className="w-full border border-primary text-primary font-bold py-3 text-sm hover:bg-primary hover:text-black transition-all">
                Send
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background-dark">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <About />
        <Projects />
        <VideoSection />
        <Partners />
        <Testimonials />
        <Team />
        <PropertyDetailsCTA />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
