import { expect, test } from '@playwright/test';

test.describe('日報作成 (/diaries)', () => {
  test('未ログインのときはログインへ誘導される', async ({ page }) => {
    await page.goto('/diaries');
    await expect(page).toHaveURL(/\/login/);
  });

  test('ログイン後、必須入力して保存すると成功モーダルが出る（API はモック）', async ({
    page,
  }) => {
    const email = process.env.E2E_USER_EMAIL;
    const password = process.env.E2E_USER_PASSWORD;
    test.skip(!email || !password, 'E2E_USER_EMAIL / E2E_USER_PASSWORD を設定してください');

    await page.route('**/diaries', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true }),
        });
        return;
      }
      await route.continue();
    });

    await page.goto('/login');
    const loginBtn = page.getByRole('button', { name: 'ログイン' });
    await expect(loginBtn).toBeEnabled({ timeout: 30_000 });
    await page.getByPlaceholder('メールアドレス').fill(email!);
    await page.getByPlaceholder('パスワード').fill(password!);
    await loginBtn.click();

    await page.waitForURL(/\/(home|diaries)/, { timeout: 30_000 });

    await page.goto('/diaries');
    await expect(page.getByRole('heading', { name: '日報・ノート' })).toBeVisible();

    await page.getByPlaceholder('今日はどんな一日でしたか？').fill('E2E で入力した日報');
    await page.getByRole('button', { name: '記録を保存' }).click();

    await expect(page.getByRole('heading', { name: 'ご苦労様でした！' })).toBeVisible({
      timeout: 15_000,
    });
  });
});
