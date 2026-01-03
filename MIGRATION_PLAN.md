# Migration Plan: Next.js → Astro + React + TypeScript

## Overview
This document outlines the migration from Next.js to Astro with React and TypeScript support.

## Key Changes

### 1. Framework
- **From**: Next.js 15 (App Router)
- **To**: Astro 4+ with React integration

### 2. i18n
- **From**: next-intl
- **To**: Astro's built-in i18n routing + custom translation system

### 3. Routing
- **From**: Next.js App Router with `[locale]` dynamic segments
- **To**: Astro file-based routing with i18n support

### 4. Components
- React components need `client:load` or `client:only` directives
- Server components become Astro components (`.astro` files)

## Migration Steps

### Phase 1: Setup ✅
- [x] Create `astro.config.mjs`
- [ ] Update `package.json` dependencies
- [ ] Create Astro directory structure

### Phase 2: Configuration
- [ ] Set up i18n translations system
- [ ] Migrate Tailwind CSS
- [ ] Update TypeScript config

### Phase 3: Components
- [ ] Migrate React components (mark as client components)
- [ ] Convert layouts to Astro components
- [ ] Update R3F components

### Phase 4: Pages
- [ ] Create Astro pages with locale routing
- [ ] Migrate page content
- [ ] Update navigation

### Phase 5: Cleanup
- [ ] Remove Next.js specific files
- [ ] Update build scripts
- [ ] Test all functionality

## File Structure Changes

### Before (Next.js)
```
app/
  [locale]/
    layout.tsx
    page.tsx
    media/page.tsx
    rsvp/page.tsx
  components/
  shared/
```

### After (Astro)
```
src/
  layouts/
    Layout.astro
  pages/
    index.astro (redirects to /es)
    [locale]/
      index.astro
      media.astro
      rsvp.astro
  components/
    react/ (React components)
    astro/ (Astro components)
  locales/
    es.json
    eus.json
```

## Important Notes

1. **React Components**: Must use `client:load` or `client:only` directives
2. **R3F Components**: Need `client:only="react"` directive
3. **i18n**: Astro has built-in i18n routing, but we'll use a custom translation hook
4. **Styling**: Tailwind works the same way
5. **Build**: Astro generates static files by default (perfect for Cloudflare Pages)

