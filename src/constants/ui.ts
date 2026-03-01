// UI 관련 상수 정의
export const COLORS = {
  primary: '#4A90E2',
  secondary: '#222222',
  text: '#333333',
  background: '#F7F7F7',
  backgroundSecondary: '#FFFFFF',
  muted: '#888888',
  accent: '#E8F4FD',
  error: '#DC3545',
  success: '#28A745',
  warning: '#FFC107',
} as const;

export const TYPOGRAPHY = {
  hero: 'text-4xl md:text-5xl lg:text-6xl font-bold',
  heading: 'text-2xl md:text-3xl font-bold',
  subheading: 'text-xl md:text-2xl font-semibold',
  body: 'text-base',
  small: 'text-sm',
  tiny: 'text-xs',
} as const;

export const SPACING = {
  container: 'max-w-7xl mx-auto px-6 lg:px-8',
  section: 'py-16 lg:py-24',
  card: 'p-6 lg:p-8',
} as const;

export const ANIMATION = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 }
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 }
  },
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;