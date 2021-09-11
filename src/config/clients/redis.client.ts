import { injectable } from 'inversify';
import { createClient, RedisClient } from 'redis';

export interface IRedisClient {
    getClient(): RedisClient;
}

@injectable()
export class CustomRedisClient implements IRedisClient {
    getClient(): RedisClient {
        return createClient();
    }
}
