
import { type MotionProps } from "framer-motion";

// Fade in animation
export const fadeIn = (delay = 0): MotionProps => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, delay }
});

// Slide up animation
export const slideUp = (delay = 0): MotionProps => ({
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
  transition: { duration: 0.4, ease: "easeOut", delay }
});

// Slide down animation
export const slideDown = (delay = 0): MotionProps => ({
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
  transition: { duration: 0.4, ease: "easeOut", delay }
});

// Scale animation
export const scaleIn = (delay = 0): MotionProps => ({
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
  transition: { duration: 0.3, ease: "easeOut", delay }
});

// Staggered children animation 
export const staggerContainer = {
  initial: { opacity: 1 },
  animate: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { opacity: 1 }
};

// Child animation for staggered containers
export const staggerItem = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
  transition: { duration: 0.3, ease: "easeOut" }
};

// Hover scale effect
export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2 }
};

// Pulse animation
export const pulse = {
  animate: {
    scale: [1, 1.03, 1],
    opacity: [1, 0.8, 1],
  },
  transition: {
    duration: 2,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "loop"
  }
};
