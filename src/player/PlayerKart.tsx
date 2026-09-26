import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PlayerPhysics } from './PlayerPhysics';

interface PlayerKartProps {
  physics: PlayerPhysics;
  color?: string;
}

export const PlayerKart: React.FC<PlayerKartProps> = ({ physics, color = '#FF4757' }) => {
  const groupRef = useRef<THREE.Group>(null);
  const frontLeftWheel = useRef<THREE.Mesh>(null);
  const frontRightWheel = useRef<THREE.Mesh>(null);
  const rearLeftWheel = useRef<THREE.Mesh>(null);
  const rearRightWheel = useRef<THREE.Mesh>(null);
  const boostLightRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Update 3D object transform from physics
    groupRef.current.position.copy(physics.position);
    groupRef.current.rotation.copy(physics.rotation);

    // Rotate wheels proportional to kart speed
    const wheelSpin = (physics.speed / 1.5) * delta;
    if (frontLeftWheel.current) frontLeftWheel.current.rotation.x += wheelSpin;
    if (frontRightWheel.current) frontRightWheel.current.rotation.x += wheelSpin;
    if (rearLeftWheel.current) rearLeftWheel.current.rotation.x += wheelSpin;
    if (rearRightWheel.current) rearRightWheel.current.rotation.x += wheelSpin;

    // Boost light intensity
    if (boostLightRef.current) {
      boostLightRef.current.intensity = physics.isBoosting ? 5.0 : 0.0;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Kart Main Body */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.45, 2.4]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Cockpit / Hood Accent */}
      <mesh position={[0, 0.6, -0.2]} castShadow>
        <boxGeometry args={[0.9, 0.3, 1.1]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Steering Wheel */}
      <mesh position={[0, 0.7, -0.3]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.18, 0.04, 8, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Rear Spoiler */}
      <group position={[0, 0.85, 1.0]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.1, 0.4]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
        </mesh>

        <mesh position={[-0.6, -0.25, 0]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0.6, -0.25, 0]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* Headlights */}
      <mesh position={[-0.45, 0.45, -1.21]}>
        <boxGeometry args={[0.25, 0.15, 0.05]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={2.0} />
      </mesh>
      <mesh position={[0.45, 0.45, -1.21]}>
        <boxGeometry args={[0.25, 0.15, 0.05]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={2.0} />
      </mesh>

      {/* Wheels */}
      {/* Front Left Wheel */}
      <group position={[-0.8, 0.3, -0.75]}>
        <mesh ref={frontLeftWheel} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.25, 16]} />
          <meshStandardMaterial color="#111827" roughness={0.8} />
        </mesh>
      </group>

      {/* Front Right Wheel */}
      <group position={[0.8, 0.3, -0.75]}>
        <mesh ref={frontRightWheel} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.25, 16]} />
          <meshStandardMaterial color="#111827" roughness={0.8} />
        </mesh>
      </group>

      {/* Rear Left Wheel */}
      <group position={[-0.85, 0.35, 0.75]}>
        <mesh ref={rearLeftWheel} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
          <meshStandardMaterial color="#111827" roughness={0.8} />
        </mesh>
      </group>

      {/* Rear Right Wheel */}
      <group position={[0.85, 0.35, 0.75]}>
        <mesh ref={rearRightWheel} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
          <meshStandardMaterial color="#111827" roughness={0.8} />
        </mesh>
      </group>

      {/* Exhaust & Boost Light */}
      <pointLight ref={boostLightRef} position={[0, 0.4, 1.2]} color="#FFA502" distance={5} />
    </group>
  );
};
