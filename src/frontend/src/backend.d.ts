import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface Building {
    id: BuildingId;
    name: string;
    zone: string;
}
export type BuildingId = bigint;
export type BinId = bigint;
export interface CollectionTaskInfo {
    id: bigint;
    status: CollectionStatus;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    binId: BinId;
}
export interface DailyForecast {
    needsCollection: boolean;
    dayOffset: bigint;
    predictedFillPercent: bigint;
    confidence: ConfidenceLevel;
}
export interface BuildingWasteSummary {
    rank: bigint;
    totalCollectedKg: bigint;
    averageFillPercent: bigint;
    buildingId: BuildingId;
    buildingName: string;
}
export interface WasteTrendEntry {
    dayOffset: bigint;
    collectedKg: bigint;
    buildingId: BuildingId;
}
export interface CollectionRecord {
    status: CollectionStatus;
    collectedAt: Timestamp;
    fillPercentAtCollection: bigint;
    binId: BinId;
}
export interface BinForecast {
    forecasts: Array<DailyForecast>;
    binId: BinId;
    buildingId: BuildingId;
}
export interface BinInfo {
    id: BinId;
    lastCollectedAt: Timestamp;
    fillPercent: bigint;
    buildingId: BuildingId;
    predictedNextCollectionAt: Timestamp;
    binLabel: string;
}
export interface UserProfile {
    name: string;
    role: UserRole;
}
export enum CollectionStatus {
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum ConfidenceLevel {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum UserRole {
    facilitiesStaff = "facilitiesStaff",
    campusManager = "campusManager"
}
export interface backendInterface {
    dispatchCollection(binId: BinId): Promise<bigint>;
    getActiveTasks(): Promise<Array<CollectionTaskInfo>>;
    getBinStatuses(): Promise<Array<BinInfo>>;
    getBinsForBuilding(buildingId: BuildingId): Promise<Array<BinInfo>>;
    getBinsNeedingCollection(): Promise<Array<BinInfo>>;
    getBuildingForecast(buildingId: BuildingId): Promise<Array<BinForecast>>;
    getBuildingSummaries(): Promise<Array<BuildingWasteSummary>>;
    getBuildings(): Promise<Array<Building>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCollectionHistory(binId: BinId): Promise<Array<CollectionRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWasteTrends(): Promise<Array<WasteTrendEntry>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCollectionStatus(taskId: bigint, status: CollectionStatus): Promise<void>;
}
