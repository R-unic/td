interface ReplicatedFirst extends Instance {
  Assets: Folder & {
    Enemies: Folder;
    Towers: Folder;
    Maps: Folder & {
      Forest: MapModel;
    };
    UI: Folder;
  };
}