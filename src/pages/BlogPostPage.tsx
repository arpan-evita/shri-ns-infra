import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { Button, message, Spin } from 'antd';
import { supabase } from '@/lib/supabase';
import { PageBanner } from "@/components/sections/PageBanner";

export const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        message.error('Blog post not found');
        navigate('/blog');
      } else {
        setBlog(data);
      }
      setLoading(false);
    };

    fetchBlog();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark">
        <Spin size="large" />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="bg-background-dark min-h-screen">
      <PageBanner 
        title={blog.title} 
        image={blog.image_url || "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2067&auto=format&fit=crop"}
      />

      <div className="max-w-4xl mx-auto px-6 py-24">
        <Button 
          icon={<ArrowLeft className="w-4 h-4" />} 
          onClick={() => navigate('/blog')}
          className="bg-white/5 border-white/10 text-white hover:text-primary hover:border-primary mb-12 flex items-center gap-2 h-10 px-6 uppercase tracking-widest text-[10px] font-bold"
        >
          Back to Blogs
        </Button>

        <article className="space-y-12">
          {/* Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/10 pb-12">
            <div className="flex items-center gap-8 text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> 
                {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> 
                {blog.author || 'Admin'}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Share:</span>
              <div className="flex gap-2">
                <Button shape="circle" icon={<Facebook className="w-4 h-4" />} className="bg-white/5 border-none text-white hover:text-[#1877F2]" />
                <Button shape="circle" icon={<Twitter className="w-4 h-4" />} className="bg-white/5 border-none text-white hover:text-[#1DA1F2]" />
                <Button shape="circle" icon={<LinkIcon className="w-4 h-4" />} className="bg-white/5 border-none text-white hover:text-primary" />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-2xl text-slate-300 font-light italic leading-relaxed border-l-4 border-primary pl-8">
            {blog.excerpt}
          </p>

          {/* Main Content */}
          <div 
            className="rich-text-content prose prose-invert prose-primary max-w-none text-slate-400 text-lg leading-loose"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* Footer Meta */}
        <div className="mt-24 p-12 bg-white/5 border border-white/5 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary text-4xl font-black shrink-0">
              {blog.author?.[0] || 'A'}
            </div>
            <div className="text-center md:text-left space-y-2">
              <h4 className="text-white text-xl font-bold uppercase tracking-wider">Written by {blog.author || 'Admin'}</h4>
              <p className="text-slate-500 text-sm italic">
                A real estate expert sharing insights on infrastructure, investment, and the luxury lifestyle in Noida and Delhi NCR.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .rich-text-content h1, .rich-text-content h2, .rich-text-content h3 {
          color: white;
          font-weight: 900;
          text-transform: uppercase;
          margin-top: 2em;
          margin-bottom: 1em;
          letter-spacing: -0.02em;
        }
        .rich-text-content h1 { font-size: 2.5rem; }
        .rich-text-content h2 { font-size: 2rem; }
        .rich-text-content h3 { font-size: 1.5rem; }
        .rich-text-content p { margin-bottom: 2em; }
        .rich-text-content img {
          width: 100%;
          border-radius: 12px;
          margin: 3em 0;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .rich-text-content ul, .rich-text-content ol {
          margin-bottom: 2em;
          padding-left: 1.5em;
        }
        .rich-text-content li {
          margin-bottom: 1em;
        }
        .rich-text-content a {
          color: #c9a41d;
          text-decoration: underline;
          font-weight: bold;
        }
        .rich-text-content blockquote {
          border-left: 4px solid #c9a41d;
          padding-left: 2em;
          font-style: italic;
          color: #94a3b8;
          margin: 3em 0;
        }
      `}</style>
    </div>
  );
};
