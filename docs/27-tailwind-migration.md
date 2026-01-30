# Tailwind CSS Migration

Laju framework provides a migration script to facilitate transitions between Tailwind CSS v3 and v4.

## Quick Reference

```bash
# Check current version
npm run tailwind:migrate check

# Upgrade to Tailwind CSS v4 (automatically runs npm install)
npm run tailwind:migrate to-v4

# Downgrade to Tailwind CSS v3 (automatically runs npm install)
npm run tailwind:migrate to-v3
```

**Note:** The migration script automatically runs `npm install` after updating configuration files. No manual installation is required.

## Overview

The migration script allows you to:
- Upgrade from Tailwind CSS v3 to v4
- Downgrade from Tailwind CSS v4 to v3
- Check the current Tailwind CSS version

## Installation

The migration script is available at `commands/native/TailwindMigrate.ts` and can be accessed via npm script:

```bash
npm run tailwind:migrate <action>
```

## Usage

### Check Current Version

To check the current Tailwind CSS version:

```bash
npm run tailwind:migrate check
```

Output example:
```
📦 Current Tailwind CSS Version:
─────────────────────────────────
Version: ^3.4.17
Status: Tailwind CSS v3 (JS config)
```

### Upgrade to Tailwind CSS v4

To upgrade from Tailwind CSS v3 to v4:

```bash
npm run tailwind:migrate to-v4
```

**What the script does:**

1. Update `package.json`:
   - Change `tailwindcss` to `^4.0.0`
   - Add `@tailwindcss/vite` to devDependencies

2. Remove `postcss.config.mjs` (not needed in v4)

3. Update `resources/js/index.css`:
   - Change from `@tailwind` directives to `@import "tailwindcss"`
   - Add `@theme` directive for configuration

4. Backup `tailwind.config.js` as `tailwind.config.js.backup`

5. Update `vite.config.mjs`:
   - Add `import tailwindcss from '@tailwindcss/vite'`
   - Add `tailwindcss()` to plugins array

6. **Automatically run `npm install`** to install/update dependencies

**After migration:** Start the dev server with `npm run dev` to test the changes.

**Differences between v3 and v4:**

- **v3**: Uses JavaScript config (`tailwind.config.js`) + PostCSS
- **v4**: Uses CSS-first config (`@theme` directive) + Vite plugin

### Downgrade to Tailwind CSS v3

To downgrade from Tailwind CSS v4 to v3:

```bash
npm run tailwind:migrate to-v3
```

**What the script does:**

1. Update `package.json`:
   - Change `tailwindcss` to `^3.4.17`
   - Add `autoprefixer` to devDependencies

2. Create `tailwind.config.js` with v3 configuration

3. Create `postcss.config.mjs` with `tailwindcss` and `autoprefixer`

4. Update `resources/js/index.css`:
   - Change from `@import "tailwindcss"` to `@tailwind` directives
   - Remove `@theme` directive

5. Revert `vite.config.mjs`:
   - Remove `@tailwindcss/vite` import
   - Remove `tailwindcss()` plugin from plugins array

6. **Automatically run `npm install`** to install/update dependencies

**After migration:** Start the dev server with `npm run dev` to test the changes.

## Tailwind CSS v4 Configuration

In Tailwind CSS v4, configuration is done through CSS using the `@theme` directive:

```css
@import "tailwindcss";

@theme {
  --font-family-sans: 'Inter', sans-serif;
  --font-family-mono: 'Fira Code', monospace;

  --color-brand-400: #fb923c;
  --color-brand-500: #f97316;
  --color-brand-600: #ea580c;

  --shadow-soft: 0 2px 15px -3px rgba(0, 0, 0, 0.07);

  --animate-blob: blob 7s infinite;
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
```

## Tailwind CSS v3 Configuration

In Tailwind CSS v3, configuration is done through JavaScript:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.{svelte,html,js,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

## Which Version to Use?

### Tailwind CSS v3 (Stable)
- ✅ Proven and stable
- ✅ Compatible with all plugins
- ✅ Complete documentation
- ✅ Large community support

### Tailwind CSS v4 (Latest)
- ✅ CSS-first configuration (more modern)
- ✅ Better performance
- ✅ Faster build times
- ⚠️ Limited plugin compatibility
- ⚠️ Still in development

**Recommendation:** Use v3 for production, v4 for development/experimentation.

## Troubleshooting

### Port Already in Use

If you get error "Vite Port 5134 is already in use":

```bash
# Kill process on port 5134
lsof -ti:5134 | xargs kill -9

# Or use a different port
VITE_PORT=3000 npm run dev
```

### Styling Not Working

If styling doesn't appear after migration:

1. Check Tailwind CSS version:
   ```bash
   npm run tailwind:migrate check
   ```

2. Make sure dev server is running:
   ```bash
   npm run dev
   ```

3. Clear cache and restart:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

### Plugin Not Found

If you get error "Cannot find module '@tailwindcss/vite'":

```bash
# Install plugin manually
npm install -D @tailwindcss/vite
```

## Migration Best Practices

1. **Backup before migration**: The script automatically backs up config, but manual backup is still recommended
2. **Test in development**: Always test migration in development environment first
3. **Review changes**: After migration, review all changes made
4. **Update dependencies**: Ensure all dependencies are compatible with the Tailwind version being used
5. **Document custom config**: If you have custom config, document it before migration

## See Also

- [Tailwind CSS v3 Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [Vite Configuration](./05-FRONTEND-SVELTE.md#vite-configuration)
