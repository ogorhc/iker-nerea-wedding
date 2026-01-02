# Theme Configuration Guide

This project uses a centralized color theme system that allows you to change all colors from a single location.

## How to Change Colors

### Option 1: Edit CSS Variables (Recommended)

Edit the color values in `app/globals.css`:

```css
:root {
  /* Primary colors */
  --background: #f8f9fa; /* Main background color */
  --foreground: #1a1a1a; /* Main text color */

  /* Secondary colors */
  --secondary: #6b7280; /* Secondary elements */
  --secondary-foreground: #ffffff;

  /* Accent colors */
  --accent: #6366f1; /* Accent/highlight color */
  --accent-foreground: #ffffff;

  /* Navigation colors */
  --nav-background: rgba(15, 23, 42, 0.8); /* Navigation bar background */
  --nav-border: #1e293b; /* Navigation border */
  --nav-text-active: #f1f5f9; /* Active nav link color */
  --nav-text-inactive: #94a3b8; /* Inactive nav link color */
  --nav-text-hover: #e2e8f0; /* Nav link hover color */

  /* Page content colors */
  --page-background: #e2e8f0; /* Page background */
  --page-text: #f1f5f9; /* Page text color */
  --page-text-primary: #0f172a; /* Primary heading color */
  --page-text-secondary: rgba(15, 23, 42, 0.5); /* Secondary text color */
}
```

### Option 2: Edit TypeScript Constants

Edit the values in `app/shared/constants/theme.ts` (for reference/documentation):

```typescript
export const THEME_COLORS = {
  background: '#f8f9fa',
  foreground: '#1a1a1a',
  // ... etc
};
```

## Available Custom Colors in Tailwind

After defining colors in `globals.css`, you can use them in your components:

### Background Colors

- `bg-background` - Main background
- `bg-secondary` - Secondary background
- `bg-accent` - Accent background
- `bg-page-background` - Page content background
- `bg-nav-background` - Navigation background

### Text Colors

- `text-foreground` - Main text
- `text-secondary-foreground` - Secondary text
- `text-accent-foreground` - Accent text
- `text-page-text` - Page text
- `text-page-text-primary` - Primary heading
- `text-page-text-secondary` - Secondary text
- `text-nav-text-active` - Active nav link
- `text-nav-text-inactive` - Inactive nav link
- `text-nav-text-hover` - Nav link hover

### Border Colors

- `border-nav-border` - Navigation border

### Font Families

- `font-primary` - Primary font (Geist Sans)
- `font-secondary` - Secondary font (Geist Mono)

## Example Usage

```tsx
// Background
<div className="bg-page-background">

// Text
<h1 className="text-page-text-primary font-primary">
<p className="text-page-text-secondary">

// Navigation
<nav className="bg-nav-background border-nav-border">
  <a className="text-nav-text-active">Active Link</a>
  <a className="text-nav-text-inactive hover:text-nav-text-hover">Link</a>
</nav>
```

## Dark Mode

Dark mode colors are defined in the `@media (prefers-color-scheme: dark)` section of `globals.css`. Update those values to customize dark mode appearance.

## Quick Color Change

To quickly change the entire theme:

1. Open `app/globals.css`
2. Find the `:root` section
3. Update the hex color values
4. Save the file
5. All components using these colors will update automatically!
