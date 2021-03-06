import * as vscode from "vscode";
import { multiInject, injectable, inject } from "inversify";
import TYPES from "../types";
import { ICommand } from "./icommand";
import { IAllCommand } from "./iallcommand";

@injectable()
export class CommandManager {
  constructor(
    @multiInject(TYPES.Command) private commands: ICommand[],
    @inject(TYPES.AllCommand) private allCommand: IAllCommand
  ) {}

  registerCommands(context: vscode.ExtensionContext) {
    for (const c of this.commands) {
      const cmd = vscode.commands.registerCommand(c.id, c.execute, c);
      context.subscriptions.push(cmd);
    }

    context.subscriptions.push(vscode.commands.registerCommand(this.allCommand.id, this.allCommand.execute, this.allCommand));
  }
}
