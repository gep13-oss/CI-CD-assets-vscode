import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageHandler } from "../message-handler";
import { FileSystemHandler } from "../filesystem-handler";
import { NetworkHandler } from "../network-handler";
import { ConfigurationHandler } from "../configuration-handler";
import TYPES from "../types";

@injectable()
export class EditorConfigCommand implements ICommand {
  constructor(
    @inject(TYPES.MessageHandler) private messageHandler: MessageHandler,
    @inject(TYPES.FileSystemHandler) private fileSystemHandler: FileSystemHandler,
    @inject(TYPES.NetworkHandler) private networkHandler: NetworkHandler,
    @inject(TYPES.ConfigurationHandler) private configurationHandler: ConfigurationHandler
  ) {}

  get id() {
    return "cicd.editorconfig";
  }

  async execute() {
    var workspaceRootPath = this.fileSystemHandler.checkForWorkspace();
    if (workspaceRootPath !== "") {
      var editorConfigFilePath = this.fileSystemHandler.combinePath(workspaceRootPath, ".editorconfig");
      var ready = await this.fileSystemHandler.checkForExisting(editorConfigFilePath);

      if (!ready) {
        return;
      }

      var file = this.fileSystemHandler.createWriteStream(editorConfigFilePath);
      var config = this.configurationHandler.getConfig("cicd");

      if (!config) {
        this.messageHandler.showError("Could not find CI/CD Configuration.");
        return;
      }

      var uri = config.urls.editorconfig;
      var result = await this.networkHandler.downloadFile(uri, file);

      if (result) {
        this.messageHandler.showInformation(
          "EditorConfig File downloaded correctly."
        );
      } else {
        this.messageHandler.showError("Error downloading EditorConfig File.");
      }
    }
  }
}
