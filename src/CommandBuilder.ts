import * as vscode from 'vscode';
import { Template } from "./Template";

const PLACEHOLDER = /\{\s*\}/;

export class CommandBuilder {

  currentCommand: string;

  constructor(private template: Template) {
    this.currentCommand = template.value;
  }

  async build(prefill?: string) {
    this.currentCommand = this.template.value;
    while (PLACEHOLDER.test(this.currentCommand)) {
      let arg: string | undefined;
      if (prefill) {
        arg = prefill;
        prefill = undefined;
      } else {
        arg = await vscode.window.showInputBox({ prompt: this.currentCommand });
      }
      if (!arg) { return undefined; }
      this.currentCommand = this.currentCommand.replace(PLACEHOLDER, arg);
    }
    return this.currentCommand;
  }

}