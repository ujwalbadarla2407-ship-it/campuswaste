import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Common "../types/common";
import Types "../types/waste-management";
import WasteLib "../lib/waste-management";

/// Public API mixin for the waste-management domain.
/// State is seeded in main.mo at initialization time.
mixin (
  userProfiles : Map.Map<Principal, Types.UserProfile>,
  buildings : List.List<Types.Building>,
  bins : List.List<Types.Bin>,
  collectionTasks : List.List<Types.CollectionTask>,
  collectionHistory : Map.Map<Common.BinId, List.List<Types.CollectionRecord>>,
) {

  var nextTaskId : Nat = 1;

  // ── Facilities Staff endpoints ─────────────────────────────────────────────

  /// All bins with current fill levels.
  public query ({ caller = _ }) func getBinStatuses() : async [Types.BinInfo] {
    WasteLib.getAllBins(bins)
  };

  /// Bins with fill >= 85% — require immediate collection.
  public query ({ caller = _ }) func getBinsNeedingCollection() : async [Types.BinInfo] {
    WasteLib.getBinsNeedingCollection(bins)
  };

  /// Bins for a specific building.
  public query ({ caller = _ }) func getBinsForBuilding(buildingId : Common.BuildingId) : async [Types.BinInfo] {
    WasteLib.getBinsForBuilding(bins, buildingId)
  };

  /// Dispatch a collection task for a bin. Returns new task id.
  public shared ({ caller = _ }) func dispatchCollection(binId : Common.BinId) : async Nat {
    let now = Time.now();
    let newId = WasteLib.dispatchCollection(collectionTasks, nextTaskId, binId, now);
    nextTaskId += 1;
    newId
  };

  /// Update status of an existing collection task.
  public shared ({ caller = _ }) func updateCollectionStatus(
    taskId : Nat,
    status : Types.CollectionStatus,
  ) : async () {
    let now = Time.now();
    WasteLib.updateTaskStatus(collectionTasks, taskId, status, now);
    // If completed, mark the bin as collected
    if (status == #completed) {
      switch (collectionTasks.find(func(t : Types.CollectionTask) : Bool { t.id == taskId })) {
        case (?task) {
          WasteLib.markBinCollected(bins, collectionHistory, task.binId, now);
        };
        case null {};
      };
    };
  };

  /// Last 5 collection records for a bin.
  public query ({ caller = _ }) func getCollectionHistory(binId : Common.BinId) : async [Types.CollectionRecord] {
    WasteLib.getCollectionHistory(collectionHistory, binId)
  };

  /// All active (non-completed) collection tasks.
  public query ({ caller = _ }) func getActiveTasks() : async [Types.CollectionTaskInfo] {
    collectionTasks
      .filter(func(t : Types.CollectionTask) : Bool { t.status != #completed })
      .map<Types.CollectionTask, Types.CollectionTaskInfo>(WasteLib.taskToInfo)
      .toArray()
  };

  // ── Campus Manager endpoints ───────────────────────────────────────────────

  /// 7-day predictive forecast for all bins in a building.
  public query ({ caller = _ }) func getBuildingForecast(buildingId : Common.BuildingId) : async [Types.BinForecast] {
    let now = Time.now();
    WasteLib.forecastBuilding(bins, collectionHistory, buildingId, now)
  };

  /// Waste trend entries for the past 30 days, grouped by building.
  public query ({ caller = _ }) func getWasteTrends() : async [Types.WasteTrendEntry] {
    let now = Time.now();
    WasteLib.getWasteTrends(collectionHistory, bins, now)
  };

  /// Building summaries ranked by total waste collected.
  public query ({ caller = _ }) func getBuildingSummaries() : async [Types.BuildingWasteSummary] {
    let now = Time.now();
    WasteLib.getBuildingSummaries(buildings, bins, collectionHistory, now)
  };

  // ── Shared / general endpoints ─────────────────────────────────────────────

  /// All buildings on campus.
  public query ({ caller = _ }) func getBuildings() : async [Types.Building] {
    buildings.toArray()
  };

  /// Get caller's user profile (name + role).
  public query ({ caller }) func getCallerUserProfile() : async ?Types.UserProfile {
    userProfiles.get(caller)
  };

  /// Save or update the caller's user profile.
  public shared ({ caller }) func saveCallerUserProfile(profile : Types.UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  /// Get another user's profile.
  public query ({ caller = _ }) func getUserProfile(user : Principal) : async ?Types.UserProfile {
    userProfiles.get(user)
  };
};
