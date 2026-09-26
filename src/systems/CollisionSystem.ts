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

export class CollisionSystem {
  public coins: CoinData[] = [];
  public boostPads: BoostPadData[] = [];
  public movingHazards: MovingHazardData[] = [];

  private lastBoostTime: number = 0;
  private lastHitTime: number = 0;

  public reset(trackData?: TrackConfigData) {
    this.lastBoostTime = 0;
    this.lastHitTime = 0;

    if (trackData && trackData.curvePoints && trackData.curvePoints.length > 2) {
      const points = trackData.curvePoints;
      
      // 1. Dynamic Coins
      this.coins = [];
      let coinId = 1;
      points.forEach((pt, idx) => {
        if (idx > 0 && idx < points.length - 1) {
          // Place 2 coins near each segment
          const nextPt = points[idx + 1];
          const midX = (pt[0] + nextPt[0]) / 2;
          const midZ = (pt[2] + nextPt[2]) / 2;

          this.coins.push({
            id: coinId++,
            position: [pt[0], pt[1] + 0.5, pt[2]],
            collected: false,
          });
          this.coins.push({
            id: coinId++,
            position: [midX, pt[1] + 0.5, midZ],
            collected: false,
          });
        }
      });

      // 2. Dynamic Boost Pads (placed every 3rd segment)
      this.boostPads = [];
      let padId = 1;
      for (let i = 2; i < points.length - 1; i += 3) {
        const pt = points[i];
        this.boostPads.push({
          id: padId++,
          position: [pt[0], pt[1], pt[2]],
        });
      }

      // 3. Dynamic Moving Hazards (placed at intermediate segments)
      this.movingHazards = [];
      let hazardId = 1;
      for (let i = 3; i < points.length - 1; i += 4) {
        const pt = points[i];
        this.movingHazards.push({
          id: hazardId++,
          position: [pt[0] + (i % 2 === 0 ? 3 : -3), pt[1], pt[2]],
        });
      }
    } else {
      // Fallback default setup
      this.coins = [
        { id: 1, position: [0, 0, -40], collected: false },
        { id: 2, position: [15, 0, -120], collected: false },
        { id: 3, position: [50, 0, -200], collected: false },
        { id: 4, position: [90, 0, -300], collected: false },
        { id: 5, position: [30, 0, -450], collected: false },
        { id: 6, position: [-20, 0, -600], collected: false },
      ];
      this.boostPads = [
        { id: 1, position: [0, 0, -80] },
        { id: 2, position: [70, 0, -250] },
        { id: 3, position: [-10, 0, -520] },
      ];
      this.movingHazards = [
        { id: 1, position: [35, 0, -180] },
        { id: 2, position: [40, 0, -400] },
      ];
    }
  }

  public update(physics: PlayerPhysics) {
    const kartPos = physics.position;
    const now = Date.now();

    // 1. Coin Pickup Collision
    this.coins.forEach((coin) => {
      if (!coin.collected) {
        const coinPos = new THREE.Vector3(coin.position[0], coin.position[1], coin.position[2]);
        if (kartPos.distanceTo(coinPos) < 2.5) {
          coin.collected = true;
          const metrics = gameStateStore.getMetrics();
          gameStateStore.updateMetrics({
            coins: metrics.coins + 50,
          });
        }
      }
    });

    // 2. Nitro Boost Pad Collision
    if (now - this.lastBoostTime > 1500) {
      this.boostPads.forEach((pad) => {
        const padPos = new THREE.Vector3(pad.position[0], pad.position[1], pad.position[2]);
        if (kartPos.distanceTo(padPos) < 3.5) {
          this.lastBoostTime = now;
          physics.isBoosting = true;
          physics.boostTimer = 3.0;
        }
      });
    }

    // 3. Moving Hazard Collision
    if (now - this.lastHitTime > 1800) {
      this.movingHazards.forEach((hazard) => {
        const hazardPos = new THREE.Vector3(hazard.position[0], hazard.position[1], hazard.position[2]);
        if (kartPos.distanceTo(hazardPos) < 2.8) {
          this.lastHitTime = now;
          physics.speed *= 0.35;
        }
      });
    }
  }
}
