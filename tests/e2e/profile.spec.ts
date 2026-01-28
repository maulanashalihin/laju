/**
 * E2E Test: Profile Management
 * Testing profile update and password change functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to profile page (requires authentication)
    await page.goto('/profile');
  });

  test('should display profile form', async ({ page }) => {
    // Check for name input
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();

    // Check for email input
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Check for phone input
    const phoneInput = page.locator('input[name="phone"]');
    await expect(phoneInput).toBeVisible();

    // Check for update button
    const updateButton = page.getByText('Update profile').or(page.locator('button:has-text("Update profile")'));
    await expect(updateButton.first()).toBeVisible();
  });

  test('should display avatar upload section', async ({ page }) => {
    // Check for avatar display
    const avatarImage = page.locator('img[alt*="avatar"]');
    await expect(avatarImage.first()).toBeVisible();

    // Check for file input
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
  });

  test('should display password change section', async ({ page }) => {
    // Check for current password input
    const currentPasswordInput = page.locator('input[name="current_password"]');
    await expect(currentPasswordInput).toBeVisible();
    await expect(currentPasswordInput).toHaveAttribute('type', 'password');

    // Check for new password input
    const newPasswordInput = page.locator('input[name="new_password"]');
    await expect(newPasswordInput).toBeVisible();
    await expect(newPasswordInput).toHaveAttribute('type', 'password');

    // Check for confirm password input
    const confirmPasswordInput = page.locator('input[name="confirm_password"]');
    await expect(confirmPasswordInput).toBeVisible();
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Check for change password button
    const changePasswordButton = page.getByText('Change password').or(page.locator('button:has-text("Change password")'));
    await expect(changePasswordButton.first()).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const newPasswordInput = page.locator('input[name="new_password"]');
    const toggleButton = newPasswordInput.locator('xpath=../button');

    // Initially password should be hidden
    await expect(newPasswordInput).toHaveAttribute('type', 'password');

    // Click toggle button
    await toggleButton.click();

    // Password should now be visible
    await expect(newPasswordInput).toHaveAttribute('type', 'text');

    // Click again to hide
    await toggleButton.click();
    await expect(newPasswordInput).toHaveAttribute('type', 'password');
  });

  test('should show password mismatch error', async ({ page }) => {
    const newPasswordInput = page.locator('input[name="new_password"]');
    const confirmPasswordInput = page.locator('input[name="confirm_password"]');
    const changePasswordButton = page.getByText('Change password').or(page.locator('button:has-text("Change password")'));

    // Fill with mismatched passwords
    await page.fill('input[name="current_password"]', 'oldpassword123');
    await newPasswordInput.fill('newpassword123');
    await confirmPasswordInput.fill('different123');

    // Submit form
    await changePasswordButton.click();

    // Check for password mismatch error
    const errorText = page.locator('.text-red-400');
    await expect(errorText.first()).toBeVisible();
    await expect(errorText.first()).toContainText('do not match');
  });

  test('should disable update button during submission', async ({ page }) => {
    const updateButton = page.getByText('Update profile').or(page.locator('button:has-text("Update profile")'));

    // Fill form with valid data
    await page.fill('input[name="name"]', 'Updated Name');
    await page.fill('input[name="email"]', 'updated@example.com');
    await page.fill('input[name="phone"]', '+628123456789');

    // Submit form
    await updateButton.click();

    // Button should be disabled during submission
    await expect(updateButton.first()).toBeDisabled();
  });

  test('should disable change password button during submission', async ({ page }) => {
    const changePasswordButton = page.getByText('Change password').or(page.locator('button:has-text("Change password")'));

    // Fill form with valid data
    await page.fill('input[name="current_password"]', 'oldpassword123');
    await page.fill('input[name="new_password"]', 'NewPassword123!');
    await page.fill('input[name="confirm_password"]', 'NewPassword123!');

    // Submit form
    await changePasswordButton.click();

    // Button should be disabled during submission
    await expect(changePasswordButton.first()).toBeDisabled();
  });

  test('should preserve input values', async ({ page }) => {
    // Fill name field
    await page.fill('input[name="name"]', 'Test User');

    // Check value is preserved
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toHaveValue('Test User');
  });

  test('should have logout button', async ({ page }) => {
    // Check for logout button
    const logoutButton = page.getByText('Logout').or(page.locator('button:has-text("Logout")'));
    await expect(logoutButton.first()).toBeVisible();
  });
});
