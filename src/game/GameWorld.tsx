import React, { useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber';
import { PlayerPhysics } from '../player/PlayerPhysics';
import { PlayerKart } from '../player/PlayerKart';
import { Track } from '../track/Track';
import { RacingCamera } from '../camera/RacingCamera';
import { inputManager } from '../player/PlayerInput';
import { gameStateStore } from './GameState';
import { TrackConfigData, TRACKS_DATA } from '../track/TrackConfig';
import { LapSystem } from '../track/LapSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { AIRacers, AI_RACER_COUNT } from './AIRacers';

interface GameWorldProps {
  physics: PlayerPhysics;
  trackData?: TrackConfigData;
  kartColor?: string;
}

const GameLoopRunner: React.FC<{
  physics: PlayerPhysics;
  lapSystem: LapSystem;
  collisionSystem: CollisionSystem;
  startPosition: [number, number, number];
  startHeading: number;
  trackLength: number;
  aiProgress: React.MutableRefObject<number[]>;
}> = ({ physics, lapSystem, collisionSystem, startPosition, startHeading, trackLength, aiProgress }) => {
  const previousState = useRef(gameStateStore.getState());

  useFrame((_, delta) => {
    const input = inputManager.getInput();
    const currentState = gameStateStore.getState();

    if (currentState === 'COUNTDOWN' && previousState.current !== 'COUNTDOWN') {
      physics.reset(startPosition, startHeading);
      lapSystem.reset();
    }
    previousState.current = currentState;

    if (input.pause) {
      inputManager.resetPauseTrigger();
      if (currentState === 'RACING') {
        gameStateStore.setState('PAUSED');
      } else if (currentState === 'PAUSED') {
        gameStateStore.setState('RACING');
      }
    }

    if (currentState === 'RACING') {
      const clampedDelta = Math.min(delta, 0.05);
      physics.update(clampedDelta, input);
      collisionSystem.update(physics);
      lapSystem.update(physics.position);

      const playerProgress = Math.min(1, Math.max(0, Math.abs(physics.position.z - startPosition[2]) / Math.max(trackLength, 1)));
      const racersAhead = aiProgress.current.filter((progress) => progress > playerProgress + 0.002).length;
      gameStateStore.updateMetrics({
        speed: Math.round(Math.abs(physics.speed)),
        isBoosting: physics.isBoosting,
        isDrifting: physics.isDrifting,
        boostCharge: physics.driftCharge,
        position: Math.min(AI_RACER_COUNT + 1, racersAhead + 1),
        totalRacers: AI_RACER_COUNT + 1,
        progressPercent: Math.round(playerProgress * 100),
      });
    }
  });

  return null;
};

export const GameWorld: React.FC<GameWorldProps> = ({
  physics,
  trackData = TRACKS_DATA[0],
  kartColor = '#FF4757',
}) => {
  const env = trackData.environment;
  const aiProgress = useRef<number[]>(Array(AI_RACER_COUNT).fill(0));

  const lapSystem = useMemo(() => {
    return new LapSystem(trackData.checkpoints, trackData.laps, trackData.isClosed ?? false);
  }, [trackData]);

  const collisionSystem = useMemo(() => {
    return new CollisionSystem();
  }, []);

  useEffect(() => {
    lapSystem.reset();
    collisionSystem.reset(trackData);
    physics.reset(trackData.startPosition, trackData.startHeading);
  }, [trackData, physics, lapSystem, collisionSystem]);

  return (
    <View style={styles.container}>
      <Canvas
        shadows={Platform.OS === 'web'}
        camera={{ position: [0, 4.2, 9], fov: 60 }}
        style={styles.canvas}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={[env.bgColor]} />
        <fog attach="fog" args={[env.fogColor, env.fogNear, env.fogFar]} />

        <ambientLight intensity={0.7} />
        <directionalLight
          position={env.sunPosition}
          intensity={1.4}
          color={env.sunColor}
          castShadow={Platform.OS === 'web'}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={10}
          shadow-camera-far={250}
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
        />

        <Track trackData={trackData} collisionSystem={collisionSystem} />
        <AIRacers
          trackData={trackData}
          onRacerPosition={(index, position) => collisionSystem.setRacerPosition(index, position)}
          onProgress={(index, progress) => {
            aiProgress.current[index] = progress;
          }}
        />
        <PlayerKart physics={physics} color={kartColor} />
        <RacingCamera physics={physics} />

        <GameLoopRunner
          physics={physics}
          lapSystem={lapSystem}
          collisionSystem={collisionSystem}
          startPosition={trackData.startPosition}
          startHeading={trackData.startHeading}
          trackLength={trackData.lengthMeters}
          aiProgress={aiProgress}
        />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  canvas: {
    flex: 1,
  },
});
