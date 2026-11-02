/**
 * Shared staff UI motion tokens. Honor prefers-reduced-motion.
 */

export const staffEase = [0.22, 1, 0.36, 1] as const;

export const staffDuration = {
  micro: 0.15,
  ui: 0.22,
  overlay: 0.28,
} as const;

export const staffDrawerSpring = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 40,
  mass: 0.9,
};

export const staffDrawerExitSpring = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 38,
  mass: 0.85,
};

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function drawerPanelMotion(reduced?: boolean, snappy?: boolean) {
  const reduce = reduced ?? prefersReducedMotion();
  if (reduce) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: staffDuration.micro },
    };
  }
  if (snappy) {
    return {
      initial: { x: '100%' },
      animate: { x: 0, transition: { duration: staffDuration.ui, ease: staffEase } },
      exit: { x: '100%', transition: { duration: staffDuration.micro, ease: staffEase } },
    };
  }
  return {
    initial: { x: '100%' },
    animate: { x: 0, transition: staffDrawerSpring },
    exit: { x: '100%', transition: staffDrawerExitSpring },
  };
}

export function drawerScrimMotion(reduced?: boolean) {
  const reduce = reduced ?? prefersReducedMotion();
  if (reduce) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: staffDuration.micro },
    };
  }
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: staffDuration.overlay, ease: staffEase },
  };
}
