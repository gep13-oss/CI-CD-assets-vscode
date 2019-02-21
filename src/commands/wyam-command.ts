import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageService } from "../message-service";
import { FileSystemService } from "../filesystem-service";
import { NetworkService } from "../network-service";
import { ConfigurationService } from "../configuration-service";
import TYPES from "../types";

@injectable()
export class WyamCommand implements ICommand {
  constructor(
    @inject(TYPES.MessageService) private messageService: MessageService,
    @inject(TYPES.FileSystemService) private fileSystemService: FileSystemService,
    @inject(TYPES.NetworkService) private networkService: NetworkService,
    @inject(TYPES.ConfigurationService) private configurationService: ConfigurationService
  ) {}

  get id() {
    return "cicd.wyam";
  }

  async execute() {
    var workspaceRootPath = this.fileSystemService.checkForWorkspace();
    if (workspaceRootPath !== "") {
      var wyamFilePath = this.fileSystemService.combinePath(workspaceRootPath, "config.wyam");
      var ready = await this.fileSystemService.checkForExisting(wyamFilePath);

      if (!ready) {
        return;
      }

      var file = this.fileSystemService.createWriteStream(wyamFilePath);
      var uri = this.configurationService.getConfigSection("cicd", "wyam");
      var result = await this.networkService.downloadFile(uri, file);

      if (result) {
        this.messageService.showInformation("config.wyam File downloaded correctly.");
      } else {
        this.messageService.showError("Error downloading config.wyam File.");
      }
    }
  }
}
