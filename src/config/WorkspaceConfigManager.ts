import * as vscode from "vscode";
import { join, dirname } from "path";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import * as json from 'jsonc-parser';
import * as lodash from "lodash";
import { SnapshotEventEmitter } from "../util/SnapshotEventEmitter";
import { DisposableProvider } from "../util/DisposableProvider";

export const VSCODE_CONFIG_PATH = '.vscode';
export const FILE_NAME = 'cmdtpl.json';

export class WorkspaceConfigManager extends DisposableProvider {

  private _onConfigurationChanged = new SnapshotEventEmitter<Configuration>();
  private _currentFolder?: vscode.WorkspaceFolder;

  onConfigurationChanged = this._onConfigurationChanged.event;
  public get configuration() { return this._onConfigurationChanged.snapshot; }

  constructor() {
    super();

    vscode.window.onDidChangeActiveTextEditor(this.onDidChangeActiveTextEditor, this, this.disposables);
    this.onDidChangeActiveTextEditor(vscode.window.activeTextEditor);

    let fsWatcher = vscode.workspace.createFileSystemWatcher(`**/${VSCODE_CONFIG_PATH}/${FILE_NAME}`);
    fsWatcher.onDidCreate((e) => this.onConfigFileCreateOrChange(e));
    fsWatcher.onDidChange((e) => this.onConfigFileCreateOrChange(e));
    this.disposables.push(fsWatcher);
  }

  private onDidChangeActiveTextEditor(e?: vscode.TextEditor) {
    let folder = e && vscode.workspace.getWorkspaceFolder(e.document.uri);
    if (!isSameWorkspace(folder, this._currentFolder)) {
      this._currentFolder = folder;
      this._onConfigurationChanged.fire(new Configuration(folder));
      console.log("workspace changed");
    }
  }

  private onConfigFileCreateOrChange(e: vscode.Uri) {
    let folder = vscode.workspace.getWorkspaceFolder(e);
    if (isSameWorkspace(folder, this._currentFolder))
      this._onConfigurationChanged.fire(new Configuration(folder));

  }
}

function isSameWorkspace(a?: vscode.WorkspaceFolder, b?: vscode.WorkspaceFolder) {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.uri.fsPath === b.uri.fsPath;
}


export class Configuration {

  private config?: any;
  public configPath?: string;

  constructor(workspaceFolder?: vscode.WorkspaceFolder) {
    if (!workspaceFolder) return;
    this.configPath = join(workspaceFolder.uri.fsPath, VSCODE_CONFIG_PATH, FILE_NAME);
    try {
      let text = readFileSync(this.configPath, { encoding: "utf8" });
      this.config = json.parse(text);
    } catch (e) {
      this.config = {};
    }
  }

  /**
   * get configuration
   * @param section config section
   * @param startPoint resource uri, undefined will be resolved to active editor's document
   */
  get<T>(section: string): T | undefined {
    return lodash.get(this.config, section);
  }

  /**
   * update configuration and sync to storage
   * @param section config section
   * @param value new value
   */
  update<T>(section: string, value: T) {
    if (!this.configPath) return;
    lodash.set(this.config, section, value);
    let dir = dirname(this.configPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    try {
      writeFileSync(this.configPath, this.config, { encoding: "utf8" });
    } catch (e) { }
  }
}
