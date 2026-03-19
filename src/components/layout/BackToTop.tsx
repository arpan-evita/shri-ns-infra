import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Calculate the stroke dash offset based on scroll progress
  // The circle has a circumference of 2 * PI * r = 2 * 3.14 * 24 = 150.72
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          className="fixed bottom-8 right-8 z-50 group"
        >
          <button
            onClick={scrollToTop}
            className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center focus:outline-none"
            aria-label="Back to top"
          >
            {/* Liquid Background Effect */}
            <motion.div 
              animate={{
                borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "60% 40% 30% 70% / 60% 30% 70% 40%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-primary shadow-2xl transition-colors duration-500 group-hover:bg-white"
            />

            {/* Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <motion.circle
                cx="50%"
                cy="50%"
                r="30"
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="2"
                fill="none"
                className="group-hover:stroke-black/5 transition-colors"
                style={{ r: "calc(50% - 2px)" }}
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="30"
                stroke="black"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                style={{ 
                  pathLength,
                  r: "calc(50% - 2px)" 
                }}
                className="group-hover:stroke-black transition-colors"
              />
            </svg>

            {/* Icon */}
            <ArrowUp className="relative z-10 w-6 h-6 md:w-7 md:h-7 text-black transition-transform duration-300 group-hover:-translate-y-1" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

