import { PageBanner } from "@/components/sections/PageBanner";
import { ContactInfo } from "@/components/sections/ContactInfo";
import { ContactMapSection } from "@/components/sections/ContactMapSection";
import contactBanner from "@/assets/contact-banner.png";

export const ContactPage = () => {
  return (
    <div className="flex flex-col">
      <PageBanner 
        title="Contact Us" 
        image={contactBanner}
      />
      <ContactInfo />
      <ContactMapSection />
    </div>
  );
};
