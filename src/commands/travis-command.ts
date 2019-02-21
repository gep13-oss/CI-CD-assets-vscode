import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageService } from "../message-service";
import { FileSystemService } from "../filesystem-service";
import { NetworkService } from "../network-service";
import { ConfigurationService } from "../configuration-service";
import TYPES from "../types";

@injectable()
export class TravisCommand implements ICommand {
  constructor(
    @inject(TYPES.MessageService) private messageService: MessageService,
    @inject(TYPES.FileSystemService) private fileSystemService: FileSystemService,
    @inject(TYPES.NetworkService) private networkService: NetworkService,
    @inject(TYPES.ConfigurationService) private configurationService: ConfigurationService
  ) {}

  get id() {
    return "cicd.travis";
  }

  async execute() {
    var workspaceRootPath = this.fileSystemService.checkForWorkspace();
    if (workspaceRootPath !== "") {
      var travisFilePath = this.fileSystemService.combinePath(workspaceRootPath, ".travis.yml");
      var ready = await this.fileSystemService.checkForExisting(travisFilePath);

      if (!ready) {
        return;
      }

      var file = this.fileSystemService.createWriteStream(travisFilePath);
      var uri = this.configurationService.getConfigSection("cicd", "travis");
      var result = await this.networkService.downloadFile(uri, file);

      if (result) {
        this.messageService.showInformation(".travis.yml File downloaded correctly.");
      } else {
        this.messageService.showError("Error downloading .travis.yml File.");
      }
    }
  }
}
