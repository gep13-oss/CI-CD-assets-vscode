import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageService } from "../message-service";
import { FileSystemService } from "../filesystem-service";
import { NetworkService } from "../network-service";
import { ConfigurationService } from "../configuration-service";
import TYPES from "../types";

@injectable()
export class DependabotCommand implements ICommand {
  constructor(
    @inject(TYPES.MessageService) private messageService: MessageService,
    @inject(TYPES.FileSystemService) private fileSystemService: FileSystemService,
    @inject(TYPES.NetworkService) private networkService: NetworkService,
    @inject(TYPES.ConfigurationService) private configurationService: ConfigurationService
  ) {}

  get id() {
    return "cicd.dependabot";
  }

  async execute() {
    var workspaceRootPath = this.fileSystemService.checkForWorkspace();
    if (workspaceRootPath !== "") {
      var dependabotFolderPath = this.fileSystemService.combinePath(workspaceRootPath, ".dependabot");
      if (!this.fileSystemService.directoryExists(dependabotFolderPath)) {
        this.fileSystemService.directoryCreate(dependabotFolderPath);
      }

      var dependabotFilePath = this.fileSystemService.combinePath(dependabotFolderPath, "config.yml");
      var ready = await this.fileSystemService.checkForExisting(dependabotFilePath);

      if (!ready) {
        return;
      }

      var file = this.fileSystemService.createWriteStream(dependabotFilePath);
      var uri = this.configurationService.getConfigSection("cicd", "dependabot");
      var result = await this.networkService.downloadFile(uri, file);

      if (result) {
        this.messageService.showInformation(".dependabot/config.yml File downloaded correctly.");
      } else {
        this.messageService.showError(
          "Error downloading .dependabot/config.yml File."
        );
      }
    }
  }
}
