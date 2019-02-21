import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageService } from "../message-service";
import { FileSystemService } from "../filesystem-service";
import { NetworkService } from "../network-service";
import { ConfigurationService } from "../configuration-service";
import TYPES from "../types";

@injectable()
export class AppVeyorCommand implements ICommand {
  constructor(
    @inject(TYPES.MessageService) private messageService: MessageService,
    @inject(TYPES.FileSystemService) private fileSystemService: FileSystemService,
    @inject(TYPES.NetworkService) private networkService: NetworkService,
    @inject(TYPES.ConfigurationService) private configurationService: ConfigurationService
  ) {}

  get id() {
    return "cicd.appveyor";
  }

  async execute() {
    var workspaceRootPath = this.fileSystemService.checkForWorkspace();
    if (workspaceRootPath !== "") {
      var appveyorFilePath = this.fileSystemService.combinePath(workspaceRootPath, ".appveyor.yml");
      var ready = await this.fileSystemService.checkForExisting(appveyorFilePath);

      if (!ready) {
        return;
      }

      var file = this.fileSystemService.createWriteStream(appveyorFilePath);
      var uri = this.configurationService.getConfigSection("cicd", "appveyor");
      var result = await this.networkService.downloadFile(uri, file);

      if (result) {
        this.messageService.showInformation(".appveyor.yml File downloaded correctly.");
      } else {
        this.messageService.showError("Error downloading .appveyor.yml File.");
      }
    }
  }
}
