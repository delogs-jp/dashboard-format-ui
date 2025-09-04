// src/app/(protected)/layout.tsx
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        {/* サイドバー/ヘッダ/パンくずは“各 page.tsx”で自由に */}
        {children}
        <Toaster richColors closeButton />
      </SidebarInset>
    </SidebarProvider>
  );
}
