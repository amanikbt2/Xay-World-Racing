import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CoinProps {
  position: [number, number, number];
  collected: boolean;
}

export const GoldenCoin: React.FC<CoinProps> = ({ position, collected }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y += delta * 3.5;
    }
  });

  if (collected) return null;

  return (
    <group position={[position[0], position[1] + 1.2, position[2]]}>
      <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.15, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#FF8C00" emissiveIntensity={0.3} />
      </mesh>
      <pointLight color="#FFD700" intensity={1.5} distance={3} />
    </group>
  );
};

interface BoostPadProps {
  position: [number, number, number];
  rotationY?: number;
}

export const NitroBoostPad: React.FC<BoostPadProps> = ({ position, rotationY = 0 }) => {
  return (
    <group position={[position[0], position[1] + 0.05, position[2]]} rotation={[0, rotationY, 0]}>
      {/* Base Pad Plate */}
      <mesh receiveShadow>
        <boxGeometry args={[4.5, 0.08, 3.5]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} />
      </mesh>

      {/* Emissive Chevron Arrow */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.5, 2.5]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
};

interface MovingHazardProps {
  position: [number, number, number];
  moveRange?: number;
}

export const MovingRoadHazard: React.FC<MovingHazardProps> = ({ position, moveRange = 8 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta * 2.0;

    // Move back and forth along X axis
    const offsetX = Math.sin(timeRef.current) * (moveRange / 2);
    groupRef.current.position.x = position[0] + offsetX;
  });

  return (
    <group ref={groupRef} position={[position[0], position[1] + 0.6, position[2]]}>
      {/* Roaming Creature / Cat Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color="#FF4757" roughness={0.3} emissive="#FF4757" emissiveIntensity={0.4} />
      </mesh>
      {/* Glowing Eyes */}
      <mesh position={[-0.25, 0.25, -0.6]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.25, 0.25, -0.6]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};
