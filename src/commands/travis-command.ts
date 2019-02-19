import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageHandler } from '../message-handler';
import TYPES from '../types';

 @injectable()
export class TravisCommand implements ICommand {

   constructor(
    @inject(TYPES.MessageHandler) private messageHandler: MessageHandler
  ) {}

   get id() { return "cicd.travis"; }

   execute(...args: any[]) {
    this.messageHandler.showInformation('cicd.travis');
  }
}
