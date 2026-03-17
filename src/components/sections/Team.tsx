import { Facebook, Twitter, Linkedin } from 'lucide-react';

export const Team = () => {
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
