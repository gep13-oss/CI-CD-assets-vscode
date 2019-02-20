import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageHandler } from "../message-handler";
import { FileSystemHandler } from "../filesystem-handler";
import { NetworkHandler } from "../network-handler";
import { ConfigurationHandler } from "../configuration-handler";
import TYPES from "../types";

@injectable()
export class TravisCommand implements ICommand {
  constructor(
    @inject(TYPES.MessageHandler) private messageHandler: MessageHandler,
    @inject(TYPES.FileSystemHandler)
    private fileSystemHandler: FileSystemHandler,
    @inject(TYPES.NetworkHandler) private networkHandler: NetworkHandler,
    @inject(TYPES.ConfigurationHandler)
    private configurationHandler: ConfigurationHandler
  ) {}

  get id() {
    return "cicd.travis";
  }

  async execute(...args: any[]) {
    var workspaceRootPath = this.fileSystemHandler.checkForWorkspace();
    if (workspaceRootPath !== "") {
      var travisFilePath = this.fileSystemHandler.combinePath(workspaceRootPath, ".travis.yml");
      var ready = await this.fileSystemHandler.checkForExisting(travisFilePath);

      if (!ready) {
        return;
      }

      var file = this.fileSystemHandler.createWriteStream(travisFilePath);
      var config = this.configurationHandler.getConfig("cicd");

      if (!config) {
        this.messageHandler.showError("Could not find CI/CD Configuration.");
        return;
      }

      var uri = config.urls.travis;
      var result = await this.networkHandler.downloadFile(uri, file);

      if (result) {
        this.messageHandler.showInformation(".travis.yml File downloaded correctly.");
      } else {
        this.messageHandler.showError("Error downloading .travis.yml File.");
      }
    }
  }
}
