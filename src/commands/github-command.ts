import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageService } from "../message-service";
import { FileSystemService } from "../filesystem-service";
import { NetworkService } from "../network-service";
import { ConfigurationService } from "../configuration-service";
import TYPES from "../types";
const replace = require('replace-in-file');

@injectable()
export class GitHubCommand implements ICommand {
  constructor(
    @inject(TYPES.MessageService) private messageService: MessageService,
    @inject(TYPES.FileSystemService) private fileSystemService: FileSystemService,
    @inject(TYPES.NetworkService) private networkService: NetworkService,
    @inject(TYPES.ConfigurationService) private configurationService: ConfigurationService
  ) {}

  get id() {
    return "cicd.github";
  }

  async execute() {
    let context = this;

    var workspaceRootPath = context.fileSystemService.checkForWorkspace();
    if (workspaceRootPath !== "") {
      let projectName = await context.messageService.showInput("Enter the project name...", "");

      var gitHubFolderPath = context.fileSystemService.combinePath(workspaceRootPath, ".github");
      if (!context.fileSystemService.directoryExists(gitHubFolderPath)) {
        context.fileSystemService.directoryCreate(gitHubFolderPath);
      }

      const gitHubFiles = this.configurationService.getConfigSection("cicd", "github");

      Promise.all(
        gitHubFiles.map(async gitHubFile => {
          var gitHubFilePath = context.fileSystemService.combinePath(gitHubFolderPath, gitHubFile.name);
          var ready = await context.fileSystemService.checkForExisting(gitHubFilePath);

          if (!ready) {
            return;
          }

          let file = context.fileSystemService.createWriteStream(gitHubFilePath);
          let result = await context.networkService.downloadFile(gitHubFile.url, file);
          return { success: result, name: gitHubFile.name };
        })
      ).then(function(results) {
        results.forEach(result => {
          var castResult = result as any;
          if (castResult.success) {
            context.messageService.showInformation(`${castResult.name} File downloaded correctly.`);
          } else {
            context.messageService.showError(
              `Error downloading ${castResult.name} File.`
            );
          }
        });

        const options = {
          files: gitHubFolderPath + "/*.md",
          from: /<projectName>/g,
          to: projectName
        };

        replace(options);
      });
    }
  }
}
