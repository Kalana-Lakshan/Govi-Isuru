/**
 * Responsive Design Utilities
 * 
 * This file contains reusable responsive Tailwind class generators
 * to ensure consistency and mobile-first design across all components
 */

// Grid layout generators
export const gridResponsive = {
  // 1 column on mobile, 2 on tablet, 3 on desktop, 4 on xl
  cards: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6',
  
  // 1 column on mobile, 2 on tablet, 3 on desktop
  featured: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
  
  // 1 column on mobile, 2 on tablet and up
  two: 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6',
  
  // 1 column on mobile, 3 on tablet and up
  three: 'grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6',
  
  // 2 columns on tablet, 4 on desktop
  stats: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4',
};

// Padding generators
export const paddingResponsive = {
  container: 'p-4 sm:p-6 md:p-8',
  section: 'px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10',
  card: 'p-3 sm:p-4 md:p-6',
  compact: 'p-2 sm:p-3 md:p-4',
};

// Font size generators
export const fontResponsive = {
  heroTitle: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
  sectionTitle: 'text-2xl sm:text-3xl md:text-4xl',
  cardTitle: 'text-lg sm:text-xl md:text-2xl',
  body: 'text-sm sm:text-base md:text-lg',
};

// Flex layout generators
export const flexResponsive = {
  rowReverse: 'flex flex-col-reverse sm:flex-row',
  centerColumn: 'flex flex-col items-center justify-center',
  between: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6',
};

// Gap generators
export const gapResponsive = {
  small: 'gap-2 sm:gap-3 md:gap-4',
  medium: 'gap-4 sm:gap-5 md:gap-6',
  large: 'gap-6 sm:gap-8 md:gap-10',
};

// Width generators
export const widthResponsive = {
  maxContainer: 'w-full max-w-7xl mx-auto',
  maxSmall: 'w-full max-w-2xl mx-auto',
  maxMedium: 'w-full max-w-4xl mx-auto',
};

// Table responsive wrapper
export const tableResponsive = 'w-full overflow-x-auto';

// Image responsive
export const imageResponsive = 'w-full h-auto object-cover';

// Button responsive
export const buttonResponsive = 'px-4 sm:px-6 py-2 sm:py-3 min-h-[44px] min-w-[44px] text-sm sm:text-base';

// Input responsive
export const inputResponsive = 'w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base min-h-[44px]';

// Card responsive
export const cardResponsive = 'p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border';

// Common responsive patterns
export const patterns = {
  // Two column layout that stacks on mobile
  twoColumnStack: 'flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8',
  
  // Three column layout that stacks on mobile
  threeColumnStack: 'flex flex-col md:flex-row gap-4 sm:gap-6 justify-between',
  
  // Hero section with overlay text
  heroOverlay: 'relative h-64 sm:h-80 md:h-96 lg:h-screen/2 rounded-lg sm:rounded-xl overflow-hidden',
  
  // Mobile-first modal backdrop
  modalBackdrop: 'fixed inset-0 bg-black/50 z-40 flex items-end sm:items-center justify-center',
  
  // Responsive modal content
  modalContent: 'bg-white w-full sm:w-11/12 md:w-3/4 lg:w-1/2 rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8',
  
  // Sticky header for mobile
  stickyHeader: 'sticky top-0 bg-white z-10 border-b',
};

export default {
  gridResponsive,
  paddingResponsive,
  fontResponsive,
  flexResponsive,
  gapResponsive,
  widthResponsive,
  tableResponsive,
  imageResponsive,
  buttonResponsive,
  inputResponsive,
  cardResponsive,
  patterns,
};
