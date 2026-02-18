import type { CameraCommand, CameraResult } from '../types/robot.types.js';

export class CameraService {
  private streamActive = false;

  execute(command: CameraCommand): CameraResult {
    switch (command.action) {
      case 'capture':
        return { action: 'capture', success: true, streamActive: this.streamActive, resolution: '1280x720', fps: 0 };
      case 'startStream':
        this.streamActive = true;
        return { action: 'startStream', success: true, streamActive: true, resolution: '1280x720', fps: 30 };
      case 'stopStream':
        this.streamActive = false;
        return { action: 'stopStream', success: true, streamActive: false, resolution: '1280x720', fps: 0 };
      default:
        return { action: command.action, success: false, streamActive: this.streamActive, resolution: '0x0', fps: 0 };
    }
  }
}
