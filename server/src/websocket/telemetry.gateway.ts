import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import { eventBus } from '../events/event-bus.js';
import type { TelemetryFrame } from '../types/robot.types.js';

export class TelemetryGateway {
  private wss: WebSocketServer;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws/telemetry' });

    this.wss.on('connection', (ws) => {
      console.log('[WS] Client connected');

      ws.on('message', (raw) => {
        try {
          const msg = JSON.parse(raw.toString());
          if (msg.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          }
        } catch {
          // ignore invalid messages
        }
      });

      ws.on('close', () => {
        console.log('[WS] Client disconnected');
      });
    });

    eventBus.on('telemetry:frame', (frame: TelemetryFrame) => {
      const message = JSON.stringify({ type: 'telemetry', data: frame, timestamp: Date.now() });
      this.wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
  }
}
