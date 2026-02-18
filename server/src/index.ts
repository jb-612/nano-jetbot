import { createServer } from 'http';
import { createApp } from './app.js';
import { TelemetryGateway } from './websocket/telemetry.gateway.js';
import { config } from './config.js';

const app = createApp();
const server = createServer(app);

// Attach WebSocket
new TelemetryGateway(server);

server.listen(config.port, () => {
  console.log(`Robot server running on http://localhost:${config.port}`);
  console.log(`WebSocket available at ws://localhost:${config.port}/ws/telemetry`);
  console.log(`API Key for dev: ${config.defaultApiKey}`);
});
