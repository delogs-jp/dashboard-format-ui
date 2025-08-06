// tests/login-form.spec.ts
import { test, expect } from "@playwright/test";

// ログインフォームの動作テスト
test.describe("ログインフォーム", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("フォームの初期状態", async ({ page }) => {
    await expect(page.getByTestId("accountId")).toBeEmpty();
    await expect(page.getByTestId("email")).toBeEmpty();
    await expect(page.getByTestId("password")).toBeEmpty();
    await expect(page.getByTestId("submit")).toBeEnabled();
  });

  test("バリデーションメッセージの表示（未入力）", async ({ page }) => {
    await page.getByTestId("submit").click();

    await Promise.all([
      expect(page.getByTestId("accountId-error")).toBeVisible({
        timeout: 10000,
      }),
      expect(page.getByTestId("email-error")).toBeVisible({ timeout: 10000 }),
      expect(page.getByTestId("password-error")).toBeVisible({
        timeout: 10000,
      }),
    ]);
  });

  test("バリデーションメッセージの表示（形式エラー）", async ({ page }) => {
    await page.getByTestId("accountId").fill("ABC123ABC456ABC"); // 小文字なし
    await page.getByTestId("email").fill("test@example.com"); // OK
    await page.getByTestId("password").fill("securepassword123"); // 大文字なし

    await page.getByTestId("submit").click();

    await Promise.all([
      expect(page.getByTestId("accountId-error")).toBeVisible({
        timeout: 10000,
      }),
      expect(page.getByTestId("password-error")).toBeVisible({
        timeout: 10000,
      }),
    ]);
  });

  test("有効なデータでフォーム送信", async ({ page }) => {
    await page.getByTestId("accountId").fill("CorpUserAccount123");
    await page.getByTestId("email").fill("test@example.com");
    await page.getByTestId("password").fill("SecurePassword123");

    await page.getByTestId("submit").click();
    // Safari/WebKitでは、submit直後にDOM反映が遅れるケースがあるため600msの猶予を与える
    await page.waitForTimeout(600); // Safariでバリデーションが遅延する場合の対策

    await Promise.all([
      expect(page.getByTestId("accountId-error")).not.toBeVisible({
        timeout: 10000,
      }),
      expect(page.getByTestId("email-error")).not.toBeVisible({
        timeout: 10000,
      }),
      expect(page.getByTestId("password-error")).not.toBeVisible({
        timeout: 10000,
      }),
    ]);

    // 実際のAPI連携が未実装なので、ここではconsoleの確認やモック処理を想定
    await expect(page).not.toHaveURL(/error/);
  });
});
