import { RedisConfiguration } from './RedisConfiguration';
export class PluginConfig {
    servers = new Array<RedisConfiguration>();
    constructor(servers: RedisConfiguration[]) {
        this.servers = servers;
    }
}
