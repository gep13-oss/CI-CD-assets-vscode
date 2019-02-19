import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageHandler } from '../message-handler';
import TYPES from '../types';

 @injectable()
export class DependabotCommand implements ICommand {

   constructor(
    @inject(TYPES.MessageHandler) private messageHandler: MessageHandler
  ) {}

   get id() { return "cicd.dependabot"; }

   execute(...args: any[]) {
    this.messageHandler.showInformation('cicd.depdendabot');
  }
}
