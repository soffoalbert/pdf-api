import * as http from 'http';
import * as serverHandlers from './server.handlers';
import expressServer from './server';
import { Server } from 'socket.io';
import { Container } from 'inversify';
import { Bootstrap } from '../container/bootstrap';
import { TYPES } from '../container/types';
import { IDBClient } from '../clients/db.client';

const container:Container = Bootstrap.createContainer();
const dbClient:IDBClient =  container.get<IDBClient>(TYPES.IDBClient);

dbClient.getConnection().then(() => {
    const httpServer: http.Server = http.createServer(expressServer);

    const socketIOServer: Server = new Server(httpServer, {
        cors: {
            origin: '*'
        }
    });

    /**
     * Binds and listens for connections on the specified host
     */
    httpServer.listen(expressServer.get('port'));

    /**
     * Server Events
     */
    httpServer.on('error',
        (error: Error): void => serverHandlers.onError(error, expressServer.get('port')));
    httpServer.on('listening',
        serverHandlers.onListening.bind(httpServer, socketIOServer));
}).catch((err: Error) => {
    console.error(`An error occured when starting the app ${err}`);
});
