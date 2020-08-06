import * as vscode from "vscode";
import { WorkspaceConfigManager, Configuration } from "./WorkspaceConfigManager";
import { TemplateFolderContent } from "../Template";
import { SnapshotEventEmitter } from "../util/SnapshotEventEmitter";


const TEMPLATES_SECTION = 'templates';

export class WorkspaceTemplateManager {

  private _onDidChangeTreeData = new SnapshotEventEmitter<TemplateFolderContent>();

  get tree() { return this._onDidChangeTreeData.snapshot; }
  onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private configManager: WorkspaceConfigManager) {
    configManager.onConfigurationChanged((e) => this.onConfigurationChanged(e));
  }

  onConfigurationChanged(e?: Configuration) {
    console.log("configuration changed");
    console.log(e);
    this._onDidChangeTreeData.fire(e && e.get<TemplateFolderContent>(TEMPLATES_SECTION));
  }

  initialize() {
    let editor = vscode.window.activeTextEditor;
    let folder = editor && vscode.workspace.getWorkspaceFolder(editor.document.uri);
    if (!folder) {
      vscode.window.showErrorMessage("Please run this command in an opened workspace");
      return;
    }
    new Configuration(folder).update(TEMPLATES_SECTION, []);
    console.log('initialized');
  }

}