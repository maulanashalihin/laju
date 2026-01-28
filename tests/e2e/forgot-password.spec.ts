/**
 * E2E Test: Forgot Password Flow
 * Testing password reset request functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Forgot Password', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password');
  });

  test('should display forgot password form', async ({ page }) => {
    // Check page title
    const title = await page.title();
    expect(title).toBeTruthy();

    // Check for email input
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Check for submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveText('Send reset link');
  });

  test('should show required field validation', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    // Try to submit without filling email
    await submitButton.click();

    // Browser should show required validation
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('required');
  });

  test('should disable submit button during submission', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    // Fill with valid email
    await page.fill('input[name="email"]', 'test@example.com');

    // Submit form
    await submitButton.click();

    // Button should be disabled during submission
    await expect(submitButton).toBeDisabled();

    // Check for loading text
    await expect(submitButton).toContainText('Sending');
  });

  test('should have link to login page', async ({ page }) => {
    // Use text-based selector for Inertia links
    const loginLink = page.getByText('Back to login').or(page.locator('a[href="/login"]'));
    await expect(loginLink.first()).toBeVisible();
  });

  test('should accept valid email format', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    // Fill with valid email
    await page.fill('input[name="email"]', 'user@example.com');

    // Submit form - should attempt submission
    await submitButton.click();

    // Button should be disabled indicating submission started
    await expect(submitButton).toBeDisabled();
  });

  test('should preserve email value', async ({ page }) => {
    // Fill email field
    await page.fill('input[name="email"]', 'test@example.com');

    // Check value is preserved
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('should navigate to login page', async ({ page }) => {
    // Use text-based selector for Inertia links
    const loginLink = page.getByText('Back to login');

    // Click login link
    await loginLink.click();

    // Should navigate to login page
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });
});
