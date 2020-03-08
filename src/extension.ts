// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


import { DepNodeProvider, Dependency } from './nodeDependencies';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "sortis" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.sortis', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello Redis UI!');
	});

	context.subscriptions.push(disposable);

	const nodeDependenciesProvider = new DepNodeProvider(vscode.workspace.workspaceFolders?.pop.toString);
	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => nodeDependenciesProvider.refresh());
	vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`)));
	vscode.commands.registerCommand('nodeDependencies.addEntry', () => vscode.window.showInformationMessage(`Successfully called add entry.`));
	vscode.commands.registerCommand('nodeDependencies.editEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called edit entry on ${node.label}.`));
	vscode.commands.registerCommand('nodeDependencies.deleteEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called delete entry on ${node.label}.`));

	// const jsonOutlineProvider = new JsonOutlineProvider(context);
	// vscode.window.registerTreeDataProvider('jsonOutline', jsonOutlineProvider);
	// vscode.commands.registerCommand('jsonOutline.refresh', () => jsonOutlineProvider.refresh());
	// vscode.commands.registerCommand('jsonOutline.refreshNode', offset => jsonOutlineProvider.refresh(offset));
	// vscode.commands.registerCommand('jsonOutline.renameNode', offset => jsonOutlineProvider.rename(offset));
	// vscode.commands.registerCommand('extension.openJsonSelection', range => jsonOutlineProvider.select(range));

	// // Samples of `window.createView`
	// new FtpExplorer(context);
	// new FileExplorer(context);

	// // Test View
	// new TestView(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
