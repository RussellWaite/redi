import * as vscode from 'vscode';

import { PluginConfiguration } from "./PluginConfiguration";
import { RedisKey } from "./RedisKey";
import { RedisServer } from "./RedisServer";
import { TedisRediRedis } from './TedisRediRedis';
import { RedisEntry } from './RedisEntry';

export class RedisServerDataProvider implements vscode.TreeDataProvider<RedisEntry> {
	constructor(
        private serverConf: PluginConfiguration, 
        private commander:TedisRediRedis,
        private context: vscode.ExtensionContext) 
    { }
    
    private _onDidChangeTreeData: vscode.EventEmitter<RedisEntry | undefined> = new vscode.EventEmitter<RedisEntry | undefined>();
	readonly onDidChangeTreeData: vscode.Event<RedisEntry | undefined> = this._onDidChangeTreeData.event;
    
    refresh(): void {
		this._onDidChangeTreeData.fire();
	}
    
    getTreeItem(element: RedisServer): vscode.TreeItem {
		return element;
    }
    
    async getChildren(element?: RedisServer): Promise<RedisEntry[]> {
		if (!element) {
			return this.addServersFromConfigToTree();
		}
		else {
            return await this.addKeysFromServerToTree(this.commander, element);
		}
	}

    private addServersFromConfigToTree() {
        let rarr = Array<RedisServer>();
        this.serverConf.servers.map((x) => {
            rarr.push(new RedisServer(x, vscode.TreeItemCollapsibleState.Collapsed, 
                {
                    command: 'extension.redi.viewAllKeys',
                    title: `$(database) ${x.server}`,
                    arguments: [x.host]
            }));
        });
        return Promise.resolve(rarr);
    }

    private async addKeysFromServerToTree(commander: TedisRediRedis, element: RedisServer) {
        await commander.connectToServer(element.config);
        try {
            let keys = await commander.listKeys(element.config, "*");
            let rkeys = Array<RedisEntry>();

            keys.map(async (x) => {
                rkeys.push(new RedisKey(x, vscode.TreeItemCollapsibleState.None, 
                    {
                        command: 'extension.redi.test',
                        arguments: [x],
                        title: 'View Value'
                }));
            });

            return Promise.resolve(rkeys);
        }
        catch (err) {
            console.log(err);
            return Promise.resolve([]);
        }
    }
}