import { Service, type OnInit } from "core";
import { StrictMap } from "strict-map";
import { Janitor } from "janitor";

import type { OnPlayerJoin, OnPlayerLeave } from "server/hooks";
import { teleportPlayers } from "shared/game-utility";

import type { MapService } from "./map";

interface PlayerInfo {
  cash: number;
  wasTeleported: boolean;
  readonly janitor: Janitor;
}

@Service()
export class MatchService implements OnInit, OnPlayerJoin, OnPlayerLeave {
  private readonly playerInfo = new StrictMap<Player, PlayerInfo>();

  public constructor(
    private readonly map: MapService
  ) { }

  public onInit(): void {
    this.map.load("Forest");
  }

  public onPlayerJoin(player: Player): void {
    const info: PlayerInfo = {
      cash: 200,
      wasTeleported: false,
      janitor: new Janitor
    };

    this.playerInfo.set(player, info);
    this.teleportToMap(player);
  }

  public onPlayerLeave(player: Player): void {
    const info = this.playerInfo.mustGet(player);
    info.janitor.Destroy();
    // preserve info in case they join back
  }

  private teleportToMap(player: Player): void {
    const spawnCFrame = this.map.getSpawnCFrame();
    const info = this.playerInfo.mustGet(player);
    info.wasTeleported = true;

    teleportPlayers(spawnCFrame, player);
  }
}
