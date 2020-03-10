// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { DepNodeProvider, Dependency } from './nodeDependencies';

import {ServerConfiguration, PluginConfiguration, RedisConfiguration} from './servers';

import {RedisCommander} from './redisCommander';

let configuration: PluginConfiguration;
let redisCommander: RedisCommander;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Sortis online');

	let disposable = vscode.commands.registerCommand('extension.sortis', () => {
		vscode.window.showInformationMessage('Hello Redis UI!');
	});

	context.subscriptions.push(disposable);

	const nodeDependenciesProvider = new DepNodeProvider(".");
	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => nodeDependenciesProvider.refresh());
	vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`)));
	vscode.commands.registerCommand('nodeDependencies.addEntry', () => vscode.window.showInformationMessage(`Successfully called add entry.`));
	vscode.commands.registerCommand('nodeDependencies.editEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called edit entry on ${node.label}.`));
	vscode.commands.registerCommand('nodeDependencies.deleteEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called delete entry on ${node.label}.`));

	configuration = new ServerConfiguration(context.globalStoragePath);
	redisCommander = new RedisCommander(configuration);
}

// this method is called when your extension is deactivated
export function deactivate() {}
