import { Calendar, User, ArrowRight } from 'lucide-react';

export const BlogGrid = () => {
  const posts = [
    {
      title: "The Future of Luxury Real Estate in Noida",
      excerpt: "Noida's skyline is changing rapidly with upcoming luxury developments. Discover why investors are flocking to these new high-yield projects.",
      date: "March 15, 2024",
      author: "Admin",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop"
    },
    {
      title: "RERA Approved Projects: What You Need to Know",
      excerpt: "Safety first when it comes to property investments. Understanding the importance of RERA guidelines for residential and commercial assets.",
      date: "March 10, 2024",
      author: "Ajay Sharma",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Commercial vs Residential: Which is Better for ROI?",
      excerpt: "Analyzing the market trends of 2024 in Delhi NCR. We break down the rental yields and capital appreciation for different asset types.",
      date: "March 05, 2024",
      author: "Sales Director",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section className="bg-background-dark py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post, idx) => (
            <div key={idx} className="group flex flex-col bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300">
              <div className="relative overflow-hidden h-64">
                <img 
                  src={post.image} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={post.title}
                />
                <div className="absolute top-0 left-0 bg-primary px-4 py-2 text-black text-xs font-bold uppercase tracking-widest translate-y-4 -translate-x-2">
                  Real Estate
                </div>
              </div>
              
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" /> {post.date}</div>
                  <div className="flex items-center gap-1"><User className="w-3 h-3 text-primary" /> {post.author}</div>
                </div>
                
                <h3 className="text-white text-2xl font-black mb-4 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto">
                  <button className="text-white font-bold text-sm uppercase flex items-center gap-2 hover:text-primary transition-all group/btn tracking-widest">
                    Read More <ArrowRight className="w-4 h-4 text-primary group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
