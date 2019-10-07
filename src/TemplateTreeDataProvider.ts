import * as vscode from 'vscode';
import { TEntry, TemplateFolderContent, getEntry } from "./Template";
import { join } from 'path';
import { isArray } from 'util';
import { WorkspaceTemplateManager } from './WorkspaceTemplateManager';

export class TemplateTreeDataProvider implements vscode.TreeDataProvider<TEntry>, vscode.Disposable {

  private _onDidChangeTreeData = new vscode.EventEmitter<TEntry>();
  private disposables: vscode.Disposable[] = [];
  private tree?: TemplateFolderContent;

  onDidChangeTreeData: vscode.Event<TEntry | null | undefined> = this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext, templateManager: WorkspaceTemplateManager) {
    templateManager.onDidChangeTreeData(() => {
      this.tree = templateManager.tree;
      this._onDidChangeTreeData.fire();
    }, this.disposables);
    this.tree = templateManager.tree;
  }

  getTreeItem(element: TEntry): vscode.TreeItem | Thenable<vscode.TreeItem> {
    if (element.type === "templateFolder") {
      let item = new vscode.TreeItem(element.templateFolder.name);
      item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
      item.iconPath = {
        light: this.context.asAbsolutePath(join('resources', 'light', 'folder.svg')),
        dark: this.context.asAbsolutePath(join('resources', 'dark', 'folder.svg'))
      };
      return item;
    } else {
      let item = new vscode.TreeItem(element.template.name);
      item.collapsibleState = vscode.TreeItemCollapsibleState.None;
      item.iconPath = {
        light: this.context.asAbsolutePath(join('resources', 'light', 'run.svg')),
        dark: this.context.asAbsolutePath(join('resources', 'dark', 'run.svg'))
      };
      return item;
    }
  }

  getChildren(element?: TEntry) {
    if (!element) {
      if (!isArray(this.tree)) { return undefined; }
      else { return this.tree.map(i => getEntry(i)); }
    } else {
      if (element.type === 'template') { return undefined; }
      else { return element.templateFolder.children.map((c) => getEntry(c)); }
    }
  }

  dispose() {
    this.disposables.forEach(d => d.dispose());
  }

}