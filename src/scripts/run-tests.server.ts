import { TestRunner } from "runit";
import { ServerScriptService } from "services";

const testRunner = new TestRunner(
  ServerScriptService.WaitForChild("Tests")
);

testRunner.run({ colors: true });