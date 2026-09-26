import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const BeachScenery: React.FC<{ cityUpgrade?: boolean }> = ({ cityUpgrade = false }) => {
  const umbrellas: [number, number, number][] = [
    [30, 0, -92], [122, 0, -238], [-66, 0, -456], [78, 0, -642],
  ];

  return (
    <group>
      <mesh position={[105, 48, -270]}>
        <sphereGeometry args={[12, 24, 16]} />
        <meshBasicMaterial color="#FFE7A3" />
      </mesh>
      {umbrellas.map((position, index) => (
        <group key={`umbrella-${index}`} position={position} rotation={[0, index * 0.7, 0]}>
          <mesh position={[0, 2.2, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.11, 4.4, 8]} />
            <meshStandardMaterial color="#6B4226" roughness={0.8} />
          </mesh>
          <mesh position={[0, 4.25, 0]} rotation={[Math.PI, 0, 0]} castShadow>
            <coneGeometry args={[2.2, 0.85, 12]} />
            <meshStandardMaterial color={index % 2 === 0 ? '#FF5D5D' : '#20B8B0'} roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.5, 24]} />
            <meshStandardMaterial color="#F7D070" roughness={1} />
          </mesh>
        </group>
      ))}
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <mesh key={`wave-${index}`} position={[158 + (index % 2) * 13, -0.01, -80 - index * 145]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7, 42]} />
          <meshBasicMaterial color="#D8F8F4" transparent opacity={0.42} />
        </mesh>
      ))}
      {cityUpgrade && <CoastalCityScenery />}
    </group>
  );
};

// --- SMART COASTAL CITY SUB-COMPONENTS ---

const OffshoreWindTurbine: React.FC<{ position: [number, number, number]; speedMultiplier?: number }> = ({
  position,
  speedMultiplier = 1.0,
}) => {
  const bladesRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z += delta * 1.8 * speedMultiplier;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[2.5, 3.5, 4, 12]} />
        <meshStandardMaterial color="#64748B" roughness={0.8} />
      </mesh>
      <mesh position={[0, 22, 0]} castShadow>
        <cylinderGeometry args={[0.5, 1.2, 40, 16]} />
        <meshStandardMaterial color="#F8FAFC" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 42, 0.8]} castShadow>
        <boxGeometry args={[1.8, 1.8, 3.2]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.2} metalness={0.6} />
      </mesh>
      <group ref={bladesRef} position={[0, 42, 2.5]}>
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
          <group key={i} rotation={[0, 0, angle]}>
            <mesh position={[0, 8.5, 0]}>
              <boxGeometry args={[0.6, 17, 0.15]} />
              <meshStandardMaterial color="#FFFFFF" metalness={0.2} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

const SmartLighthouse: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const beaconRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (beaconRef.current) {
      beaconRef.current.rotation.y += delta * 1.4;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[12, 16, 5, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>
      <mesh position={[0, 18, 0]} castShadow>
        <cylinderGeometry args={[3.2, 5.5, 28, 16]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.4} />
      </mesh>
      <mesh position={[0, 16, 0]}>
        <cylinderGeometry args={[4.2, 4.4, 3, 16]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 33, 0]}>
        <cylinderGeometry args={[3.8, 3.8, 4, 16]} />
        <meshStandardMaterial color="#38BDF8" transparent opacity={0.6} metalness={0.8} />
      </mesh>
      <mesh position={[0, 36, 0]}>
        <coneGeometry args={[4.2, 3, 16]} />
        <meshStandardMaterial color="#0F172A" metalness={0.9} />
      </mesh>
      <group ref={beaconRef} position={[0, 33, 0]}>
        <mesh position={[0, 0, 7]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[4, 14, 16]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.35} />
        </mesh>
        <pointLight color="#00E5FF" intensity={5} distance={60} />
      </group>
    </group>
  );
};

const SmartMonorailTrack: React.FC<{ startZ: number; endZ: number; xPos: number; height: number }> = ({
  startZ,
  endZ,
  xPos,
  height,
}) => {
  const trainRef = useRef<THREE.Group>(null);
  const length = Math.abs(endZ - startZ);
  const centerZ = (startZ + endZ) / 2;

  useFrame((state) => {
    if (trainRef.current) {
      const t = (Math.sin(state.clock.elapsedTime * 0.35) + 1) / 2;
      trainRef.current.position.z = startZ + t * (endZ - startZ);
    }
  });

  const pillarCount = Math.floor(length / 50);
  const pillars = Array.from({ length: pillarCount + 1 }, (_, i) => startZ - i * 50);

  return (
    <group>
      {pillars.map((z, idx) => (
        <group key={`pillar-${idx}`} position={[xPos, 0, z]}>
          <mesh position={[0, height / 2, 0]} castShadow>
            <cylinderGeometry args={[0.9, 1.3, height, 10]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, height - 0.5, 0]}>
            <boxGeometry args={[4, 0.8, 1.2]} />
            <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}

      <mesh position={[xPos, height, centerZ]}>
        <boxGeometry args={[1.6, 1.2, length]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[xPos, height + 0.65, centerZ]}>
        <boxGeometry args={[0.4, 0.1, length]} />
        <meshBasicMaterial color="#00E5FF" />
      </mesh>

      <group ref={trainRef} position={[xPos, height + 1.8, startZ]}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 2.0, 18]} />
          <meshStandardMaterial color="#F8FAFC" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, -10]} rotation={[0.2, 0, 0]} castShadow>
          <coneGeometry args={[1.5, 3.5, 4]} />
          <meshStandardMaterial color="#00E5FF" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[2.3, 0.8, 16]} />
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.8} />
        </mesh>
        <pointLight position={[0, -1, 0]} color="#00E5FF" intensity={3} distance={12} />
      </group>
    </group>
  );
};

const HoverDrone: React.FC<{ position: [number, number, number]; seed?: number }> = ({ position, seed = 0 }) => {
  const droneRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (droneRef.current) {
      const time = state.clock.elapsedTime + seed;
      droneRef.current.position.y = position[1] + Math.sin(time * 2) * 1.5;
      droneRef.current.rotation.y = Math.sin(time * 0.8) * 0.4;
    }
  });

  return (
    <group ref={droneRef} position={position}>
      <mesh castShadow>
        <sphereGeometry args={[1.2, 12, 12]} />
        <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.4, 0.15, 8, 24]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1.2} />
      </mesh>
      {[-1.8, 1.8].map((x) =>
        [-1.8, 1.8].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            <mesh>
              <cylinderGeometry args={[1.1, 1.1, 0.1, 12]} />
              <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} />
            </mesh>
          </group>
        ))
      )}
      <pointLight color="#00E5FF" intensity={2} distance={8} />
    </group>
  );
};

const SmartSkyscraper: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  accentColor: string;
  heliport?: boolean;
  bannerText?: string;
}> = ({ position, size: [w, h, d], color, accentColor, heliport = false, bannerText }) => {
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
      </mesh>

      {[-w / 2, w / 2].map((x, i) =>
        [-d / 2, d / 2].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, h / 2, z]}>
            <boxGeometry args={[0.3, h, 0.3]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} />
          </mesh>
        ))
      )}

      {[0.25, 0.5, 0.75].map((level, idx) => (
        <mesh key={idx} position={[0, h * level, 0]}>
          <boxGeometry args={[w + 0.1, 1.8, d + 0.1]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} />
        </mesh>
      ))}

      {heliport ? (
        <group position={[0, h + 0.3, 0]}>
          <mesh receiveShadow>
            <cylinderGeometry args={[w * 0.4, w * 0.4, 0.6, 24]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[w * 0.28, w * 0.35, 24]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
        </group>
      ) : (
        <mesh position={[0, h + 6, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.5, 12, 8]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.0} />
        </mesh>
      )}

      {bannerText && (
        <group position={[0, h * 0.7, d / 2 + 0.3]}>
          <mesh>
            <boxGeometry args={[w * 0.85, 4.5, 0.2]} />
            <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1.2} />
          </mesh>
        </group>
      )}
    </group>
  );
};

const MooredYacht: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({ position, rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[4.2, 1.8, 14]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.4} />
      </mesh>
      <mesh position={[0, 2.2, -1]} castShadow>
        <boxGeometry args={[3.2, 1.5, 8]} />
        <meshStandardMaterial color="#00A8FF" metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0, 6, 0]}>
        <cylinderGeometry args={[0.08, 0.15, 9, 8]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.9} />
      </mesh>
    </group>
  );
};

const OverheadSmartGantry: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0,
}) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[-10, 4.5, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.7, 9, 12]} />
        <meshStandardMaterial color="#0F172A" metalness={0.8} />
      </mesh>
      <mesh position={[10, 4.5, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.7, 9, 12]} />
        <meshStandardMaterial color="#0F172A" metalness={0.8} />
      </mesh>
      <mesh position={[0, 8.5, 0]}>
        <boxGeometry args={[21, 1.5, 1.2]} />
        <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, 8.5, 0.65]}>
        <planeGeometry args={[16, 1.1]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
};

const CoastalCityScenery: React.FC = () => {
  const skyscrapers = [
    [-55, -40, 22, 48, 22, '#0F172A', '#00E5FF', true, 'SMART CITY'],
    [-85, -120, 26, 62, 24, '#1E293B', '#FF007F', false, 'NEO COAST'],
    [-52, -210, 20, 42, 20, '#0F172A', '#00FF9D', false, undefined],
    [-92, -300, 28, 75, 28, '#1E293B', '#00E5FF', true, 'XAYRUSH TOWER'],
    [-58, -390, 24, 52, 22, '#0F172A', '#FFD700', false, undefined],
    [-88, -480, 26, 68, 24, '#1E293B', '#00E5FF', true, 'CYBER HUB'],
    [-54, -570, 22, 45, 20, '#0F172A', '#FF007F', false, undefined],
    [-86, -660, 25, 70, 25, '#1E293B', '#00FF9D', true, 'SMART PORT'],
    [-52, -750, 20, 50, 20, '#0F172A', '#00E5FF', false, undefined],

    [-135, -80, 32, 85, 30, '#0B0F19', '#00E5FF', true, undefined],
    [-145, -260, 35, 95, 32, '#030712', '#38BDF8', false, undefined],
    [-140, -450, 34, 90, 30, '#0B0F19', '#FF007F', true, undefined],
    [-145, -630, 36, 88, 34, '#030712', '#00FF9D', false, undefined],
  ] as const;

  const skyBridges = [
    [-70, 32, -120, 30, 0],
    [-72, 40, -300, 32, 0],
    [-71, 35, -480, 30, 0],
    [-70, 38, -660, 32, 0],
  ] as const;

  const smartLamps = [
    [-14, 0], [14, -60], [-14, -140], [14, -220], [-14, -300],
    [14, -380], [-14, -460], [14, -540], [-14, -620], [14, -700], [-14, -780],
  ] as const;

  const windTurbines = [
    [240, 0, -120, 1.0],
    [270, 0, -280, 1.2],
    [250, 0, -440, 0.9],
    [280, 0, -600, 1.1],
    [245, 0, -740, 1.0],
  ] as const;

  const yachts = [
    [150, 0, -110, 0.3],
    [165, 0, -260, -0.2],
    [155, 0, -420, 0.4],
    [170, 0, -590, 0.1],
    [148, 0, -730, -0.3],
  ] as const;

  const drones = [
    [-40, 38, -100, 1],
    [30, 42, -250, 2],
    [-50, 45, -420, 3],
    [40, 36, -600, 4],
    [-35, 40, -720, 5],
  ] as const;

  return (
    <group>
      <SmartMonorailTrack startZ={40} endZ={-820} xPos={-32} height={12} />

      {skyscrapers.map(([x, z, w, h, d, color, accent, heliport, label], idx) => (
        <SmartSkyscraper
          key={`sky-${idx}`}
          position={[x, 0, z]}
          size={[w, h, d]}
          color={color}
          accentColor={accent}
          heliport={heliport}
          bannerText={label}
        />
      ))}

      {skyBridges.map(([x, y, z, length, rot], idx) => (
        <group key={`bridge-${idx}`} position={[x, y, z]} rotation={[0, rot, 0]}>
          <mesh castShadow>
            <boxGeometry args={[length, 2.5, 3.2]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 1.7]}>
            <planeGeometry args={[length, 1.4]} />
            <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}

      {windTurbines.map(([x, y, z, speed], idx) => (
        <OffshoreWindTurbine key={`wind-${idx}`} position={[x, y, z]} speedMultiplier={speed} />
      ))}

      <SmartLighthouse position={[210, 0, -810]} />

      {yachts.map(([x, y, z, rot], idx) => (
        <MooredYacht key={`yacht-${idx}`} position={[x, y, z]} rotationY={rot} />
      ))}

      {drones.map(([x, y, z, seed], idx) => (
        <HoverDrone key={`drone-${idx}`} position={[x, y, z]} seed={seed} />
      ))}

      <OverheadSmartGantry position={[0, 0, -120]} />
      <OverheadSmartGantry position={[75, 0, -310]} rotationY={0.4} />
      <OverheadSmartGantry position={[-30, 0, -620]} rotationY={-0.3} />

      {smartLamps.map(([x, z], idx) => (
        <group key={`lamp-${idx}`} position={[x, 0, z]}>
          <mesh position={[0, 4, 0]}>
            <cylinderGeometry args={[0.15, 0.25, 8, 8]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} />
          </mesh>
          <mesh position={[0, 8.1, 0]}>
            <boxGeometry args={[2.5, 0.3, 0.6]} />
            <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1.2} />
          </mesh>
        </group>
      ))}

      <mesh position={[24, 0.8, -400]}>
        <boxGeometry args={[1.2, 1.6, 850]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      <mesh position={[24, 1.65, -400]}>
        <boxGeometry args={[0.3, 0.2, 850]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};

export interface PalmTreeProps {
  position: [number, number, number];
  scale?: [number, number, number];
}

export const PalmTree: React.FC<PalmTreeProps> = ({ position, scale = [1, 1, 1] }) => {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.35, 5, 8]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
      </mesh>
      <group position={[0, 5, 0]}>
        <mesh position={[0, 0, 0]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[1.6, 0.4, 6]} />
          <meshStandardMaterial color="#2ED573" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[-0.3, 1, 0.2]}>
          <coneGeometry args={[1.8, 0.4, 6]} />
          <meshStandardMaterial color="#26DE81" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
};

export interface PineTreeProps {
  position: [number, number, number];
  scale?: [number, number, number];
}

export const PineTree: React.FC<PineTreeProps> = ({ position, scale = [1, 1, 1] }) => {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.4, 3, 8]} />
        <meshStandardMaterial color="#4A2E19" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[1.8, 3.5, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow>
        <coneGeometry args={[1.3, 2.5, 8]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.2} />
      </mesh>
    </group>
  );
};

export interface CyberCrystalProps {
  position: [number, number, number];
  scale?: [number, number, number];
}

export const CyberCrystal: React.FC<CyberCrystalProps> = ({ position, scale = [1, 1, 1] }) => {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 2, 0]} castShadow>
        <octahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1.5} wireframe />
      </mesh>
      <pointLight position={[0, 2, 0]} color="#00E5FF" intensity={3} distance={10} />
    </group>
  );
};

export interface RockProps {
  position: [number, number, number];
  scale?: [number, number, number];
}

export const Rock: React.FC<RockProps> = ({ position, scale = [1, 1, 1] }) => {
  return (
    <mesh position={[position[0], position[1] + (scale[1] * 0.5), position[2]]} scale={scale} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#64748B" roughness={0.9} />
    </mesh>
  );
};

export interface StartArchProps {
  position: [number, number, number];
  rotationY?: number;
}

export const StartArch: React.FC<StartArchProps> = ({ position, rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[-7, 3.5, 0]} castShadow>
        <boxGeometry args={[1, 7, 1]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} />
      </mesh>
      <mesh position={[7, 3.5, 0]} castShadow>
        <boxGeometry args={[1, 7, 1]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} />
      </mesh>
      <mesh position={[0, 6.5, 0]} castShadow>
        <boxGeometry args={[15, 1.4, 0.8]} />
        <meshStandardMaterial color="#FF4757" metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0, 6.5, 0.45]}>
        <planeGeometry args={[12, 1.0]} />
        <meshStandardMaterial color="#2ED573" emissive="#2ED573" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 2]} />
        <meshStandardMaterial color="#2ED573" roughness={0.5} />
      </mesh>
    </group>
  );
};

export const FinishArch: React.FC<StartArchProps> = ({ position, rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[-7, 3.5, 0]} castShadow>
        <boxGeometry args={[1.2, 7, 1.2]} />
        <meshStandardMaterial color="#FFA502" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[7, 3.5, 0]} castShadow>
        <boxGeometry args={[1.2, 7, 1.2]} />
        <meshStandardMaterial color="#FFA502" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 6.5, 0]} castShadow>
        <boxGeometry args={[15.2, 1.6, 1.0]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 6.5, 0.55]}>
        <planeGeometry args={[12.5, 1.2]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFA502" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 3.5]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[13.5, 1.5]} />
        <meshStandardMaterial color="#FF4757" emissive="#FF4757" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};
