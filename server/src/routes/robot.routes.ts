import { Router } from 'express';
import { RobotController } from '../controllers/robot.controller.js';
import { RobotService } from '../services/robot.service.js';
import { TelemetryService } from '../services/telemetry.service.js';
import { CameraService } from '../services/camera.service.js';
import { RobotStateRepository } from '../repositories/robot-state.repository.js';
import { PartsRepository } from '../repositories/parts.repository.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

// DI composition
const stateRepo = new RobotStateRepository();
const partsRepo = new PartsRepository();
const robotService = new RobotService(stateRepo, partsRepo);
const telemetryService = new TelemetryService();
const cameraService = new CameraService();
const controller = new RobotController(robotService, telemetryService, cameraService);

// Start telemetry generation
telemetryService.start();

const router = Router();
router.use(authMiddleware);

router.get('/status', controller.getStatus);
router.post('/move', controller.move);
router.post('/camera', controller.camera);
router.get('/telemetry', controller.getTelemetry);
router.post('/servo', controller.servo);
router.get('/parts', controller.getParts);
router.put('/parts/:id', controller.updatePart);

export { router as robotRouter, telemetryService };
