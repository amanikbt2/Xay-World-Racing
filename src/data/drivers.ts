export interface Driver {
  id: string;
  name: string;
  avatarColor: string;
  perkName: string;
  perkDescription: string;
  speedBonus: number;
  accelBonus: number;
  driftBonus: number;
  price: number;
  unlocked: boolean;
}

export const DRIVERS_DATA: Driver[] = [
  {
    id: 'driver_zack',
    name: 'Zack',
    avatarColor: '#FF4757',
    perkName: 'Top Speed Surge',
    perkDescription: '+5% Max Velocity on all karts',
    speedBonus: 0.05,
    accelBonus: 0,
    driftBonus: 0,
    price: 0,
    unlocked: true,
  },
  {
    id: 'driver_maya',
    name: 'Maya',
    avatarColor: '#FFA502',
    perkName: 'Drift Master',
    perkDescription: '+15% Faster Boost Charge while drifting',
    speedBonus: 0,
    accelBonus: 0,
    driftBonus: 0.15,
    price: 500,
    unlocked: false,
  },
  {
    id: 'driver_rex',
    name: 'Rex',
    avatarColor: '#2ED573',
    perkName: 'Nitro Fuel',
    perkDescription: '+20% Extended Boost Duration',
    speedBonus: 0.02,
    accelBonus: 0.1,
    driftBonus: 0,
    price: 800,
    unlocked: false,
  },
  {
    id: 'driver_kira',
    name: 'Kira',
    avatarColor: '#00E5FF',
    perkName: 'Cyber Launcher',
    perkDescription: '+10% Instant Launch Acceleration',
    speedBonus: 0,
    accelBonus: 0.15,
    driftBonus: 0.05,
    price: 1200,
    unlocked: false,
  },
];
