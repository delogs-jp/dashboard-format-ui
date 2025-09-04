// src/app/layout.tsx
import type { Metadata } from "next";

import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/sidebar/theme-provider";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: {
    default: "管理画面フォーマットUIのみ版【DELOGs】",
    template: "%s | 管理画面フォーマットUIのみ版【DELOGs】",
  },
  description:
    "Next.js、Shadcn/uiを使用した管理画面フォーマットです。UIのみを制作しました。今後、DB連携を行う予定です。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
