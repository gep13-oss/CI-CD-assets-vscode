import {commands, window, workspace} from "vscode";
import * as request from "request";
import * as path from "path"
import * as fs from "fs";
const replace = require('replace-in-file');

export function activate(): void {
    // register Commands
    commands.registerCommand("cicd.editorconfig", async () => downloadEditorConfigFile());
    commands.registerCommand("cicd.appveyor", async () => downloadAppVeyorConfigFile());
    commands.registerCommand("cicd.gitattributes", async () => downloadGitAttributesFile());
    commands.registerCommand("cicd.gitignore", async () => downloadGitIgnoreFile());
    commands.registerCommand("cicd.mergify", async () => downloadMergifyFile());
    commands.registerCommand("cicd.travis", async () => downloadTravisFile());
    commands.registerCommand("cicd.gitreleasemanager", async () => downloadGitReleaseManagerFile());
    commands.registerCommand("cicd.wyam", async () => downloadWyamFile());
    commands.registerCommand("cicd.github", async () => downloadGitHubFiles());
    commands.registerCommand("cicd.all", async () => downloadAllFiles());
    commands.registerCommand("cicd.dependabot", async () => downloadDependabotFile());
}

async function checkForExisting(path: string): Promise<boolean> {
  if (fs.existsSync(path)) {
      var message = `Overwrite the existing \'${path}\' file in this folder?`;
      var option = await window.showWarningMessage(message, 'Overwrite');
      return option === 'Overwrite';
  }

  return true;
}

function checkForWorkspace(): string {
  if (workspace.rootPath !== undefined) {
    return workspace.rootPath;
  } else {
    window.showErrorMessage("No workspace is currently open.");
    return "";
  }
}

function downloadFile(uriToDownload: string, stream: NodeJS.WritableStream): Thenable<boolean> {
  return new Promise((resolve, reject) => {
      request
          .get(uriToDownload, { timeout: 4000 })
          .on('response', function(response: any) {
              if (response.statusCode === 200) {
                  resolve(true);
              } else {
                  reject(
                      `Failed to download file: ${
                          response.statusMessage
                      }`
                  );
              }
          })
          .on('error', function(e: any) {
              reject(`Failed to download file: ${e}`);
          })
          .pipe(stream);
  });
}

async function downloadEditorConfigFile(): Promise<void> {
  var workspaceRootPath = checkForWorkspace();
  if(workspaceRootPath !== "") {
    var editorConfigFilePath = path.join(workspaceRootPath, '.editorconfig');
    var ready = await checkForExisting(editorConfigFilePath);

    if(!ready) {
      return;
    }

    var file = fs.createWriteStream(editorConfigFilePath);
    var config = workspace.getConfiguration('cicd');

    if (!config) {
      window.showErrorMessage("Could not find CI/CD Configuration.");
      return;
    }

    var uri = config.urls.editorconfig;
    var result = await downloadFile(uri, file);

    if(result) {
     window.showInformationMessage("EditorConfig File downloaded correctly.");
    } else {
      window.showErrorMessage("Error downloading EditorConfig File.");
    }
  }
}

async function downloadAppVeyorConfigFile(): Promise<void> {
  var workspaceRootPath = checkForWorkspace();
  if(workspaceRootPath !== "") {
    var appveyorFilePath = path.join(workspaceRootPath, '.appveyor.yml');
    var ready = await checkForExisting(appveyorFilePath);

    if(!ready) {
      return;
    }

    var file = fs.createWriteStream(appveyorFilePath);
    var config = workspace.getConfiguration('cicd');

    if (!config) {
      window.showErrorMessage("Could not find CI/CD Configuration.");
      return;
    }

    var uri = config.urls.appveyor;
    var result = await downloadFile(uri, file);

    if(result) {
      window.showInformationMessage("AppVeyor File downloaded correctly.");
    } else {
      window.showErrorMessage("Error downloading AppVeyor File.");
    }
  }
}

async function downloadGitAttributesFile(): Promise<void> {
  var workspaceRootPath = checkForWorkspace();
  if(workspaceRootPath !== "") {
    var gitAttributesFilePath = path.join(workspaceRootPath, '.gitattributes');
    var ready = await checkForExisting(gitAttributesFilePath);

    if(!ready) {
      return;
    }

    var file = fs.createWriteStream(gitAttributesFilePath);
    var config = workspace.getConfiguration('cicd');

    if (!config) {
      window.showErrorMessage("Could not find CI/CD Configuration.");
      return;
    }

    var uri = config.urls.gitattributes;
    var result = await downloadFile(uri, file);

    if(result) {
      window.showInformationMessage(".gitattributes File downloaded correctly.");
    } else {
      window.showErrorMessage("Error downloading .gitattributes File.");
    }
  }
}

async function downloadGitIgnoreFile(): Promise<void> {
  var workspaceRootPath = checkForWorkspace();
  if(workspaceRootPath !== "") {
    var gitIgnoreFilePath = path.join(workspaceRootPath, '.gitignore');
    var ready = await checkForExisting(gitIgnoreFilePath);

    if(!ready) {
      return;
    }

    var file = fs.createWriteStream(gitIgnoreFilePath);
    var config = workspace.getConfiguration('cicd');

    if (!config) {
      window.showErrorMessage("Could not find CI/CD Configuration.");
      return;
    }

    var uri = config.urls.gitignore;
    var result = await downloadFile(uri, file);

    if(result) {
      window.showInformationMessage(".gitignore File downloaded correctly.");
    } else {
      window.showErrorMessage("Error downloading .gitignore File.");
    }
  }
}

async function downloadMergifyFile(): Promise<void> {
  var workspaceRootPath = checkForWorkspace();
  if(workspaceRootPath !== "") {
    var mergifyFilePath = path.join(workspaceRootPath, '.mergify.yml');
    var ready = await checkForExisting(mergifyFilePath);

    if(!ready) {
      return;
    }

    var file = fs.createWriteStream(mergifyFilePath);
    var config = workspace.getConfiguration('cicd');

    if (!config) {
      window.showErrorMessage("Could not find CI/CD Configuration.");
      return;
    }

    var uri = config.urls.mergify;
    var result = await downloadFile(uri, file);

    if(result) {
      window.showInformationMessage(".mergify.yml File downloaded correctly.");
    } else {
      window.showErrorMessage("Error downloading .mergify.yml File.");
    }
  }
}

async function downloadTravisFile(): Promise<void> {
  var workspaceRootPath = checkForWorkspace();
  if(workspaceRootPath !== "") {
    var travisFilePath = path.join(workspaceRootPath, '.travis.yml');
    var ready = await checkForExisting(travisFilePath);

    if(!ready) {
      return;
    }

    var file = fs.createWriteStream(travisFilePath);
    var config = workspace.getConfiguration('cicd');

    if (!config) {
      window.showErrorMessage("Could not find CI/CD Configuration.");
      return;
    }

    var uri = config.urls.travis;
    var result = await downloadFile(uri, file);

    if(result) {
      window.showInformationMessage(".travis.yml File downloaded correctly.");
    } else {
      window.showErrorMessage("Error downloading .travis.yml File.");
    }
  }
}

async function downloadGitReleaseManagerFile(): Promise<void> {
  var workspaceRootPath = checkForWorkspace();
  if(workspaceRootPath !== "") {
    var gitReleaseManagerFilePath = path.join(workspaceRootPath, 'GitReleaseManager.yaml');
    var ready = await checkForExisting(gitReleaseManagerFilePath);

    if(!ready) {
      return;
    }

    var file = fs.createWriteStream(gitReleaseManagerFilePath);
    var config = workspace.getConfiguration('cicd');

    if (!config) {
      window.showErrorMessage("Could not find CI/CD Configuration.");
      return;
    }

    var uri = config.urls.gitreleasemanager;
    var result = await downloadFile(uri, file);

    if(result) {
      window.showInformationMessage("GitReleaseManager.yaml File downloaded correctly.");
    } else {
      window.showErrorMessage("Error downloading GitReleaseManager.yaml File.");
    }
  }
}

async function downloadWyamFile(): Promise<void> {
  var workspaceRootPath = checkForWorkspace();
  if(workspaceRootPath !== "") {
    var wyamFilePath = path.join(workspaceRootPath, 'config.wyam');
    var ready = await checkForExisting(wyamFilePath);

    if(!ready) {
      return;
    }

    var file = fs.createWriteStream(wyamFilePath);
    var config = workspace.getConfiguration('cicd');

    if (!config) {
      window.showErrorMessage("Could not find CI/CD Configuration.");
      return;
    }

    var uri = config.urls.wyam;
    var result = await downloadFile(uri, file);

    if(result) {
      window.showInformationMessage("config.wyam File downloaded correctly.");
    } else {
      window.showErrorMessage("Error downloading config.wyam File.");
    }
  }
}

async function downloadGitHubFiles(): Promise<void> {
  var workspaceRootPath = checkForWorkspace();
  if(workspaceRootPath !== "") {
    let projectName = await window.showInputBox({
      placeHolder: "Enter the project name...",
      value: ""
    });

    var gitHubFolderPath = path.join(workspaceRootPath, ".github");
    if(!fs.existsSync(gitHubFolderPath)) {
      fs.mkdirSync(gitHubFolderPath);
    }

    var config = workspace.getConfiguration('cicd');

    if (!config) {
      window.showErrorMessage("Could not find CI/CD Configuration.");
      return;
    }

    const gitHubFiles = config.urls.github;

    Promise.all(gitHubFiles.map(async gitHubFile => {
      var gitHubFilePath = path.join(gitHubFolderPath, gitHubFile.name);
      var ready = await checkForExisting(gitHubFilePath);

      if(!ready) {
        return;
      }

      let file = fs.createWriteStream(gitHubFilePath);
      let result = await downloadFile(gitHubFile.url, file);
      return { "success": result, "name": gitHubFile.name}
    })).then(function(results) {
      results.forEach(result => {
        var castResult = (result as any);
        if(castResult.success) {
          window.showInformationMessage(`${castResult.name} File downloaded correctly.`);
        } else {
          window.showErrorMessage(`Error downloading ${castResult.name} File.`);
        }

        const options = {
          files: gitHubFolderPath + "/*.md",
          from: /<projectName>/g,
          to: projectName,
        };

        replace(options);
      });
    });
  }
}

async function downloadAllFiles(): Promise<void> {
  downloadAppVeyorConfigFile()
    .then(downloadEditorConfigFile)
    .then(downloadGitAttributesFile)
    .then(downloadGitHubFiles)
    .then(downloadGitIgnoreFile)
    .then(downloadGitReleaseManagerFile)
    .then(downloadMergifyFile)
    .then(downloadTravisFile)
    .then(downloadWyamFile)
    .then(downloadDependabotFile);
}

async function downloadDependabotFile(): Promise<void> {
  var workspaceRootPath = checkForWorkspace();
  if(workspaceRootPath !== "") {
    var dependabotFolderPath = path.join(workspaceRootPath, ".dependabot");
    if(!fs.existsSync(dependabotFolderPath)) {
      fs.mkdirSync(dependabotFolderPath);
    }

    var dependabotFilePath = path.join(dependabotFolderPath, "config.yml");
    var ready = await checkForExisting(dependabotFilePath);

    if(!ready) {
      return;
    }

    var file = fs.createWriteStream(dependabotFilePath);
    var config = workspace.getConfiguration('cicd');

    if (!config) {
      window.showErrorMessage("Could not find CI/CD Configuration.");
      return;
    }

    var uri = config.urls.dependabot;
    var result = await downloadFile(uri, file);

    if(result) {
      window.showInformationMessage(".dependabot/config.yml File downloaded correctly.");
    } else {
      window.showErrorMessage("Error downloading .dependabot/config.yml File.");
    }
  }
}
