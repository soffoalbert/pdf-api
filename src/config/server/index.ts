import * as http from 'http';
import * as serverHandlers from './server.handlers';
import expressServer from './server';
import { Server } from 'socket.io';

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
