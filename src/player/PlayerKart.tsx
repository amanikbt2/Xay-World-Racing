import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PlayerPhysics } from './PlayerPhysics';

interface PlayerKartProps {
  physics: PlayerPhysics;
  color?: string;
}

const CageBar: React.FC<{ position: [number, number, number]; rotation: [number, number, number]; length: number }> = ({
  position,
  rotation,
  length,
}) => (
  <mesh position={position} rotation={rotation} castShadow>
    <cylinderGeometry args={[0.075, 0.075, length, 8]} />
    <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.22} />
  </mesh>
);

export const PlayerKart: React.FC<PlayerKartProps> = ({ physics, color = '#C8102E' }) => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<Array<THREE.Mesh | null>>([]);
  const boostLightRef = useRef<THREE.PointLight>(null);
  const hitLightRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    groupRef.current.position.copy(physics.position);
    groupRef.current.rotation.copy(physics.rotation);

    const wheelSpin = (physics.speed / 1.5) * delta;
    wheelRefs.current.forEach((wheel) => {
      if (wheel) wheel.rotation.x += wheelSpin;
    });

    if (hitLightRef.current) hitLightRef.current.intensity = physics.hitTimer > 0 ? 8 : 0;
    if (boostLightRef.current) boostLightRef.current.intensity = physics.isBoosting ? 5 : 0;
  });

  const wheelPositions: [number, number, number][] = [
    [-0.95, 0.38, -0.82],
    [0.95, 0.38, -0.82],
    [-0.95, 0.38, 0.82],
    [0.95, 0.38, 0.82],
  ];

  return (
    <group ref={groupRef}>
      {/* Low-poly buggy chassis and sculpted nose */}
      <mesh position={[0, 0.48, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.85, 0.42, 2.55]} />
        <meshStandardMaterial color={color} metalness={0.72} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0.7, -0.72]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[1.45, 0.28, 0.95]} />
        <meshStandardMaterial color={color} metalness={0.65} roughness={0.26} />
      </mesh>
      <mesh position={[0, 0.48, 1.18]} castShadow>
        <boxGeometry args={[1.62, 0.26, 0.28]} />
        <meshStandardMaterial color="#111827" metalness={0.75} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.78, -0.24]} castShadow>
        <boxGeometry args={[0.92, 0.36, 0.82]} />
        <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.16} />
      </mesh>

      {/* Side panels and racing seat */}
      <mesh position={[-0.88, 0.62, 0.18]} rotation={[0, 0, -0.08]} castShadow>
        <boxGeometry args={[0.12, 0.48, 1.55]} />
        <meshStandardMaterial color="#0B1220" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.88, 0.62, 0.18]} rotation={[0, 0, 0.08]} castShadow>
        <boxGeometry args={[0.12, 0.48, 1.55]} />
        <meshStandardMaterial color="#0B1220" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.78, 0.34]} castShadow>
        <boxGeometry args={[0.72, 0.16, 0.82]} />
        <meshStandardMaterial color="#7F1D1D" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.08, 0.57]} rotation={[-0.12, 0, 0]} castShadow>
        <boxGeometry args={[0.72, 0.68, 0.14]} />
        <meshStandardMaterial color="#7F1D1D" roughness={0.8} />
      </mesh>

      {/* Driver silhouette */}
      <mesh position={[0, 1.28, 0.05]} castShadow>
        <sphereGeometry args={[0.27, 12, 10]} />
        <meshStandardMaterial color="#C68642" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.45, 0.05]} castShadow>
        <sphereGeometry args={[0.31, 12, 8]} />
        <meshStandardMaterial color="#D6A64F" roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.45, -0.2]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.38, 0.08, 0.1]} />
        <meshStandardMaterial color="#111827" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.02, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.035, 8, 16]} />
        <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.28} />
      </mesh>
      <mesh position={[0, 1.08, -0.42]} rotation={[-0.42, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.38, 8]} />
        <meshStandardMaterial color="#64748B" metalness={0.65} roughness={0.3} />
      </mesh>
      <mesh position={[-0.16, 1.22, -0.16]} rotation={[-0.62, 0, -0.18]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.62, 8]} />
        <meshStandardMaterial color="#C68642" roughness={0.78} />
      </mesh>
      <mesh position={[0.16, 1.22, -0.16]} rotation={[-0.62, 0, 0.18]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.62, 8]} />
        <meshStandardMaterial color="#C68642" roughness={0.78} />
      </mesh>
      <mesh position={[-0.23, 1.04, -0.45]} castShadow>
        <sphereGeometry args={[0.09, 10, 8]} />
        <meshStandardMaterial color="#C68642" roughness={0.78} />
      </mesh>
      <mesh position={[0.23, 1.04, -0.45]} castShadow>
        <sphereGeometry args={[0.09, 10, 8]} />
        <meshStandardMaterial color="#C68642" roughness={0.78} />
      </mesh>

      {/* Silver roll cage */}
      <CageBar position={[-0.78, 1.42, 0.48]} rotation={[0.16, 0, 0]} length={1.55} />
      <CageBar position={[0.78, 1.42, 0.48]} rotation={[0.16, 0, 0]} length={1.55} />
      <CageBar position={[-0.78, 1.46, -0.52]} rotation={[-0.12, 0, 0]} length={1.65} />
      <CageBar position={[0.78, 1.46, -0.52]} rotation={[-0.12, 0, 0]} length={1.65} />
      <CageBar position={[0, 1.94, 0.48]} rotation={[0, 0, Math.PI / 2]} length={1.65} />
      <CageBar position={[0, 1.94, -0.52]} rotation={[0, 0, Math.PI / 2]} length={1.65} />

      {/* Suspension arms and shocks */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.87, 0.58, -0.82]} rotation={[0, side * 0.28, 0.25]} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.72, 8]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[side * 0.87, 0.62, 0.82]} rotation={[0, side * 0.28, -0.25]} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.72, 8]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
      ))}

      {/* Headlights and front bumper */}
      {[-0.48, 0.48].map((x) => (
        <mesh key={x} position={[x, 0.67, -1.31]}>
          <boxGeometry args={[0.28, 0.18, 0.06]} />
          <meshStandardMaterial color="#FFF7C2" emissive="#FFF7C2" emissiveIntensity={2.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.42, -1.42]} castShadow>
        <boxGeometry args={[2.0, 0.16, 0.14]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Wheels with alloy hubs */}
      {wheelPositions.map((position, index) => (
        <group key={index} position={position}>
          <mesh
            ref={(mesh) => { wheelRefs.current[index] = mesh; }}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.43, 0.43, 0.32, 16]} />
            <meshStandardMaterial color="#090D14" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[position[0] > 0 ? 0.18 : -0.18, 0, 0]}>
            <cylinderGeometry args={[0.21, 0.21, 0.035, 12]} />
            <meshStandardMaterial color="#D6D3D1" metalness={0.9} roughness={0.18} />
          </mesh>
        </group>
      ))}

      {/* Number plate and lights */}
      <mesh position={[0, 0.72, 1.34]}>
        <boxGeometry args={[0.82, 0.52, 0.05]} />
        <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.73, 1.37]}>
        <planeGeometry args={[0.55, 0.32]} />
        <meshBasicMaterial color="#F8FAFC" />
      </mesh>

      <pointLight ref={boostLightRef} position={[0, 0.45, 1.3]} color="#FFA502" distance={5} />
      <pointLight ref={hitLightRef} position={[0, 0.8, 0]} color="#FF1F3D" distance={6} />
    </group>
  );
};