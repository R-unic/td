import { Service } from "core";
import { Workspace as World } from "services";

import { Assets } from "shared/constants";
import { BezierPath } from "shared/classes/bezier-path";
import Log from "shared/log";

/** Manages the currently loaded map and it's `BezierPath`. */
@Service()
export class MapService {
  private loadedMap?: MapModel;
  private loadedPath?: BezierPath;

  public load(name: MapName): void {
    if (this.loadedMap !== undefined)
      return Log.warn(`Failed to load map '${name}': Map '${this.loadedMap.Name}' is already loaded`);

    const map = Assets.Maps[name].Clone();
    map.Parent = World;
    map.PivotTo(CFrame.identity);
    map.AddTag("LoadedMap");
    this.loadedMap = map;
    this.getPath();
  }

  public unload(): void {
    this.loadedMap?.Destroy();
    this.loadedMap = undefined;
    this.loadedPath = undefined;
  }

  /**
   * Returns the BezierPath of the currently loaded map.
   * If no map is loaded, this will log a fatal error.
   * If the path has already been generated, this will return the cached path.
   */
  public getPath(): BezierPath {
    if (this.loadedMap === undefined)
      return Log.fatal("Failed to get map path: No map loaded");
    if (this.loadedPath !== undefined)
      return this.loadedPath;

    return this.loadedPath = new BezierPath(this.loadedMap);
  }

  /**
   * Returns the spawn CFrame of the currently loaded map.
   * If no map is loaded, this will log a fatal error.
   * If a SpawnLocation is present in the map, the CFrame of that is returned.
   * Otherwise, the map's pivot is returned.
   */
  public getSpawnCFrame(): CFrame {
    if (this.loadedMap === undefined)
      return Log.fatal("Failed to get map spawn CFrame: No map loaded");

    const spawnLocation = this.loadedMap.FindFirstChildOfClass("SpawnLocation");
    return spawnLocation?.CFrame ?? this.loadedMap.GetPivot();
  }
}
