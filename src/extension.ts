import * as vscode from 'vscode';
import { CommandManager } from './commands/command-manager';
import container from './inversify.config';
import TYPES from './types';

export function activate(context: vscode.ExtensionContext) {
  const cmdManager = container.get<CommandManager>(TYPES.CommandManager);
  cmdManager.registerCommands(context);
}

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
