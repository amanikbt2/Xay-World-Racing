export type GameStateType = 
  | 'SPLASH'
  | 'HOME'
  | 'MISSIONS'
  | 'GARAGE'
  | 'DRIVERS'
  | 'SHOP'
  | 'SETTINGS'
  | 'LOADING'
  | 'COUNTDOWN'
  | 'RACING'
  | 'PAUSED'
  | 'FINISHED'
  | 'RESULTS';

export interface RaceMetrics {
  speed: number;
  maxSpeed: number;
  lap: number;
  totalLaps: number;
  progressPercent: number;
  racerProgress: number[];
  position: number;
  totalRacers: number;
  timeSeconds: number;
  countdown: number;
  boostCharge: number;
  isBoosting: boolean;
  isDrifting: boolean;
  selectedTrackId: string;
  selectedKartId: string;
  selectedDriverId: string;
  rank: number;
  maxRank: number;
  coins: number;
  gems: number;
}

type Listener = (state: GameStateType, metrics: RaceMetrics) => void;

class GameStateManager {
  private currentState: GameStateType = 'SPLASH';
  private metrics: RaceMetrics = {
    speed: 0,
    maxSpeed: 38,
    lap: 1,
    totalLaps: 1,
    progressPercent: 0,
    racerProgress: [0, 0, 0, 0, 0, 0],
    position: 1,
    totalRacers: 6,
    timeSeconds: 0,
    countdown: 3,
    boostCharge: 0,
    isBoosting: false,
    isDrifting: false,
    selectedTrackId: 'tropical_coast_lvl_1',
    selectedKartId: 'apex_runner',
    selectedDriverId: 'driver_zack',
    rank: 42,
    maxRank: 1000,
    coins: 50200,
    gems: 50,
  };

  private listeners: Set<Listener> = new Set();

  public getState(): GameStateType {
    return this.currentState;
  }

  public getMetrics(): RaceMetrics {
    return this.metrics;
  }

  public setState(newState: GameStateType) {
    if (this.currentState === newState) return;
    this.currentState = newState;
    this.notify();
  }

  public updateMetrics(partial: Partial<RaceMetrics>) {
    Object.assign(this.metrics, partial);
    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    queueMicrotask(() => {
      this.listeners.forEach((l) => l(this.currentState, this.metrics));
    });
  }
}

export const gameStateStore = new GameStateManager();
