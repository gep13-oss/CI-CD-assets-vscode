import 'reflect-metadata';

import { Container } from 'inversify';
import TYPES from './types';
import { ICommand } from './commands/icommand';
import { CommandManager } from './commands/command-manager';
import { AllCommand } from './commands/all-command';
import { AppVeyorCommand } from './commands/appveyor-command';
import { DependabotCommand } from './commands/dependabot-command';
import { EditorConfigCommand } from './commands/editorconfig-command';
import { GitAttributesCommand } from './commands/gitattributes-command';
import { GitHubCommand } from './commands/github-command';
import { GitIgnoreCommand } from './commands/gitignore-command';
import { GitReleaseManagerCommand } from './commands/gitreleasemanager-command';
import { MergifyCommand } from './commands/mergify-command';
import { TravisCommand } from './commands/travis-command';
import { WyamCommand } from './commands/wyam-command';
import { MessageService } from './message-service';
import { FileSystemService } from './filesystem-service';
import { NetworkService } from './network-service';
import { ConfigurationService } from './configuration-service';

const container = new Container();
container.bind(TYPES.MessageService).to(MessageService).inSingletonScope();
container.bind(TYPES.FileSystemService).to(FileSystemService).inSingletonScope();
container.bind(TYPES.NetworkService).to(NetworkService).inSingletonScope();
container.bind(TYPES.ConfigurationService).to(ConfigurationService).inSingletonScope();
container.bind<ICommand>(TYPES.Command).to(AllCommand);
container.bind<ICommand>(TYPES.Command).to(AppVeyorCommand);
container.bind<ICommand>(TYPES.Command).to(DependabotCommand);
container.bind<ICommand>(TYPES.Command).to(EditorConfigCommand);
container.bind<ICommand>(TYPES.Command).to(GitAttributesCommand);
container.bind<ICommand>(TYPES.Command).to(GitHubCommand);
container.bind<ICommand>(TYPES.Command).to(GitIgnoreCommand);
container.bind<ICommand>(TYPES.Command).to(GitReleaseManagerCommand);
container.bind<ICommand>(TYPES.Command).to(MergifyCommand);
container.bind<ICommand>(TYPES.Command).to(TravisCommand);
container.bind<ICommand>(TYPES.Command).to(WyamCommand);

container.bind<CommandManager>(TYPES.CommandManager).to(CommandManager);

export default container;
