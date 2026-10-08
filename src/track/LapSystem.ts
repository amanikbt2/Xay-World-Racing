import * as THREE from 'three';
import { CheckpointData } from './TrackConfig';
import { gameStateStore } from '../game/GameState';

export class LapSystem {
  private checkpoints: CheckpointData[] = [];
  private nextCheckpointIndex: number = 0;
  public currentLap: number = 1;
  public totalLaps: number = 1;
  public isClosed: boolean = false;
  public isRaceFinished: boolean = false;

  public raceStartTime: number = 0;
  public currentLapStartTime: number = 0;
  public bestLapTime: number = 0;

  constructor(checkpoints: CheckpointData[], totalLaps: number = 1, isClosed: boolean = false) {
    this.checkpoints = checkpoints;
    this.totalLaps = totalLaps;
    this.isClosed = isClosed;
    this.reset();
  }

  public reset() {
    this.nextCheckpointIndex = 1;
    this.currentLap = 1;
    this.isRaceFinished = false;
    this.raceStartTime = Date.now();
    this.currentLapStartTime = Date.now();
    gameStateStore.updateMetrics({
      lap: 1,
      totalLaps: this.totalLaps,
      progressPercent: 0,
    });
  }

  public update(kartPosition: THREE.Vector3) {
    if (this.isRaceFinished || this.checkpoints.length === 0) return;

    const target = this.checkpoints[this.nextCheckpointIndex];
    if (!target) return;

    const targetPos = new THREE.Vector3(target.position[0], target.position[1], target.position[2]);
    const distance = kartPosition.distanceTo(targetPos);

    if (distance <= target.radius) {
      if (!this.isClosed) {
        // Point-to-Point Sprint Mission Logic
        const progressPercent = Math.round(
          ((this.nextCheckpointIndex + 1) / this.checkpoints.length) * 100
        );
        gameStateStore.updateMetrics({ progressPercent });

        this.nextCheckpointIndex += 1;

        if (this.nextCheckpointIndex >= this.checkpoints.length) {
          // Race & Mission Complete!
          this.isRaceFinished = true;
          const totalDuration = (Date.now() - this.raceStartTime) / 1000;
          gameStateStore.updateMetrics({
            timeSeconds: totalDuration,
            progressPercent: 100,
          });
          gameStateStore.setState('RESULTS');
        }
      } else {
        // Circuit Race Loop Logic
        this.nextCheckpointIndex = (this.nextCheckpointIndex + 1) % this.checkpoints.length;

        if (this.nextCheckpointIndex === 0) {
          const now = Date.now();
          const lapDuration = (now - this.currentLapStartTime) / 1000;
          this.currentLapStartTime = now;

          if (this.bestLapTime === 0 || lapDuration < this.bestLapTime) {
            this.bestLapTime = lapDuration;
          }

          if (this.currentLap < this.totalLaps) {
            this.currentLap += 1;
            gameStateStore.updateMetrics({ lap: this.currentLap });
          } else {
            // Circuit Race Complete!
            this.isRaceFinished = true;
            const totalDuration = (now - this.raceStartTime) / 1000;
            gameStateStore.updateMetrics({
              timeSeconds: totalDuration,
            });
            gameStateStore.setState('RESULTS');
          }
        }
      }
    }
  }
}
