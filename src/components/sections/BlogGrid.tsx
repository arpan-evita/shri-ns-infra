import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Spin, Empty } from 'antd';
import { supabase } from '@/lib/supabase';

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
        <Spin size="large" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-24 flex items-center justify-center bg-background-dark">
        <Empty description={<span className="text-slate-500">No articles published yet.</span>} />
      </div>
    );
  }

  return (
    <section className="bg-background-dark py-24 px-6 gap-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.slug}`}
              className="group flex flex-col bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300"
            >
              <div className="relative overflow-hidden h-64">
                <img 
                  src={post.image_url || "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2067&auto=format&fit=crop"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={post.title}
                />
                <div className="absolute top-0 left-0 bg-primary px-4 py-2 text-black text-xs font-bold uppercase tracking-widest translate-y-4 -translate-x-2">
                  {post.category || 'Real Estate'}
                </div>
              </div>
              
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-primary" /> 
                    {new Date(post.published_at || post.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-primary" /> 
                    {post.author || 'Admin'}
                  </div>
                </div>
                
                <h3 className="text-white text-2xl font-black mb-4 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto">
                  <div className="text-white font-bold text-sm uppercase flex items-center gap-2 hover:text-primary transition-all group/btn tracking-widest">
                    Read More <ArrowRight className="w-4 h-4 text-primary group-hover/btn:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
