import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageHandler } from "../message-handler";
import { FileSystemHandler } from "../filesystem-handler";
import { NetworkHandler } from "../network-handler";
import { ConfigurationHandler } from "../configuration-handler";
import TYPES from "../types";

@injectable()
export class GitIgnoreCommand implements ICommand {
  constructor(
    @inject(TYPES.MessageHandler) private messageHandler: MessageHandler,
    @inject(TYPES.FileSystemHandler)
    private fileSystemHandler: FileSystemHandler,
    @inject(TYPES.NetworkHandler) private networkHandler: NetworkHandler,
    @inject(TYPES.ConfigurationHandler)
    private configurationHandler: ConfigurationHandler
  ) {}

  get id() {
    return "cicd.gitignore";
  }

  async execute(...args: any[]) {
    var workspaceRootPath = this.fileSystemHandler.checkForWorkspace();
    if (workspaceRootPath !== "") {
      var gitIgnoreFilePath = this.fileSystemHandler.combinePath(workspaceRootPath, ".gitignore");
      var ready = await this.fileSystemHandler.checkForExisting(gitIgnoreFilePath);

      if (!ready) {
        return;
      }

      var file = this.fileSystemHandler.createWriteStream(gitIgnoreFilePath);
      var config = this.configurationHandler.getConfig("cicd");

      if (!config) {
        this.messageHandler.showError("Could not find CI/CD Configuration.");
        return;
      }

      var uri = config.urls.gitignore;
      var result = await this.networkHandler.downloadFile(uri, file);

      if (result) {
        this.messageHandler.showInformation(".gitignore File downloaded correctly.");
      } else {
        this.messageHandler.showError("Error downloading .gitignore File.");
      }
    }
  }
}
