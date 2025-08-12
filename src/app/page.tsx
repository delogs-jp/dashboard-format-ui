import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/login/login-form"; // ログインフォームコンポーネント

export default function Page() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-gray-800 p-6 md:p-10 dark:bg-neutral-800">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex justify-center">
            {/* light用ロゴ（＝ダークモード時に非表示） */}
            <Image
              src="/logo.svg"
              alt="サイトロゴ"
              width={160}
              height={40}
              priority
              className="h-[40px] w-[160px] dark:hidden"
            />

            {/* dark用ロゴ（＝ダークモード時に表示） */}
            <Image
              src="/logo-d.svg"
              alt="サイトロゴ（ダーク）"
              width={160}
              height={40}
              priority
              className="hidden h-[40px] w-[160px] dark:block"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
