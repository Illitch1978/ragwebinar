# Rubiklab Brand Guide

> Design system documentation for maintaining visual consistency across the Rubiklab platform.

---

## Typography

| Purpose | Font Family | Weight | Tailwind Class |
|---------|-------------|--------|----------------|
| **Headings & Logo** | Playfair Display | 700 (bold) | `font-serif` |
| **Body & UI Text** | Inter | 300-600 | `font-sans` |
| **Monospace/Data** | Roboto Mono | 400-500 | `font-mono` |

### Usage Guidelines

- **Logo**: Playfair Display, lowercase, bold (700), with pulsing LinkedIn blue dot
- **Dashboard Titles**: Playfair Display (e.g., "Strategic Intelligence", "Market Position")
- **Section Headers**: Inter, uppercase, letter-spacing: widest
- **Body Text**: Inter, 14px, leading relaxed
- **Data Labels**: Roboto Mono, uppercase, 10-11px

---

## Color Palette

### Primary Brand Colors

| Name | HSL Value | Hex (approx) | Usage |
|------|-----------|--------------|-------|
| **LinkedIn Blue** | `201 89% 48%` | `#0A66C2` | Primary actions, links, accents, logo dot |
| **Accent Purple** | `263 70% 58%` | `#8B5CF6` | Secondary highlights |
| **Accent Green** | `160 84% 39%` | `#10B981` | Success states |

### Dashboard Theme (Light)

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--background` | `0 0% 99%` | Page background |
| `--foreground` | `220 15% 15%` | Primary text |
| `--card` | `0 0% 100%` | Card backgrounds (white) |
| `--muted` | `220 14% 96%` | Secondary surfaces |
| `--muted-foreground` | `220 10% 45%` | Secondary text |
| `--border` | `220 14% 90%` | Card borders |
| `--primary` | `201 89% 48%` | LinkedIn Blue |

---

## Design Tokens

### Spacing & Sizing

| Token | Value | Usage |
|-------|-------|-------|
| Border Radius | `0.75rem` (12px) | Cards, buttons, inputs |
| Border Radius (sm) | `0.5rem` (8px) | Pills, small elements |
| Card Padding | `1.25rem - 1.5rem` | Standard card content |
| Section Gap | `2rem` | Between major sections |

### Shadows & Effects

- **Cards**: No drop shadows; use ultra-thin borders (`border-border/50`)
- **Glow Effects**: Reserved for logo dot and primary CTAs
- **Logo Dot**: LinkedIn blue pulsing glow effect

---

## Logo Specifications

### Primary Logo

```
Rubiklab•
```

### Logo Structure

| Element | Specification |
|---------|---------------|
| **Text "Rubiklab"** | |
| Font | Playfair Display |
| Weight | 700 (bold) |
| Case | lowercase |
| Letter Spacing | `tracking-tight` (-0.025em) |
| Size (Default) | `text-3xl` (30px) |
| Size (Small) | `text-2xl` (24px) |
| Color | `text-foreground` (adapts to theme) |
| Hover Color | `text-primary` (LinkedIn blue) |
| Transition | `duration-700` (0.7s) |
| **Dot "•"** | |
| Shape | Circle (rounded-full) |
| Size (Default) | `w-2.5 h-2.5` (10px) |
| Size (Small) | `w-2 h-2` (8px) |
| Color | `bg-primary` (LinkedIn blue: `hsl(201 89% 48%)`) |
| Glow | `shadow-[0_0_12px_hsl(var(--primary)/0.3)]` |
| Animation | Ping effect with `animate-ping` on outer ring |
| Ping Ring Size (Default) | `w-3 h-3` (12px) |
| Ping Ring Size (Small) | `w-2.5 h-2.5` (10px) |
| Ping Opacity | `opacity-20` |
| **Layout** | |
| Gap | `gap-1.5` (6px) between text and dot |
| Alignment | `items-center` (vertically centered) |

### Logo Component Reference

```tsx
const RubiklabLogo = ({ size = 'default' }: { size?: 'default' | 'small' }) => (
  <div className="flex items-center gap-1.5 group cursor-pointer">
    <span className={`font-serif font-bold tracking-tight text-foreground 
      transition-colors duration-700 group-hover:text-primary 
      ${size === 'small' ? 'text-2xl' : 'text-3xl'}`}>
      Rubiklab
    </span>
    <div className="relative flex items-center justify-center">
      <div className={`absolute bg-primary rounded-full animate-ping opacity-20 
        ${size === 'small' ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />
      <div className={`bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.3)] 
        ${size === 'small' ? 'w-2 h-2' : 'w-2.5 h-2.5'}`} />
    </div>
  </div>
);
```

---

## Report Component Guidelines

### Slide Structure
- Full-screen slides with consistent padding
- Grid backgrounds on dark divider slides
- Staggered content animations for engagement

### Data Visualization
- Use semantic colors for status indicators
- Counting number animations for metrics
- Pulsing badges for high-priority items

---

## Footer Branding

Always include the Rubiklab logo with blue dot in report footers:

```
Rubiklab.ai © 2026
```
