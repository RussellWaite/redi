import * as vscode from 'vscode';

import { PluginConfiguration } from './servers';
import { RedisKey } from "./RedisEntries";
import { RedisServer } from "./RedisServer";
import { RedisCommander } from './redisCommander';
import { RedisEntry } from './RedisEntry';

export class RedisServerDataProvider implements vscode.TreeDataProvider<RedisEntry> {
	constructor(
        private serverConf: PluginConfiguration, 
        private commander:RedisCommander) 
    { }
    
    private _onDidChangeTreeData: vscode.EventEmitter<RedisEntry | undefined> = new vscode.EventEmitter<RedisEntry | undefined>();
	readonly onDidChangeTreeData: vscode.Event<RedisEntry | undefined> = this._onDidChangeTreeData.event;
    
    refresh(): void {
		this._onDidChangeTreeData.fire();
	}
	getTreeItem(element: RedisServer): vscode.TreeItem {
		return element;
	}
	getChildren(element?: RedisServer): Thenable<RedisEntry[]> {
		if (!element) {
			let rarr = Array<RedisServer>();
			this.serverConf.servers.map((x) => {
				rarr.push(new RedisServer(x, vscode.TreeItemCollapsibleState.Collapsed, {
					command: 'extension.viewAllKeys',
					title: x.server,
					arguments: [x.url]
				}));
			});
			return Promise.resolve(rarr);
		}
		else {
            return this.commander.connectToServer(element.config)
                .then(
                    async (tedis) => { 
                        let keys = await this.commander.listKeys(tedis, "*");

                        let rkeys = Array<RedisEntry>();
            
                        keys.map(async (x) => {
                            rkeys.push(
                                new RedisKey(x, vscode.TreeItemCollapsibleState.None)
                            );
                            let value = await this.commander.getValue(tedis,x);
                            vscode.window.showInformationMessage(`the value of the key ${x} is ${value}`);
                        });

                        return Promise.resolve(rkeys);
                    },
                    (err) => { 
                        console.log(err);
                        return Promise.resolve([]);                    
                    }
            );
		}
	}
}