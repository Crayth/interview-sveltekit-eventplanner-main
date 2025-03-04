import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
});

test('navigate to event creation page', async ({ page }) => {
    await page.goto('/');
    await page.click('#add-event');
    await expect(page).toHaveURL('/event/new');
    await expect(page.locator('#add-event-title')).toHaveText('Add Event');
});

test('submit event form with past date', async ({ page }) => {
    await page.goto('/event/new');
    await page.fill('#title', 'Test Event');
    await page.fill('#date', '2020-01-01T10:00');
    await page.click('#submit-button');
    await expect(page.locator('#form-error')).toHaveText('The date is in the past');
});

test('submit event form successfully', async ({ page }) => {
    await page.goto('/event/new');
    await page.fill('#title', 'Test Event');
    await page.fill('#description', 'This is a test event.');
    await page.fill('#date', '2025-03-10T10:00');
    await page.click('#submit-button');
    await expect(page).toHaveURL('/1'); // only works if the data file is empty on run
});