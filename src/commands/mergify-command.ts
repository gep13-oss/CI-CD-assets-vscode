import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageService } from "../message-service";
import { FileSystemService } from "../filesystem-service";
import { NetworkService } from "../network-service";
import { ConfigurationService } from "../configuration-service";
import TYPES from "../types";

@injectable()
export class MergifyCommand implements ICommand {
  constructor(
    @inject(TYPES.MessageService) private messageService: MessageService,
    @inject(TYPES.FileSystemService) private fileSystemService: FileSystemService,
    @inject(TYPES.NetworkService) private networkService: NetworkService,
    @inject(TYPES.ConfigurationService) private configurationService: ConfigurationService
  ) {}

  get id() {
    return "cicd.mergify";
  }

  async execute() {
    var workspaceRootPath = this.fileSystemService.checkForWorkspace();
    if (workspaceRootPath !== "") {
      var mergifyFilePath = this.fileSystemService.combinePath(workspaceRootPath, ".mergify.yml");
      var ready = await this.fileSystemService.checkForExisting(mergifyFilePath);

      if (!ready) {
        return;
      }

      var file = this.fileSystemService.createWriteStream(mergifyFilePath);
      var uri = this.configurationService.getConfigSection("cicd", "mergify");
      var result = await this.networkService.downloadFile(uri, file);

      if (result) {
        this.messageService.showInformation(".mergify.yml File downloaded correctly.");
      } else {
        this.messageService.showError("Error downloading .mergify.yml File.");
      }
    }
  }
}
