// tests/login-form.spec.ts
import { test, expect } from "@playwright/test";

// ログインフォームの動作テスト
test.describe("ログインフォーム", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.reload(); // ❗フォーム初期化を確実にする
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
    await page.getByTestId("accountId").fill("");
    await page.getByTestId("accountId").click();
    await page.keyboard.insertText("ABC123ABC456ABC"); // ❌小文字なし intentionally

    await page.getByTestId("email").fill("");
    await page.getByTestId("email").click();
    await page.keyboard.insertText("test@example.com"); // OK

    await page.getByTestId("password").fill("");
    await page.getByTestId("password").click();
    await page.keyboard.insertText("securepassword123"); // ❌大文字なし intentionally

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
    await page.getByTestId("accountId").fill(""); // 初期化
    await page.getByTestId("accountId").click(); // フォーカス
    await page.keyboard.insertText("ABCabc123456789"); // insertTextで入力

    await page.getByTestId("email").fill(""); // 初期化
    await page.getByTestId("email").click(); // フォーカス
    await page.keyboard.insertText("test@example.com"); // insertTextで入力

    await page.getByTestId("password").fill(""); // 初期化
    await page.getByTestId("password").click(); // フォーカス
    await page.keyboard.insertText("SecurePassword123"); // insertTextで入力

    await page.getByTestId("submit").click();

    // Safari/WebKitでは、submit直後にDOM反映が遅れるケースがあるため600msの猶予を与える
    await page.waitForTimeout(800); // Safariでバリデーションが遅延する場合の対策

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
