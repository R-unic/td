import { Networking } from "@flamework/networking";

type SerializedRemote = (packet: SerializedPacket) => void;
type UnreliableSerializedRemote = Networking.Unreliable<(packet: SerializedPacket) => void>;

interface ServerEvents {
  character: {
    toggleDefaultMovement(on: boolean): void;
  };
}

interface ClientEvents { }

interface ServerFunctions { }

interface ClientFunctions { }

export const Serializers = {

};

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();