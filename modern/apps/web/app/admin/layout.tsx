import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { requireSessionUser } from "@/lib/session";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSessionUser();

  if (!user.isPlatformAdmin) {
    return (
      <div className="mx-auto mt-8 max-w-xl px-4 md:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShieldAlert className="size-5 text-destructive" />
              Admin Access Required
            </CardTitle>
            <CardDescription>
              Your current account is not marked as platform admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            Contact a platform owner to request elevated access.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="sticky top-[57px] z-40 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Administration
                </p>
                <h1 className="text-sm font-semibold md:text-base">Pelotus Control Room</h1>
              </div>
            </div>
            <Badge variant="secondary" className="hidden gap-1 md:inline-flex">
              <ShieldCheck className="size-3.5" />
              Platform Admin
            </Badge>
          </div>
        </header>

        <div className="p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
