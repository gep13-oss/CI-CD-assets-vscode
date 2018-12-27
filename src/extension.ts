import {commands, window, workspace} from "vscode";
import * as request from "request";
import * as path from "path"
import * as fs from "fs";

export function activate(): void {
    // register Commands
    commands.registerCommand("cicd.editorconfig", async () => downloadEditorConfigFile());
    commands.registerCommand("cicd.appveyor", async () => downloadAppVeyorConfigFile());
    commands.registerCommand("cicd.gitattributes", async () => downloadGitAttributesFile());
    commands.registerCommand("cicd.gitignore", async () => downloadGitIgnoreFile());
    commands.registerCommand("cicd.mergify", async () => downloadMergifyFile());
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
