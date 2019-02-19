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
import { MessageHandler } from './message-handler';
import { FileSystemHandler } from './filesystem-handler';
import { NetworkHandler } from './network-handler';
import { ConfigurationHandler } from './configuration-handler';

const container = new Container();
container.bind(TYPES.MessageHandler).to(MessageHandler).inSingletonScope();
container.bind(TYPES.FileSystemHandler).to(FileSystemHandler).inSingletonScope();
container.bind(TYPES.NetworkHandler).to(NetworkHandler).inSingletonScope();
container.bind(TYPES.ConfigurationHandler).to(ConfigurationHandler).inSingletonScope();
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
