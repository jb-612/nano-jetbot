import React from 'react';
import { RobotPart } from './RobotPart';
import { ChassisGroup } from './parts/ChassisGroup';
import { WheelAssembly } from './parts/WheelAssembly';
import { CasterBall } from './parts/CasterBall';
import { JetsonNano } from './parts/JetsonNano';
import { Antenna } from './parts/Antenna';
import { CameraModule } from './parts/CameraModule';
import { BatteryPack } from './parts/BatteryPack';
import { MotorDriverBoard } from './parts/MotorDriverBoard';
import { Wiring } from './parts/Wiring';
import { useRobotStore } from '../../stores/robotStore';
import type { Vector3Tuple } from 'three';

export const JetBotModel: React.FC = () => {
  const dispatch = useRobotStore((s) => s.dispatch);

  const handleMiss = () => {
    dispatch({ type: 'SELECT_PART', partId: null });
  };

  return (
    <group onPointerMissed={handleMiss}>
      {/* Chassis - non-removable root, centered at origin */}
      <RobotPart
        partId="chassis"
        basePosition={[0, 0.4, 0] as Vector3Tuple}
        detachedOffset={[0, 0, 0] as Vector3Tuple}
      >
        {({ isHovered, isSelected }) => (
          <ChassisGroup isHovered={isHovered} isSelected={isSelected} />
        )}
      </RobotPart>

      {/* Left Drive Wheel */}
      <RobotPart
        partId="wheel-left"
        basePosition={[-1.75, 0.4, -0.6] as Vector3Tuple}
        detachedOffset={[-1.5, 0, 0] as Vector3Tuple}
      >
        {({ isHovered, isSelected }) => (
          <WheelAssembly side="left" isHovered={isHovered} isSelected={isSelected} />
        )}
      </RobotPart>

      {/* Right Drive Wheel */}
      <RobotPart
        partId="wheel-right"
        basePosition={[1.75, 0.4, -0.6] as Vector3Tuple}
        detachedOffset={[1.5, 0, 0] as Vector3Tuple}
      >
        {({ isHovered, isSelected }) => (
          <WheelAssembly side="right" isHovered={isHovered} isSelected={isSelected} />
        )}
      </RobotPart>

      {/* Front Caster Ball */}
      <RobotPart
        partId="caster-ball"
        basePosition={[0, 0.15, 1.0] as Vector3Tuple}
        detachedOffset={[0, -0.8, 1.2] as Vector3Tuple}
      >
        {({ isHovered, isSelected }) => (
          <CasterBall isHovered={isHovered} isSelected={isSelected} />
        )}
      </RobotPart>

      {/* Battery Pack - between chassis plates */}
      <RobotPart
        partId="battery-pack"
        basePosition={[0, 0.55, -0.1] as Vector3Tuple}
        detachedOffset={[0, -1.2, 0] as Vector3Tuple}
      >
        {({ isHovered, isSelected }) => (
          <BatteryPack isHovered={isHovered} isSelected={isSelected} />
        )}
      </RobotPart>

      {/* Motor Driver Board - on lower chassis */}
      <RobotPart
        partId="motor-driver"
        basePosition={[0, 0.52, -0.7] as Vector3Tuple}
        detachedOffset={[0, -1.0, -1.5] as Vector3Tuple}
      >
        {({ isHovered, isSelected }) => (
          <MotorDriverBoard isHovered={isHovered} isSelected={isSelected} />
        )}
      </RobotPart>

      {/* NVIDIA Jetson Nano - on upper chassis plate */}
      <RobotPart
        partId="jetson-nano"
        basePosition={[0, 1.18, 0] as Vector3Tuple}
        detachedOffset={[0, 1.5, 0] as Vector3Tuple}
      >
        {({ isHovered, isSelected }) => (
          <JetsonNano isHovered={isHovered} isSelected={isSelected} />
        )}
      </RobotPart>

      {/* CSI Camera Module - front of Jetson */}
      <RobotPart
        partId="camera-module"
        basePosition={[0, 1.3, 1.15] as Vector3Tuple}
        detachedOffset={[0, 0.8, 1.5] as Vector3Tuple}
      >
        {({ isHovered, isSelected }) => (
          <CameraModule isHovered={isHovered} isSelected={isSelected} />
        )}
      </RobotPart>

      {/* Left WiFi Antenna */}
      <RobotPart
        partId="antenna-left"
        basePosition={[-0.6, 1.25, -0.5] as Vector3Tuple}
        detachedOffset={[-1.2, 1.5, 0] as Vector3Tuple}
      >
        {({ isHovered, isSelected }) => (
          <Antenna side="left" isHovered={isHovered} isSelected={isSelected} />
        )}
      </RobotPart>

      {/* Right WiFi Antenna */}
      <RobotPart
        partId="antenna-right"
        basePosition={[0.6, 1.25, -0.5] as Vector3Tuple}
        detachedOffset={[1.2, 1.5, 0] as Vector3Tuple}
      >
        {({ isHovered, isSelected }) => (
          <Antenna side="right" isHovered={isHovered} isSelected={isSelected} />
        )}
      </RobotPart>

      {/* Wiring Harness */}
      <RobotPart
        partId="wiring-harness"
        basePosition={[0, 0.5, 0] as Vector3Tuple}
        detachedOffset={[2.0, 0.5, 0] as Vector3Tuple}
      >
        {({ isHovered, isSelected }) => (
          <Wiring isHovered={isHovered} isSelected={isSelected} />
        )}
      </RobotPart>
    </group>
  );
};
