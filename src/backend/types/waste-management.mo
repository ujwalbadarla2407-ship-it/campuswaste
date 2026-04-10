import Common "common";

module {
  // ── Enumerations ──────────────────────────────────────────────────────────

  public type ConfidenceLevel = {
    #high;   // variance < 10%
    #medium; // variance 10-20%
    #low;    // variance > 20%
  };

  public type CollectionStatus = {
    #pending;
    #inProgress;
    #completed;
  };

  public type UserRole = {
    #facilitiesStaff;
    #campusManager;
  };

  // ── Core domain types ─────────────────────────────────────────────────────

  public type Building = {
    id : Common.BuildingId;
    name : Text;
    zone : Text;
  };

  public type Bin = {
    id : Common.BinId;
    buildingId : Common.BuildingId;
    binLabel : Text;
    var fillPercent : Nat;           // 0-100
    var lastCollectedAt : Common.Timestamp;
    var predictedNextCollectionAt : Common.Timestamp;
  };

  // Shared (immutable) version for API boundary
  public type BinInfo = {
    id : Common.BinId;
    buildingId : Common.BuildingId;
    binLabel : Text;
    fillPercent : Nat;
    lastCollectedAt : Common.Timestamp;
    predictedNextCollectionAt : Common.Timestamp;
  };

  public type CollectionRecord = {
    binId : Common.BinId;
    collectedAt : Common.Timestamp;
    fillPercentAtCollection : Nat;
    status : CollectionStatus;
  };

  public type CollectionTask = {
    id : Nat;
    binId : Common.BinId;
    createdAt : Common.Timestamp;
    var status : CollectionStatus;
    var updatedAt : Common.Timestamp;
  };

  // Shared (immutable) version for API boundary
  public type CollectionTaskInfo = {
    id : Nat;
    binId : Common.BinId;
    createdAt : Common.Timestamp;
    status : CollectionStatus;
    updatedAt : Common.Timestamp;
  };

  // ── Prediction types ──────────────────────────────────────────────────────

  public type DailyForecast = {
    dayOffset : Nat; // 0 = today, 6 = 6 days from now
    predictedFillPercent : Nat;
    needsCollection : Bool;
    confidence : ConfidenceLevel;
  };

  public type BinForecast = {
    binId : Common.BinId;
    buildingId : Common.BuildingId;
    forecasts : [DailyForecast]; // 7 entries
  };

  public type BuildingWasteSummary = {
    buildingId : Common.BuildingId;
    buildingName : Text;
    totalCollectedKg : Nat; // simulated weight
    rank : Nat;
    averageFillPercent : Nat;
  };

  public type WasteTrendEntry = {
    dayOffset : Nat; // 0 = 29 days ago, 29 = today
    buildingId : Common.BuildingId;
    collectedKg : Nat;
  };

  // ── User profile ──────────────────────────────────────────────────────────

  public type UserProfile = {
    name : Text;
    role : UserRole;
  };
};
