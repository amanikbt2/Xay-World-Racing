import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PlayerPhysics } from '../player/PlayerPhysics';
import { GAME_PHYSICS } from '../game/GameConfig';

interface RacingCameraProps {
  physics: PlayerPhysics;
}

export const RacingCamera: React.FC<RacingCameraProps> = ({ physics }) => {
  const currentPos = useRef(new THREE.Vector3(0, GAME_PHYSICS.cameraHeight, GAME_PHYSICS.cameraDistance));
  const currentTarget = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const camera = state.camera;
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    // Calculate target camera position behind kart
    const forwardX = -Math.sin(physics.heading);
    const forwardZ = -Math.cos(physics.heading);

    // Speed dependent offset
    const speedRatio = Math.abs(physics.speed) / 38;
    const dynamicDist = GAME_PHYSICS.cameraDistance + speedRatio * 2.5;
    const dynamicHeight = GAME_PHYSICS.cameraHeight + speedRatio * 0.8;

    const desiredCamX = physics.position.x - forwardX * dynamicDist;
    const desiredCamZ = physics.position.z - forwardZ * dynamicDist;
    const desiredCamY = physics.position.y + dynamicHeight;

    const desiredPos = new THREE.Vector3(desiredCamX, desiredCamY, desiredCamZ);

    // Damped smooth transition
    const lerpFactor = Math.min(1.0, GAME_PHYSICS.cameraLerpSpeed * (delta * 60));
    currentPos.current.lerp(desiredPos, lerpFactor);
    camera.position.copy(currentPos.current);

    // Look ahead point in front of kart
    const lookAheadDist = 6.0 + speedRatio * 4.0;
    const targetX = physics.position.x + forwardX * lookAheadDist;
    const targetZ = physics.position.z + forwardZ * lookAheadDist;
    const targetY = physics.position.y + 1.2;

    const desiredTarget = new THREE.Vector3(targetX, targetY, targetZ);
    currentTarget.current.lerp(desiredTarget, lerpFactor);
    camera.lookAt(currentTarget.current);

    // Dynamic FOV on boost
    const targetFov = physics.isBoosting 
      ? GAME_PHYSICS.cameraFovBoost 
      : GAME_PHYSICS.cameraFovNormal;
    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 4);
    camera.updateProjectionMatrix();
  });

  return null;
};
