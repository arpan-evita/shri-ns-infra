import { AboutBanner } from "@/components/sections/AboutBanner";
import { AboutExperience } from "@/components/sections/AboutExperience";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";

export const AboutPage = () => {
  return (
    <div className="flex flex-col">
      <AboutBanner />
      <AboutExperience />
      <Team />
      <Testimonials />
    </div>
  );
};
