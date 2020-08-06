import * as vscode from 'vscode';
import { TemplateQuickPickProvider } from "./provider/TemplateQuickPickProvider";
import { promises as fsp } from 'fs';
import { DisposableProvider } from './util/DisposableProvider';
import { WorkspaceTemplateManager } from './config/WorkspaceTemplateManager';
import { Template } from './Template';

const PLACEHOLDER = /\{\s*\}/;
const INDICATOR = "{__}";

export class TemplateRunner extends DisposableProvider {

  private quickPickProvider: TemplateQuickPickProvider;

  constructor(manager: WorkspaceTemplateManager) {
    super();
    this.quickPickProvider = new TemplateQuickPickProvider(manager);
  }

  async buildCommand(template: Template, prefill?: string) {
    let command = template.value;
    if (prefill && PLACEHOLDER.test(command))
      command = command.replace(PLACEHOLDER, prefill);

    while (PLACEHOLDER.test(command)) {
      let arg = await vscode.window.showInputBox({ prompt: command.replace(PLACEHOLDER, INDICATOR) });
      if (!arg) return undefined;
      command = command.replace(PLACEHOLDER, arg);
    }
    return command;
  }

  async executeTask(template: Template, type: string, cmd: string) {
    const task = new vscode.Task(
      {
        type,
        template
      },
      vscode.TaskScope.Workspace,
      template.name,
      template.name,
      new vscode.ShellExecution(cmd));
    vscode.tasks.executeTask(task);
  }

  async runTemplateWithFilePath(resource?: vscode.Uri) {
    let template = await this.quickPickProvider.pickTemplate();
    if (!template) return;
    let cmd = await this.buildCommand(template, resource && resource.fsPath);
    if (!cmd) return;
    await this.executeTask(template, "Run Template With Path:", cmd);
  }

  async runTemplateWithFileContent(resource: vscode.Uri) {
    let template = await this.quickPickProvider.pickTemplate();
    if (!template) return;
    let arg = await fsp.readFile(resource.fsPath, { encoding: "utf8" });
    let cmd = await this.buildCommand(template, arg);
    if (!cmd) return;
    await this.executeTask(template, "Run Template With Content", cmd);
  }
}