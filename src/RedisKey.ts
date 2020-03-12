import * as vscode from 'vscode';
import * as path from 'path';
import { RedisEntry } from "./RedisEntry";

export class RedisKey extends RedisEntry {
	constructor(public readonly identifier: string, public readonly collapsibleState: vscode.TreeItemCollapsibleState, public readonly command?: vscode.Command) {
		super(identifier, collapsibleState);
		
	}
	get tooltip(): string {
		return `${this.identifier}`;
	}
	get description(): string {
		return this.identifier;
	}
	iconPath = {
		light: path.join(__filename, '..', '..', 'media', 'heart.svg'),
		dark: path.join(__filename, '..', '..', 'media', 'heart.svg')
	};
	contextValue = 'redis-key';
}
