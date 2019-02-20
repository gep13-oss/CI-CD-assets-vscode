import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageService } from "../message-service";
import { FileSystemService } from "../filesystem-service";
import { NetworkService } from "../network-service";
import { ConfigurationService } from "../configuration-service";
import TYPES from "../types";

@injectable()
export class EditorConfigCommand implements ICommand {
  constructor(
    @inject(TYPES.MessageService) private messageService: MessageService,
    @inject(TYPES.FileSystemService) private fileSystemService: FileSystemService,
    @inject(TYPES.NetworkService) private networkService: NetworkService,
    @inject(TYPES.ConfigurationService) private configurationService: ConfigurationService
  ) {}

  get id() {
    return "cicd.editorconfig";
  }

  async execute() {
    var workspaceRootPath = this.fileSystemService.checkForWorkspace();
    if (workspaceRootPath !== "") {
      var editorConfigFilePath = this.fileSystemService.combinePath(workspaceRootPath, ".editorconfig");
      var ready = await this.fileSystemService.checkForExisting(editorConfigFilePath);

      if (!ready) {
        return;
      }

      var file = this.fileSystemService.createWriteStream(editorConfigFilePath);
      var config = this.configurationService.getConfig("cicd");

      if (!config) {
        this.messageService.showError("Could not find CI/CD Configuration.");
        return;
      }

      var uri = config.urls.editorconfig;
      var result = await this.networkService.downloadFile(uri, file);

      if (result) {
        this.messageService.showInformation(
          "EditorConfig File downloaded correctly."
        );
      } else {
        this.messageService.showError("Error downloading EditorConfig File.");
      }
    }
  }
}
