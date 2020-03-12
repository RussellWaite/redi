import { RedisConfiguration } from "./RedisConfiguration";
import { PluginConfiguration } from "./PluginConfiguration";
import { Tedis, TedisPool } from "tedis";
import { RedisEntry } from "./RedisEntry";
import { RedisServer } from "./RedisServer";

interface RediRedis {
    connectToServer(server: RedisConfiguration): Promise<Tedis>;
    closeAllConnections(): void;

}
export class TedisRediRedis implements RediRedis {

    // TODO: how is this going to cope with multiple servers - best off moving to a factory class and then a server impl one
    private openRedisInstances: {[key: string]: Tedis } = {};

    constructor(public config: PluginConfiguration){}

    // hard coded this against tedis - might be nice to not do that...
    async connectToServer(server: RedisConfiguration): Promise<Tedis> {
        let key = this.generateKeyFromRedisServer(server);
        if(!(key in this.openRedisInstances)) {
            this.openRedisInstances[key] =  new Tedis(server); 
        }
        return this.openRedisInstances[key]; 
    }

    async listKeys(server: RedisConfiguration, pattern = "*") : Promise<string[]> {
        return (await this.connectToServer(server)).keys(pattern);
    }
    async listKeys2(connection: Tedis, pattern = "*") : Promise<string[]> {
        
        return await connection.keys(pattern);
    }
    
    async getValue(server: RedisConfiguration, key: string) :Promise<string | number | any> {
        return (await this.connectToServer(server)).get(key);
    }

    async getValue2(connection: Tedis, key: string) :Promise<string | number | any> {
        return await connection.get(key);
    }

    async closeAllConnections(): Promise<void> {
        Object.entries(this.openRedisInstances).forEach(
            ([_, value]) => value.close()
          );        
    }

    private generateKeyFromRedisServer(server: RedisConfiguration): string {
        return `${server.group}_${server.server}`;
    }
}
