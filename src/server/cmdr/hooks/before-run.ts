import type { Registry } from "cmdr";
import { RunService as Runtime } from "services"

const DEVS = [game.CreatorId];

const enum Message {
  NoPermission = "You do not have permission to execute this command!"
}

export = function (registry: Registry) {
  registry.RegisterHook("BeforeRun", ctx => {
    switch (ctx.Group) {
      case "Dev": {
        if (DEVS.includes(ctx.Executor.UserId) || Runtime.IsStudio()) return;
        return Message.NoPermission;
      }
    }
  });
}