import { Players } from "services";

export const Player = Players.LocalPlayer;
export const PlayerGui = Player.WaitForChild<PlayerGui>("PlayerGui");