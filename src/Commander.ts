import { window, Uri } from "vscode";
import { WorkspaceConfigManager } from "./config/WorkspaceConfigManager";


export class Commander {
  constructor(private workspaceConfigManager: WorkspaceConfigManager) { }

  async showConfigDoc() {
    let config = this.workspaceConfigManager.configuration;
    if (!config || !config.configPath) {
      window.showErrorMessage("no workspace or no config file under this workspace");
      return;
    }
    window.showTextDocument(Uri.file(config.configPath));
  }
}