import { Quote } from 'lucide-react';

export const ContactMapSection = () => {
  return (
    <section className="flex flex-col lg:flex-row h-auto lg:h-[600px] w-full overflow-hidden">
      {/* Left Side: Map */}
      <div className="w-full lg:w-1/2 h-[400px] lg:h-full">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112117.981512497!2d77.30605963906251!3d28.57913349999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30d3f1c34![Noida%2C%20Uttar%20Pradesh]!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale invert hover:invert-0 transition-all duration-700"
        ></iframe>
      </div>

      {/* Right Side: Trusted Quote */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-8 md:p-16 lg:p-24 bg-[#1a170f] text-left">
        {/* Architectural Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover"
            alt="Architecture Background"
          />
        </div>

        <div className="relative z-10 space-y-8 md:space-y-12 max-w-lg">
          <div className="space-y-4">
            <h3 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tight leading-none md:leading-tight">Trusted From Over<br /><span className="text-primary">2,500 Clients.</span></h3>
            <div className="w-16 md:w-20 h-1 bg-primary"></div>
          </div>

          <p className="text-slate-300 text-lg md:text-2xl font-medium italic leading-relaxed">
            " We want to create a better world through the products and services. Good architecture makes you go WOW! "
          </p>

          <div className="flex justify-start">
             <Quote className="w-16 h-16 md:w-24 md:h-24 text-primary opacity-30 rotate-180" strokeWidth={3} />
          </div>
        </div>
      </div>
    </section>
  );
};
