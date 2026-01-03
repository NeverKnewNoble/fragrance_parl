import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  href?: string;
  showArrow?: boolean;
  children: React.ReactNode;
}

// Simple className utility function
function cnUtil(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      asChild = false,
      href,
      showArrow = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-[0.18em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50';

    const variants = {
      primary:
        'bg-[#D4AF37] text-black shadow-[0_24px_60px_rgba(212,175,55,0.6)] hover:scale-105 hover:shadow-[0_28px_70px_rgba(212,175,55,0.7)] active:scale-100',
      secondary:
        'bg-black/60 text-white border border-white/20 backdrop-blur-sm hover:bg-black/80 hover:border-[#D4AF37]/50',
      outline:
        'border border-white/20 bg-white/5 text-white backdrop-blur-sm hover:border-[#D4AF37]/70 hover:bg-white/10 hover:text-[#f6e6b0]',
      ghost:
        'text-white/80 hover:text-[#D4AF37] hover:bg-white/5',
    };

    const sizes = {
      sm: 'px-4 py-1.5 text-[10px]',
      md: 'px-6 py-2.5 text-[11px]',
      lg: 'px-8 py-4 text-sm',
    };

    const classes = cnUtil(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );

    // If href is provided, render as Link
    if (href) {
      return (
        <Link
          href={href}
          className={cnUtil(
            classes,
            'group relative overflow-hidden'
          )}
        >
          {variant === 'primary' && (
            <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-20 bg-[radial-gradient(circle_at_top,#ffffff,transparent_60%)]" />
          )}
          <span className="relative flex items-center gap-2">
            {children}
            {showArrow && (
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </span>
        </Link>
      );
    }

    // Render as button
    return (
      <button
        className={cnUtil(classes, variant === 'primary' && 'group relative overflow-hidden')}
        ref={ref}
        {...props}
      >
        {variant === 'primary' && (
          <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-20 bg-[radial-gradient(circle_at_top,#ffffff,transparent_60%)]" />
        )}
        <span className="relative flex items-center gap-2">
          {children}
          {showArrow && (
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

/**
 * ============================================================================
 * BUTTON COMPONENT USAGE GUIDE
 * ============================================================================
 * 
 * The Button component is a reusable, accessible button with multiple variants
 * and sizes that match the Fragrance Parl design system (gold #D4AF37, black, white).
 * 
 * IMPORT:
 * --------
 * import { Button } from '@/components/ui/button';
 * 
 * 
 * PROPS:
 * ------
 * - variant?: 'primary' | 'secondary' | 'outline' | 'ghost' (default: 'primary')
 *   Controls the visual style of the button
 * 
 * - size?: 'sm' | 'md' | 'lg' (default: 'md')
 *   Controls the button size (padding and font size)
 * 
 * - href?: string
 *   When provided, renders as Next.js Link component instead of button element
 *   Use for navigation between pages
 * 
 * - showArrow?: boolean (default: false)
 *   If true, displays an animated ArrowRight icon that slides on hover
 *   Recommended for primary CTAs and call-to-action buttons
 * 
 * - className?: string
 *   Additional CSS classes to apply (will be merged with component styles)
 * 
 * - children: React.ReactNode
 *   Button content (text, icons, etc.)
 * 
 * - All standard HTML button attributes are supported:
 *   onClick, disabled, type, aria-label, etc.
 * 
 * 
 * VARIANTS:
 * ---------
 * 
 * 1. PRIMARY (default)
 *    - Gold background (#D4AF37) with black text
 *    - Enhanced shadow and scale animation on hover
 *    - Use for main call-to-action buttons
 *    - Best for: Hero sections, primary actions, "Shop Now", "Sign Up"
 * 
 * 2. SECONDARY
 *    - Dark semi-transparent background with white text
 *    - Backdrop blur effect
 *    - Gold border accent on hover
 *    - Use for secondary actions
 *    - Best for: Alternative actions, "Learn More", "View Details"
 * 
 * 3. OUTLINE
 *    - Transparent with white border
 *    - Subtle background on hover
 *    - Gold border accent on hover
 *    - Use for less prominent actions
 *    - Best for: "Cancel", "Back", tertiary actions
 * 
 * 4. GHOST
 *    - Minimal styling, text only
 *    - Gold text color on hover
 *    - Use for subtle actions
 *    - Best for: "Skip", "Close", cancel buttons
 * 
 * 
 * SIZES:
 * ------
 * 
 * - sm: Small (px-4 py-1.5 text-[10px])
 *   Use in: Compact spaces, inline actions, tight layouts
 * 
 * - md: Medium (px-6 py-2.5 text-[11px]) - DEFAULT
 *   Use in: Standard buttons, forms, navigation
 * 
 * - lg: Large (px-8 py-4 text-sm)
 *   Use in: Hero sections, prominent CTAs, main actions
 * 
 * 
 * USAGE EXAMPLES:
 * ---------------
 * 
 * 1. PRIMARY BUTTON WITH LINK AND ARROW (Hero CTA)
 *    ----------------------------------------------
 *    <Button href="/category" variant="primary" size="lg" showArrow>
 *      Shop Collection
 *    </Button>
 * 
 * 
 * 2. PRIMARY BUTTON WITH CLICK HANDLER
 *    ----------------------------------
 *    <Button 
 *      variant="primary" 
 *      size="md" 
 *      onClick={() => handleAddToCart()}
 *    >
 *      Add to Cart
 *    </Button>
 * 
 * 
 * 3. SECONDARY BUTTON FOR NAVIGATION
 *    --------------------------------
 *    <Button href="/about" variant="secondary" size="md">
 *      Learn More
 *    </Button>
 * 
 * 
 * 4. OUTLINE BUTTON FOR SECONDARY ACTIONS
 *    -------------------------------------
 *    <Button variant="outline" size="sm" onClick={handleCancel}>
 *      Cancel
 *    </Button>
 * 
 * 
 * 5. GHOST BUTTON FOR MINIMAL ACTIONS
 *    ---------------------------------
 *    <Button variant="ghost" size="md" onClick={handleClose}>
 *      Close
 *    </Button>
 * 
 * 
 * 6. DISABLED BUTTON
 *    ----------------
 *    <Button 
 *      variant="primary" 
 *      size="lg" 
 *      disabled={isLoading}
 *    >
 *      {isLoading ? 'Processing...' : 'Submit'}
 *    </Button>
 * 
 * 
 * 7. BUTTON WITH CUSTOM CLASSES
 *    ---------------------------
 *    <Button 
 *      variant="primary" 
 *      size="lg"
 *      className="w-full max-w-md"
 *    >
 *      Full Width Button
 *    </Button>
 * 
 * 
 * 8. BUTTON WITH ARIA LABEL (ACCESSIBILITY)
 *    ---------------------------------------
 *    <Button 
 *      variant="primary" 
 *      size="md"
 *      aria-label="Add item to shopping cart"
 *      onClick={handleAddToCart}
 *    >
 *      Add to Cart
 *    </Button>
 * 
 * 
 * BEST PRACTICES:
 * ---------------
 * 
 * 1. Use PRIMARY variant for main call-to-action buttons
 *    - Hero sections: "Shop Collection", "Get Started"
 *    - Product pages: "Add to Cart", "Buy Now"
 *    - Forms: "Submit", "Sign Up"
 * 
 * 2. Use SECONDARY variant for alternative actions
 *    - "Learn More", "View All", "Explore"
 * 
 * 3. Use OUTLINE variant for less prominent actions
 *    - "Cancel", "Back", "Skip"
 * 
 * 4. Use GHOST variant for subtle actions
 *    - "Close", "Dismiss", minimal UI elements
 * 
 * 5. Use showArrow prop for primary CTAs
 *    - Helps indicate navigation/action
 *    - Creates visual interest with animation
 * 
 * 6. Use href prop for navigation (Next.js routing)
 *    - Automatically renders as Link component
 *    - Provides client-side navigation
 * 
 * 7. Use onClick for form submissions and interactions
 *    - Standard button behavior
 *    - Works with form elements
 * 
 * 8. Always provide accessible labels
 *    - Use aria-label for icon-only buttons
 *    - Ensure text is descriptive
 * 
 * 
 * STYLING NOTES:
 * --------------
 * 
 * - All buttons have rounded-full shape (pill-shaped)
 * - Uppercase text with letter spacing (tracking-[0.18em])
 * - Smooth transitions (300ms duration)
 * - Focus states with gold ring for accessibility
 * - Disabled state with reduced opacity
 * - Hover effects: scale, shadow, color transitions
 * - Primary variant includes radial gradient overlay on hover
 * 
 * 
 * DESIGN SYSTEM COLORS:
 * ---------------------
 * 
 * - Primary Gold: #D4AF37
 * - Black: #000000
 * - White: #FFFFFF
 * - Gold Hover: #e3c55d, #f5e3a1
 * 
 * ============================================================================
 */

