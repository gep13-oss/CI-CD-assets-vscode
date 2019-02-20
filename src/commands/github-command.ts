import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageHandler } from "../message-handler";
import { FileSystemHandler } from "../filesystem-handler";
import { NetworkHandler } from "../network-handler";
import { ConfigurationHandler } from "../configuration-handler";
import TYPES from "../types";
const replace = require('replace-in-file');

@injectable()
export class GitHubCommand implements ICommand {
  constructor(
    @inject(TYPES.MessageHandler) private messageHandler: MessageHandler,
    @inject(TYPES.FileSystemHandler)
    private fileSystemHandler: FileSystemHandler,
    @inject(TYPES.NetworkHandler) private networkHandler: NetworkHandler,
    @inject(TYPES.ConfigurationHandler)
    private configurationHandler: ConfigurationHandler
  ) {}

  get id() {
    return "cicd.github";
  }

  async execute() {
    let context = this;

    var workspaceRootPath = context.fileSystemHandler.checkForWorkspace();
    if (workspaceRootPath !== "") {
      let projectName = await context.messageHandler.showInput("Enter the project name...", "");

      var gitHubFolderPath = context.fileSystemHandler.combinePath(workspaceRootPath, ".github");
      if (!context.fileSystemHandler.directoryExists(gitHubFolderPath)) {
        context.fileSystemHandler.directoryCreate(gitHubFolderPath);
      }

      var config = context.configurationHandler.getConfig("cicd");

      if (!config) {
        context.messageHandler.showError("Could not find CI/CD Configuration.");
        return;
      }

      const gitHubFiles = config.urls.github;

      Promise.all(
        gitHubFiles.map(async gitHubFile => {
          var gitHubFilePath = context.fileSystemHandler.combinePath(gitHubFolderPath, gitHubFile.name);
          var ready = await context.fileSystemHandler.checkForExisting(gitHubFilePath);

          if (!ready) {
            return;
          }

          let file = context.fileSystemHandler.createWriteStream(gitHubFilePath);
          let result = await context.networkHandler.downloadFile(gitHubFile.url, file);
          return { success: result, name: gitHubFile.name };
        })
      ).then(function(results) {
        results.forEach(result => {
          var castResult = result as any;
          if (castResult.success) {
            context.messageHandler.showInformation(
              `${castResult.name} File downloaded correctly.`
            );
          } else {
            context.messageHandler.showError(
              `Error downloading ${castResult.name} File.`
            );
          }

          const options = {
            files: gitHubFolderPath + "/*.md",
            from: /<projectName>/g,
            to: projectName
          };

          replace(options);
        });
      });
    }
  }
}
