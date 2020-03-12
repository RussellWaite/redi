import * as vscode from 'vscode';
import * as path from 'path';
import { RedisConfiguration } from "./RedisConfiguration";
import { RedisEntry } from "./RedisEntry";

export class RedisServer extends RedisEntry {
	constructor(public config: RedisConfiguration, public readonly collapsibleState: vscode.TreeItemCollapsibleState, public readonly command?: vscode.Command) {
		super(config.server, collapsibleState);
	}
	get tooltip(): string {
		return `${this.config.server}-${this.config.group}`;
	}
	get description(): string {
		return this.config.group;
	}
	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dep.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dep.svg')
	};
	contextValue = 'redis-server';
}
