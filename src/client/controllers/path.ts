import { Controller } from "core";
import { Workspace as World } from "services";

import { BezierPath } from "shared/classes/bezier-path";
import { getChildrenOfType } from "shared/utility/meta";
import Log from "shared/log";

@Controller()
export class PathController {
  private path?: BezierPath;

  public get(): BezierPath {
    if (this.path !== undefined)
      return this.path;

    const currentMap = getChildrenOfType<MapModel>(World).find(m => m.HasTag("LoadedMap"));
    if (currentMap === undefined) {
      this.path = undefined;
      return Log.warn("Failed to get current path: Could not find loaded map");
    }

    return this.path = new BezierPath(currentMap);
  }
}