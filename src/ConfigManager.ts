import * as vscode from "vscode";
import { join, dirname } from "path";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import * as json from 'jsonc-parser';
import * as lodash from "lodash";

export const VSCODE_CONFIG_PATH = '.vscode';
export const FILE_NAME = 'cmdtpl.json';

export class WorkspaceConfigManager {

  static getConfig(startPoint: vscode.Uri) {
    return new Configuration(startPoint);
  }
}

class Configuration {

  private config?: any;
  public configPath?: string;

  constructor(startPoint: vscode.Uri) {
    let workspaceFolder = vscode.workspace.getWorkspaceFolder(startPoint);
    if (!workspaceFolder) {
      this.configPath = undefined;
      return;
    }
    this.configPath = join(workspaceFolder.uri.fsPath, VSCODE_CONFIG_PATH, FILE_NAME);
    try {
      let text = readFileSync(this.configPath, { encoding: "utf8" });
      this.config = json.parse(text);
    } catch (e) {
      this.config = undefined;
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
    if (!this.configPath) { return; }
    lodash.set(this.config, section, value);
    let dir = dirname(this.configPath);
    if (!existsSync(dir)) { mkdirSync(dir, { recursive: true }); }
    try {
      writeFileSync(this.configPath, this.config, { encoding: "utf8" });
    } catch (e) {

    }
  }
}
