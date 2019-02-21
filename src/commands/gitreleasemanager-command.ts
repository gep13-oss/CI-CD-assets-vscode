import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageService } from "../message-service";
import { FileSystemService } from "../filesystem-service";
import { NetworkService } from "../network-service";
import { ConfigurationService } from "../configuration-service";
import TYPES from "../types";

@injectable()
export class GitReleaseManagerCommand implements ICommand {
  constructor(
    @inject(TYPES.MessageService) private messageService: MessageService,
    @inject(TYPES.FileSystemService) private fileSystemService: FileSystemService,
    @inject(TYPES.NetworkService) private networkService: NetworkService,
    @inject(TYPES.ConfigurationService) private configurationService: ConfigurationService
  ) {}

  get id() {
    return "cicd.gitreleasemanager";
  }

  async execute() {
    var workspaceRootPath = this.fileSystemService.checkForWorkspace();
    if (workspaceRootPath !== "") {
      var gitReleaseManagerFilePath = this.fileSystemService.combinePath(workspaceRootPath, "GitReleaseManager.yaml");
      var ready = await this.fileSystemService.checkForExisting(gitReleaseManagerFilePath);

      if (!ready) {
        return;
      }

      var file = this.fileSystemService.createWriteStream(gitReleaseManagerFilePath);
      var uri = this.configurationService.getConfigSection("cicd", "gitreleasemanager");
      var result = await this.networkService.downloadFile(uri, file);

      if (result) {
        this.messageService.showInformation("GitReleaseManager.yaml File downloaded correctly.");
      } else {
        this.messageService.showError("Error downloading GitReleaseManager.yaml File.");
      }
    }
  }
}
