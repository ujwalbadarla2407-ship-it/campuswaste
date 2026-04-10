import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  BinForecast,
  BinInfo,
  Building,
  BuildingWasteSummary,
  CollectionRecord,
  CollectionTaskInfo,
  UserProfile,
  WasteTrendEntry,
} from "../types";
import { CollectionStatus, UserRole } from "../types";

function useBackendActor() {
  return useActor(createActor);
}

// ─── Bin Queries ─────────────────────────────────────────────────────────────

export function useBinStatuses() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<BinInfo[]>({
    queryKey: ["binStatuses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBinStatuses();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useBinsNeedingCollection() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<BinInfo[]>({
    queryKey: ["binsNeedingCollection"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBinsNeedingCollection();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useBinsForBuilding(buildingId: bigint | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<BinInfo[]>({
    queryKey: ["binsForBuilding", buildingId?.toString()],
    queryFn: async () => {
      if (!actor || buildingId === null) return [];
      return actor.getBinsForBuilding(buildingId);
    },
    enabled: !!actor && !isFetching && buildingId !== null,
  });
}

export function useCollectionHistory(binId: bigint | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<CollectionRecord[]>({
    queryKey: ["collectionHistory", binId?.toString()],
    queryFn: async () => {
      if (!actor || binId === null) return [];
      return actor.getCollectionHistory(binId);
    },
    enabled: !!actor && !isFetching && binId !== null,
  });
}

// ─── Building Queries ─────────────────────────────────────────────────────────

export function useBuildings() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Building[]>({
    queryKey: ["buildings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBuildings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBuildingForecast(buildingId: bigint | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<BinForecast[]>({
    queryKey: ["buildingForecast", buildingId?.toString()],
    queryFn: async () => {
      if (!actor || buildingId === null) return [];
      return actor.getBuildingForecast(buildingId);
    },
    enabled: !!actor && !isFetching && buildingId !== null,
  });
}

export function useBuildingSummaries() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<BuildingWasteSummary[]>({
    queryKey: ["buildingSummaries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBuildingSummaries();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Trend Queries ────────────────────────────────────────────────────────────

export function useWasteTrends() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<WasteTrendEntry[]>({
    queryKey: ["wasteTrends"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWasteTrends();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Task Queries ─────────────────────────────────────────────────────────────

export function useActiveTasks() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<CollectionTaskInfo[]>({
    queryKey: ["activeTasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveTasks();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15_000,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useDispatchCollection() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation<bigint, Error, bigint>({
    mutationFn: async (binId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.dispatchCollection(binId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeTasks"] });
      queryClient.invalidateQueries({ queryKey: ["binsNeedingCollection"] });
      queryClient.invalidateQueries({ queryKey: ["binStatuses"] });
    },
  });
}

export function useUpdateCollectionStatus() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { taskId: bigint; status: CollectionStatus }>(
    {
      mutationFn: async ({ taskId, status }) => {
        if (!actor) throw new Error("Actor not ready");
        return actor.updateCollectionStatus(taskId, status);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["activeTasks"] });
        queryClient.invalidateQueries({ queryKey: ["binStatuses"] });
      },
    },
  );
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useCallerUserProfile() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerUserProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, UserProfile>({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerUserProfile"] });
    },
  });
}

export { UserRole, CollectionStatus };
