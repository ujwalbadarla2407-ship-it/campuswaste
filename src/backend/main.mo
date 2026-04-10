import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Common "types/common";
import Types "types/waste-management";
import WasteLib "lib/waste-management";
import WasteManagementApi "mixins/waste-management-api";

actor {
  // ── Domain state ───────────────────────────────────────────────────────────
  let buildings = List.empty<Types.Building>();
  let bins = List.empty<Types.Bin>();
  let collectionTasks = List.empty<Types.CollectionTask>();
  let collectionHistory = Map.empty<Common.BinId, List.List<Types.CollectionRecord>>();

  // ── User profiles ──────────────────────────────────────────────────────────
  let userProfiles = Map.empty<Principal, Types.UserProfile>();

  // ── Seed sample data on first initialization ───────────────────────────────
  let initTime = Time.now();
  WasteLib.seedBuildings(buildings);
  WasteLib.seedBins(bins, initTime);
  WasteLib.seedCollectionHistory(collectionHistory, bins, initTime);

  // ── Waste Management API ───────────────────────────────────────────────────
  include WasteManagementApi(
    userProfiles,
    buildings,
    bins,
    collectionTasks,
    collectionHistory,
  );
};
