import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Linkedin, Youtube, ArrowRight } from 'lucide-react';

export const ContactInfo = () => {
  return (
    <section className="bg-background-dark py-24 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left Side: Contact Details */}
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-primary text-3xl font-light">Contact Us</span>
              <h2 className="text-white text-6xl font-black uppercase leading-tight tracking-tighter">Get In Touch With Professionals.</h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                Looking for the right property in Delhi & NCR? Share your details and get verified listings, pricing, and site visit assistance from our team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-wider mb-2">Call Us</h4>
                    <p className="text-slate-400 text-sm">+91 9999999999</p>
                    <p className="text-slate-400 text-sm">0120 456789</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-wider mb-2">Email Us</h4>
                    <p className="text-slate-400 text-sm">info@shrinsinfra.com</p>
                    <p className="text-slate-400 text-sm">sales@shrinsinfra.com</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-wider mb-2">Office Address</h4>
                    <p className="text-slate-400 text-sm">Sector 12, Noida<br />Uttar Pradesh 201301</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-wider mb-2">Working Hours</h4>
                    <p className="text-slate-400 text-sm">Mon - Sat: 10AM - 7PM</p>
                    <p className="text-slate-400 text-sm">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Follow Our Socials</h4>
              <div className="flex gap-4">
                {[Facebook, Twitter, Linkedin, Youtube].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-white/5 p-12 border border-white/10">
            <h3 className="text-white text-4xl font-black mb-8 uppercase tracking-tight">Request Call Back</h3>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-white text-xs font-bold uppercase tracking-widest">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-transparent border-b border-white/30 py-4 text-white focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-white text-xs font-bold uppercase tracking-widest">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full bg-transparent border-b border-white/30 py-4 text-white focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-white text-xs font-bold uppercase tracking-widest">Phone Number</label>
                <input type="text" placeholder="+91 99999 99999" className="w-full bg-transparent border-b border-white/30 py-4 text-white focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-white text-xs font-bold uppercase tracking-widest">Message</label>
                <textarea rows={4} placeholder="How can we help you?" className="w-full bg-transparent border-b border-white/30 py-4 text-white focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
              </div>
              <button className="w-full bg-primary text-black font-bold py-5 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all uppercase tracking-widest">
                Submit Request <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
