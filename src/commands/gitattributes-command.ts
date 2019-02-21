import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageService } from "../message-service";
import { FileSystemService } from "../filesystem-service";
import { NetworkService } from "../network-service";
import { ConfigurationService } from "../configuration-service";
import TYPES from "../types";

@injectable()
export class GitAttributesCommand implements ICommand {
  constructor(
    @inject(TYPES.MessageService) private messageService: MessageService,
    @inject(TYPES.FileSystemService) private fileSystemService: FileSystemService,
    @inject(TYPES.NetworkService) private networkService: NetworkService,
    @inject(TYPES.ConfigurationService) private configurationService: ConfigurationService
  ) {}

  get id() {
    return "cicd.gitattributes";
  }

  async execute() {
    var workspaceRootPath = this.fileSystemService.checkForWorkspace();
    if (workspaceRootPath !== "") {
      var gitAttributesFilePath = this.fileSystemService.combinePath(workspaceRootPath, ".gitattributes");
      var ready = await this.fileSystemService.checkForExisting(gitAttributesFilePath);

      if (!ready) {
        return;
      }

      var file = this.fileSystemService.createWriteStream(gitAttributesFilePath);
      var uri = this.configurationService.getConfigSection("cicd", "gitattributes");
      var result = await this.networkService.downloadFile(uri, file);

      if (result) {
        this.messageService.showInformation(".gitattributes File downloaded correctly.");
      } else {
        this.messageService.showError("Error downloading .gitattributes File.");
      }
    }
  }
}
