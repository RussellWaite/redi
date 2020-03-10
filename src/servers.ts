import { promises as fs } from 'fs';
import * as path from 'path';

export interface RedisConfiguration {
    server: string;
    group: string;
    url: string;
    port: number;
    password: string;
}

export interface PluginConfiguration {
    servers: RedisConfig[];
}

class RedisConfig {
    server: string = "";
    group: string = "dev";
    url: string = "";
    port: number = 6379;
    password: string = "";
}

class PluginConfig {
    servers = new Array<RedisConfiguration>();

    constructor( servers: RedisConfiguration[]) {
        this.servers = servers;
    }
}

export class ServerConfiguration {

    private dataFileName = "servers.json";
    private configPath: string;
    private pluginConfig = new PluginConfig([]);

    get servers():RedisConfiguration[] {
        return this.pluginConfig.servers;
    }
 
    constructor( configPath: string ) {
        this.configPath = configPath;
        let _self = this;
        this.readConfiguration()
            .then(value => { _self.pluginConfig = value; });
     }

    private async readConfiguration(): Promise<PluginConfiguration> {
        let serversBuffer = await this.readConfigurationFile();
        return JSON.parse( serversBuffer.toString() );
    }

    private async readConfigurationFile(): Promise<Buffer> {
        try {
            let servers = await fs.readFile(
                path.join(this.configPath, this.dataFileName),
            );
            return servers;
        }
        catch {
            let contents = JSON.stringify(new PluginConfig(new Array<RedisConfig>()));
            return Buffer.alloc(contents.length, contents);
        }
    }

    async saveConfiguration() {        
        try {
            await fs.mkdir(this.configPath);
        }
        catch (e) { } // dir exists
        let contents = JSON.stringify(this.pluginConfig);//config);
	    await fs.writeFile(
            path.join(this.configPath, this.dataFileName),
            contents
        );        
    }
}