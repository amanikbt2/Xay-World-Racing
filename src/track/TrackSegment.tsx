import React from 'react';
import * as THREE from 'three';


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

const CoastalCityScenery: React.FC = () => {
  const buildings = [
    [-52, -115, 16, 12, 18, '#F4A261', '#E76F51'],
    [-76, -190, 20, 18, 22, '#F6BD60', '#2A9D8F'],
    [-54, -285, 14, 10, 18, '#E9C46A', '#264653'],
    [-82, -380, 24, 22, 24, '#F28482', '#E76F51'],
    [-57, -490, 18, 14, 20, '#84A59D', '#F6BD60'],
    [-78, -610, 22, 20, 25, '#90BE6D', '#277DA1'],
    [-52, -715, 17, 11, 20, '#F7EDE2', '#E76F51'],
  ] as const;

  const roads = [
    [-49, -154, 7, 54, 0], [-47, -338, 7, 58, 0], [-48, -550, 7, 62, 0],
    [-68, -250, 56, 7, Math.PI / 2], [-68, -660, 56, 7, Math.PI / 2],
  ] as const;

  const lamps = [
    [-38, -135], [-38, -310], [-38, -505], [-38, -690], [18, -175], [18, -615],
  ] as const;

  const birds = [
    [-20, 36, -180, 1.1], [72, 44, -430, 0.8], [130, 32, -680, 1.35],
  ] as const;

  return (
    <group>
      {buildings.map(([x, z, w, h, d, color, roof], index) => (
        <group key={'building-' + index} position={[x, 0, z]}>
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
          <mesh position={[0, h + 0.35, 0]} castShadow>
            <boxGeometry args={[w + 1.5, 0.7, d + 1.5]} />
            <meshStandardMaterial color={roof} roughness={0.75} />
          </mesh>
          {[-1, 0, 1].map((window) => (
            <mesh key={window} position={[window * (w / 3.3), h * 0.58, -(d / 2 + 0.04)]}>
              <boxGeometry args={[1.8, 2.2, 0.08]} />
              <meshStandardMaterial color="#BDE0FE" emissive="#5DADE2" emissiveIntensity={0.18} />
            </mesh>
          ))}
        </group>
      ))}
      {roads.map(([x, z, width, length, rotation], index) => (
        <group key={'city-road-' + index} position={[x, 0.08, z]} rotation={[0, rotation, 0]}>
          <mesh receiveShadow>
            <planeGeometry args={[width, length]} />
            <meshStandardMaterial color="#64748B" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <planeGeometry args={[0.35, length * 0.82]} />
            <meshBasicMaterial color="#FDE68A" />
          </mesh>
        </group>
      ))}
      <group position={[151, 0.65, -385]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[24, 0.7, 150]} />
          <meshStandardMaterial color="#4B5563" roughness={0.8} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 11, 2.1, 0]}>
            <mesh>
              <boxGeometry args={[0.35, 3, 150]} />
              <meshStandardMaterial color="#F6BD60" metalness={0.35} roughness={0.5} />
            </mesh>
            {[-60, -30, 0, 30, 60].map((z) => (
              <mesh key={z} position={[0, -0.4, z]}>
                <boxGeometry args={[0.45, 3.2, 0.45]} />
                <meshStandardMaterial color="#334155" />
              </mesh>
            ))}
          </group>
        ))}
        <mesh position={[0, -1.2, 0]}>
          <boxGeometry args={[1.4, 2, 150]} />
          <meshStandardMaterial color="#64748B" roughness={0.9} />
        </mesh>
      </group>
      {lamps.map(([x, z], index) => (
        <group key={'lamp-' + index} position={[x, 0, z]}>
          <mesh position={[0, 3, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.18, 6, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.7} />
          </mesh>
          <mesh position={[0, 6.1, 0]}>
            <sphereGeometry args={[0.42, 10, 8]} />
            <meshStandardMaterial color="#FFF4D0" emissive="#FFD166" emissiveIntensity={0.7} />
          </mesh>
        </group>
      ))}
      {birds.map(([x, y, z, scale], index) => (
        <group key={'bird-' + index} position={[x, y, z]} scale={scale}>
          <mesh rotation={[0, 0, -0.25]}>
            <boxGeometry args={[3, 0.12, 0.18]} />
            <meshBasicMaterial color="#334155" />
          </mesh>
          <mesh position={[2.1, 0.15, 0]} rotation={[0, 0, 0.25]}>
            <boxGeometry args={[3, 0.12, 0.18]} />
            <meshBasicMaterial color="#334155" />
          </mesh>
        </group>
      ))}
    </group>
  );
};



interface PalmTreeProps {
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

interface PineTreeProps {
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

interface CyberCrystalProps {
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

interface RockProps {
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

interface StartArchProps {
  position: [number, number, number];
  rotationY?: number;
}

export const StartArch: React.FC<StartArchProps> = ({ position, rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Pillars */}
      <mesh position={[-7, 3.5, 0]} castShadow>
        <boxGeometry args={[1, 7, 1]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} />
      </mesh>
      <mesh position={[7, 3.5, 0]} castShadow>
        <boxGeometry args={[1, 7, 1]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} />
      </mesh>
      {/* Top Beam */}
      <mesh position={[0, 6.5, 0]} castShadow>
        <boxGeometry args={[15, 1.4, 0.8]} />
        <meshStandardMaterial color="#FF4757" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Banner */}
      <mesh position={[0, 6.5, 0.45]}>
        <planeGeometry args={[12, 1.0]} />
        <meshStandardMaterial color="#2ED573" emissive="#2ED573" emissiveIntensity={0.6} />
      </mesh>
      {/* Start Line Asphalt Patch */}
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
      {/* Gold & Black Checkered Finish Pillars */}
      <mesh position={[-7, 3.5, 0]} castShadow>
        <boxGeometry args={[1.2, 7, 1.2]} />
        <meshStandardMaterial color="#FFA502" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[7, 3.5, 0]} castShadow>
        <boxGeometry args={[1.2, 7, 1.2]} />
        <meshStandardMaterial color="#FFA502" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Top Finish Arch Beam */}
      <mesh position={[0, 6.5, 0]} castShadow>
        <boxGeometry args={[15.2, 1.6, 1.0]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Glowing Finish Line Header Banner */}
      <mesh position={[0, 6.5, 0.55]}>
        <planeGeometry args={[12.5, 1.2]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFA502" emissiveIntensity={0.9} />
      </mesh>
      {/* Checkered Finish Line Asphalt Patch */}
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

