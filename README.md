# 管理画面フォーマット制作編 #8 ログイン後404ページ + ログイン前のパスワード忘れ導線UIのDemo

[![DELOGs 記事へ](https://img.shields.io/badge/DELOGs-記事はこちら-1e90ff?logo=githubpages)](https://delogs.jp/next-js/shadcn-ui/format-404-password-forgot)

記事「[管理画面フォーマット制作編 #8 ログイン後404ページ + ログイン前のパスワード忘れ導線UI](https://delogs.jp/next-js/shadcn-ui/format-404-password-forgot)」の実践結果のリポジトリです。

## 📦 Tech Stack

| Tool / Lib          | Version | Purpose                                                              |
| ------------------- | :-----: | -------------------------------------------------------------------- |
| **React**           |  19.x   | UIの土台。コンポーネント/フックで状態と表示を組み立てる              |
| **Next.js**         |  15.x   | フルスタックFW。App Router/SSR/SSG、動的ルーティング、メタデータ管理 |
| **TypeScript**      |   5.x   | 型安全・補完・リファクタリング                                       |
| **shadcn/ui**       | latest  | RadixベースのUIキット                                                |
| **Tailwind CSS**    |   4.x   | ユーティリティファーストCSSで素早くスタイリング                      |
| **Zod**             |   4.x   | スキーマ定義と実行時バリデーション                                   |
| **Playwright Test** | 1.54.x  | E2E テスト                                                           |
| **GitHub Actions**  |    —    | CI / HTML レポート保存                                               |

---

## 🚀 クイックスタート

### 1. セットアップ

```bash
git clone https://github.com/delogs-jp/format-404-password-forgot.git
cd format-menu-ui

# 依存ライブラリ
npm install

# Playwright ブラウザバイナリ
npx playwright install --with-deps
```

### 2. ローカルサーバー & テスト

#### UIの確認

```bash
npm run dev
```

#### e2eテスト

この記事では、e2eテストは範囲外ですが、ログインについてテストする場合は下記を実行してください。

```bash
# 開発サーバーは自動起動されるので不要
# そのままテスト実行
npx playwright test --reporter=html
npx playwright show-report  # レポートをブラウザで確認
```

- 環境によっては、`tests/login-form.spec.ts`のタイムアウト時間の調整が必要な場合があります。特に、safari回り。

---

## 📜 ライセンス

MIT

> サンプルのコードはご自由に利用 / 改変ください  
> （引用時はリンクいただけるとうれしいです 🙌）
> 感想やご意見など「DELOGs」サイトやXにてお寄せください

---

### 🙏 Credits / Author

- **DELOGs** – <https://delogs.jp>  
  技術ブログ × Web サービスで “届ける” 技術を探求中
- Twitter / X: [@DELOGs2506](https://x.com/DELOGs2506)
