
export interface CheckpointData {
  id: number;
  position: [number, number, number];
  radius: number;
}

export interface SceneryObjectData {
  type: 'palm' | 'rock' | 'barrier' | 'ramp' | 'tree' | 'crystal';
  position: [number, number, number];
  scale?: [number, number, number];
  rotation?: number;
}

export interface TrackEnvironmentConfig {
  bgColor: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  groundColor: string;
  fluidColor: string;
  roadColor: string;
  sunColor: string;
  sunPosition: [number, number, number];
}

export interface TrackConfigData {
  id: string;
  name: string;
  theme: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  lengthMeters: number;
  laps: number;
  isClosed?: boolean;
  checkpoints: CheckpointData[];
  curvePoints: [number, number, number][];
  scenery: SceneryObjectData[];
  startPosition: [number, number, number];
  startHeading: number;
  finishPosition?: [number, number, number];
  finishHeading?: number;
  environment: TrackEnvironmentConfig;
}

export interface SubLevelData {
  id: string;
  seasonId: string;
  levelNumber: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  lengthMeters: number;
  laps: number;
  unlocked: boolean;
  stars: number;
  bestTime: number;
  trackConfig: TrackConfigData;
}

export interface SeasonData {
  id: string;
  name: string;
  theme: string;
  iconName: 'sun' | 'flame' | 'sparkles' | 'snowflake';
  environment: TrackEnvironmentConfig;
  levels: SubLevelData[];
}

// Level 1: Real Point-to-Point Coastal Highway Sprint Track (Non-circular)
const level1CurvePoints: [number, number, number][] = [
  [0, 0, 0],         // Start Arch
  [0, 0, -80],       // Beach Straight
  [30, 0, -170],     // Gentle Right Bend
  [80, 0, -250],     // High-Speed Curve
  [110, 0, -340],    // Coastal Bend
  [60, 0, -420],     // S-Curve Entrance
  [0, 0, -500],      // S-Curve Exit
  [-40, 0, -580],    // Palm Tunnel
  [-20, 0, -660],    // Final Straight Entrance
  [0, 0, -740],      // Victory Bend
  [0, 0, -820],      // FINISH LINE ARCH!
];

// Helper to generate dynamic realistic curves for levels
const generateCurveForLevel = (levelIndex: number, isSprint: boolean): [number, number, number][] => {
  if (levelIndex === 1) return level1CurvePoints;

  const points: [number, number, number][] = [[0, 0, 0]];
  const totalSegments = isSprint ? 10 : 8;
  const segmentLength = 75 + levelIndex * 5;

  let currentX = 0;
  let currentZ = 0;
  let dirAngle = 0; // facing -Z

  for (let i = 1; i <= totalSegments; i++) {
    const turn = Math.sin(i * 1.3 + levelIndex) * (0.4 + (levelIndex % 3) * 0.15);
    dirAngle += turn;

    currentX += Math.sin(dirAngle) * segmentLength;
    currentZ -= Math.cos(dirAngle) * segmentLength;

    points.push([Math.round(currentX), 0, Math.round(currentZ)]);
  }

  if (!isSprint) {
    // Loop back to start for circuit tracks
    points.push([0, 0, 0]);
  }

  return points;
};

const generateSeasonSubLevels = (
  seasonId: string,
  seasonName: string,
  theme: string,
  env: TrackEnvironmentConfig,
  sceneryType: 'palm' | 'rock' | 'tree' | 'crystal'
): SubLevelData[] => {
  const levels: SubLevelData[] = [];

  for (let i = 1; i <= 15; i++) {
    const isUnlocked = i === 1;
    const isSprint = i % 2 !== 0; // Odd levels are Point-to-Point Sprint Missions!
    const laps = isSprint ? 1 : (i > 6 ? 3 : 2);
    const lengthMeters = 700 + i * 50;

    let difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert' = 'Easy';
    if (i > 3 && i <= 6) difficulty = 'Medium';
    if (i > 6 && i <= 8) difficulty = 'Hard';
    if (i > 8) difficulty = 'Expert';

    const curvePoints = generateCurveForLevel(i, isSprint);
    
    // Generate Checkpoints along curve points
    const checkpoints: CheckpointData[] = curvePoints.map((pt, idx) => ({
      id: idx + 1,
      position: [pt[0], pt[1], pt[2]],
      radius: 16,
    }));

    // Generate Scenery along track sides
    const scenery: SceneryObjectData[] = [];
    curvePoints.forEach((pt, idx) => {
      if (idx > 0 && idx < curvePoints.length - 1) {
        const sideOffset = (idx % 2 === 0 ? 1 : -1) * (14 + (idx % 3) * 2);
        scenery.push({
          type: sceneryType,
          position: [pt[0] + sideOffset, pt[1], pt[2]],
          scale: [1 + (idx % 3) * 0.2, 1 + (idx % 3) * 0.3, 1 + (idx % 3) * 0.2],
        });
      }
    });

    const trackConfig: TrackConfigData = {
      id: `${seasonId}_lvl_${i}`,
      name: `${seasonName} - Level ${i}`,
      theme,
      difficulty,
      lengthMeters,
      laps,
      isClosed: !isSprint,
      startPosition: [0, 0, 0],
      startHeading: 0,
      curvePoints,
      checkpoints,
      scenery,
      environment: env,
    };

    levels.push({
      id: `${seasonId}_lvl_${i}`,
      seasonId,
      levelNumber: i,
      name: isSprint ? `Level ${i} (Sprint Mission)` : `Level ${i} (Circuit Race)`,
      difficulty,
      lengthMeters,
      laps,
      unlocked: isUnlocked,
      stars: isUnlocked ? 0 : 0,
      bestTime: 0,
      trackConfig,
    });
  }

  return levels;
};

export const SEASONS_DATA: SeasonData[] = [
  {
    id: 'tropical_coast',
    name: 'Tropical Coast',
    theme: 'Tropical Coast',
    iconName: 'sun',
    environment: {
      bgColor: '#87CEEB',
      fogColor: '#87CEEB',
      fogNear: 100,
      fogFar: 450,
      groundColor: '#F7D070',
      fluidColor: '#00A8FF',
      roadColor: '#1E293B',
      sunColor: '#FFF4D0',
      sunPosition: [50, 80, 30],
    },
    levels: generateSeasonSubLevels(
      'tropical_coast',
      'Tropical Coast',
      'Tropical Coast',
      {
        bgColor: '#87CEEB',
        fogColor: '#87CEEB',
        fogNear: 100,
        fogFar: 450,
        groundColor: '#F7D070',
        fluidColor: '#00A8FF',
        roadColor: '#1E293B',
        sunColor: '#FFF4D0',
        sunPosition: [50, 80, 30],
      },
      'palm'
    ),
  },
  {
    id: 'lava_canyon',
    name: 'Lava Canyon',
    theme: 'Lava Canyon',
    iconName: 'flame',
    environment: {
      bgColor: '#2D0A0A',
      fogColor: '#3D0B0B',
      fogNear: 80,
      fogFar: 350,
      groundColor: '#261C1C',
      fluidColor: '#FF3300',
      roadColor: '#151518',
      sunColor: '#FF6B00',
      sunPosition: [40, 60, 20],
    },
    levels: generateSeasonSubLevels(
      'lava_canyon',
      'Lava Canyon',
      'Lava Canyon',
      {
        bgColor: '#2D0A0A',
        fogColor: '#3D0B0B',
        fogNear: 80,
        fogFar: 350,
        groundColor: '#261C1C',
        fluidColor: '#FF3300',
        roadColor: '#151518',
        sunColor: '#FF6B00',
        sunPosition: [40, 60, 20],
      },
      'rock'
    ),
  },
  {
    id: 'cyber_city',
    name: 'Cyber Neon City',
    theme: 'Cyber Neon City',
    iconName: 'sparkles',
    environment: {
      bgColor: '#030712',
      fogColor: '#0B0F19',
      fogNear: 90,
      fogFar: 400,
      groundColor: '#0F172A',
      fluidColor: '#00E5FF',
      roadColor: '#0B0F19',
      sunColor: '#00E5FF',
      sunPosition: [30, 90, 40],
    },
    levels: generateSeasonSubLevels(
      'cyber_city',
      'Cyber Neon City',
      'Cyber Neon City',
      {
        bgColor: '#030712',
        fogColor: '#0B0F19',
        fogNear: 90,
        fogFar: 400,
        groundColor: '#0F172A',
        fluidColor: '#00E5FF',
        roadColor: '#0B0F19',
        sunColor: '#00E5FF',
        sunPosition: [30, 90, 40],
      },
      'crystal'
    ),
  },
  {
    id: 'snowy_alpine',
    name: 'Snowy Alpine',
    theme: 'Snowy Alpine',
    iconName: 'snowflake',
    environment: {
      bgColor: '#94A3B8',
      fogColor: '#CBD5E1',
      fogNear: 80,
      fogFar: 350,
      groundColor: '#F1F5F9',
      fluidColor: '#38BDF8',
      roadColor: '#475569',
      sunColor: '#FFFFFF',
      sunPosition: [60, 70, 50],
    },
    levels: generateSeasonSubLevels(
      'snowy_alpine',
      'Snowy Alpine',
      'Snowy Alpine',
      {
        bgColor: '#94A3B8',
        fogColor: '#CBD5E1',
        fogNear: 80,
        fogFar: 350,
        groundColor: '#F1F5F9',
        fluidColor: '#38BDF8',
        roadColor: '#475569',
        sunColor: '#FFFFFF',
        sunPosition: [60, 70, 50],
      },
      'tree'
    ),
  },
];

export const TRACKS_DATA: TrackConfigData[] = SEASONS_DATA.flatMap((s) =>
  s.levels.map((l) => l.trackConfig)
);
