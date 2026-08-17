import SideBar from "@/components/SideBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardHeader from "@/components/DashboardHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full min-w-0">
          <SideBar />
          <SidebarInset className="flex min-w-0 w-full flex-col overflow-x-hidden bg-[#f8f9fb] text-sm">
            <DashboardHeader />
            <main className="min-w-0 flex-1 overflow-auto bg-[#f8f9fb]">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
