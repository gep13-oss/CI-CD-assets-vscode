import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageService } from "../message-service";
import { FileSystemService } from "../filesystem-service";
import { NetworkService } from "../network-service";
import { ConfigurationService } from "../configuration-service";
import TYPES from "../types";

@injectable()
export class GitIgnoreCommand implements ICommand {
  constructor(
    @inject(TYPES.MessageService) private messageService: MessageService,
    @inject(TYPES.FileSystemService) private fileSystemService: FileSystemService,
    @inject(TYPES.NetworkService) private networkService: NetworkService,
    @inject(TYPES.ConfigurationService) private configurationService: ConfigurationService
  ) {}

  get id() {
    return "cicd.gitignore";
  }

  async execute() {
    var workspaceRootPath = this.fileSystemService.checkForWorkspace();
    if (workspaceRootPath !== "") {
      var gitIgnoreFilePath = this.fileSystemService.combinePath(workspaceRootPath, ".gitignore");
      var ready = await this.fileSystemService.checkForExisting(gitIgnoreFilePath);

      if (!ready) {
        return;
      }

      var file = this.fileSystemService.createWriteStream(gitIgnoreFilePath);
      var uri = this.configurationService.getConfigSection("cicd", "gitignore");
      var result = await this.networkService.downloadFile(uri, file);

      if (result) {
        this.messageService.showInformation(".gitignore File downloaded correctly.");
      } else {
        this.messageService.showError("Error downloading .gitignore File.");
      }
    }
  }
}
