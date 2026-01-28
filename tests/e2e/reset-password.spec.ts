/**
 * E2E Test: Reset Password Flow
 * Testing password reset functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Reset Password', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reset-password?token=test-token');
  });

  test('should display reset password form', async ({ page }) => {
    // Check page title
    const title = await page.title();
    expect(title).toBeTruthy();

    // Check for password fields
    const passwordInput = page.locator('input[name="password"]');
    const confirmPasswordInput = page.locator('input[name="confirm-password"]');

    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(confirmPasswordInput).toBeVisible();
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Check for submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveText('Reset password');
  });

  test('should have password input type', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    const toggleButton = passwordInput.locator('xpath=../button');

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button
    await toggleButton.click();

    // Password should now be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should show password mismatch error', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    const confirmPasswordInput = page.locator('input[name="confirm-password"]');
    const submitButton = page.locator('button[type="submit"]');

    // Fill with mismatched passwords
    await passwordInput.fill('password123');
    await confirmPasswordInput.fill('different123');

    // Submit form
    await submitButton.click();

    // Check for password mismatch error
    const errorText = page.locator('.text-red-400');
    await expect(errorText.first()).toBeVisible();
    await expect(errorText.first()).toContainText('do not match');
  });

  test('should show required field validation', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    // Try to submit without filling fields
    await submitButton.click();

    // Browser should show required validation
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('should disable submit button during submission', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    // Fill form with valid data
    await page.fill('input[name="password"]', 'NewPassword123!');
    await page.fill('input[name="confirm-password"]', 'NewPassword123!');

    // Submit form
    await submitButton.click();

    // Button should be disabled during submission
    await expect(submitButton).toBeDisabled();

    // Check for loading text
    await expect(submitButton).toContainText('Resetting');
  });

  test('should accept valid form data', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    // Fill all fields correctly
    await page.fill('input[name="password"]', 'ValidPass123!');
    await page.fill('input[name="confirm-password"]', 'ValidPass123!');

    // Submit form
    await submitButton.click();

    // Form should submit (either success or server error)
    // Button should be disabled indicating submission started
    await expect(submitButton).toBeDisabled();
  });

  test('should preserve input values', async ({ page }) => {
    // Fill password field
    await page.fill('input[name="password"]', 'password123');

    // Check value is preserved
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toHaveValue('password123');
  });
});
