import * as vscode from "vscode";
import { WorkspaceConfigManager, VSCODE_CONFIG_PATH, FILE_NAME } from "./ConfigManager";
import { TemplateFolderContent } from "./Template";


const TEMPLATES_SECTION = 'templates';

export class WorkspaceTemplateManager implements vscode.Disposable {

  private _onDidChangeTreeData = new vscode.EventEmitter<TemplateFolderContent>();
  private disposables: vscode.Disposable[] = [];
  private previousConfigPath?: string;

  tree?: TemplateFolderContent;
  onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor() {
    vscode.window.onDidChangeActiveTextEditor(() => this.getTree(), this.disposables);
    let watcher = vscode.workspace.createFileSystemWatcher(`**/${VSCODE_CONFIG_PATH}/${FILE_NAME}`);
    watcher.onDidCreate((e) => this.onConfigFileCreateOrChange(e));
    watcher.onDidChange((e) => this.onConfigFileCreateOrChange(e));
    this.disposables.push(watcher);
    this.getTree();
  }

  private onConfigFileCreateOrChange(e: vscode.Uri) {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (!activeTextEditor) { return; }
    const currentWorkspaceFolder = vscode.workspace.getWorkspaceFolder(activeTextEditor.document.uri);
    if (!currentWorkspaceFolder) { return; }
    const changeWorkspace = vscode.workspace.getWorkspaceFolder(e);
    if (!changeWorkspace) { return; }
    if (currentWorkspaceFolder.uri.fsPath !== changeWorkspace.uri.fsPath) { return; }
    this.getTree(true);
  }

  private getTree(fileChanged?: boolean) {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (!activeTextEditor) { return; }
    let config = WorkspaceConfigManager.getConfig(activeTextEditor.document.uri);
    if (!fileChanged && config.configPath === this.previousConfigPath) { return; }
    this.previousConfigPath = config.configPath;
    this.tree = config.get<TemplateFolderContent>(TEMPLATES_SECTION);
    this._onDidChangeTreeData.fire(this.tree);
    console.log(this.tree);
  }

  initialize() {
    if (!vscode.window.activeTextEditor) {
      vscode.window.showErrorMessage("Please run this command in an opened workspace");
      return;
    }
    this.tree = [];
    this.writeTree();
    console.log('initialized');
  }

  writeTree() {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (!activeTextEditor) { return; }
    let config = WorkspaceConfigManager.getConfig(activeTextEditor.document.uri);
    config.update(TEMPLATES_SECTION, this.tree);
  }

  dispose() {
    this.disposables.forEach(d => d.dispose());
  }
}