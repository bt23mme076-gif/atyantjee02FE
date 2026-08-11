# CircleMeshBackground Component

A performant, reusable React component that adds subtle animated circular mesh patterns to section backgrounds.

## Features

- ✅ Lightweight (CSS-only gradients, no canvas)
- ✅ Animated (optional slow pulse effect)
- ✅ Multiple variants (dark, light, tinted)
- ✅ Intensity levels (subtle, medium, bold)
- ✅ Blur effect support
- ✅ Mobile responsive
- ✅ Respects `prefers-reduced-motion` accessibility setting
- ✅ Tailwind CSS compatible

## Props

| Prop        | Type                           | Default  | Description                                                                                       |
| ----------- | ------------------------------ | -------- | ------------------------------------------------------------------------------------------------- |
| `children`  | ReactNode                      | required | Content to render on top of background                                                            |
| `variant`   | 'dark' \| 'light' \| 'tinted'  | 'dark'   | Background color variant: light circles on dark bg, dark circles on light bg, or colored gradient |
| `intensity` | 'subtle' \| 'medium' \| 'bold' | 'subtle' | Opacity level: 5%, 8%, or 12%                                                                     |
| `animated`  | boolean                        | true     | Enable slow pulse animation (20s duration)                                                        |
| `blur`      | boolean                        | true     | Apply subtle blur effect to background                                                            |

## Usage Examples

### Hero Section (Dark background with subtle circles)

```jsx
import CircleMeshBackground from './components/CircleMeshBackground';

export default function Hero() {
  return (
    <CircleMeshBackground variant="dark" intensity="subtle" animated blur>
      <section className="bg-[#0B0F2E] text-white">{/* Your hero content */}</section>
    </CircleMeshBackground>
  );
}
```

### CTA Section (Medium intensity with animation)

```jsx
<CircleMeshBackground variant="dark" intensity="medium" animated>
  <section className="bg-[#0B0F2E]">
    <div className="max-w-5xl mx-auto text-center">
      <h2>One Wrong Decision Costs 4 Years</h2>
      <p>Get clarity now</p>
    </div>
  </section>
</CircleMeshBackground>
```

### Light Background Section

```jsx
<CircleMeshBackground variant="light" intensity="subtle">
  <section className="bg-white">{/* Light background content */}</section>
</CircleMeshBackground>
```

### Tinted Variant (Purple + Orange gradient)

```jsx
<CircleMeshBackground variant="tinted" intensity="medium" animated>
  <section className="bg-gradient-to-r from-purple-900 to-orange-900">
    {/* Content with colored mesh */}
  </section>
</CircleMeshBackground>
```

### Without Animation (Static background)

```jsx
<CircleMeshBackground variant="dark" animated={false} blur>
  <section className="bg-[#0B0F2E]">{/* Static mesh background */}</section>
</CircleMeshBackground>
```

## Implementation Details

### How It Works

1. **Layering:** Component renders a relative container with three layers:
   - Background mesh layer (absolute, low z-index)
   - Secondary depth layer (optional radial gradient)
   - Content layer (relative, z-index: 10)

2. **Pattern:** Uses multiple overlapping radial gradients with different sizes and positions to create a repeating circle pattern
   - 8 different gradient sizes (200–300px)
   - Staggered positions for natural look
   - 1px circle dots at specific coordinates

3. **Animation:** Optional CSS keyframe animation that:
   - Subtly shifts vertical position (±10px)
   - Modulates opacity slightly over 20 seconds
   - Respects user's motion preferences

4. **Performance:**
   - Pure CSS (no JavaScript computation)
   - No canvas rendering
   - Minimal reflow/repaint
   - ~1KB component size

## Customization

### Adjust Circle Density

Edit the `backgroundSize` and `backgroundPosition` in `CircleMeshBackground.jsx`:

```jsx
backgroundSize: '150px 150px, 250px 200px, ...', // Smaller sizes = denser pattern
backgroundPosition: '0 0, 20px 40px, ...', // Adjust spacing
```

### Change Animation Speed

Modify the animation duration in the `@keyframes mesh-pulse`:

```jsx
animation: mesh-pulse 20s ease-in-out infinite; // Change 20s to your duration
```

### Modify Colors

Update the `backgroundColor` property:

```jsx
backgroundColor: variant === 'dark' ? '#ffffff' : '#1e293b', // Light/dark circle colors
```

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support (responsive, respects reduce-motion)

## Accessibility

- Respects `prefers-reduced-motion` media query (disables animation)
- Maintains text contrast and readability
- No flashing or seizure risks

## Performance Notes

- Renders efficiently on mobile (no performance degradation)
- Blur effect may impact performance on older devices (disable if needed)
- Animation is 60fps on modern browsers

## Integration in Current Project

- **Hero.jsx:** Wraps the main hero section with `variant="dark" intensity="subtle"`
- **LaunchpadPage.jsx (FinalCTA):** Wraps the final CTA section with `variant="dark" intensity="medium"`

To add to more sections, simply wrap the section with the component:

```jsx
<CircleMeshBackground variant="dark" intensity="subtle">
  <section>Content</section>
</CircleMeshBackground>
```
