import { PluginConfiguration, RedisConfiguration } from "./servers";
import { Tedis, TedisPool } from "tedis";

export class RedisCommander {

    constructor(public config: PluginConfiguration){}

    // hard coded this against tedis - might be nice to not do that...
    async connectToServer(server: RedisConfiguration): Promise<Tedis> {

        return new Tedis({
            host: server.url,
            port: server.port,
            password: server.password
          });
    }

    async listKeys(connection: Tedis, pattern = "*") : Promise<string[]> {
        return await connection.keys(pattern);
    }

    async getValue(connection: Tedis, key: string) :Promise<string | number | any> {
        return await connection.get(key);
    }
}
