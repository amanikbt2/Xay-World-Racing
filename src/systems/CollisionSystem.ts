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
}

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
        const radius = item.type === 'rock' ? 3.2 : item.type === 'palm' || item.type === 'tree' ? 2.4 : 2.8;
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

        this.solidObstacles.push({
          position: new THREE.Vector3(24, 0, -400),
          halfSize: [0.6, 425],
        });

        [[0, -120], [75, -310], [-30, -620]].forEach(([x, z]) => {
          [-10, 10].forEach((offset) => this.solidObstacles.push({
            position: new THREE.Vector3(x + offset, 0, z),
            radius: 1.25,
          }));
        });
      }

      this.coins = [];
      let coinId = 1;
      trackData.curvePoints.forEach((pt, idx) => {
        if (idx > 0 && idx < trackData.curvePoints.length - 1) {
          const next = trackData.curvePoints[idx + 1];
          this.coins.push({ id: coinId++, position: [pt[0], pt[1] + 0.5, pt[2]], collected: false });
          this.coins.push({
            id: coinId++,
            position: [(pt[0] + next[0]) / 2, pt[1] + 0.5, (pt[2] + next[2]) / 2],
            collected: false,
          });
        }
      });

      this.boostPads = [];
      for (let i = 2; i < trackData.curvePoints.length - 1; i += 3) {
        const pt = trackData.curvePoints[i];
        this.boostPads.push({ id: i, position: [pt[0], pt[1], pt[2]] });
      }

      this.movingHazards = [];
      for (let i = 3; i < trackData.curvePoints.length - 1; i += 4) {
        const pt = trackData.curvePoints[i];
        this.movingHazards.push({ id: i, position: [pt[0] + (i % 2 === 0 ? 3 : -3), pt[1], pt[2]] });
      }
    }
  }

  public setRacerPosition(index: number, position: THREE.Vector3) {
    this.racerPositions[index] = position.clone();
  }

  private findHit(position: THREE.Vector3): CollisionHit | undefined {
    const cartRadius = 1.25;

    for (const obstacle of this.solidObstacles) {
      if (obstacle.halfSize) {
        const dx = Math.abs(position.x - obstacle.position.x);
        const dz = Math.abs(position.z - obstacle.position.z);
        if (dx < obstacle.halfSize[0] + cartRadius && dz < obstacle.halfSize[1] + cartRadius) {
          return obstacle;
        }
      } else if (
        obstacle.radius !== undefined &&
        Math.hypot(position.x - obstacle.position.x, position.z - obstacle.position.z) < obstacle.radius + cartRadius
      ) {
        return obstacle;
      }
    }

    return this.racerPositions
      .filter(Boolean)
      .map((racerPosition) => ({ position: racerPosition, radius: 1.8 }))
      .find((racer) => Math.hypot(position.x - racer.position.x, position.z - racer.position.z) < (racer.radius ?? 0) + cartRadius);
  }

  public update(physics: PlayerPhysics) {
    const kartPos = physics.position;
    const now = Date.now();
    const hit = this.findHit(kartPos);

    if (hit) {
      const away = new THREE.Vector3(kartPos.x - hit.position.x, 0, kartPos.z - hit.position.z);
      let pushDistance = 0;

      if (hit.halfSize) {
        const dx = kartPos.x - hit.position.x;
        const dz = kartPos.z - hit.position.z;
        const pushX = hit.halfSize[0] + 1.25 - Math.abs(dx);
        const pushZ = hit.halfSize[1] + 1.25 - Math.abs(dz);
        if (pushX <= pushZ) {
          away.set(Math.sign(dx) || 1, 0, 0);
          pushDistance = pushX;
        } else {
          away.set(0, 0, Math.sign(dz) || 1);
          pushDistance = pushZ;
        }
      } else {
        const distance = Math.max(away.length(), 0.001);
        away.normalize();
        pushDistance = (hit.radius ?? 1.8) + 1.25 - distance;
      }

      physics.position.addScaledVector(away.normalize(), Math.max(0, pushDistance) + 0.08);
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