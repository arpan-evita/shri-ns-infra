import { PageBanner } from "@/components/sections/PageBanner";
import { BlogGrid } from "@/components/sections/BlogGrid";

export const BlogPage = () => {
  return (
    <div className="flex flex-col">
      <PageBanner 
        title="Our Blog" 
        image="https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2067&auto=format&fit=crop"
      />
      <BlogGrid />
    </div>
  );
};
