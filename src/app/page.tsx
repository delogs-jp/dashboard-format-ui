import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/LoginForm"; // ログインフォームコンポーネント

export default function Page() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-gray-800 p-6 md:p-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex justify-center">
            <Image
              src="/logo.svg"
              alt="サイトロゴ"
              width={160}
              height={40}
              priority={true}
              className="h-[40px] w-[160px]"
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
