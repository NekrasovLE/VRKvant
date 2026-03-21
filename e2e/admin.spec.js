import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test('should load the admin page', async ({ page }) => {
    // Переходим в папку admin
    await page.goto('/admin/');
    
    // Проверяем заголовок страницы (из index.html)
    await expect(page).toHaveTitle(/Admin/);
    
    // Проверяем наличие скрипта Sveltia CMS в DOM
    const sveltiaScript = page.locator('script[src*="sveltia-cms"]');
    await expect(sveltiaScript).toBeAttached();
  });
});
