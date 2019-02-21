import { injectable, multiInject } from "inversify";
import TYPES from "../types";
import { ICommand } from "./icommand";
import { IAllCommand } from "./iallcommand";

@injectable()
export class AllCommand implements IAllCommand {
  constructor(@multiInject(TYPES.Command) private commands: ICommand[]) {}

  get id() {
    return "cicd.all";
  }

  async execute() {
    for (const c of this.commands) {
      await c.execute();
    }
  }
}
