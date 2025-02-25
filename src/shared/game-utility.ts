import { $nameof } from "rbxts-transform-debug";

import { safeCast } from "./utility/meta";
import Log from "./log";

/**
 * Teleports players to the given position.
 *
 * @remarks
 * This function will warn if a player's character is not found.
 * It will also warn if a character does not satisfy the `CharacterModel` type.
 *
 * @param cframe - The position to teleport the players to.
 * @param players - The players to teleport.
 */
export function teleportPlayers(cframe: CFrame, ...players: Player[]): void {
  for (const player of players) {
    const failed = `Failed to teleport player '${player.Name}'`;
    if (player.Character === undefined) {
      Log.warn(`${failed}: Character does not exist`);
      continue;
    }

    const character = safeCast<CharacterModel>(player.Character);
    if (character === undefined) {
      Log.warn(`${failed}: Character does not satisfy guard for '${$nameof<CharacterModel>()}' type`);
      continue;
    }

    const [_, size] = character.GetBoundingBox();
    character.HumanoidRootPart.CFrame = cframe.add(new Vector3(0, size.Y / 2, 0));
  }
}