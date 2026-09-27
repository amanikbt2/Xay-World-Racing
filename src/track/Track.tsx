import React, { useMemo } from 'react';
import * as THREE from 'three';
import { TrackConfigData } from './TrackConfig';
import { PalmTree, Rock, PineTree, CyberCrystal, StartArch, FinishArch, BeachScenery } from './TrackSegment';
import { GoldenCoin, NitroBoostPad } from '../items/Collectible';
import { CollisionSystem } from '../systems/CollisionSystem';

interface TrackProps {
  trackData: TrackConfigData;
  collisionSystem: CollisionSystem;
}

export const Track: React.FC<TrackProps> = ({ trackData, collisionSystem }) => {
  const { ribbonGeometry, shoulderGeometry, startPos, finishPos, startHeading, finishHeading } = useMemo(() => {
    const points = trackData.curvePoints.map(
      (p) => new THREE.Vector3(p[0], p[1], p[2])
    );
    const isClosed = trackData.isClosed ?? false;
    const catmullCurve = new THREE.CatmullRomCurve3(points, isClosed, 'centripetal');

    const segments = 300;
    const roadWidth = 14;
    const geometry = new THREE.BufferGeometry();
    const shoulder = new THREE.BufferGeometry();

    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const curvePoints = catmullCurve.getSpacedPoints(segments);
    const frenetFrames = catmullCurve.computeFrenetFrames(segments, isClosed);

    for (let i = 0; i <= segments; i++) {
      const pt = curvePoints[i];
      const binormal = frenetFrames.binormals[i];

      const left = pt.clone().addScaledVector(binormal, roadWidth / 2);
      const right = pt.clone().addScaledVector(binormal, -roadWidth / 2);

      positions.push(left.x, left.y + 0.02, left.z);
      positions.push(right.x, right.y + 0.02, right.z);

      const v = (i / segments) * 40;
      uvs.push(0, v);
      uvs.push(1, v);

      if (i < segments) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const shoulderPositions: number[] = [];
    const shoulderUvs: number[] = [];
    const shoulderIndices: number[] = [];
    for (let i = 0; i <= segments; i++) {
      const pt = curvePoints[i];
      const binormal = frenetFrames.binormals[i];
      const left = pt.clone().addScaledVector(binormal, (roadWidth + 5) / 2);
      const right = pt.clone().addScaledVector(binormal, -(roadWidth + 5) / 2);
      shoulderPositions.push(left.x, left.y + 0.005, left.z, right.x, right.y + 0.005, right.z);
      shoulderUvs.push(0, i / segments * 24, 1, i / segments * 24);
      if (i < segments) {
        const base = i * 2;
        shoulderIndices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
      }
    }
    shoulder.setAttribute('position', new THREE.Float32BufferAttribute(shoulderPositions, 3));
    shoulder.setAttribute('uv', new THREE.Float32BufferAttribute(shoulderUvs, 2));
    shoulder.setIndex(shoulderIndices);
    shoulder.computeVertexNormals();

    const p0 = curvePoints[0];
    const p1 = curvePoints[1];
    const computedStartHeading = Math.atan2(p0.x - p1.x, p0.z - p1.z);

    const pLastPrev = curvePoints[segments - 1];
    const pLast = curvePoints[segments];
    const computedFinishHeading = Math.atan2(pLastPrev.x - pLast.x, pLastPrev.z - pLast.z);

    return {
      ribbonGeometry: geometry,
      shoulderGeometry: shoulder,
      startPos: [p0.x, p0.y, p0.z] as [number, number, number],
      finishPos: [pLast.x, pLast.y, pLast.z] as [number, number, number],
      startHeading: computedStartHeading,
      finishHeading: computedFinishHeading,
    };
  }, [trackData]);

  const env = trackData.environment;

  return (
    <group>
      {/* Sand shoulder and racetrack ribbon */}
      <mesh geometry={shoulderGeometry} receiveShadow>
        <meshStandardMaterial color={trackData.theme === 'Tropical Coast' ? '#E8B85B' : env.groundColor} roughness={0.95} />
      </mesh>
      <mesh geometry={ribbonGeometry} receiveShadow castShadow>
        <meshStandardMaterial
          color={env.roadColor}
          roughness={0.7}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Terrain Base Plane */}
      <mesh position={[0, -0.05, -400]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1800, 1800]} />
        <meshStandardMaterial color={env.groundColor} roughness={0.95} />
      </mesh>

      {/* Fluid Surface */}
      <mesh position={[235, -0.02, -400]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[220, 3000]} />
        <meshStandardMaterial
          color={env.fluidColor}
          roughness={0.1}
          metalness={0.3}
          emissive={trackData.theme === 'Lava Canyon' ? '#FF3300' : '#000000'}
          emissiveIntensity={trackData.theme === 'Lava Canyon' ? 0.8 : 0}
        />
      </mesh>

      {trackData.theme === 'Tropical Coast' && <BeachScenery cityUpgrade={trackData.id.endsWith('_lvl_1')} />}

      {/* Start Arch */}
      <StartArch position={startPos} rotationY={startHeading} />

      {/* Finish Line Arch (Rendered for Sprint Tracks or Finish Line) */}
      <FinishArch position={finishPos} rotationY={finishHeading} />

      {/* Scenery Objects */}
      {trackData.scenery.map((item, idx) => {
        if (item.type === 'palm') {
          return <PalmTree key={idx} position={item.position} scale={item.scale} />;
        }
        if (item.type === 'rock') {
          return <Rock key={idx} position={item.position} scale={item.scale} />;
        }
        if (item.type === 'tree') {
          return <PineTree key={idx} position={item.position} scale={item.scale} />;
        }
        if (item.type === 'crystal') {
          return <CyberCrystal key={idx} position={item.position} scale={item.scale} />;
        }
        return null;
      })}

      {/* Collectible Golden Coins */}
      {collisionSystem.coins.map((coin) => (
        <GoldenCoin key={coin.id} position={coin.position} collected={coin.collected} />
      ))}

      {/* Nitro Boost Pads */}
      {collisionSystem.boostPads.map((pad) => (
        <NitroBoostPad key={pad.id} position={pad.position} />
      ))}

      {/* Moving Hazards */}
      {collisionSystem.movingHazards.map((hazard) => (
        <MovingRoadHazard key={hazard.id} position={hazard.position} />
      ))}
    </group>
  );
};
