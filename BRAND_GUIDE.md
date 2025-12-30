# Mondro Brand Guide

> Design system documentation for maintaining visual consistency across the Mondro platform.

---

## Typography

| Purpose | Font Family | Weight | Tailwind Class |
|---------|-------------|--------|----------------|
| **Headings & Logo** | Playfair Display | 700 (bold) | `font-serif` |
| **Body & UI Text** | Inter | 300-600 | `font-sans` |
| **Monospace/Data** | Roboto Mono | 400-500 | `font-mono` |

### Usage Guidelines

- **Logo**: Playfair Display, lowercase, bold (700), with pulsing dot
- **Dashboard Titles**: Playfair Display (e.g., "Meridian West", "Market Position")
- **Section Headers**: Inter, uppercase, letter-spacing: widest
- **Body Text**: Inter, 14px, leading relaxed
- **Data Labels**: Roboto Mono, uppercase, 10-11px

---

## Color Palette

### Primary Brand Colors

| Name | HSL Value | Hex (approx) | Usage |
|------|-----------|--------------|-------|
| **Brand Blue** | `200 100% 45%` | `#0099CC` | Primary actions, links, accents |
| **Accent Purple** | `263 70% 58%` | `#8B5CF6` | Secondary highlights |
| **Accent Pink** | `330 79% 58%` | `#EC4899` | Tertiary accents |
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
| `--primary` | `200 100% 45%` | Brand blue |

### Landing Page Theme (Dark)

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--background` | `240 12% 6%` | Dark background |
| `--foreground` | `0 0% 95%` | Light text |
| `--card` | `240 10% 9%` | Dark card surfaces |
| `--muted` | `240 6% 18%` | Muted surfaces |
| `--muted-foreground` | `0 0% 60%` | Secondary text |
| `--border` | `240 6% 18%` | Subtle borders |

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
- **Glass Morphism**: Landing page only (`backdrop-filter: blur(20px)`)

---

## Logo Specifications

### Primary Logo

```
mondro•
```

### Logo Structure

| Element | Specification |
|---------|---------------|
| **Text "mondro"** | |
| Font | Playfair Display |
| Weight | 700 (bold) |
| Case | lowercase |
| Letter Spacing | `tracking-tight` (-0.025em) |
| Size (Default) | `text-3xl` (30px) |
| Size (Small) | `text-2xl` (24px) |
| Color | `text-foreground` (adapts to theme) |
| Hover Color | `text-primary` (brand blue) |
| Transition | `duration-700` (0.7s) |
| **Dot "•"** | |
| Shape | Circle (rounded-full) |
| Size (Default) | `w-2.5 h-2.5` (10px) |
| Size (Small) | `w-2 h-2` (8px) |
| Color | `bg-primary` (brand blue: `hsl(200 100% 45%)`) |
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
const EvolvedLogo = ({ size = 'default' }: { size?: 'default' | 'small' }) => (
  <Link to="/" className="flex items-center gap-1.5 group cursor-pointer">
    <span className={`font-serif font-bold tracking-tight text-foreground 
      transition-colors duration-700 group-hover:text-primary 
      ${size === 'small' ? 'text-2xl' : 'text-3xl'}`}>
      mondro
    </span>
    <div className="relative flex items-center justify-center">
      <div className={`absolute bg-primary rounded-full animate-ping opacity-20 
        ${size === 'small' ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />
      <div className={`bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.3)] 
        ${size === 'small' ? 'w-2 h-2' : 'w-2.5 h-2.5'}`} />
    </div>
  </Link>
);
```

---

## Component Patterns

### Cards

```
Background: white (#FFFFFF)
Border: 1px solid hsl(220 14% 90% / 0.5)
Border Radius: 0.75rem
Padding: 1.25rem - 2rem
```

### Section Headers

```
Font: Inter
Size: 10-11px
Weight: 600 (semibold)
Color: Primary blue
Transform: uppercase
Letter Spacing: 0.1em (widest)
```

### Metric Displays

```
Label: Muted foreground, uppercase, 10px, tracking-widest
Value: Playfair Display, 48-60px, normal weight
```

### Pills/Badges

```
Background: Transparent or foreground (inverted)
Border: 1px solid border color
Font: Roboto Mono, 10px, uppercase
Padding: 0.625rem 0.75rem
Border Radius: 0.375rem
```

---

## Animation Guidelines

### Allowed Interactions

✅ Color transitions (0.3s ease)
✅ Box-shadow glows
✅ Opacity changes
✅ Border color transitions

### Prohibited Interactions

❌ Scale transforms on hover (causes shakiness)
❌ TranslateY hover effects
❌ Aggressive motion animations

### Standard Timing

| Animation | Duration | Easing |
|-----------|----------|--------|
| Color transitions | 0.3s | ease |
| Fade in/out | 0.3s | ease-out |
| Stagger delay | 0.1s per item | - |

---

## Navigation Structure

### Dashboard Sidebar

| Item | Icon | ID |
|------|------|----|
| Positioning | Crosshair | `positioning` |
| AI Consultant | Bot | `ai-consultant` |
| Competitor Intel | Radar | `competitor-intel` |
| Visibility | Search | `visibility` |
| Trust | Shield | `trust` |
| Friction | Hand | `friction` |
| Technical | Wrench | `technical` |
| Reports | BarChart3 | `reports` |
| Settings | Settings2 | `settings` |
| Projects | Layers | `projects` |

---

## File Structure

```
src/
├── index.css          # Design tokens & theme variables
├── tailwind.config.ts # Tailwind extensions
├── components/
│   ├── ui/            # Shadcn components
│   └── dashboard/     # Dashboard-specific components
└── pages/
    ├── Index.tsx      # Landing page (dark theme)
    └── Dashboard.tsx  # Dashboard (light theme)
```

---

## Quick Reference

### Tailwind Classes

```tsx
// Headings
className="font-serif text-lg font-semibold tracking-tight"

// Section labels
className="text-xs font-semibold text-primary uppercase tracking-widest"

// Body text
className="text-sm text-muted-foreground leading-relaxed"

// Cards
className="rounded-xl border border-border/50 bg-white p-6"

// Monospace data
className="font-mono text-[10px] uppercase tracking-wide"
```

---

*Last updated: December 2024*
