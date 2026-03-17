import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const siteUrl = 'https://shri-ns-infra.vercel.app';

export default async function handler(req: any, res: any) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Fetch Slugs
  const [properties, blogs] = await Promise.all([
    supabase.from('properties').select('slug'),
    supabase.from('blogs').select('slug').eq('status', 'published')
  ]);

  const propertyUrls = properties.data?.map(p => `
  <url>
    <loc>${siteUrl}/properties/${p.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('') || '';

  const blogUrls = blogs.data?.map(b => `
  <url>
    <loc>${siteUrl}/blog/${b.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('') || '';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${siteUrl}/properties</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>${propertyUrls}${blogUrls}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
}
