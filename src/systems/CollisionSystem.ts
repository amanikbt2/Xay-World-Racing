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
  radius: number;
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
          [-55, -40, 22, 13], [-85, -120, 26, 15], [-52, -210, 20, 12],
          [-92, -300, 28, 16], [-58, -390, 24, 14], [-88, -480, 26, 15],
          [-54, -570, 22, 13], [-86, -660, 25, 15], [-52, -750, 20, 12],
          [-135, -80, 32, 18], [-145, -260, 35, 20], [-140, -450, 34, 19], [-145, -630, 36, 20],
        ];
        buildings.forEach(([x, z, width, radius]) => this.solidObstacles.push({
          position: new THREE.Vector3(x, 0, z),
          radius,
        }));

        const lamps: [number, number][] = [
          [-14, 0], [14, -60], [-14, -140], [14, -220], [-14, -300],
          [14, -380], [-14, -460], [14, -540], [-14, -620], [14, -700], [-14, -780],
        ];
        lamps.forEach(([x, z]) => this.solidObstacles.push({
          position: new THREE.Vector3(x, 0, z),
          radius: 1.7,
        }));

        for (let z = 40; z >= -820; z -= 50) {
          this.solidObstacles.push({
            position: new THREE.Vector3(-32, 0, z),
            radius: 2.2,
          });
        }

        this.solidObstacles.push({
          position: new THREE.Vector3(24, 0, -400),
          radius: 2.2,
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

  public update(physics: PlayerPhysics) {
    const kartPos = physics.position;
    const now = Date.now();

    const obstacle = this.solidObstacles.find((item) => {
      const distance = Math.hypot(kartPos.x - item.position.x, kartPos.z - item.position.z);
      return distance < item.radius + 1.25;
    });
    const rival = this.racerPositions
      .map((position) => ({ position, radius: 1.8 }))
      .find((item) => Math.hypot(kartPos.x - item.position.x, kartPos.z - item.position.z) < item.radius + 1.25);
    const hit = obstacle ?? rival;

    if (hit) {
      const away = new THREE.Vector3(kartPos.x - hit.position.x, 0, kartPos.z - hit.position.z);
      if (away.lengthSq() < 0.001) away.set(Math.sin(physics.heading), 0, Math.cos(physics.heading));
      const distance = Math.max(away.length(), 0.001);
      away.normalize();

      // Resolve the full overlap, not just a small nudge, so the kart cannot tunnel through.
      const requiredPush = Math.max(0, (hit.radius + 1.3) - distance) + 0.08;
      physics.position.addScaledVector(away, requiredPush);
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