import { injectable } from 'inversify';
import { createClient, RedisClient } from 'redis';
import config from '../env/index';

export interface IRedisClient {
    getClient(): RedisClient;
}

@injectable()
export class CustomRedisClient implements IRedisClient {
    getClient(): RedisClient {
        return createClient({ host: config.redisHost, port: Number(config.redisPort) });
    }
}
