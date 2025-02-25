type MapName = ExtractKeys<ReplicatedFirst["Assets"]["Maps"], MapModel>;
interface MapModel extends Model {
  PathNodes: Folder;
  StartPoint: Part;
  EndPoint: Part;
}

interface CharacterModel extends Model {
  Humanoid: Humanoid;
  HumanoidRootPart: Part;
  Head: Part;
}