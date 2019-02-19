import { workspace } from "vscode";

import { injectable } from "inversify";

@injectable()
export class ConfigurationHandler {
  getConfig(name: string) {
    return workspace.getConfiguration(name);
  }
}
