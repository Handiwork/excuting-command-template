import * as vscode from 'vscode';
import { WorkspaceTemplateManager } from '../config/WorkspaceTemplateManager';
import { TemplateFolderContent, TEntry, getEntry, TemplateFolderEntry } from '../Template';
import { DisposableProvider } from '../util/DisposableProvider';

export interface TemplateQuickPickItem extends vscode.QuickPickItem {
  entry: TEntry;
  action?: "current" | "parent";
}

export interface FolderQuickPickItem extends vscode.QuickPickItem {
  folder?: TemplateFolderEntry;
  action?: "current" | "parent";
}

function getTemplatePickItem(entry: TEntry): TemplateQuickPickItem {
  if (entry.type === 'templateFolder')
    return {
      label: `$(file-directory)  ${entry.templateFolder.name}`,
      entry
    };
  else
    return {
      label: `$(play)  ${entry.template.name}`,
      description: entry.template.value,
      entry
    };

}

function getFolderPickItem(folder: TemplateFolderEntry): FolderQuickPickItem {
  return {
    label: `$(file-directory)  ${folder.templateFolder.name}`,
    folder,
  };
}

export class TemplateQuickPickProvider extends DisposableProvider {

  private tree?: TemplateFolderContent;

  constructor(templateManager: WorkspaceTemplateManager) {
    super();
    templateManager.onDidChangeTreeData(() => this.tree = templateManager.tree, this, this.disposables);
    this.tree = templateManager.tree;
  }

  async pickTemplate() {
    let t: TemplateFolderEntry | undefined;
    while (1) {
      let item = await vscode.window.showQuickPick(this.getTemplateItems(t));
      if (!item) return undefined;
      if (item.entry.type === 'template') return item.entry.template;
      t = item.entry;
    }
  }

  async pickFolder() {
    let t: TemplateFolderEntry | undefined;
    while (1) {
      let item = await vscode.window.showQuickPick(this.getFolderItems(t));
      if (!item) return undefined;
      if (item.action === 'current') return item.folder;
      if (item.action === 'parent') t = t && t.parent;
      t = item.folder;
    }
  }

  private getFolderItems(folder?: TemplateFolderEntry): Array<FolderQuickPickItem> {
    if (!folder) {
      if (!this.tree) return [];
      return this.tree
        .map((t) => getEntry(t))
        .filter((e) => e.type === 'templateFolder')
        .map((e) => getFolderPickItem(e as TemplateFolderEntry));
    } else
      return folder.templateFolder.children
        .map((t) => getEntry(t, folder))
        .filter((e) => e.type === 'templateFolder')
        .map((e) => getFolderPickItem(e as TemplateFolderEntry));
  }

  private getTemplateItems(folder?: TemplateFolderEntry): Array<TemplateQuickPickItem> {
    if (!folder) {
      if (!this.tree) return [];
      return this.tree.map((t) => getEntry(t)).map((e) => getTemplatePickItem(e));
    } else
      return folder.templateFolder.children.map((t) => getEntry(t, folder)).map((e) => getTemplatePickItem(e));
  }

}