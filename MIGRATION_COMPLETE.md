# Migration Complete: Next.js → Astro

## ✅ Migration Summary

Your application has been successfully migrated from Next.js to Astro with React and TypeScript support.

## 📁 New Structure

```
src/
  components/
    react/          # React components (client-side)
      Navigation.tsx
      LanguageSwitch.tsx
      FoggyBackground.tsx
      PageContent.tsx
  layouts/
    Layout.astro    # Main layout
  pages/
    index.astro     # Redirects to /es
    [locale]/
      index.astro   # Home page
      media.astro   # Media page
      rsvp.astro    # RSVP page
  i18n/
    config.ts       # Locale configuration
    translations.ts # Translation utilities
  constants/
    routes.ts       # Route constants
  utils/
    useTranslation.ts # React translation hook
    routing.ts      # Routing utilities
  styles/
    globals.css     # Global styles
messages/           # Translation JSON files (kept from Next.js)
public/             # Static assets (kept from Next.js)
```

## 🚀 Next Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 🔄 Key Changes

### Routing
- **Before**: Next.js App Router with `[locale]` dynamic segments
- **After**: Astro file-based routing with `[locale]` in pages directory

### Components
- **Before**: Server Components by default, `'use client'` for client components
- **After**: Astro components by default, `client:load` or `client:only` for React components

### i18n
- **Before**: `next-intl` with middleware
- **After**: Custom translation system with Astro's file-based routing

### Navigation
- **Before**: Next.js `Link` and `useRouter`
- **After**: Regular `<a>` tags (Astro handles routing automatically)

## 📝 Important Notes

1. **React Components**: All React components are in `src/components/react/` and use `client:load` or `client:only` directives
2. **R3F Components**: `FoggyBackground` uses `client:only="react"` for React Three Fiber
3. **Translations**: Translation files remain in `messages/` directory
4. **Styling**: Tailwind CSS configuration is preserved
5. **Fonts**: Geist fonts are loaded via Google Fonts in the layout

## 🗑️ Files to Remove (Optional)

After confirming everything works, you can remove:
- `app/` directory (old Next.js structure)
- `next.config.ts`
- `middleware.ts`
- `i18n.ts` (Next.js specific)
- `next-env.d.ts`
- `.next/` directory (if exists)

## 🐛 Troubleshooting

### If you see import errors:
- Make sure all React components have proper `client:` directives
- Check that paths use `@/` alias correctly

### If translations don't work:
- Verify `messages/es.json` and `messages/eus.json` exist
- Check that locale is being passed correctly to components

### If R3F doesn't work:
- Ensure `FoggyBackground` uses `client:only="react"`
- Check that Three.js is properly bundled (configured in `astro.config.mjs`)

## 📚 Resources

- [Astro Documentation](https://docs.astro.build)
- [Astro + React](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Astro Routing](https://docs.astro.build/en/core-concepts/routing/)

