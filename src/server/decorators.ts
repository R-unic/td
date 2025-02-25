import { callMethodOnDependency } from "flamework-meta-utils";
import type { Serializer } from "flamework-binary-serializer";
import type { ServerReceiver as ServerEventReceiver } from "networking/out/events/types";
import type { ServerReceiver as ServerFunctionReceiver } from "networking/out/functions/types";

import { FlameworkIgnited } from "shared/constants";

type ServerReceiver<I extends unknown[] = unknown[], O = void> = ServerEventReceiver<I> | ServerFunctionReceiver<I, O>;

/** @metadata reflect identifier flamework:parameters */
export function LinkRemote<I extends unknown[] = unknown[], O = void>(remote: ServerReceiver<I, O>) {
  return (ctor: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(this: unknown, player: Player, ...input: I) => O>) => {
    FlameworkIgnited.Once(() => {
      (<UnionToIntersection<ServerReceiver<I, O>>>remote)["setCallback" in remote ? "setCallback" : "connect"]((...args) => callMethodOnDependency(ctor, descriptor, ...args));
    });
  }
}

/** @metadata reflect identifier flamework:parameters */
export function LinkSerializedRemote<PacketStruct extends object, I extends [packet: SerializedPacket] = [packet: SerializedPacket], O = void>(remote: ServerReceiver<I, O>, deserializer: Serializer<PacketStruct>) {
  return (ctor: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(this: unknown, player: Player, struct: PacketStruct, ...otherArgs: never[]) => O>) => {
    FlameworkIgnited.Once(() => {
      (<UnionToIntersection<ServerReceiver<I, O>>>remote)["setCallback" in remote ? "setCallback" : "connect"]((...args) => {
        const [player, { buffer, blobs }] = args;
        args.shift();

        const struct = deserializer.deserialize(buffer, blobs);
        return callMethodOnDependency(ctor, descriptor, player, struct, ...<never[]><unknown>args);
      });
    });
  }
}