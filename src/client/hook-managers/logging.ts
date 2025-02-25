import { Controller, Modding, type OnStart } from "core";
import { BaseComponent } from "components";

import { LogStart } from "shared/hooks";
import Log from "shared/log";

@Controller()
export class LoggingController implements OnStart {
  public onStart(): void {
    Modding.onListenerAdded<LogStart>(object => object instanceof BaseComponent ? Log.clientComponent(object) : Log.controller(object));
  }
}