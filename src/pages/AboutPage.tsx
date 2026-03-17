import { PageBanner } from "@/components/sections/PageBanner";
import { AboutExperience } from "@/components/sections/AboutExperience";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";

export const AboutPage = () => {
  return (
    <div className="flex flex-col">
      <PageBanner title="About Us" />
      <AboutExperience />
      <Team />
      <Testimonials />
    </div>
  );
};
