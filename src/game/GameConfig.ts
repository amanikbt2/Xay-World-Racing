export interface KartConfig {
  id: string;
  name: string;
  maxSpeed: number;
  reverseMaxSpeed: number;
  acceleration: number;
  brakeForce: number;
  steeringStrength: number;
  friction: number;
  driftFactor: number;
  boostMultiplier: number;
  boostDuration: number;
  airControl: number;
}

export const DEFAULT_KART_CONFIG: KartConfig = {
  id: 'speedster_01',
  name: 'Apex Runner',
  maxSpeed: 38,
  reverseMaxSpeed: 12,
  acceleration: 24,
  brakeForce: 36,
  steeringStrength: 2.2,
  friction: 0.94,
  driftFactor: 0.75,
  boostMultiplier: 1.5,
  boostDuration: 2.5,
  airControl: 0.5,
};

export const GAME_PHYSICS = {
  gravity: 25.0,
  groundY: 0.0,
  cameraDistance: 7.2,
  cameraHeight: 3.25,
  cameraLerpSpeed: 0.12,
  cameraFovNormal: 64,
  cameraFovBoost: 72,
};
