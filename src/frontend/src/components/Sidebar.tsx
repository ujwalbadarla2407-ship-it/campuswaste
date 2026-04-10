import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { UserRole } from "../types";
import type { UserProfile } from "../types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const STAFF_NAV: NavItem[] = [
  { label: "Dashboard", href: "/staff", icon: LayoutDashboard },
  { label: "Bin Status", href: "/staff/bins", icon: Trash2 },
  { label: "Collection Tasks", href: "/staff/tasks", icon: ClipboardList },
  { label: "Forecasts", href: "/staff/forecasts", icon: TrendingUp },
];

const MANAGER_NAV: NavItem[] = [
  { label: "Overview", href: "/manager", icon: LayoutDashboard },
  { label: "Buildings", href: "/manager/buildings", icon: Building2 },
  { label: "Analytics", href: "/manager/analytics", icon: BarChart3 },
  { label: "Trends", href: "/manager/trends", icon: TrendingUp },
];

interface SidebarProps {
  profile: UserProfile;
  onLogout: () => void;
  urgentCount?: number;
}

export function Sidebar({ profile, onLogout, urgentCount = 0 }: SidebarProps) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const navItems =
    profile.role === UserRole.facilitiesStaff ? STAFF_NAV : MANAGER_NAV;

  const roleLabel =
    profile.role === UserRole.facilitiesStaff
      ? "Facilities Staff"
      : "Campus Manager";

  return (
    <aside className="flex h-full w-60 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold text-sidebar-foreground truncate">
            SmartBin
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Campus
          </p>
        </div>
      </div>

      {/* Role chip */}
      <div className="px-4 pt-4 pb-2">
        <Badge
          variant="outline"
          className="w-full justify-center text-[10px] uppercase tracking-widest border-primary/30 text-primary"
        >
          {roleLabel}
        </Badge>
      </div>

      {/* Nav items */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5"
        data-ocid="sidebar-nav"
      >
        {navItems.map((item) => {
          const isActive =
            item.href === "/staff" || item.href === "/manager"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              data-ocid={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-smooth",
                isActive
                  ? "bg-sidebar-accent text-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span className="truncate">{item.label}</span>
              {item.label === "Bin Status" && urgentCount > 0 && (
                <Badge className="ml-auto h-5 min-w-[20px] justify-center bg-destructive text-destructive-foreground text-[10px] px-1.5">
                  {urgentCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* User footer */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-semibold font-display">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {profile.name}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {roleLabel}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          data-ocid="sidebar-logout"
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground transition-smooth"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
