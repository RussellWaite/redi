// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {ServerConfiguration} from './servers';
import { PluginConfiguration } from "./PluginConfiguration";

import {TedisRediRedis as Redis} from './TedisRediRedis';
import { RedisServerDataProvider } from './RedisServerDataProvider';

let configuration: PluginConfiguration;
let redisCommander: Redis;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Redi online');

	let disposable = vscode.commands.registerCommand('extension.redi.test', () => {
		(async() => {
			try {
				let server = configuration.servers[0];
				let _ = await redisCommander.connectToServer(server);

				let data =	await redisCommander.listKeys(server);
		
				data.map(async (x,_) => {
					console.log(x);
					vscode.window.showInformationMessage(x);
					vscode.window.showInformationMessage((await redisCommander.getValue(server,x)));
				});
			}
			catch (e) {
				console.log(e);
				vscode.window.showErrorMessage(e);
			}
		})();
	});

	context.subscriptions.push(disposable);
	registerPlaceholderCommand('extension.redi.viewconfig', context);
	registerPlaceholderCommand('extension.redi.addserver', context);
	registerPlaceholderCommand('extension.redi.removeserver', context);
	registerPlaceholderCommand('extension.redi.refreshview', context);
	registerPlaceholderCommand('extension.redi.removeallkeys', context);
	
	// initialise the mess of a setup I've created - TODO: needs major rework, I might have lost the plot whilst creating this... 
	(async() => {
		let temp = new ServerConfiguration(context.globalStoragePath);
		configuration = await temp.readConfiguration();
		redisCommander = new Redis(configuration);
	})()
		.then(() => {
			const redisServerProvider =  new RedisServerDataProvider(configuration, redisCommander);
			vscode.window.registerTreeDataProvider('redisservers', redisServerProvider);
			vscode.commands.registerCommand('redisservers.refreshEntry', () => redisServerProvider.refresh());
		});
}

export function deactivate() {
	redisCommander.closeAllConnections();
}

function registerPlaceholderCommand (command: string, context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand(command, () => {
			vscode.window.showInformationMessage(`Command (placeholder) executed: "${command}"`);
		})
	);	
}