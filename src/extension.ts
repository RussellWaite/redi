// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {ServerConfiguration, PluginConfiguration, RedisConfiguration} from './servers';

import {RedisCommander} from './redisCommander';
import { RedisServerDataProvider } from './RedisServerDataProvider';

let configuration: PluginConfiguration;
let redisCommander: RedisCommander;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Redi online');

	let disposable = vscode.commands.registerCommand('extension.redi.test', () => {
		
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
	registerPlaceholderCommand('extension.redi.viewconfig', context);
	registerPlaceholderCommand('extension.redi.addserver', context);
	registerPlaceholderCommand('extension.redi.removeserver', context);
	registerPlaceholderCommand('extension.redi.refreshview', context);
	registerPlaceholderCommand('extension.redi.removeallkeys', context);
	
	// initialise the mess of a setup I've created - TODO: needs major rework, I might have lost the plot whilst creating this... 
	(async() => {
		let temp = new ServerConfiguration(context.globalStoragePath);
		configuration = await temp.readConfiguration();
		redisCommander = new RedisCommander(configuration);
	})()
		.then((data) => {
			const redisServerProvider =  new RedisServerDataProvider(configuration, redisCommander);
			vscode.window.registerTreeDataProvider('redisservers', redisServerProvider);
			vscode.commands.registerCommand('redisservers.refreshEntry', () => redisServerProvider.refresh());
		});
}

// this method is called when your extension is deactivated
export function deactivate() {}

function registerPlaceholderCommand (command: string, context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand(command, () => {
			vscode.window.showInformationMessage(`Command (placeholder) executed: "${command}"`);
		})
	);	
}