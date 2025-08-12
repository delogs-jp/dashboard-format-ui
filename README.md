# Shadcn/uiで作るログイン後の管理画面レイアウトのDemo

[![DELOGs 記事へ](https://img.shields.io/badge/DELOGs-記事はこちら-1e90ff?logo=githubpages)](https://delogs.jp/next-js/shadcn-ui/dashboard-layout)

記事「[Shadcn/uiで作るログイン後の管理画面レイアウト](https://delogs.jp/next-js/shadcn-ui/dashboard-layout)」の実践結果のリポジトリです。

## 📦 Tech Stack

| Tool / Lib               | Version | Purpose                          |
| ------------------------ | :-----: | -------------------------------- |
| **Next.js**              |  15.x   | サンプルフォーム（お問い合わせ） |
| **TypeScript**           |   5.x   | 型安全                           |
| **Playwright Test**      | 1.54.x  | E2E テスト                       |
| **shadcn/ui + Tailwind** | latest  | UI コンポーネント                |
| **GitHub Actions**       |    —    | CI / HTML レポート保存           |

---

## 🚀 クイックスタート

### 1. セットアップ

```bash
git clone https://github.com/delogs-jp/dashboard-layout.git
cd dashboard-layout

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

---

### 🙏 Credits / Author

- **DELOGs** – <https://delogs.jp>  
  技術ブログ × Web サービスで “届ける” 技術を探求中
- Twitter / X: [@DELOGs2506](https://x.com/DELOGs2506)
