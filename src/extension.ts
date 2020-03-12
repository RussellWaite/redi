// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { ServerConfiguration } from './ServerConfiguration';
import { PluginConfiguration } from "./PluginConfiguration";

import { TedisRediRedis as Redis } from './TedisRediRedis';
import { RedisServerDataProvider } from './RedisServerDataProvider';
import { RedisKey } from './RedisKey';

let configuration: PluginConfiguration;
let redisCommander: Redis;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	console.log('Redi is ready');

	let disposable = vscode.commands.registerCommand('extension.redi.test', (resource) => {
		(async () => {
			try {
				let server = configuration.servers[0];
				let _ = await redisCommander.connectToServer(server);
				let key = getMeTheKey(resource);
				vscode.window.showInformationMessage((await redisCommander.getValue(server, key)));
			}
			catch (e) {
				console.log(e);
				vscode.window.showErrorMessage(e);
				Promise.resolve([]);
			}
		})();
	});

	registerCommands(context);

	context.subscriptions.push(disposable);


	// initialise the mess of a setup I've created - TODO: needs major rework, I might have lost the plot whilst creating this... 
	(async () => {
		let temp = new ServerConfiguration(context.globalStoragePath);
		configuration = await temp.readConfiguration();
		redisCommander = new Redis(configuration);
	})()
		.then(() => {
			const redisServerProvider = new RedisServerDataProvider(configuration, redisCommander, context);
			vscode.window.registerTreeDataProvider('redisservers', redisServerProvider);
			vscode.commands.registerCommand('redisservers.refreshEntry', () => redisServerProvider.refresh());
		});
}

export function deactivate() {
	redisCommander.closeAllConnections();
}

function getMeTheKey(resource: any): string {
	if(resource instanceof RedisKey)
	{
		return resource.command!.arguments![0];
	}
	if (typeof(resource) === "string") {
		return resource;
	}
	return "";
}

function registerCommands(context: vscode.ExtensionContext) {
	registerPlaceholderCommand('extension.redi.refreshview', (resource) => { placeholderFunc(resource, "refresh view"); }, context);
	registerPlaceholderCommand('extension.redi.removeallkeys', (resource) => { placeholderFunc(resource, "remove ALL keys"); }, context);
	registerPlaceholderCommand('extension.redi.removekey', (resource) => { placeholderFunc(resource, `remove key: ${"identifier" in resource ? resource["identifier"] : JSON.stringify(resource)}`); }, context);
	registerPlaceholderCommand('extension.redi.viewconfig', (resource) => { placeholderFunc(resource, "viewconfig"); }, context);
	registerPlaceholderCommand('extension.redi.viewallkeys', (resource) => { placeholderFunc(resource, "viewallkeys"); }, context);
	registerPlaceholderCommand('extension.redi.addserver', (resource) => { placeholderFunc(resource, "add server"); }, context);
	registerPlaceholderCommand('extension.redi.removeserver', (resource) => { placeholderFunc(resource, "remove_server"); }, context);
}

function placeholderFunc(data: any, command: string): void { //() => void {
	//	return () => {
	console.log(data);
	vscode.window.showInformationMessage(`Command (placeholder) executed: "${command}"`);
	//	};
}

function registerPlaceholderCommand(command: string, func: (resource: vscode.Uri) => void, context?: vscode.ExtensionContext) {
	let dis = vscode.commands.registerCommand(command, func, null);

	if (context) {
		context.subscriptions.push(dis);
	}
}