import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1, backgroundColor: '#ffffff', color: '#000000' }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 md:w-14 md:h-14 bg-primary text-black rounded-full flex items-center justify-center shadow-2xl border border-white/20 transition-colors duration-300 group"
          aria-label="Back to top"
        >
          <ChevronUp className="w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 group-hover:-translate-y-1" />
          
          {/* Subtle pulse effect */}
          <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping -z-10 group-hover:hidden" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
