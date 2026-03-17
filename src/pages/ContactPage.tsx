import { PageBanner } from "@/components/sections/PageBanner";
import { ContactInfo } from "@/components/sections/ContactInfo";
import { ContactMapSection } from "@/components/sections/ContactMapSection";

export const ContactPage = () => {
  return (
    <div className="flex flex-col">
      <PageBanner 
        title="Contact Us" 
        image="https://images.unsplash.com/photo-1503387762-592dee58c460?q=80&w=2070&auto=format&fit=crop"
      />
      <ContactInfo />
      <ContactMapSection />
    </div>
  );
};
