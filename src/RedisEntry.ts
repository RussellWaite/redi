import * as vscode from 'vscode';

export class RedisEntry extends vscode.TreeItem {
    constructor(
        public readonly identifier: string, 
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
        ) {
		super(identifier, collapsibleState);
	}

    
}
