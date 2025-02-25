import { Service } from "core";
import { Workspace as World } from "services";

import { Assets } from "shared/constants";
import Log from "shared/log";

@Service()
export class MapService {
  private loadedMap?: MapModel;

  public load(name: MapName): void {
    if (this.loadedMap !== undefined)
      return Log.warn(`Failed to load map '${name}': Map '${this.loadedMap.Name}' is already loaded`);

    const map = Assets.Maps[name].Clone();
    map.Parent = World;
    map.PivotTo(CFrame.identity);
    map.AddTag("LoadedMap");
    this.loadedMap = map;
  }

  public unload(): void {
    this.loadedMap?.Destroy();
    this.loadedMap = undefined;
  }

  public getSpawnCFrame(): CFrame {
    if (this.loadedMap === undefined)
      return Log.fatal("Failed to get map spawn CFrame: No map loaded");

    const spawnLocation = this.loadedMap.FindFirstChildOfClass("SpawnLocation");
    return spawnLocation?.CFrame ?? this.loadedMap.GetPivot();
  }
}