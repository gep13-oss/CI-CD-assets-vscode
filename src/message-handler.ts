import * as vscode from 'vscode';
import { injectable } from 'inversify';

@injectable()
export class MessageHandler {
  showInformation(message: string): void {
    vscode.window.showInformationMessage(message);
  }

  async showWarning(message: string, options: string): Promise<string | undefined> {
    return await vscode.window.showWarningMessage(message, options);
  }

  showError(message: string): void {
    vscode.window.showErrorMessage(message);
  }
}
