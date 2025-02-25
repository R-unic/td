import { Service, type OnInit } from "core";
import { Workspace as World } from "services";

import { Assets } from "shared/constants";

@Service()
export class MapService implements OnInit {
  public onInit(): void {
    this.load("Forest");
  }

  public load(name: MapName): void {
    const map = Assets.Maps[name].Clone();
    map.Parent = World;
  }
}