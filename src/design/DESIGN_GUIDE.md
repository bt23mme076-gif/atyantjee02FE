/**

- Atyant Design System Guide
-
- This file documents the design system and provides guidance for developers
- on how to use and extend design tokens across all Atyant verticals.
  */

/**

- COLOR PALETTE
-
- Primary Brand Colors:
- - Purple (#8B5CF6): Primary action, highlights, key CTAs
- - Dark Navy (#0B0F2E): Backgrounds, headers, typography
- - Orange (#FF6B2B): Secondary CTAs, accents, floating buttons
- - Blue (#0B72FF): Links, info states, alternative actions
-
- Usage:
- - Headings: Use white text on dark background or dark text on white
- - Accents: Purple for primary, orange for secondary
- - Hover states: Increase opacity (e.g., hover:opacity-90)
- - Disabled states: Decrease opacity (e.g., opacity-50)
-
- Examples:
- <button className="bg-primary text-white">Primary Action</button>
- <button className="bg-orange text-white">Secondary Action</button>
- <div className="bg-dark text-white">Dark Section</div>

*/

/**

- TYPOGRAPHY
-
- Font Family: Inter (system fallback: ui-sans-serif, system-ui)
- Default sizes follow Tailwind scale: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl
-
- Font Weights:
- - normal (400): Body text
- - semibold (600): Medium emphasis
- - bold (700): Headings, strong emphasis
-
- Line Heights:
- - tight (1.25): Headings
- - normal (1.5): Body text
- - relaxed (1.625): Longer content
-
- Examples:
- <h1 className="text-4xl font-bold text-white">Heading</h1>
- <p className="text-base font-normal text-gray-600">Body text</p>
- <span className="text-sm font-semibold text-primary">Label</span>
  */

/**

- SPACING SYSTEM
-
- Uses Tailwind's spacing scale (4px base unit):
- p-4 = 1rem (16px), p-8 = 2rem (32px), etc.
-
- Guidelines:
- - Component padding: p-4 to p-6
- - Section margins: mb-12 to mb-16
- - Text spacing: gap-2 to gap-4 for text elements
-
- Examples:
- <div className="p-6 mb-8">Content</div>
- <div className="space-y-4">List items</div>

*/

/**

- BORDER RADIUS
-
- Use consistent rounding:
- - Buttons: rounded-full (9999px)
- - Cards: rounded-lg (0.5rem) to rounded-xl (0.75rem)
- - Small elements: rounded-md (0.375rem)
-
- Examples:
- <button className="rounded-full px-6 py-3">Button</button>
- <div className="rounded-lg p-6">Card</div>

*/

/**

- SHADOWS & DEPTH
-
- Use shadows for depth:
- - shadow-sm: Subtle elevation
- - shadow-md: Default elevation
- - shadow-lg: Prominent elevation
- - shadow-orange-glow: Orange accent glow
- - shadow-purple-glow: Purple accent glow
-
- Examples:
- <div className="rounded-lg shadow-lg">Elevated card</div>
- <button className="shadow-orange-glow">Glowing button</button>
  */

/**

- RESPONSIVE DESIGN
-
- Breakpoints (mobile-first approach):
- - No prefix: xs (320px) - default, mobile
- - sm: 640px
- - md: 768px - tablets
- - lg: 1024px - desktops
- - xl: 1280px - large screens
- - 2xl: 1536px - extra large screens
-
- Examples:
- <div className="text-sm md:text-base lg:text-lg">Responsive text</div>
- <div className="w-full md:w-1/2 lg:w-1/3">Responsive width</div>
- <div className="hidden md:block">Hide on mobile</div>

*/

/**

- COMPONENT PATTERNS
-
- Button Variants:
- - Primary: bg-primary text-white rounded-full
- - Secondary: bg-gray-100 text-gray-900 rounded-full
- - Outline: border border-gray-300 text-gray-900 rounded-full
-
- Card Pattern:
- - bg-white rounded-lg shadow-md p-6
- - or dark: bg-dark rounded-lg border border-gray-700 p-6
-
- Input Pattern:
- - border border-gray-300 rounded-lg px-4 py-2
- - focus:outline-none focus:ring-2 focus:ring-primary
    */

/**

- COLOR COMBINATIONS (Approved Pairs)
-
- Light Mode:
- - Text: gray-900 on white background
- - Headings: white on dark background
- - Accents: purple on white
-
- Dark Mode:
- - Text: gray-100 on dark background
- - Headings: white on dark
- - Accents: purple or orange on dark
    */

/**

- ACCESSIBILITY GUIDELINES
-
- - Contrast: Ensure text meets WCAG AA standards (4.5:1 for body, 3:1 for large)
- - Focus states: Always provide visible focus ring (focus:ring-2 focus:ring-primary)
- - Motion: Use motion sparingly, provide prefers-reduced-motion support
- - Color: Don't rely solely on color; use icons and text labels
    */

/**

- HOW TO USE DESIGN TOKENS
-
- Option 1: Direct Tailwind Classes (Preferred)
- ***
- import React from 'react';
-
- export function Button() {
- return (
-     <button className="rounded-full bg-primary px-6 py-3 text-white shadow-lg hover:opacity-90">
-       Click me
-     </button>
- );
- }
-
- Option 2: Import Token Constants
- ***
- import { colors } from '../design/tokens';
-
- export function Card() {
- return (
-     <div style={{
-       backgroundColor: colors.primary,
-       color: colors.neutral.white
-     }}>
-       Content
-     </div>
- );
- }
  */

/**

- EXTENDING THE DESIGN SYSTEM
-
- To add new colors or tokens:
- 1.  Update src/design/tokens.js with new token
- 2.  Update tailwind.config.js to expose it
- 3.  Document the token and its usage here
- 4.  Update all relevant verticals
- 5.  Commit with message: "chore: add [token-name] design token"
      */

export const DESIGN_SYSTEM_VERSION = '1.0.0';
export const LAST_UPDATED = '2026-05-01';
