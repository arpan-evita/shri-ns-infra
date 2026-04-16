import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export const BlogGrid = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching blogs:', error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center bg-background-dark">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center justify-center bg-background-dark gap-3">
        <span className="text-4xl">📄</span>
        <span className="text-slate-500 font-medium">No articles published yet.</span>
      </div>
    );
  }

  return (
    <section className="bg-background-dark py-16 md:py-24 px-6 md:gap-12 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link 
                to={`/blog/${post.slug}`}
                className="group flex flex-col bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300"
              >
              <div className="relative overflow-hidden h-56 md:h-64">
                <img 
                  src={post.image_url || "https://images.unsplash.com/photo-1448630360428-65456885c650?q=75&w=600&auto=format&fit=crop&fm=webp"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={256}
                />
                <div className="absolute top-0 left-0 bg-primary px-4 py-2 text-black text-[10px] md:text-xs font-bold uppercase tracking-widest translate-y-4 -translate-x-2">
                  {post.category || 'Real Estate'}
                </div>
              </div>
              
              <div className="p-6 md:p-8 flex-grow flex flex-col items-start text-left">
                <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> 
                    {new Date(post.published_at || post.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-primary" /> 
                    {post.author || 'Admin'}
                  </div>
                </div>
                
                <h3 className="text-white text-xl md:text-2xl font-black mb-4 group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tighter">
                  {post.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto">
                  <div className="text-white font-black text-[10px] md:text-xs uppercase flex items-center gap-2 hover:text-primary transition-all group/btn tracking-[0.2em]">
                    Read Narrative <ArrowRight className="w-4 h-4 text-primary group-hover/btn:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
