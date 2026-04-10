import type { backendInterface, BinInfo, Building, CollectionTaskInfo, CollectionRecord, BinForecast, BuildingWasteSummary, WasteTrendEntry, UserProfile } from "../backend";
import { CollectionStatus, ConfidenceLevel, UserRole } from "../backend";
import type { Principal } from "@icp-sdk/core/principal";

const now = BigInt(Date.now()) * BigInt(1_000_000);
const day = BigInt(86_400_000_000_000);

const buildings: Building[] = [
  { id: BigInt(1), name: "Science Block A", zone: "North" },
  { id: BigInt(2), name: "Library", zone: "Central" },
  { id: BigInt(3), name: "Student Union", zone: "South" },
  { id: BigInt(4), name: "Engineering Hall", zone: "East" },
  { id: BigInt(5), name: "Admin Building", zone: "Central" },
];

const bins: BinInfo[] = [
  { id: BigInt(1), binLabel: "Bin A1", buildingId: BigInt(1), fillPercent: BigInt(87), lastCollectedAt: now - day * BigInt(2), predictedNextCollectionAt: now + day },
  { id: BigInt(2), binLabel: "Bin A2", buildingId: BigInt(1), fillPercent: BigInt(45), lastCollectedAt: now - day, predictedNextCollectionAt: now + day * BigInt(2) },
  { id: BigInt(3), binLabel: "Bin L1", buildingId: BigInt(2), fillPercent: BigInt(92), lastCollectedAt: now - day * BigInt(3), predictedNextCollectionAt: now },
  { id: BigInt(4), binLabel: "Bin SU1", buildingId: BigInt(3), fillPercent: BigInt(60), lastCollectedAt: now - day, predictedNextCollectionAt: now + day * BigInt(2) },
  { id: BigInt(5), binLabel: "Bin SU2", buildingId: BigInt(3), fillPercent: BigInt(23), lastCollectedAt: now - day, predictedNextCollectionAt: now + day * BigInt(4) },
  { id: BigInt(6), binLabel: "Bin EH1", buildingId: BigInt(4), fillPercent: BigInt(78), lastCollectedAt: now - day * BigInt(2), predictedNextCollectionAt: now + day },
  { id: BigInt(7), binLabel: "Bin AD1", buildingId: BigInt(5), fillPercent: BigInt(34), lastCollectedAt: now - day, predictedNextCollectionAt: now + day * BigInt(3) },
];

const activeTasks: CollectionTaskInfo[] = [
  { id: BigInt(1), binId: BigInt(1), status: CollectionStatus.pending, createdAt: now - BigInt(3600_000_000_000), updatedAt: now - BigInt(1800_000_000_000) },
  { id: BigInt(2), binId: BigInt(3), status: CollectionStatus.inProgress, createdAt: now - BigInt(7200_000_000_000), updatedAt: now - BigInt(900_000_000_000) },
];

const collectionHistory: CollectionRecord[] = [
  { binId: BigInt(1), fillPercentAtCollection: BigInt(91), collectedAt: now - day * BigInt(2), status: CollectionStatus.completed },
  { binId: BigInt(1), fillPercentAtCollection: BigInt(85), collectedAt: now - day * BigInt(5), status: CollectionStatus.completed },
  { binId: BigInt(1), fillPercentAtCollection: BigInt(78), collectedAt: now - day * BigInt(8), status: CollectionStatus.completed },
];

const buildingForecasts: BinForecast[] = [
  {
    binId: BigInt(1),
    buildingId: BigInt(1),
    forecasts: [
      { dayOffset: BigInt(0), predictedFillPercent: BigInt(87), needsCollection: true, confidence: ConfidenceLevel.high },
      { dayOffset: BigInt(1), predictedFillPercent: BigInt(95), needsCollection: true, confidence: ConfidenceLevel.high },
      { dayOffset: BigInt(2), predictedFillPercent: BigInt(30), needsCollection: false, confidence: ConfidenceLevel.medium },
      { dayOffset: BigInt(3), predictedFillPercent: BigInt(55), needsCollection: false, confidence: ConfidenceLevel.medium },
      { dayOffset: BigInt(4), predictedFillPercent: BigInt(72), needsCollection: false, confidence: ConfidenceLevel.low },
      { dayOffset: BigInt(5), predictedFillPercent: BigInt(88), needsCollection: true, confidence: ConfidenceLevel.low },
      { dayOffset: BigInt(6), predictedFillPercent: BigInt(40), needsCollection: false, confidence: ConfidenceLevel.low },
    ],
  },
];

const buildingSummaries: BuildingWasteSummary[] = [
  { rank: BigInt(1), buildingId: BigInt(3), buildingName: "Student Union", totalCollectedKg: BigInt(1240), averageFillPercent: BigInt(74) },
  { rank: BigInt(2), buildingId: BigInt(1), buildingName: "Science Block A", totalCollectedKg: BigInt(980), averageFillPercent: BigInt(68) },
  { rank: BigInt(3), buildingId: BigInt(4), buildingName: "Engineering Hall", totalCollectedKg: BigInt(820), averageFillPercent: BigInt(61) },
  { rank: BigInt(4), buildingId: BigInt(2), buildingName: "Library", totalCollectedKg: BigInt(610), averageFillPercent: BigInt(55) },
  { rank: BigInt(5), buildingId: BigInt(5), buildingName: "Admin Building", totalCollectedKg: BigInt(390), averageFillPercent: BigInt(40) },
];

const wasteTrends: WasteTrendEntry[] = [
  { dayOffset: BigInt(-6), buildingId: BigInt(1), collectedKg: BigInt(140) },
  { dayOffset: BigInt(-5), buildingId: BigInt(1), collectedKg: BigInt(160) },
  { dayOffset: BigInt(-4), buildingId: BigInt(1), collectedKg: BigInt(120) },
  { dayOffset: BigInt(-3), buildingId: BigInt(1), collectedKg: BigInt(190) },
  { dayOffset: BigInt(-2), buildingId: BigInt(1), collectedKg: BigInt(175) },
  { dayOffset: BigInt(-1), buildingId: BigInt(1), collectedKg: BigInt(210) },
  { dayOffset: BigInt(0), buildingId: BigInt(1), collectedKg: BigInt(155) },
  { dayOffset: BigInt(-6), buildingId: BigInt(3), collectedKg: BigInt(200) },
  { dayOffset: BigInt(-5), buildingId: BigInt(3), collectedKg: BigInt(230) },
  { dayOffset: BigInt(-4), buildingId: BigInt(3), collectedKg: BigInt(180) },
  { dayOffset: BigInt(-3), buildingId: BigInt(3), collectedKg: BigInt(260) },
  { dayOffset: BigInt(-2), buildingId: BigInt(3), collectedKg: BigInt(245) },
  { dayOffset: BigInt(-1), buildingId: BigInt(3), collectedKg: BigInt(290) },
  { dayOffset: BigInt(0), buildingId: BigInt(3), collectedKg: BigInt(220) },
];

const staffProfile: UserProfile = { name: "Alex Chen", role: UserRole.facilitiesStaff };

export const mockBackend: backendInterface = {
  getBuildings: async () => buildings,
  getBinStatuses: async () => bins,
  getBinsNeedingCollection: async () => bins.filter(b => b.fillPercent >= BigInt(75)),
  getBinsForBuilding: async (buildingId) => bins.filter(b => b.buildingId === buildingId),
  getActiveTasks: async () => activeTasks,
  getCollectionHistory: async (_binId) => collectionHistory,
  getBuildingForecast: async (_buildingId) => buildingForecasts,
  getBuildingSummaries: async () => buildingSummaries,
  getWasteTrends: async () => wasteTrends,
  getCallerUserProfile: async () => staffProfile,
  getUserProfile: async (_user: Principal) => staffProfile,
  saveCallerUserProfile: async (_profile) => undefined,
  dispatchCollection: async (_binId) => BigInt(activeTasks.length + 1),
  updateCollectionStatus: async (_taskId, _status) => undefined,
};
