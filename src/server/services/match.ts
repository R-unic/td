import { Service, type OnInit } from "core";
import { Players } from "services";

import { teleportPlayers } from "shared/game-utility";

import type { MapService } from "./map";

@Service()
export class MatchService implements OnInit {
  public constructor(
    private readonly map: MapService
  ) { }

  public onInit(): void {
    this.map.load("Forest");
    this.teleportPlayersToMap();
  }

  private teleportPlayersToMap(): void {
    const spawnCFrame = this.map.getSpawnCFrame();
    teleportPlayers(spawnCFrame, ...Players.GetPlayers());
  }
}