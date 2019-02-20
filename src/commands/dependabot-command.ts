import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageHandler } from "../message-handler";
import { FileSystemHandler } from "../filesystem-handler";
import { NetworkHandler } from "../network-handler";
import { ConfigurationHandler } from "../configuration-handler";
import TYPES from "../types";

@injectable()
export class DependabotCommand implements ICommand {
  constructor(
    @inject(TYPES.MessageHandler) private messageHandler: MessageHandler,
    @inject(TYPES.FileSystemHandler)
    private fileSystemHandler: FileSystemHandler,
    @inject(TYPES.NetworkHandler) private networkHandler: NetworkHandler,
    @inject(TYPES.ConfigurationHandler)
    private configurationHandler: ConfigurationHandler
  ) {}

  get id() {
    return "cicd.dependabot";
  }

  async execute(...args: any[]) {
    var workspaceRootPath = this.fileSystemHandler.checkForWorkspace();
    if (workspaceRootPath !== "") {
      var dependabotFolderPath = this.fileSystemHandler.combinePath(workspaceRootPath, ".dependabot");
      if (!this.fileSystemHandler.directoryExists(dependabotFolderPath)) {
        this.fileSystemHandler.directoryCreate(dependabotFolderPath);
      }

      var dependabotFilePath = this.fileSystemHandler.combinePath(dependabotFolderPath, "config.yml");
      var ready = await this.fileSystemHandler.checkForExisting(dependabotFilePath);

      if (!ready) {
        return;
      }

      var file = this.fileSystemHandler.createWriteStream(dependabotFilePath);
      var config = this.configurationHandler.getConfig("cicd");

      if (!config) {
        this.messageHandler.showError("Could not find CI/CD Configuration.");
        return;
      }

      var uri = config.urls.dependabot;
      var result = await this.networkHandler.downloadFile(uri, file);

      if (result) {
        this.messageHandler.showInformation(
          ".dependabot/config.yml File downloaded correctly."
        );
      } else {
        this.messageHandler.showError(
          "Error downloading .dependabot/config.yml File."
        );
      }
    }
  }
}
