import { workspace } from "vscode";
import { injectable, inject } from "inversify";
import { MessageService } from "./message-service";
import TYPES from "./types";

@injectable()
export class ConfigurationService {
  constructor(
    @inject(TYPES.MessageService) private messageService: MessageService,
  ){}

  getConfigSection(parentSection: string, sectionName: string) {
    var config = workspace.getConfiguration(parentSection);

    if (!config) {
      this.messageService.showError("Could not find CI/CD Configuration.");
      return;
    }

    return config.urls[sectionName];
  }
}
