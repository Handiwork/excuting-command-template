
import { commands, ExtensionContext, window, Uri } from 'vscode';
import { WorkspaceTemplateManager } from './WorkspaceTemplateManager';
import { TemplateTreeDataProvider } from './TemplateTreeDataProvider';
import { TemplateQuickPickProvider } from './TemplateQuickPickProvider';
import { TemplateRunner } from './TemplateRunner';

export function activate(context: ExtensionContext) {

	console.log(`ExecutingCommandTemplate Plugin has been activated`);

	const subscriptions = context.subscriptions;

	const templateManager = new WorkspaceTemplateManager();
	const treeDataProvider = new TemplateTreeDataProvider(context, templateManager);
	const quickPickProvider = new TemplateQuickPickProvider(templateManager);
	const templateRunner = new TemplateRunner(quickPickProvider);

	subscriptions.push(commands.registerCommand('cmdtpl.initialize', () => templateManager.initialize()));
	subscriptions.push(commands.registerCommand('cmdtpl.usePathToRun', (e: Uri) => templateRunner.runTemplateWithFilePath(e)));
	subscriptions.push(commands.registerCommand('cmdtpl.useContentToRun', (e: Uri) => window.showErrorMessage("not implemented")));
	subscriptions.push(window.registerTreeDataProvider('commandTemplate', treeDataProvider));

}

export function deactivate() { }
