import * as vscode from 'vscode';
import { CommandManager } from './commands/command-manager';
import container from './inversify.config';
import TYPES from './types';

export function activate(context: vscode.ExtensionContext) {
  const cmdManager = container.get<CommandManager>(TYPES.CommandManager);
  cmdManager.registerCommands(context);
}

// async function downloadWyamFile(): Promise<void> {
//   var workspaceRootPath = checkForWorkspace();
//   if(workspaceRootPath !== "") {
//     var wyamFilePath = path.join(workspaceRootPath, 'config.wyam');
//     var ready = await checkForExisting(wyamFilePath);

//     if(!ready) {
//       return;
//     }

//     var file = fs.createWriteStream(wyamFilePath);
//     var config = workspace.getConfiguration('cicd');

//     if (!config) {
//       window.showErrorMessage("Could not find CI/CD Configuration.");
//       return;
//     }

//     var uri = config.urls.wyam;
//     var result = await downloadFile(uri, file);

//     if(result) {
//       window.showInformationMessage("config.wyam File downloaded correctly.");
//     } else {
//       window.showErrorMessage("Error downloading config.wyam File.");
//     }
//   }
// }

// async function downloadGitHubFiles(): Promise<void> {
//   var workspaceRootPath = checkForWorkspace();
//   if(workspaceRootPath !== "") {
//     let projectName = await window.showInputBox({
//       placeHolder: "Enter the project name...",
//       value: ""
//     });

//     var gitHubFolderPath = path.join(workspaceRootPath, ".github");
//     if(!fs.existsSync(gitHubFolderPath)) {
//       fs.mkdirSync(gitHubFolderPath);
//     }

//     var config = workspace.getConfiguration('cicd');

//     if (!config) {
//       window.showErrorMessage("Could not find CI/CD Configuration.");
//       return;
//     }

//     const gitHubFiles = config.urls.github;

//     Promise.all(gitHubFiles.map(async gitHubFile => {
//       var gitHubFilePath = path.join(gitHubFolderPath, gitHubFile.name);
//       var ready = await checkForExisting(gitHubFilePath);

//       if(!ready) {
//         return;
//       }

//       let file = fs.createWriteStream(gitHubFilePath);
//       let result = await downloadFile(gitHubFile.url, file);
//       return { "success": result, "name": gitHubFile.name}
//     })).then(function(results) {
//       results.forEach(result => {
//         var castResult = (result as any);
//         if(castResult.success) {
//           window.showInformationMessage(`${castResult.name} File downloaded correctly.`);
//         } else {
//           window.showErrorMessage(`Error downloading ${castResult.name} File.`);
//         }

//         const options = {
//           files: gitHubFolderPath + "/*.md",
//           from: /<projectName>/g,
//           to: projectName,
//         };

//         replace(options);
//       });
//     });
//   }
// }

// async function downloadAllFiles(): Promise<void> {
//   downloadAppVeyorConfigFile()
//     .then(downloadEditorConfigFile)
//     .then(downloadGitAttributesFile)
//     .then(downloadGitHubFiles)
//     .then(downloadGitIgnoreFile)
//     .then(downloadGitReleaseManagerFile)
//     .then(downloadMergifyFile)
//     .then(downloadTravisFile)
//     .then(downloadWyamFile)
//     .then(downloadDependabotFile);
// }

// async function downloadDependabotFile(): Promise<void> {
//   var workspaceRootPath = checkForWorkspace();
//   if(workspaceRootPath !== "") {
//     var dependabotFolderPath = path.join(workspaceRootPath, ".dependabot");
//     if(!fs.existsSync(dependabotFolderPath)) {
//       fs.mkdirSync(dependabotFolderPath);
//     }

//     var dependabotFilePath = path.join(dependabotFolderPath, "config.yml");
//     var ready = await checkForExisting(dependabotFilePath);

//     if(!ready) {
//       return;
//     }

//     var file = fs.createWriteStream(dependabotFilePath);
//     var config = workspace.getConfiguration('cicd');

//     if (!config) {
//       window.showErrorMessage("Could not find CI/CD Configuration.");
//       return;
//     }

//     var uri = config.urls.dependabot;
//     var result = await downloadFile(uri, file);

//     if(result) {
//       window.showInformationMessage(".dependabot/config.yml File downloaded correctly.");
//     } else {
//       window.showErrorMessage("Error downloading .dependabot/config.yml File.");
//     }
//   }
// }
