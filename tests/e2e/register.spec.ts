/**
 * E2E Test: Registration Form
 * Testing registration form interactions and validation
 */

import { test, expect } from '@playwright/test';

test.describe('Registration Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display registration form', async ({ page }) => {
    // Check page title
    const title = await page.title();
    expect(title).toBeTruthy();

    // Check for all required fields
    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const confirmPasswordInput = page.locator('input[name="confirm-password"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(confirmPasswordInput).toBeVisible();

    // Check for submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveText('Create account');
  });

  test('should have proper email input type', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('type', 'email');
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
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
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
    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');

    // Check that inputs have required attribute
    await expect(nameInput).toHaveAttribute('required');
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('should disable submit button during submission', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    // Fill form with valid data
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirm-password"]', 'password123');

    // Submit form
    await submitButton.click();

    // Button should be disabled during submission (now has 500ms delay)
    await expect(submitButton).toBeDisabled();

    // Check for loading text
    await expect(submitButton).toContainText('Creating account');
  });

  test('should have link to login page', async ({ page }) => {
    // Use text-based selector for Inertia links
    const loginLink = page.getByText('Sign in').or(page.locator('a[href="/login"]'));
    await expect(loginLink.first()).toBeVisible();
  });

  test('should have Google sign up button', async ({ page }) => {
    // Use text-based selector for consistency
    const googleButton = page.getByText('Sign up with Google').or(page.locator('a[href="/google/redirect"]'));
    await expect(googleButton.first()).toBeVisible();
  });

  test('should show generate password button', async ({ page }) => {
    const generateButton = page.locator('button:has-text("Generate secure password")');
    await expect(generateButton).toBeVisible();

    const passwordInput = page.locator('input[name="password"]');
    const confirmPasswordInput = page.locator('input[name="confirm-password"]');

    // Click generate button
    await generateButton.click();

    // Password fields should be filled
    const passwordValue = await passwordInput.inputValue();
    const confirmValue = await confirmPasswordInput.inputValue();

    expect(passwordValue.length).toBeGreaterThan(0);
    expect(confirmValue).toBe(passwordValue);
  });

  test('should accept valid form data', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    // Fill all fields correctly
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'ValidPass123!');
    await page.fill('input[name="confirm-password"]', 'ValidPass123!');

    // Submit form
    await submitButton.click();

    // Form should submit (either success or server error, but no client validation)
    // Button should be disabled indicating submission started (now has 500ms delay)
    await expect(submitButton).toBeDisabled();
  });

  test('should preserve input values', async ({ page }) => {
    // Fill name field
    await page.fill('input[name="name"]', 'Test User');

    // Check value is preserved
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toHaveValue('Test User');
  });
});
