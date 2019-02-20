import { workspace } from "vscode";

import { injectable } from "inversify";

@injectable()
export class ConfigurationService {
  getConfig(name: string) {
    return workspace.getConfiguration(name);
  }
}
