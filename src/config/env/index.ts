import * as dotenv from 'dotenv';

dotenv.config();

export interface IConfig {
    port: string | number;
    database: {
        host: string,
        port: string,
        username: string,
        password: string,
        name: string,
        synchronize: string
    };
    filePath: string;
}

const NODE_ENV: string = process.env.NODE_ENV || 'development';

const development: IConfig = {
    port: process.env.PORT || 3000,
    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        synchronize: process.env.SYNCRONIZE_DB
    },
    filePath: process.env.FILE_PATH
};

const config: {
    [name: string]: IConfig
} = {
    development,
};

export default config[NODE_ENV];
