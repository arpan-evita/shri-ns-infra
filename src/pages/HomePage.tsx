import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { VideoSection } from "@/components/sections/VideoSection";
import { Partners } from "@/components/sections/Partners";
import { Testimonials } from "@/components/sections/Testimonials";
import { Team } from "@/components/sections/Team";
import { PropertyDetailsCTA } from "@/components/sections/PropertyDetailsCTA";
import { ContactSection } from "@/components/sections/ContactSection";

export const HomePage = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <About />
      <Projects />
      <VideoSection />
      <Partners />
      <Testimonials />
      <Team />
      <PropertyDetailsCTA />
      <ContactSection />
    </div>
  );
};
