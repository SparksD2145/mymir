import * as http from 'http';
import * as https from 'https';
import * as debug from 'debug';

import App from './components/App/App';
import {HTTPConfig, SSLConfig, SSLOptions} from './config/config.default';

// Set debug name
debug('mimir:server');

let server, port;

if (SSLConfig.enabled) {
  port = normalizePort(process.env.PORT || SSLConfig.defaultPort);
  server = https.createServer(SSLOptions, App);

} else {
  port = normalizePort(process.env.PORT || HTTPConfig.defaultPort);
  server = http.createServer(App);

}

App.set('port', port);

// We have signal!
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: number | string): number | string | boolean {
  let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;

  // Check port access
  let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// On Server Listen Handler
function onListening(): void {
  let addr = server.address();
  let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}
