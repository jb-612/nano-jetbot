import type { Request, Response } from 'express';
import type { RobotService } from '../services/robot.service.js';
import type { TelemetryService } from '../services/telemetry.service.js';
import type { CameraService } from '../services/camera.service.js';
import type { MoveCommand, CameraCommand, ServoCommand } from '../types/robot.types.js';
import { v4 as uuid } from 'uuid';

export class RobotController {
  constructor(
    private robotService: RobotService,
    private telemetryService: TelemetryService,
    private cameraService: CameraService,
  ) {}

  getStatus = (_req: Request, res: Response) => {
    res.json({ success: true, data: this.robotService.getStatus(), timestamp: Date.now(), requestId: uuid() });
  };

  move = (req: Request, res: Response) => {
    const command = req.body as MoveCommand;
    const result = this.robotService.move(command);
    res.json({ success: true, data: result, timestamp: Date.now(), requestId: uuid() });
  };

  camera = (req: Request, res: Response) => {
    const command = req.body as CameraCommand;
    const result = this.cameraService.execute(command);
    res.json({ success: true, data: result, timestamp: Date.now(), requestId: uuid() });
  };

  getTelemetry = (_req: Request, res: Response) => {
    const frame = this.telemetryService.getLatest();
    res.json({ success: true, data: frame, timestamp: Date.now(), requestId: uuid() });
  };

  servo = (req: Request, res: Response) => {
    const command = req.body as ServoCommand;
    res.json({
      success: true,
      data: { servoId: command.servoId, currentAngle: command.angle, targetAngle: command.angle, moving: false },
      timestamp: Date.now(),
      requestId: uuid(),
    });
  };

  getParts = (_req: Request, res: Response) => {
    res.json({ success: true, data: this.robotService.getAllParts(), timestamp: Date.now(), requestId: uuid() });
  };

  updatePart = (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = this.robotService.updatePart(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Part ${id} not found` }, timestamp: Date.now(), requestId: uuid() });
      return;
    }
    res.json({ success: true, data: updated, timestamp: Date.now(), requestId: uuid() });
  };
}
