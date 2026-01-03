# Iker Eta Nerea Wedding

A wedding website built with Astro, React, and TypeScript.

## Features

- 🌍 **Internationalization**: Spanish (es) and Euskera (eus) support
- 🎨 **Custom Theme**: Centralized color system with Tailwind CSS
- 🎭 **3D Background**: React Three Fiber animated foggy background
- 📱 **Responsive Design**: Mobile-first approach
- ⚡ **Fast**: Static site generation with Astro

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:4321` to see your site.

### Build

```bash
npm run build
```

This creates a `dist/` directory with your static site.

### Preview

```bash
npm run preview
```

Preview your production build locally.

## Project Structure

```
src/
  components/
    react/          # React components (client-side)
  layouts/          # Astro layouts
  pages/            # Astro pages (file-based routing)
  i18n/             # Internationalization config
  constants/        # Constants
  utils/            # Utilities
  styles/           # Global styles
messages/           # Translation JSON files
public/             # Static assets
```

## Internationalization

The site supports two locales:
- Spanish (es) - default
- Euskera (eus)

Routes are prefixed with locale: `/es`, `/eus`

## Styling

Colors and theme can be customized in `src/styles/globals.css`. See `THEME.md` for details.

## Deployment

This project is configured for static site generation and can be deployed to:
- Cloudflare Pages
- Netlify
- Vercel
- Any static hosting service

## Tech Stack

- [Astro](https://astro.build) - Web framework
- [React](https://react.dev) - UI library
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - 3D graphics
- [Three.js](https://threejs.org) - 3D library

## License

Private project
