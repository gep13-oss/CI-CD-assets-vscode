export interface IAllCommand {
  id: string;
  execute(...args: any[]): any;
}
