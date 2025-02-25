import { Service, type OnInit } from "core";
import { Workspace as World, Players } from "services";

import { Assets } from "shared/constants";
import { teleportPlayers } from "shared/game-utility";
import Log from "shared/log";

@Service()
export class MapService implements OnInit {
  private loadedMap?: MapModel;

  public onInit(): void {
    this.load("Forest");
  }

  public load(name: MapName): void {
    if (this.loadedMap !== undefined)
      return Log.warn(`Failed to load map '${name}': Map '${this.loadedMap.Name}' is already loaded`);

    const map = Assets.Maps[name].Clone();
    map.Parent = World;
    map.PivotTo(CFrame.identity);
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