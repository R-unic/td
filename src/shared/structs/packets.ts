import type { PacketSafePlaySoundOptions } from "./audio";

export interface AudioPacket {
  sound: Sound;
  options?: PacketSafePlaySoundOptions;
}