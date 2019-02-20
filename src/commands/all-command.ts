import { injectable, inject } from "inversify";
import { ICommand } from "./icommand";
import { MessageService } from '../message-service';
import TYPES from '../types';

 @injectable()
export class AllCommand implements ICommand {

   constructor(
    @inject(TYPES.MessageService) private messageService: MessageService
  ) {}

   get id() { return "cicd.all"; }

   execute() {
    this.messageService.showInformation('cicd.all');
  }
}
