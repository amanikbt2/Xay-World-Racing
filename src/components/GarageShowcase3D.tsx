import React, { useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerKart } from '../player/PlayerKart';
import { PlayerPhysics } from '../player/PlayerPhysics';

interface GarageShowcase3DProps {
  kartColor?: string;
}

const LowPolyTree: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 2.2, 0]} castShadow>
      <cylinderGeometry args={[0.25, 0.38, 4.4, 8]} />
      <meshStandardMaterial color="#A95D2A" roughness={0.9} />
    </mesh>
    <mesh position={[0, 5.1, 0]} castShadow>
      <dodecahedronGeometry args={[2.1, 1]} />
      <meshStandardMaterial color="#21A957" roughness={0.85} />
    </mesh>
    <mesh position={[0.75, 5.7, 0.25]} castShadow>
      <dodecahedronGeometry args={[1.25, 1]} />
      <meshStandardMaterial color="#39C96A" roughness={0.85} />
    </mesh>
  </group>
);

const MiniKart: React.FC<{ color: string; lane: number; offset: number }> = ({ color, lane, offset }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() * 0.13 + offset) % 1;
    ref.current.position.set(lane + Math.sin(t * Math.PI * 2) * 0.24, 0.18, -18 + t * 8);
    ref.current.rotation.y = Math.PI + Math.sin(t * Math.PI * 2) * 0.15;
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[0.95, 0.32, 1.55]} />
        <meshStandardMaterial color={color} metalness={0.45} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.52, 0.18]}>
        <boxGeometry args={[0.62, 0.18, 0.55]} />
        <meshStandardMaterial color="#172033" metalness={0.7} roughness={0.2} />
      </mesh>
      {[-0.58, 0.58].flatMap((x) => [-0.48, 0.48].map((z) => (
        <mesh key={x + z} position={[x, 0.22, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.2, 12]} />
          <meshStandardMaterial color="#151A24" roughness={0.9} />
        </mesh>
      )))}
    </group>
  );
};

const Mechanic: React.FC<{ position: [number, number, number]; flip?: boolean }> = ({ position, flip = false }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2.2 + position[0]) * 0.035;
  });
  return (
    <group ref={ref} position={position} scale={[flip ? -1 : 1, 1, 1]}>
      <mesh position={[0, 1.25, 0]} castShadow>
        <capsuleGeometry args={[0.42, 1.15, 5, 10]} />
        <meshStandardMaterial color="#2C6BB0" roughness={0.75} />
      </mesh>
      <mesh position={[0, 2.15, 0]} castShadow>
        <sphereGeometry args={[0.38, 10, 8]} />
        <meshStandardMaterial color="#B87954" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.46, 0]}>
        <sphereGeometry args={[0.43, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#25334C" roughness={0.7} />
      </mesh>
      <mesh position={[0.58, 1.28, -0.05]} rotation={[0, 0, -0.65]}>
        <cylinderGeometry args={[0.1, 0.1, 1.1, 8]} />
        <meshStandardMaterial color="#B87954" />
      </mesh>
      <mesh position={[0.96, 1.02, -0.05]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.32, 0.1, 0.42]} />
        <meshStandardMaterial color="#F2B84B" metalness={0.6} />
      </mesh>
    </group>
  );
};

const TireRack: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 1.1, 0]}>
      <boxGeometry args={[2.9, 0.12, 0.55]} />
      <meshStandardMaterial color="#293344" metalness={0.7} />
    </mesh>
    {[0.45, 1.1, 1.75].map((y) => (
      <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.22, 10, 18]} />
        <meshStandardMaterial color="#131923" roughness={0.96} />
      </mesh>
    ))}
    <mesh position={[-1.28, 1.3, 0]}>
      <boxGeometry args={[0.12, 2.8, 0.14]} />
      <meshStandardMaterial color="#65758B" metalness={0.7} />
    </mesh>
    <mesh position={[1.28, 1.3, 0]}>
      <boxGeometry args={[0.12, 2.8, 0.14]} />
      <meshStandardMaterial color="#65758B" metalness={0.7} />
    </mesh>
  </group>
);

const DiagnosticDesk: React.FC = () => (
  <group position={[5.45, 0, -1.1]} rotation={[0, -0.18, 0]}>
    <mesh position={[0, 0.95, 0]} castShadow>
      <boxGeometry args={[3.1, 0.18, 1.25]} />
      <meshStandardMaterial color="#313C4F" metalness={0.65} roughness={0.35} />
    </mesh>
    {[-1.1, 0, 1.1].map((x) => (
      <mesh key={x} position={[x, 1.9, 0]}>
        <boxGeometry args={[0.92, 0.7, 0.08]} />
        <meshStandardMaterial color="#101925" metalness={0.45} />
      </mesh>
    ))}
    {[-1.1, 0, 1.1].map((x) => (
      <mesh key={x} position={[x, 1.9, 0.05]}>
        <planeGeometry args={[0.78, 0.56]} />
        <meshStandardMaterial color="#55D5D1" emissive="#1D9698" emissiveIntensity={1.5} />
      </mesh>
    ))}
    <mesh position={[0, 0.4, 0]}>
      <boxGeometry args={[2.7, 0.9, 0.9]} />
      <meshStandardMaterial color="#273347" roughness={0.65} />
    </mesh>
  </group>
);

const ShowcaseStage: React.FC<{ kartColor?: string }> = ({ kartColor = '#FF4757' }) => {
  const stageRef = useRef<THREE.Group>(null);
  const physics = React.useMemo(() => new PlayerPhysics(new THREE.Vector3(0, 0.45, 0), 0), []);
  useFrame((_, delta) => {
    if (stageRef.current) stageRef.current.rotation.y += delta * 0.18;
  });

  return (
    <group>
      <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 46]} />
        <meshStandardMaterial color="#77808A" roughness={0.88} />
      </mesh>
      <mesh position={[0, 9.3, -17]} receiveShadow>
        <boxGeometry args={[34, 18, 0.6]} />
        <meshStandardMaterial color="#303A46" roughness={0.84} />
      </mesh>
      <mesh position={[0, 7.1, -16.55]}>
        <boxGeometry args={[28, 11.2, 0.15]} />
        <meshStandardMaterial color="#65BCD5" roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.7, -16.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[27, 15]} />
        <meshStandardMaterial color="#293B4C" roughness={0.82} />
      </mesh>
      <mesh position={[-13.8, 5.2, -16.5]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[10.5, 1.4]} />
        <meshStandardMaterial color="#F7F8FA" roughness={0.9} />
      </mesh>
      <mesh position={[13.8, 5.2, -16.5]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[10.5, 1.4]} />
        <meshStandardMaterial color="#F7F8FA" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.1, -9.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.5, 15]} />
        <meshStandardMaterial color="#1E2B3B" roughness={0.55} />
      </mesh>
      {[-3.7, 3.7].map((x) => (
        <mesh key={x} position={[x, 0.12, -13.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.38, 15]} />
          <meshStandardMaterial color="#EEF0F2" roughness={0.7} />
        </mesh>
      ))}
      {[-2.7, 2.7].map((x) => (
        <mesh key={x} position={[x, 0.13, -13.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.38, 15]} />
          <meshStandardMaterial color="#D94B58" roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.18, -3.3]} receiveShadow>
        <cylinderGeometry args={[3.55, 3.85, 0.35, 48]} />
        <meshStandardMaterial color="#3C4654" metalness={0.8} roughness={0.25} />
      </mesh>
      <group ref={stageRef} position={[0, 0.37, -2.7]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.85, 3.05, 48]} />
          <meshStandardMaterial color="#FFB14B" emissive="#FF7F3B" emissiveIntensity={1.4} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.15, 2.32, 48]} />
          <meshStandardMaterial color="#57E3E7" emissive="#32C8D5" emissiveIntensity={2.2} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.45, 1.55, 48]} />
          <meshStandardMaterial color="#FFF0B0" emissive="#FFC45A" emissiveIntensity={1.3} />
        </mesh>
        <group position={[0, 0.45, 0]}>
          <PlayerKart physics={physics} color={kartColor} />
        </group>
      </group>
      <LowPolyTree position={[-8.5, 0, -14]} scale={1.15} />
      <LowPolyTree position={[8.2, 0, -14]} scale={1.05} />
      <LowPolyTree position={[0, 0, -19]} scale={0.6} />
      <MiniKart color="#2B89DC" lane={-1.8} offset={0.15} />
      <MiniKart color="#46C96B" lane={0.1} offset={0.48} />
      <MiniKart color="#E4515A" lane={1.8} offset={0.74} />
      <TireRack position={[-5.4, 0, -1.8]} />
      <DiagnosticDesk />
      <Mechanic position={[-4.1, 0, -2.4]} />
      <Mechanic position={[4.55, 0, -0.2]} flip />
      <mesh position={[-4.1, 0.05, -2.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial color="#5E6874" roughness={0.9} />
      </mesh>
      <pointLight position={[0, 2.2, -3.3]} color="#43DCE5" intensity={2.8} distance={10} />
      <pointLight position={[-4, 4, -4]} color="#FFB35B" intensity={1.8} distance={9} />
    </group>
  );
};

export const GarageShowcase3D: React.FC<GarageShowcase3DProps> = ({ kartColor = '#FF4757' }) => (
  <View style={styles.container}>
    <Canvas
      shadows={Platform.OS === 'web'}
      camera={{ position: [0, 4.25, 10.6], fov: 53 }}
      style={styles.canvas}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#54616D']} />
      <fog attach="fog" args={['#54616D', 20, 55]} />
      <ambientLight intensity={1.05} />
      <directionalLight position={[10, 22, 13]} intensity={1.8} castShadow={Platform.OS === 'web'} />
      <directionalLight position={[-10, 9, 2]} intensity={0.7} color="#6CC9DC" />
      <ShowcaseStage kartColor={kartColor} />
    </Canvas>
  </View>
);

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFill, backgroundColor: '#54616D' },
  canvas: { flex: 1 },
});
