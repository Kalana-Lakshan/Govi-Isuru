/**
 * Mobile-first Responsive CSS Guidelines
 * 
 * Add this to your component comments for team reference
 */

/*
 * MOBILE-FIRST RESPONSIVE DESIGN CHECKLIST
 * 
 * 1. GRID LAYOUTS - Always start with single column
 *    ❌ grid grid-cols-3
 *    ✅ grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
 * 
 * 2. PADDING/MARGIN - Scale with screen size
 *    ❌ p-8
 *    ✅ p-4 sm:p-6 md:p-8
 * 
 * 3. FONT SIZES - Readable on all devices
 *    ❌ text-4xl
 *    ✅ text-2xl sm:text-3xl md:text-4xl
 * 
 * 4. FLEX LAYOUTS - Stack on mobile
 *    ❌ flex flex-row
 *    ✅ flex flex-col sm:flex-row
 * 
 * 5. WIDTH CONSTRAINTS - Use max-width
 *    ❌ w-96
 *    ✅ w-full max-w-96
 * 
 * 6. IMAGES - Always responsive
 *    ❌ width="500" height="300"
 *    ✅ w-full h-auto object-cover
 * 
 * 7. BUTTONS/INPUTS - Touch targets 44px minimum
 *    ❌ p-2 text-xs
 *    ✅ p-2 sm:p-3 text-sm sm:text-base min-h-[44px]
 * 
 * 8. TABLES - Use horizontal scroll or cards
 *    ❌ <table> without wrapper
 *    ✅ <div className="overflow-x-auto"><table>
 * 
 * 9. ABSOLUTE POSITIONING - Avoid on mobile
 *    ❌ absolute top-0 right-0
 *    ✅ fixed bottom-0 right-0 sm:absolute sm:top-0
 * 
 * 10. GAP/SPACING - Scale consistently
 *     ❌ gap-8
 *     ✅ gap-3 sm:gap-4 md:gap-6
 * 
 * BREAKPOINTS:
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px
 * - xl: 1280px
 * - 2xl: 1536px
 */

// Import in your components:
// import { gridResponsive, paddingResponsive, fontResponsive } from '../utils/responsiveUtils';
//
// Usage:
// <div className={gridResponsive.cards}>
// <div className={paddingResponsive.container}>
// <h1 className={fontResponsive.heroTitle}>

export const MOBILE_FIRST_RULES = {
  rules: [
    'Always start with mobile (no breakpoint prefix)',
    'Add sm: for tablet (640px)',
    'Add md: for landscape tablet (768px)',
    'Add lg: for desktop (1024px)',
    'Add xl: for large desktop (1280px)',
  ],
  
  examples: {
    grid: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    padding: 'p-4 sm:p-6 md:p-8',
    fontSize: 'text-base sm:text-lg md:text-xl',
    flexDirection: 'flex-col sm:flex-row',
    width: 'w-full max-w-4xl',
  },
};
