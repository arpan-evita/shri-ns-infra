import { PageBanner } from "@/components/sections/PageBanner";
import { ContactInfo } from "@/components/sections/ContactInfo";
import { ContactMapSection } from "@/components/sections/ContactMapSection";

export const ContactPage = () => {
  return (
    <div className="flex flex-col">
      <PageBanner 
        title="Contact Us" 
        image="https://images.unsplash.com/photo-1531971589569-0d93a00d4240?q=80&w=2037&auto=format&fit=crop"
      />
      <ContactInfo />
      <ContactMapSection />
    </div>
  );
};
