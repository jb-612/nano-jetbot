import type { DependencyGraph } from '../models/dependency-graph';

export const DEPENDENCY_GRAPH: DependencyGraph = {
  edges: [
    // ── Structural edges (chassis is root) ──────────────────────────────
    {
      fromPartId: 'chassis',
      toPartId: 'caster-ball',
      type: 'structural',
      description:
        'Chassis provides the front mounting bracket for the caster ball assembly.',
    },
    {
      fromPartId: 'chassis',
      toPartId: 'battery-pack',
      type: 'structural',
      description:
        'Chassis contains the recessed battery bay that secures the Li-Ion pack.',
    },
    {
      fromPartId: 'chassis',
      toPartId: 'wiring-harness',
      type: 'structural',
      description:
        'Chassis provides cable routing channels and tie-down points for the wiring harness.',
    },
    {
      fromPartId: 'chassis',
      toPartId: 'jetson-nano',
      type: 'structural',
      description:
        'Chassis has four M2.5 standoff mounts for securing the Jetson Nano board.',
    },
    {
      fromPartId: 'chassis',
      toPartId: 'motor-driver',
      type: 'structural',
      description:
        'Chassis provides a stacking header mount for the motor driver HAT.',
    },

    // ── Power edges ─────────────────────────────────────────────────────
    {
      fromPartId: 'battery-pack',
      toPartId: 'jetson-nano',
      type: 'power',
      description:
        'Battery pack supplies 5V/4A regulated power to the Jetson Nano via barrel jack connector.',
    },
    {
      fromPartId: 'battery-pack',
      toPartId: 'motor-driver',
      type: 'power',
      description:
        'Battery pack supplies 7.4V unregulated power to the motor driver for DC motor operation.',
    },
    {
      fromPartId: 'wiring-harness',
      toPartId: 'jetson-nano',
      type: 'power',
      description:
        'Wiring harness carries regulated 5V power from the battery regulator to the Jetson Nano barrel jack.',
    },
    {
      fromPartId: 'wiring-harness',
      toPartId: 'motor-driver',
      type: 'power',
      description:
        'Wiring harness carries 7.4V motor power from the battery to the motor driver VIN terminals.',
    },
    {
      fromPartId: 'wiring-harness',
      toPartId: 'wheel-left',
      type: 'power',
      description:
        'Wiring harness carries PWM motor drive signals from the motor driver to the left DC gearmotor.',
    },
    {
      fromPartId: 'wiring-harness',
      toPartId: 'wheel-right',
      type: 'power',
      description:
        'Wiring harness carries PWM motor drive signals from the motor driver to the right DC gearmotor.',
    },
    {
      fromPartId: 'wiring-harness',
      toPartId: 'camera-module',
      type: 'power',
      description:
        'Wiring harness provides 3.3V power to the CSI camera module through the ribbon cable.',
    },
    {
      fromPartId: 'wiring-harness',
      toPartId: 'antenna-left',
      type: 'power',
      description:
        'Wiring harness carries RF signal and bias power to the left WiFi antenna via U.FL cable.',
    },
    {
      fromPartId: 'wiring-harness',
      toPartId: 'antenna-right',
      type: 'power',
      description:
        'Wiring harness carries RF signal and bias power to the right WiFi antenna via U.FL cable.',
    },

    // ── Data edges ──────────────────────────────────────────────────────
    {
      fromPartId: 'wiring-harness',
      toPartId: 'battery-pack',
      type: 'data',
      description:
        'Wiring harness carries battery management system (BMS) monitoring data (voltage, temperature, SoC) to the Jetson Nano via I2C.',
    },
    {
      fromPartId: 'jetson-nano',
      toPartId: 'camera-module',
      type: 'data',
      description:
        'Jetson Nano receives raw video frames from the CSI camera module over a 15-pin MIPI CSI-2 interface.',
    },
    {
      fromPartId: 'jetson-nano',
      toPartId: 'antenna-left',
      type: 'data',
      description:
        'Jetson Nano transmits and receives WiFi data packets through the primary antenna via the onboard wireless controller.',
    },
    {
      fromPartId: 'jetson-nano',
      toPartId: 'antenna-right',
      type: 'data',
      description:
        'Jetson Nano transmits and receives WiFi data packets through the secondary MIMO antenna for diversity.',
    },
    {
      fromPartId: 'jetson-nano',
      toPartId: 'motor-driver',
      type: 'data',
      description:
        'Jetson Nano sends PWM duty-cycle commands to the PCA9685 motor driver over the I2C bus (address 0x60).',
    },

    // ── Mechanical edges ────────────────────────────────────────────────
    {
      fromPartId: 'motor-driver',
      toPartId: 'wheel-left',
      type: 'mechanical',
      description:
        'Motor driver powers the left DC gearmotor which transmits torque to the left wheel through a direct shaft coupling.',
    },
    {
      fromPartId: 'motor-driver',
      toPartId: 'wheel-right',
      type: 'mechanical',
      description:
        'Motor driver powers the right DC gearmotor which transmits torque to the right wheel through a direct shaft coupling.',
    },
  ],
};
