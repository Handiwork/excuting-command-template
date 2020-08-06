import '@babel/polyfill';

import { commands, ExtensionContext, window, Uri } from 'vscode';
import { WorkspaceTemplateManager } from './config/WorkspaceTemplateManager';
import { TemplateTreeDataProvider } from './provider/TemplateTreeDataProvider';
import { TemplateRunner } from './TemplateRunner';
import { Commander } from './Commander';
import { WorkspaceConfigManager } from './config/WorkspaceConfigManager';

console.log("ExecutingCommandTemplate Plugin Run");

export function activate(context: ExtensionContext) {

	console.log(`ExecutingCommandTemplate Plugin has been activated`);

	const subscriptions = context.subscriptions;

	const workspaceConfigManager = new WorkspaceConfigManager();
	const templateManager = new WorkspaceTemplateManager(workspaceConfigManager);
	const templatesTreeProvider = new TemplateTreeDataProvider(context, templateManager);
	const templateRunner = new TemplateRunner(templateManager);
	const commander = new Commander(workspaceConfigManager);

	subscriptions.push(commands.registerCommand('cmdtpl.initialize', () => templateManager.initialize()));
	subscriptions.push(commands.registerCommand('cmdtpl.usePathToRun', (e: Uri) => templateRunner.runTemplateWithFilePath(e)));
	subscriptions.push(commands.registerCommand('cmdtpl.viewConfigFile', () => commander.showConfigDoc()));
	subscriptions.push(window.registerTreeDataProvider('commandTemplate', templatesTreeProvider));

}

export function deactivate() { }
