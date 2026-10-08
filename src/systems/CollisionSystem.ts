import * as THREE from 'three';
import { PlayerPhysics } from '../player/PlayerPhysics';
import { gameStateStore } from '../game/GameState';
import { TrackConfigData } from '../track/TrackConfig';

export interface CoinData {
  id: number;
  position: [number, number, number];
  collected: boolean;
}
export interface BoostPadData {
  id: number;
  position: [number, number, number];
}
export interface MovingHazardData {
  id: number;
  position: [number, number, number];
}
interface SolidObstacle {
  position: THREE.Vector3;
  radius?: number;
  halfSize?: [number, number];
}
interface CollisionHit {
  position: THREE.Vector3;
  radius?: number;
  halfSize?: [number, number];
  normal: THREE.Vector3;
  penetration: number;
}

// The player model occupies roughly 2.0 units across and 2.8 units front-to-back.
// Keep the gameplay footprint slightly inside the visible bumper/wheels so that
// the player can visually pass close to scenery without an invisible early hit.
const KART_HALF_WIDTH = 0.94;
const KART_HALF_LENGTH = 1.36;

export class CollisionSystem {
  public coins: CoinData[] = [];
  public boostPads: BoostPadData[] = [];
  public movingHazards: MovingHazardData[] = [];
  private solidObstacles: SolidObstacle[] = [];
  private racerPositions: THREE.Vector3[] = [];
  private lastBoostTime = 0;
  private lastHitTime = 0;

  public reset(trackData?: TrackConfigData) {
    this.lastBoostTime = 0;
    this.lastHitTime = 0;
    this.racerPositions = [];
    this.solidObstacles = [];

    if (trackData && trackData.curvePoints.length > 2) {
      trackData.scenery.forEach((item) => {
        // Collision should follow the solid base of the rendered object, not its
        // canopy/visual decoration. The scale is applied because scenery is
        // rendered inside a scaled group.
        const scale = Math.max(Math.abs(item.scale?.[0] ?? 1), Math.abs(item.scale?.[2] ?? 1));
        const baseRadius = item.type === 'rock' ? 1.35 : item.type === 'palm' ? 0.48 : item.type === 'tree' ? 0.72 : 0.9;
        const radius = baseRadius * scale;
        this.solidObstacles.push({ position: new THREE.Vector3(...item.position), radius });
      });

      if (trackData.id === 'tropical_coast_lvl_1') {
        const buildings: [number, number, number, number][] = [
          [-55, -40, 22, 22], [-85, -120, 26, 24], [-52, -210, 20, 20],
          [-92, -300, 28, 28], [-58, -390, 24, 22], [-88, -480, 26, 24],
          [-54, -570, 22, 20], [-86, -660, 25, 25], [-52, -750, 20, 20],
          [-135, -80, 32, 30], [-145, -260, 35, 32], [-140, -450, 34, 30], [-145, -630, 36, 34],
        ];
        buildings.forEach(([x, z, width, depth]) => this.solidObstacles.push({
          position: new THREE.Vector3(x, 0, z),
          halfSize: [width / 2, depth / 2],
        }));

        const lamps: [number, number][] = [
          [-14, 0], [14, -60], [-14, -140], [14, -220], [-14, -300],
          [14, -380], [-14, -460], [14, -540], [-14, -620], [14, -700], [-14, -780],
        ];
        lamps.forEach(([x, z]) => this.solidObstacles.push({
          position: new THREE.Vector3(x, 0, z),
          radius: 1.3,
        }));

        for (let z = 40; z >= -820; z -= 50) {
          this.solidObstacles.push({
            position: new THREE.Vector3(-32, 0, z),
            radius: 1.6,
          });
        }

        [[0, -120], [75, -310], [-30, -620]].forEach(([x, z]) => {
          [-10, 10].forEach((offset) => this.solidObstacles.push({
            position: new THREE.Vector3(x + offset, 0, z),
            radius: 1.25,
          }));
        });
      }

      if (trackData.id === 'tropical_coast_lvl_2') {
        const piers: [number, number][] = [
          [85, -240], [110, -280], [135, -330], [125, -380], [110, -420], [75, -460], [45, -500]
        ];
        piers.forEach(([x, z]) => {
          [-6, 6].forEach((offset) => this.solidObstacles.push({
            position: new THREE.Vector3(x + offset, 0, z),
            radius: 1.4,
          }));
        });

        const cavePillars: [number, number][] = [
          [-118, -720], [-102, -720],
          [-108, -900], [-92, -900]
        ];
        cavePillars.forEach(([x, z]) => {
          this.solidObstacles.push({
            position: new THREE.Vector3(x, 0, z),
            radius: 1.8,
          });
        });
      }

      if (trackData.id === 'tropical_coast_lvl_3') {
        // Waterfall Rock Mass
        this.solidObstacles.push({
          position: new THREE.Vector3(140, 0, -250),
          radius: 14.0,
        });

        // Boardwalk Posts
        [[160, -360], [150, -410], [130, -470], [90, -510]].forEach(([x, z]) => {
          [-7, 7].forEach((offset) => {
            this.solidObstacles.push({
              position: new THREE.Vector3(x + offset, 0, z),
              radius: 1.2,
            });
          });
        });
      }

      this.coins = [];
      for (let i = 1; i < trackData.curvePoints.length - 1; i += 2) {
        const pt = trackData.curvePoints[i];
        this.coins.push({
          id: i,
          position: [pt[0], pt[1] + 0.6, pt[2]],
          collected: false,
        });
      }

      this.boostPads = [];
      for (let i = 2; i < trackData.curvePoints.length - 1; i += 3) {
        const pt = trackData.curvePoints[i];
        this.boostPads.push({ id: i, position: [pt[0], pt[1], pt[2]] });
      }

      this.movingHazards = [];
    }
  }

  public setRacerPosition(index: number, position: THREE.Vector3) {
    this.racerPositions[index] = position.clone();
  }

  private findHit(position: THREE.Vector3, heading: number): CollisionHit | undefined {
    const sin = Math.sin(heading);
    const cos = Math.cos(heading);
    // Local +x is the kart's right vector and local +z is its rear direction.
    const toLocal = (worldX: number, worldZ: number) => ({
      x: (worldX - position.x) * cos + (worldZ - position.z) * sin,
      z: -(worldX - position.x) * sin + (worldZ - position.z) * cos,
    });

    for (const obstacle of this.solidObstacles) {
      if (obstacle.halfSize) {
        // SAT for the kart OBB against the track-aligned obstacle AABB.
        const relative = {
          x: obstacle.position.x - position.x,
          z: obstacle.position.z - position.z,
        };
        const kartRight = { x: cos, z: sin };
        const kartRear = { x: -sin, z: cos };
        const axes = [
          { ...kartRight, kart: KART_HALF_WIDTH },
          { ...kartRear, kart: KART_HALF_LENGTH },
          { x: 1, z: 0, kart: KART_HALF_WIDTH * Math.abs(cos) + KART_HALF_LENGTH * Math.abs(sin) },
          { x: 0, z: 1, kart: KART_HALF_WIDTH * Math.abs(sin) + KART_HALF_LENGTH * Math.abs(cos) },
        ];
        let minPenetration = Number.POSITIVE_INFINITY;
        let bestNormal = new THREE.Vector3(0, 0, 0);
        for (const axis of axes) {
          const distance = Math.abs(relative.x * axis.x + relative.z * axis.z);
          const obstacleProjection = obstacle.halfSize[0] * Math.abs(axis.x) + obstacle.halfSize[1] * Math.abs(axis.z);
          const overlap = axis.kart + obstacleProjection - distance;
          if (overlap <= 0) {
            minPenetration = -1;
            break;
          }
          if (overlap < minPenetration) {
            minPenetration = overlap;
            // Push the kart away from the obstacle center along the shallowest
            // penetration axis.
            const sign = relative.x * axis.x + relative.z * axis.z >= 0 ? -1 : 1;
            bestNormal.set(axis.x * sign, 0, axis.z * sign);
          }
        }
        if (minPenetration > 0) {
          return { ...obstacle, normal: bestNormal, penetration: minPenetration };
        }
      } else if (
        obstacle.radius !== undefined &&
        (() => {
          const local = toLocal(obstacle.position.x, obstacle.position.z);
          const closestX = THREE.MathUtils.clamp(local.x, -KART_HALF_WIDTH, KART_HALF_WIDTH);
          const closestZ = THREE.MathUtils.clamp(local.z, -KART_HALF_LENGTH, KART_HALF_LENGTH);
          const dx = local.x - closestX;
          const dz = local.z - closestZ;
          return dx * dx + dz * dz < obstacle.radius * obstacle.radius;
        })()
      ) {
        const local = toLocal(obstacle.position.x, obstacle.position.z);
        const closestX = THREE.MathUtils.clamp(local.x, -KART_HALF_WIDTH, KART_HALF_WIDTH);
        const closestZ = THREE.MathUtils.clamp(local.z, -KART_HALF_LENGTH, KART_HALF_LENGTH);
        const dx = local.x - closestX;
        const dz = local.z - closestZ;
        const distance = Math.hypot(dx, dz);
        const normalLocal = distance > 0.001
          ? { x: -dx / distance, z: -dz / distance }
          : { x: local.x >= 0 ? -1 : 1, z: 0 };
        const normal = new THREE.Vector3(
          normalLocal.x * cos - normalLocal.z * sin,
          0,
          normalLocal.x * sin + normalLocal.z * cos,
        );
        return { ...obstacle, normal, penetration: obstacle.radius - distance };
      }
    }

    for (const racerPosition of this.racerPositions.filter(Boolean)) {
      const local = toLocal(racerPosition.x, racerPosition.z);
      const closestX = THREE.MathUtils.clamp(local.x, -KART_HALF_WIDTH, KART_HALF_WIDTH);
      const closestZ = THREE.MathUtils.clamp(local.z, -KART_HALF_LENGTH, KART_HALF_LENGTH);
      const dx = local.x - closestX;
      const dz = local.z - closestZ;
      const distance = Math.hypot(dx, dz);
      const racerRadius = 0.9;
      if (distance < racerRadius) {
        return {
          position: racerPosition,
          radius: racerRadius,
          normal: new THREE.Vector3(-Math.sin(heading), 0, -Math.cos(heading)),
          penetration: racerRadius - distance,
        };
      }
    }
    return undefined;
  }

  public update(physics: PlayerPhysics) {
    const kartPos = physics.position;
    const now = Date.now();
    const hit = this.findHit(kartPos, physics.rotation.y);

    if (hit) {
      physics.position.addScaledVector(hit.normal, hit.penetration + 0.08);
      physics.speed = 0;

      if (now - this.lastHitTime > 180) {
        this.lastHitTime = now;
        physics.hitTimer = 0.35;
      }
    }

    this.coins.forEach((coin) => {
      if (!coin.collected && kartPos.distanceTo(new THREE.Vector3(...coin.position)) < 2.5) {
        coin.collected = true;
        gameStateStore.updateMetrics({ coins: gameStateStore.getMetrics().coins + 50 });
      }
    });

    if (now - this.lastBoostTime > 1500) {
      this.boostPads.forEach((pad) => {
        if (kartPos.distanceTo(new THREE.Vector3(...pad.position)) < 3.5) {
          this.lastBoostTime = now;
          physics.isBoosting = true;
          physics.boostTimer = 3;
        }
      });
    }

    if (now - this.lastHitTime > 1800) {
      this.movingHazards.forEach((hazard) => {
        if (kartPos.distanceTo(new THREE.Vector3(...hazard.position)) < 2.8) {
          this.lastHitTime = now;
          physics.speed *= 0.35;
          physics.hitTimer = 0.25;
        }
      });
    }
  }
}
