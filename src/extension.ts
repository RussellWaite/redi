// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
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
		
		redisCommander.connectToServer(configuration.servers[0])
		.then(
			(rc) => { 
				redisCommander.listKeys(rc)
					.then((data) => { 
						data.map(async (x,_) => {
							
							console.log(x);
							vscode.window.showInformationMessage(x);
							vscode.window.showInformationMessage((await redisCommander.getValue(rc,x)));
						});
					});
				},
			(reason) => { 
				console.log(reason);
				vscode.window.showErrorMessage(reason);
			});

		
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

	const redisServerProvider =  new RedisServerDataProvider(configuration);
	vscode.window.registerTreeDataProvider('redisServers',redisServerProvider);
	vscode.commands.registerCommand('redisServers.refreshEntry', () => redisServerProvider.refresh());
	//onView:redisServers

	// const nodeDependenciesProvider = new DepNodeProvider(".");
	// vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	// vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => nodeDependenciesProvider.refresh());
	// vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`)));
	// vscode.commands.registerCommand('nodeDependencies.addEntry', () => vscode.window.showInformationMessage(`Successfully called add entry.`));
	// vscode.commands.registerCommand('nodeDependencies.editEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called edit entry on ${node.label}.`));
	// vscode.commands.registerCommand('nodeDependencies.deleteEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called delete entry on ${node.label}.`));

}

// this method is called when your extension is deactivated
export function deactivate() {}


export class RedisServerDataProvider implements vscode.TreeDataProvider<RedisBranch> {

	private serverConf: PluginConfiguration;

	constructor(serverConf: PluginConfiguration) {
		this.serverConf = serverConf;
	}

	private _onDidChangeTreeData: vscode.EventEmitter<RedisBranch | undefined> = new vscode.EventEmitter<RedisBranch | undefined>();
	readonly onDidChangeTreeData: vscode.Event<RedisBranch | undefined> = this._onDidChangeTreeData.event;

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: RedisBranch): vscode.TreeItem {
		return element;
	}

	getChildren(element?: RedisBranch): Thenable<RedisBranch[]> {
		if(!element) {
			let rarr = Array<RedisBranch>();

			this.serverConf.servers.map((x) => {
				rarr.push(
					new RedisBranch(x.group, x.server, vscode.TreeItemCollapsibleState.None, {
						command: 'extension.viewAllKeys',
						title: x.server,
						arguments: [x.url]
				}));
			});

			return Promise.resolve(rarr);
		}
		return Promise.resolve([]);
	}
}

export class RedisBranch extends vscode.TreeItem {

	constructor(
		public readonly group: string,
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label}-${this.group}`;
	}

	get description(): string {
		return this.group;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';

}