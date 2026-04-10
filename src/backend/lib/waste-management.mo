import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Common "../types/common";
import Types "../types/waste-management";

module {

  // ── Constants ──────────────────────────────────────────────────────────────

  let NS_PER_DAY : Int = 86_400_000_000_000;

  // ── Seed helpers ───────────────────────────────────────────────────────────

  /// Populate buildings with sample campus data (10 buildings).
  public func seedBuildings(buildings : List.List<Types.Building>) {
    let data : [(Nat, Text, Text)] = [
      (1, "Science Block",     "North"),
      (2, "Dining Hall",       "Central"),
      (3, "Main Library",      "East"),
      (4, "Engineering Hub",   "North"),
      (5, "Student Union",     "Central"),
      (6, "Sports Complex",    "West"),
      (7, "Administration",    "South"),
      (8, "Arts Centre",       "East"),
      (9, "Medical Faculty",   "South"),
      (10,"Lecture Theatre A", "North"),
    ];
    for ((id, name, zone) in data.vals()) {
      buildings.add({ id; name; zone });
    };
  };

  /// Populate bins (3 per building = 30 bins) with simulated fill levels.
  /// Dining hall bins start fuller; library bins start emptier.
  public func seedBins(bins : List.List<Types.Bin>, now : Common.Timestamp) {
    // (buildingId, binIndex 1-3, binLabel, baseFill)
    let data : [(Nat, Nat, Text, Nat)] = [
      // Science Block — moderate
      (1, 1, "Bin A - Ground Floor",   45),
      (1, 2, "Bin B - First Floor",    30),
      (1, 3, "Bin C - Second Floor",   60),
      // Dining Hall — high fill (busy venue)
      (2, 1, "Bin A - Main Hall",      88),
      (2, 2, "Bin B - Kitchen Exit",   92),
      (2, 3, "Bin C - Outdoor Patio",  75),
      // Main Library — low fill (quiet venue)
      (3, 1, "Bin A - Ground Floor",   20),
      (3, 2, "Bin B - First Floor",    15),
      (3, 3, "Bin C - Study Zone",     25),
      // Engineering Hub — moderate-high
      (4, 1, "Bin A - Workshop",       65),
      (4, 2, "Bin B - Lab Corridor",   50),
      (4, 3, "Bin C - Entrance",       40),
      // Student Union — high fill
      (5, 1, "Bin A - Main Bar",       80),
      (5, 2, "Bin B - Games Room",     70),
      (5, 3, "Bin C - Entrance Hall",  55),
      // Sports Complex — moderate
      (6, 1, "Bin A - Changing Rooms", 48),
      (6, 2, "Bin B - Gym Floor",      35),
      (6, 3, "Bin C - Outdoor Track",  60),
      // Administration — low fill
      (7, 1, "Bin A - Reception",      22),
      (7, 2, "Bin B - Open Plan",      18),
      (7, 3, "Bin C - Meeting Rooms",  12),
      // Arts Centre — moderate
      (8, 1, "Bin A - Gallery",        42),
      (8, 2, "Bin B - Studio",         55),
      (8, 3, "Bin C - Entrance",       30),
      // Medical Faculty — moderate-low
      (9, 1, "Bin A - Reception",      28),
      (9, 2, "Bin B - Lab Area",       38),
      (9, 3, "Bin C - Canteen",        50),
      // Lecture Theatre A — moderate
      (10,1, "Bin A - Foyer",          58),
      (10,2, "Bin B - Lower Hall",     45),
      (10,3, "Bin C - Upper Hall",     35),
    ];

    var binId = 1;
    for ((bldId, _idx, lbl, fill) in data.vals()) {
      // Simulate last collection between 1 and 5 days ago
      let daysAgo : Int = ((fill * 5) / 100) + 1; // fuller = collected less recently
      let lastCollected : Common.Timestamp = now - daysAgo * NS_PER_DAY;
      // Predict next collection 2 days from now as default
      let predicted : Common.Timestamp = now + 2 * NS_PER_DAY;
      bins.add({
        id = binId;
        buildingId = bldId;
        binLabel = lbl;
        var fillPercent = fill;
        var lastCollectedAt = lastCollected;
        var predictedNextCollectionAt = predicted;
      });
      binId += 1;
    };
  };

  /// Seed simulated collection history: each bin gets ~5 past records
  /// spread over the last 30 days, weighted by building type.
  public func seedCollectionHistory(
    history : Map.Map<Common.BinId, List.List<Types.CollectionRecord>>,
    bins : List.List<Types.Bin>,
    now : Common.Timestamp,
  ) {
    bins.forEach(func(bin) {
      let records = List.empty<Types.CollectionRecord>();
      // Dining hall (buildingId 2) and Student Union (5) — collected more often
      let collectionFrequencyDays : Int = if (bin.buildingId == 2 or bin.buildingId == 5) {
        3
      } else if (bin.buildingId == 3 or bin.buildingId == 7) {
        8  // library / admin — less frequent
      } else {
        5  // default
      };
      // Generate 5 historical records going back from lastCollectedAt
      var t = bin.lastCollectedAt;
      var i = 0;
      while (i < 5) {
        let fillAtCollection : Nat = if (bin.buildingId == 2 or bin.buildingId == 5) {
          85 + (i * 2) // always nearly full before collection
        } else if (bin.buildingId == 3 or bin.buildingId == 7) {
          50 + (i * 5) // never very full
        } else {
          70 + (i * 3)
        };
        records.add({
          binId = bin.id;
          collectedAt = t;
          fillPercentAtCollection = if (fillAtCollection > 100) 100 else fillAtCollection;
          status = #completed;
        });
        t := t - collectionFrequencyDays * NS_PER_DAY;
        i += 1;
      };
      history.add(bin.id, records);
    });
  };

  // ── Conversion helpers ─────────────────────────────────────────────────────

  public func binToInfo(bin : Types.Bin) : Types.BinInfo {
    {
      id = bin.id;
      buildingId = bin.buildingId;
      binLabel = bin.binLabel;
      fillPercent = bin.fillPercent;
      lastCollectedAt = bin.lastCollectedAt;
      predictedNextCollectionAt = bin.predictedNextCollectionAt;
    }
  };

  public func taskToInfo(task : Types.CollectionTask) : Types.CollectionTaskInfo {
    {
      id = task.id;
      binId = task.binId;
      createdAt = task.createdAt;
      status = task.status;
      updatedAt = task.updatedAt;
    }
  };

  // ── Bin queries ────────────────────────────────────────────────────────────

  public func getAllBins(bins : List.List<Types.Bin>) : [Types.BinInfo] {
    bins.map<Types.Bin, Types.BinInfo>(binToInfo).toArray()
  };

  public func getBinsForBuilding(
    bins : List.List<Types.Bin>,
    buildingId : Common.BuildingId,
  ) : [Types.BinInfo] {
    bins.filter(func(b) { b.buildingId == buildingId })
        .map<Types.Bin, Types.BinInfo>(binToInfo)
        .toArray()
  };

  public func getBinsNeedingCollection(bins : List.List<Types.Bin>) : [Types.BinInfo] {
    bins.filter(func(b) { b.fillPercent >= 85 })
        .map<Types.Bin, Types.BinInfo>(binToInfo)
        .toArray()
  };

  // ── Collection task operations ─────────────────────────────────────────────

  /// Creates a new task and returns the new task id.
  public func dispatchCollection(
    tasks : List.List<Types.CollectionTask>,
    nextTaskId : Nat,
    binId : Common.BinId,
    now : Common.Timestamp,
  ) : Nat {
    tasks.add({
      id = nextTaskId;
      binId;
      createdAt = now;
      var status : Types.CollectionStatus = #inProgress;
      var updatedAt = now;
    });
    nextTaskId
  };

  public func updateTaskStatus(
    tasks : List.List<Types.CollectionTask>,
    taskId : Nat,
    status : Types.CollectionStatus,
    now : Common.Timestamp,
  ) {
    tasks.mapInPlace(func(t) {
      if (t.id == taskId) {
        t.status := status;
        t.updatedAt := now;
      };
      t
    });
  };

  /// Reset bin fill to 0, record last collection time, update predicted next.
  public func markBinCollected(
    bins : List.List<Types.Bin>,
    history : Map.Map<Common.BinId, List.List<Types.CollectionRecord>>,
    binId : Common.BinId,
    now : Common.Timestamp,
  ) {
    bins.mapInPlace(func(b) {
      if (b.id == binId) {
        let oldFill = b.fillPercent;
        b.fillPercent := 0;
        b.lastCollectedAt := now;
        b.predictedNextCollectionAt := now + 2 * NS_PER_DAY;
        // Append to history
        let records = switch (history.get(binId)) {
          case (?r) r;
          case null {
            let r = List.empty<Types.CollectionRecord>();
            history.add(binId, r);
            r
          };
        };
        records.add({
          binId;
          collectedAt = now;
          fillPercentAtCollection = oldFill;
          status = #completed;
        });
      };
      b
    });
  };

  public func getCollectionHistory(
    history : Map.Map<Common.BinId, List.List<Types.CollectionRecord>>,
    binId : Common.BinId,
  ) : [Types.CollectionRecord] {
    switch (history.get(binId)) {
      case null [];
      case (?records) {
        let arr = records.toArray();
        // Return last 5 (most recent)
        let len = arr.size();
        if (len <= 5) arr
        else arr.sliceToArray(len - 5, len)
      };
    }
  };

  // ── Prediction engine ──────────────────────────────────────────────────────

  public func confidenceFromVariance(variancePct : Nat) : Types.ConfidenceLevel {
    if (variancePct < 10) #high
    else if (variancePct <= 20) #medium
    else #low
  };

  /// Compute daily fill rate (percent per day) from history or use bin type baseline.
  func dailyFillRate(bin : Types.Bin, history : List.List<Types.CollectionRecord>) : Nat {
    // Dining hall (2) and Student Union (5) fill faster
    let baseline : Nat = if (bin.buildingId == 2 or bin.buildingId == 5) {
      18  // ~18% per day
    } else if (bin.buildingId == 3 or bin.buildingId == 7) {
      6   // ~6% per day (library, admin)
    } else {
      12  // default ~12% per day
    };

    // If we have at least 2 records, refine from history
    let arr = history.toArray();
    if (arr.size() >= 2) {
      // Use most recent pair to compute observed rate
      let last = arr[arr.size() - 1];
      let prev = arr[arr.size() - 2];
      let timeDiffNs : Int = last.collectedAt - prev.collectedAt;
      if (timeDiffNs > 0) {
        let days : Nat = (timeDiffNs / NS_PER_DAY).toNat();
        if (days > 0) {
          // Fill consumed between collections
          let fillConsumed = last.fillPercentAtCollection;
          let rate = fillConsumed / days;
          // Blend with baseline (60% observed, 40% baseline)
          return (rate * 6 + baseline * 4) / 10;
        };
      };
    };
    baseline
  };

  public func forecastBin(
    bin : Types.Bin,
    history : List.List<Types.CollectionRecord>,
    now : Common.Timestamp,
  ) : Types.BinForecast {
    let rate = dailyFillRate(bin, history);
    // Variance: dining hall bins have low variance (predictable), library higher
    let variancePct : Nat = if (bin.buildingId == 2 or bin.buildingId == 5) { 8 }
                             else if (bin.buildingId == 3 or bin.buildingId == 7) { 22 }
                             else { 14 };
    let confidence = confidenceFromVariance(variancePct);

    let forecasts = Array.tabulate(7, func(day : Nat) : Types.DailyForecast {
      let projected : Nat = bin.fillPercent + rate * (day + 1);
      let capped : Nat = if (projected > 100) 100 else projected;
      {
        dayOffset = day;
        predictedFillPercent = capped;
        needsCollection = capped >= 85;
        confidence;
      }
    });

    { binId = bin.id; buildingId = bin.buildingId; forecasts }
  };

  public func forecastBuilding(
    bins : List.List<Types.Bin>,
    history : Map.Map<Common.BinId, List.List<Types.CollectionRecord>>,
    buildingId : Common.BuildingId,
    now : Common.Timestamp,
  ) : [Types.BinForecast] {
    bins.filter(func(b) { b.buildingId == buildingId })
        .map<Types.Bin, Types.BinForecast>(func(b) {
          let hist = switch (history.get(b.id)) {
            case (?h) h;
            case null List.empty<Types.CollectionRecord>();
          };
          forecastBin(b, hist, now)
        })
        .toArray()
  };

  // ── Analytics ──────────────────────────────────────────────────────────────

  /// Simulated weight conversion: 1% fill ≈ 0.5 kg for a standard 120L bin
  func fillToKg(fillPct : Nat) : Nat { fillPct / 2 };

  public func getWasteTrends(
    history : Map.Map<Common.BinId, List.List<Types.CollectionRecord>>,
    bins : List.List<Types.Bin>,
    now : Common.Timestamp,
  ) : [Types.WasteTrendEntry] {
    // Build a map: (buildingId, dayOffset) -> totalKg accumulated
    // dayOffset 0 = 29 days ago, 29 = today
    let result = List.empty<Types.WasteTrendEntry>();

    bins.forEach(func(bin) {
      let records = switch (history.get(bin.id)) {
        case (?r) r;
        case null List.empty<Types.CollectionRecord>();
      };
      records.forEach(func(rec) {
        let ageNs : Int = now - rec.collectedAt;
        if (ageNs >= 0 and ageNs < 30 * NS_PER_DAY) {
          let daysAgo : Nat = (ageNs / NS_PER_DAY).toNat();
          let dayOffset : Nat = 29 - daysAgo;
          result.add({
            dayOffset;
            buildingId = bin.buildingId;
            collectedKg = fillToKg(rec.fillPercentAtCollection);
          });
        };
      });
    });

    result.toArray()
  };

  public func getBuildingSummaries(
    buildings : List.List<Types.Building>,
    bins : List.List<Types.Bin>,
    history : Map.Map<Common.BinId, List.List<Types.CollectionRecord>>,
    now : Common.Timestamp,
  ) : [Types.BuildingWasteSummary] {
    // Compute per-building totals
    let summaries = buildings.map<Types.Building, Types.BuildingWasteSummary>(func(bldg) {
      let buildingBins = bins.filter(func(b) { b.buildingId == bldg.id });
      var totalKg : Nat = 0;
      var totalFill : Nat = 0;
      var binCount : Nat = 0;

      buildingBins.forEach(func(bin) {
        binCount += 1;
        totalFill += bin.fillPercent;
        switch (history.get(bin.id)) {
          case (?records) {
            records.forEach(func(rec) {
              let ageNs : Int = now - rec.collectedAt;
              if (ageNs >= 0 and ageNs < 30 * NS_PER_DAY) {
                totalKg += fillToKg(rec.fillPercentAtCollection);
              };
            });
          };
          case null {};
        };
      });

      let avgFill : Nat = if (binCount == 0) 0 else totalFill / binCount;
      {
        buildingId = bldg.id;
        buildingName = bldg.name;
        totalCollectedKg = totalKg;
        rank = 0; // will be assigned after sort
        averageFillPercent = avgFill;
      }
    });

    // Sort by totalCollectedKg descending and assign ranks
    let arr = summaries.toArray();
    let sorted = arr.sort(func(a, b) {
      if (a.totalCollectedKg > b.totalCollectedKg) #less
      else if (a.totalCollectedKg < b.totalCollectedKg) #greater
      else #equal
    });
    sorted.mapEntries<Types.BuildingWasteSummary, Types.BuildingWasteSummary>(
      func(entry, i) { { entry with rank = i + 1 } }
    )
  };
};
