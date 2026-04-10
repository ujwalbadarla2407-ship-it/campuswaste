import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { useBinsNeedingCollection } from "../hooks/useBackend";
import { UserRole } from "../types";
import { Sidebar } from "./Sidebar";

export function Layout() {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const { data: urgentBins } = useBinsNeedingCollection();

  if (authState.status === "initializing") {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="space-y-3 w-48">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (
    authState.status === "unauthenticated" ||
    authState.status === "no-profile"
  ) {
    navigate({ to: "/login" });
    return null;
  }

  const { profile } = authState;

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        profile={profile}
        onLogout={handleLogout}
        urgentCount={urgentBins?.length ?? 0}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3 shrink-0">
          <div>
            <h1 className="font-display text-sm font-semibold text-foreground">
              {profile.role === UserRole.facilitiesStaff
                ? "Facilities Operations"
                : "Campus Management"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Smart Waste Management Platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export function PublicLayout() {
  return (
    <>
      <Outlet />
      <Toaster position="bottom-right" />
    </>
  );
}
