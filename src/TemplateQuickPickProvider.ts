import * as vscode from 'vscode';
import { WorkspaceTemplateManager } from './WorkspaceTemplateManager';
import { TemplateFolderContent, TEntry, TemplateFolder, getEntry } from './Template';

export interface TemplateQuickPickItem extends vscode.QuickPickItem {
  entry: TEntry;
}

function getPickItem(entry: TEntry): TemplateQuickPickItem {
  if (entry.type === 'templateFolder') {
    return {
      label: `$(file-directory)  ${entry.templateFolder.name}`,
      entry
    };
  } else {
    return {
      label: `$(play)  ${entry.template.name}`,
      description: entry.template.value,
      entry
    };
  }
}

export class TemplateQuickPickProvider implements vscode.Disposable {

  private disposables: vscode.Disposable[] = [];
  private tree?: TemplateFolderContent;

  constructor(templateManager: WorkspaceTemplateManager) {
    templateManager.onDidChangeTreeData(() => this.tree = templateManager.tree, this, this.disposables);
    this.tree = templateManager.tree;
  }

  async input() {
    let t: TemplateFolder | undefined;
    while (1) {
      let item = await vscode.window.showQuickPick(this.getQuickPickItems(t));
      if (!item) { return undefined; }
      if (item.entry.type === 'template') { return item.entry.template; }
      t = item.entry.templateFolder;
    }
  }


  private getQuickPickItems(folder?: TemplateFolder): Array<TemplateQuickPickItem> {
    if (!folder) {
      if (!this.tree) { return []; }
      return this.tree.map((t) => getEntry(t)).map((e) => getPickItem(e));
    } else {
      return folder.children.map((t) => getEntry(t, folder)).map((e) => getPickItem(e));
    }
  }

  dispose() {
    this.disposables.forEach(d => d.dispose());
  }
}