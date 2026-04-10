import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useCallback } from "react";
import type { UserProfile } from "../types";
import type { UserRole } from "../types";
import { useCallerUserProfile, useSaveCallerUserProfile } from "./useBackend";

export type AuthState =
  | { status: "initializing" }
  | { status: "unauthenticated" }
  | { status: "authenticated"; profile: UserProfile }
  | { status: "no-profile" };

export function useAuth() {
  const { identity, login, clear, isInitializing, loginStatus } =
    useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useCallerUserProfile();
  const { mutateAsync: saveProfile } = useSaveCallerUserProfile();

  const isLoggedIn = !!identity && loginStatus !== "initializing";

  const authState: AuthState = (() => {
    if (isInitializing) return { status: "initializing" };
    if (!isLoggedIn) return { status: "unauthenticated" };
    if (profileLoading) return { status: "initializing" };
    if (!profile) return { status: "no-profile" };
    return { status: "authenticated", profile };
  })();

  const loginAs = useCallback(
    async (name: string, role: UserRole) => {
      await saveProfile({ name, role });
    },
    [saveProfile],
  );

  const logout = useCallback(() => {
    clear();
  }, [clear]);

  return {
    authState,
    login,
    logout,
    loginAs,
    identity,
    loginStatus,
    isLoggedIn,
    profile: profile ?? null,
  };
}
