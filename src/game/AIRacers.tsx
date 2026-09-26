import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TrackConfigData } from '../track/TrackConfig';
import { gameStateStore } from './GameState';

export const AI_RACER_COUNT = 5;

interface AIRacerProps {
  trackData: TrackConfigData;
  index: number;
  onProgress: (index: number, progress: number) => void;
  onRacerPosition: (index: number, position: THREE.Vector3) => void;
}

const RIVALS = [
  { name: 'Sunny', color: '#FFD166', speed: 0.94, lane: -3.2 },
  { name: 'Tide', color: '#00D9FF', speed: 1.02, lane: 3.1 },
  { name: 'Coral', color: '#FF7A45', speed: 0.98, lane: -1.2 },
  { name: 'Palm', color: '#2ED573', speed: 1.05, lane: 1.3 },
  { name: 'Jet', color: '#B57BFF', speed: 1.01, lane: 0 },
];

const RivalKart: React.FC<{ color: string }> = ({ color }) => (
  <group>
    <mesh position={[0, 0.38, 0]} castShadow>
      <boxGeometry args={[1.35, 0.45, 2.2]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.35} />
    </mesh>
    <mesh position={[0, 0.64, -0.18]} castShadow>
      <boxGeometry args={[0.85, 0.28, 0.9]} />
      <meshStandardMaterial color="#172033" metalness={0.7} roughness={0.25} />
    </mesh>
    <mesh position={[0, 0.78, 0.92]} castShadow>
      <boxGeometry args={[1.45, 0.1, 0.3]} />
      <meshStandardMaterial color="#172033" metalness={0.8} roughness={0.2} />
    </mesh>
    {[-0.68, 0.68].map((x) => (
      <mesh key={'front-' + x} position={[x, 0.3, -0.68]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.22, 12]} />
        <meshStandardMaterial color="#111827" roughness={0.85} />
      </mesh>
    ))}
    {[-0.72, 0.72].map((x) => (
      <mesh key={'rear-' + x} position={[x, 0.32, 0.7]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.25, 12]} />
        <meshStandardMaterial color="#111827" roughness={0.85} />
      </mesh>
    ))}
    <mesh position={[-0.42, 0.47, -1.11]}>
      <boxGeometry args={[0.22, 0.13, 0.05]} />
      <meshStandardMaterial color="#FFF4B0" emissive="#FFF4B0" emissiveIntensity={1.5} />
    </mesh>
    <mesh position={[0.42, 0.47, -1.11]}>
      <boxGeometry args={[0.22, 0.13, 0.05]} />
      <meshStandardMaterial color="#FFF4B0" emissive="#FFF4B0" emissiveIntensity={1.5} />
    </mesh>
  </group>
);

const AIRacer: React.FC<AIRacerProps> = ({ trackData, index, onProgress, onRacerPosition }) => {
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0.004 + index * 0.002);
  const curve = useMemo(() => {
    const points = trackData.curvePoints.map((point) => new THREE.Vector3(...point));
    return new THREE.CatmullRomCurve3(points, trackData.isClosed ?? false, 'centripetal');
  }, [trackData]);
  const rival = RIVALS[index];

  useEffect(() => {
    progressRef.current = 0.004 + index * 0.002;
  }, [trackData, index]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const state = gameStateStore.getState();
    if (state === 'COUNTDOWN') {
      progressRef.current = 0.004 + index * 0.002;
    } else if (state === 'RACING') {
      const progressSpeed = (30 * rival.speed) / Math.max(trackData.lengthMeters, 1);
      progressRef.current = Math.min(1, progressRef.current + progressSpeed * delta);
    }

    const progress = progressRef.current;
    const point = curve.getPointAt(progress);
    const tangent = curve.getTangentAt(Math.min(progress + 0.001, 1)).normalize();
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    point.addScaledVector(side, rival.lane);
    point.y = 0.08 + Math.sin(progress * 60 + index) * 0.025;
    groupRef.current.position.copy(point);
    onRacerPosition(index, point);
    groupRef.current.rotation.y = Math.atan2(-tangent.x, -tangent.z);
    onProgress(index, progress);
  });

  return (
    <group ref={groupRef}>
      <RivalKart color={rival.color} />
    </group>
  );
};

interface AIRacersProps {
  trackData: TrackConfigData;
  onProgress: (index: number, progress: number) => void;
  onRacerPosition: (index: number, position: THREE.Vector3) => void;
}

export const AIRacers: React.FC<AIRacersProps> = ({ trackData, onProgress, onRacerPosition }) => (
  <group>
    {RIVALS.map((rival, index) => (
      <AIRacer key={rival.name} trackData={trackData} index={index} onProgress={onProgress} onRacerPosition={onRacerPosition} />
    ))}
  </group>
);