import * as vscode from 'vscode';
import { TemplateQuickPickProvider } from "./TemplateQuickPickProvider";
import { CommandBuilder } from './CommandBuilder';
import { readFileSync } from 'fs';

export class TemplateRunner implements vscode.Disposable {

  private disposables: vscode.Disposable[] = [];

  constructor(private quickPickProvider: TemplateQuickPickProvider) {
    vscode.tasks.onDidEndTask((e) => {
    });
  }

  async runTemplateWithFilePath(resource?: vscode.Uri) {
    let template = await this.quickPickProvider.input();
    if (!template) { return; }
    let builder = new CommandBuilder(template);
    let cmd = await builder.build(resource && resource.fsPath);
    if (!cmd) { return; }
    let task = new vscode.Task(
      {
        type: "Template Run",
        template
      },
      vscode.TaskScope.Workspace,
      template.name,
      template.name,
      new vscode.ShellExecution(cmd));
    vscode.tasks.executeTask(task);
  }

  async runTemplateWithFileContent(resource: vscode.Uri) {
    let template = await this.quickPickProvider.input();
    if (!template) { return; }
    let builder = new CommandBuilder(template);
    let arg = readFileSync(resource.fsPath, { encoding: "utf-8" });
    let cmd = await builder.build(arg);
    if (!cmd) { return; }
    let task = new vscode.Task(
      {
        type: "Template Run",
        template
      },
      vscode.TaskScope.Workspace,
      template.name,
      template.name,
      new vscode.ShellExecution(cmd));
    vscode.tasks.executeTask(task);
  }

  dispose() {
    this.disposables.forEach(d => d.dispose());
  }
}