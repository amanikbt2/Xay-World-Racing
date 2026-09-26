import { KartConfig } from '../game/GameConfig';

export interface CarItem {
  id: string;
  name: string;
  color: string;
  description: string;
  price: number;
  unlocked: boolean;
  baseStats: {
    speed: number;
    acceleration: number;
    handling: number;
    boost: number;
  };
  config: KartConfig;
}

export const CARS_DATA: CarItem[] = [
  {
    id: 'apex_runner',
    name: 'Apex Runner',
    color: '#FF4757',
    description: 'Balanced sports kart built for tight curves and smooth drifting.',
    price: 0,
    unlocked: true,
    baseStats: {
      speed: 75,
      acceleration: 70,
      handling: 80,
      boost: 70,
    },
    config: {
      id: 'apex_runner',
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
    },
  },
  {
    id: 'viper_gt',
    name: 'Viper GT',
    color: '#00E5FF',
    description: 'Ultra high-speed aerodynamic kart engineered for maximum straightaway velocity.',
    price: 600,
    unlocked: false,
    baseStats: {
      speed: 92,
      acceleration: 65,
      handling: 65,
      boost: 85,
    },
    config: {
      id: 'viper_gt',
      name: 'Viper GT',
      maxSpeed: 44,
      reverseMaxSpeed: 14,
      acceleration: 22,
      brakeForce: 32,
      steeringStrength: 1.9,
      friction: 0.96,
      driftFactor: 0.8,
      boostMultiplier: 1.65,
      boostDuration: 3.0,
      airControl: 0.4,
    },
  },
  {
    id: 'mud_crusher',
    name: 'Mud Crusher',
    color: '#2ED573',
    description: 'Heavy duty off-roader with brutal acceleration and high stability.',
    price: 1000,
    unlocked: false,
    baseStats: {
      speed: 70,
      acceleration: 90,
      handling: 85,
      boost: 60,
    },
    config: {
      id: 'mud_crusher',
      name: 'Mud Crusher',
      maxSpeed: 36,
      reverseMaxSpeed: 15,
      acceleration: 32,
      brakeForce: 42,
      steeringStrength: 2.4,
      friction: 0.91,
      driftFactor: 0.7,
      boostMultiplier: 1.4,
      boostDuration: 2.2,
      airControl: 0.7,
    },
  },
];
