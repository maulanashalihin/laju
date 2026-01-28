# E2E Testing with Playwright

E2E (End-to-End) testing dengan Playwright untuk testing flow user di browser nyata.

## Setup

```bash
# Install browsers (hanya perlu sekali)
npm run test:e2e:install

# Atau install browser spesifik
npx playwright install chromium    # Chrome
npx playwright install firefox     # Firefox
npx playwright install webkit      # Safari
```

## Menjalankan E2E Tests

**Untuk Local Development:**
```bash
# Terminal 1: Start server dulu
npm run dev

# Terminal 2: Run E2E tests
npm run test:e2e

# Atau dengan UI mode (recommended untuk debugging)
npm run test:e2e:ui

# Atau dengan debug mode (step-by-step)
npm run test:e2e:debug

# Atau dengan headed mode (lihat browser saat test berjalan)
npx playwright test --headed

# Run test spesifik
npx playwright test homepage.spec.ts

# Run di browser spesifik
npx playwright test --project=chromium

# Run test spesifik dengan headed mode
npx playwright test homepage.spec.ts --headed
```

## Struktur Test

```
tests/e2e/
├── homepage.spec.ts       # Test homepage
├── auth.spec.ts           # Test authentication flow
├── forms.spec.ts          # Test form validation
└── README.md              # Documentation ini
```

## Contoh Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/dashboard');
    expect(page.url()).toContain('/dashboard');
  });
});
```

## Best Practices

1. **Test Critical Flows** - Fokus pada user flow penting (login, checkout, dll)
2. **Use Selectors Properly** - Prefer accessibility-friendly selectors:
   - `page.getByRole('button', { name: 'Submit' })`
   - `page.getByText('Login')`
   - `page.locator('input[name="email"]')`

3. **Wait Properly** - Gunakan auto-waiting features:
   - `await page.waitForURL('**/dashboard')`
   - `await expect(element).toBeVisible()`

4. **Avoid Flaky Tests** - Jangan menggunakan hard-coded delays:
   - ❌ `await page.waitForTimeout(5000)`
   - ✅ `await page.waitForSelector('.loaded')`

5. **Test Real Scenarios** - Test seperti user nyata:
   - Valid input
   - Invalid input
   - Error cases
   - Edge cases

## Debugging

```bash
# Run dengan UI mode
npm run test:e2e:ui

# Run dengan debug mode (step-by-step)
npm run test:e2e:debug

# Run dengan headed mode (lihat browser)
npx playwright test --headed

# Generate test report
npx playwright show-report
```

## CI/CD Integration

E2E tests otomatis dijalankan di GitHub Actions CI:
- Dijalankan setelah unit + integration tests
- Testing di 3 browser: Chromium, Firefox, WebKit
- Auto-screenshot dan video jika test fail
- Deployment hanya proceeds jika semua tests pass

## Troubleshooting

**Browser not installed:**
```bash
npm run test:e2e:install
```

**Port already in use:**
- Matikan server yang running di port 3000
- Atau ubah port di `playwright.config.ts`

**Tests timeout:**
- Cek server apakah running
- Cek baseURL di `playwright.config.ts`
- Tambah timeout di test: `test.setTimeout(60000)`
