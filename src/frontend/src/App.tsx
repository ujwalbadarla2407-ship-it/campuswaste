import { Skeleton } from "@/components/ui/skeleton";
import {
  Navigate,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout, PublicLayout } from "./components/Layout";
import LoginPage from "./pages/LoginPage";

// Lazy page imports
const StaffDashboard = lazy(() => import("./pages/staff/StaffDashboard"));
const StaffBins = lazy(() => import("./pages/staff/StaffBins"));
const StaffTasks = lazy(() => import("./pages/staff/StaffTasks"));
const StaffForecasts = lazy(() => import("./pages/staff/StaffForecasts"));
const ManagerOverview = lazy(() => import("./pages/manager/ManagerOverview"));
const ManagerBuildings = lazy(() => import("./pages/manager/ManagerBuildings"));
const ManagerAnalytics = lazy(() => import("./pages/manager/ManagerAnalytics"));
const ManagerTrends = lazy(() => import("./pages/manager/ManagerTrends"));

const PageLoader = () => (
  <div className="space-y-4 p-2">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-32 w-full" />
  </div>
);

// ─── Route tree ───────────────────────────────────────────────────────────────

const rootRoute = createRootRoute();

// Public routes
const publicLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: PublicLayout,
});
const loginRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/login",
  component: LoginPage,
});
const indexRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/",
  component: () => <Navigate to="/login" />,
});

// Protected routes
const protectedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: Layout,
});

// Staff routes
const staffRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/staff",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <StaffDashboard />
    </Suspense>
  ),
});
const staffBinsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/staff/bins",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <StaffBins />
    </Suspense>
  ),
});
const staffTasksRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/staff/tasks",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <StaffTasks />
    </Suspense>
  ),
});
const staffForecastsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/staff/forecasts",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <StaffForecasts />
    </Suspense>
  ),
});

// Manager routes
const managerRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/manager",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ManagerOverview />
    </Suspense>
  ),
});
const managerBuildingsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/manager/buildings",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ManagerBuildings />
    </Suspense>
  ),
});
const managerAnalyticsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/manager/analytics",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ManagerAnalytics />
    </Suspense>
  ),
});
const managerTrendsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/manager/trends",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ManagerTrends />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  publicLayout.addChildren([indexRoute, loginRoute]),
  protectedLayout.addChildren([
    staffRoute,
    staffBinsRoute,
    staffTasksRoute,
    staffForecastsRoute,
    managerRoute,
    managerBuildingsRoute,
    managerAnalyticsRoute,
    managerTrendsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
