
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
  weather?: 'clear' | 'rain' | 'storm';
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

// Level 2: Tropical Coast High-Speed Flyover & Mountain Cave Sprint Track (Point-to-Point)
const level2CurvePoints: [number, number, number][] = [
  [0, 0, 0],          // 0: Start Arch
  [0, 0, -80],        // 1: Beach Palm Boulevard
  [30, 0, -160],      // 2: Soft Right Bend to Ocean Approach
  [85, 6, -240],      // 3: Elevated Flyover Ramp Entrance
  [135, 12, -330],    // 4: Flyover Bridge Peak (Ocean View high above beach)
  [110, 12, -420],    // 5: Elevated High-Speed Curve on Bridge
  [45, 4, -500],      // 6: Flyover Ramp Descent
  [-10, 0, -570],     // 7: Jungle Palm Valley Entrance
  [-60, 4, -640],     // 8: Mountain Foothill Ascent
  [-110, 8, -720],    // 9: Hill Cave Entrance Tunnel (Rock Mountain Arch)
  [-140, 8, -810],    // 10: Cave Interior Glow Tunnel Curve
  [-100, 4, -900],    // 11: Mountain Cave Exit Arch
  [-30, 0, -980],     // 12: Victory Beach Bend
  [0, 0, -1060],      // 13: FINISH LINE ARCH!
];

const level2SceneryData: SceneryObjectData[] = [
  { type: 'palm', position: [-16, 0, -20], scale: [1.2, 1.3, 1.2] },
  { type: 'palm', position: [16, 0, -35], scale: [1.1, 1.2, 1.1] },
  { type: 'palm', position: [-18, 0, -60], scale: [1.3, 1.4, 1.3] },
  { type: 'palm', position: [18, 0, -90], scale: [1.2, 1.3, 1.2] },
  { type: 'palm', position: [-20, 0, -120], scale: [1.4, 1.5, 1.4] },
  { type: 'rock', position: [25, 0, -135], scale: [1.5, 1.5, 1.5] },
  { type: 'palm', position: [48, 0, -170], scale: [1.3, 1.4, 1.3] },
  { type: 'palm', position: [105, 0, -210], scale: [1.5, 1.6, 1.5] },
  { type: 'palm', position: [155, 0, -280], scale: [1.4, 1.5, 1.4] },
  { type: 'palm', position: [165, 0, -350], scale: [1.6, 1.7, 1.6] },
  { type: 'palm', position: [140, 0, -430], scale: [1.5, 1.6, 1.5] },
  { type: 'palm', position: [75, 0, -475], scale: [1.3, 1.4, 1.3] },
  { type: 'palm', position: [18, 0, -520], scale: [1.4, 1.5, 1.4] },
  { type: 'palm', position: [-28, 0, -540], scale: [1.5, 1.6, 1.5] },
  { type: 'tree', position: [-38, 0, -560], scale: [1.3, 1.4, 1.3] },
  { type: 'palm', position: [12, 0, -575], scale: [1.4, 1.5, 1.4] },
  { type: 'palm', position: [-42, 0, -600], scale: [1.6, 1.7, 1.6] },
  { type: 'tree', position: [-15, 0, -620], scale: [1.5, 1.6, 1.5] },
  { type: 'rock', position: [-82, 2, -625], scale: [2.0, 2.0, 2.0] },
  { type: 'palm', position: [-40, 3, -650], scale: [1.5, 1.6, 1.5] },
  { type: 'rock', position: [-130, 7, -685], scale: [2.5, 2.5, 2.5] },
  { type: 'tree', position: [-85, 6, -700], scale: [1.6, 1.7, 1.6] },
  { type: 'rock', position: [-90, 8, -735], scale: [3.0, 3.0, 3.0] },
  { type: 'rock', position: [-165, 8, -770], scale: [3.2, 3.2, 3.2] },
  { type: 'rock', position: [-160, 8, -830], scale: [3.0, 3.0, 3.0] },
  { type: 'tree', position: [-118, 8, -845], scale: [1.5, 1.6, 1.5] },
  { type: 'rock', position: [-82, 4, -885], scale: [2.8, 2.8, 2.8] },
  { type: 'palm', position: [-125, 2, -915], scale: [1.5, 1.6, 1.5] },
  { type: 'palm', position: [-70, 0, -945], scale: [1.6, 1.7, 1.6] },
  { type: 'palm', position: [-15, 0, -960], scale: [1.4, 1.5, 1.4] },
  { type: 'palm', position: [-48, 0, -985], scale: [1.5, 1.6, 1.5] },
  { type: 'palm', position: [-18, 0, -1010], scale: [1.3, 1.4, 1.3] },
  { type: 'palm', position: [18, 0, -1015], scale: [1.4, 1.5, 1.4] },
  { type: 'palm', position: [-20, 0, -1045], scale: [1.5, 1.6, 1.5] },
  { type: 'palm', position: [20, 0, -1050], scale: [1.5, 1.6, 1.5] },
];

// Level 3: Tropical Coast Stormy Rainforest & Cliff Circuit (Closed Loop)
const level3CurvePoints: [number, number, number][] = [
  [0, 0, 0],          // 0: Start Arch
  [0, 0, -100],       // 1: Wet Beach Straight
  [45, 4, -180],      // 2: Stormy Cliffside Ascent
  [115, 10, -260],    // 3: Waterfall Gap Ridge (Roaring Cliffside Waterfall)
  [160, 10, -360],    // 4: Elevated Wooden Boardwalk over Ocean Waves
  [130, 8, -470],     // 5: Seaside Boardwalk Bend
  [50, 2, -550],      // 6: Rain-slicked Jungle Descent
  [-30, 0, -620],     // 7: Puddle Valley S-Curve 1
  [-90, 0, -540],     // 8: Puddle Valley S-Curve 2
  [-125, 4, -430],    // 9: Cliffside Highway Sweep 1
  [-110, 6, -290],    // 10: Cliffside Highway Sweep 2
  [-65, 2, -170],     // 11: Coastal Promenade Descent
  [-25, 0, -70],      // 12: Final Beach Turn
  [0, 0, 0],          // 13: Loop back to Start/Finish Line Arch!
];

const level3SceneryData: SceneryObjectData[] = [
  { type: 'palm', position: [-18, 0, -25], scale: [1.3, 1.4, 1.3] },
  { type: 'palm', position: [18, 0, -45], scale: [1.2, 1.3, 1.2] },
  { type: 'palm', position: [-20, 0, -80], scale: [1.4, 1.5, 1.4] },
  { type: 'rock', position: [24, 0, -95], scale: [1.8, 1.8, 1.8] },
  { type: 'rock', position: [20, 2, -150], scale: [2.5, 2.5, 2.5] },
  { type: 'tree', position: [75, 4, -165], scale: [1.5, 1.6, 1.5] },
  { type: 'rock', position: [85, 6, -220], scale: [3.0, 3.0, 3.0] },
  { type: 'rock', position: [145, 10, -250], scale: [3.5, 3.5, 3.5] },
  { type: 'tree', position: [140, 10, -310], scale: [1.6, 1.7, 1.6] },
  { type: 'palm', position: [185, 8, -350], scale: [1.4, 1.5, 1.4] },
  { type: 'palm', position: [160, 8, -420], scale: [1.5, 1.6, 1.5] },
  { type: 'rock', position: [155, 6, -490], scale: [2.2, 2.2, 2.2] },
  { type: 'palm', position: [75, 2, -530], scale: [1.6, 1.7, 1.6] },
  { type: 'tree', position: [25, 0, -570], scale: [1.8, 1.9, 1.8] },
  { type: 'palm', position: [-55, 0, -640], scale: [1.5, 1.6, 1.5] },
  { type: 'tree', position: [-15, 0, -660], scale: [1.6, 1.7, 1.6] },
  { type: 'rock', position: [-115, 0, -570], scale: [2.5, 2.5, 2.5] },
  { type: 'palm', position: [-70, 0, -510], scale: [1.4, 1.5, 1.4] },
  { type: 'rock', position: [-150, 4, -410], scale: [3.2, 3.2, 3.2] },
  { type: 'tree', position: [-135, 6, -270], scale: [1.6, 1.7, 1.6] },
  { type: 'palm', position: [-85, 3, -190], scale: [1.5, 1.6, 1.5] },
  { type: 'palm', position: [-45, 0, -110], scale: [1.4, 1.5, 1.4] },
  { type: 'palm', position: [-18, 0, -35], scale: [1.3, 1.4, 1.3] },
  { type: 'palm', position: [18, 0, -20], scale: [1.3, 1.4, 1.3] },
];

// Helper to generate dynamic realistic curves for levels
const generateCurveForLevel = (levelIndex: number, isSprint: boolean, seasonId?: string): [number, number, number][] => {
  if (levelIndex === 1) return level1CurvePoints;
  if (levelIndex === 2 && seasonId === 'tropical_coast') return level2CurvePoints;
  if (levelIndex === 3 && seasonId === 'tropical_coast') return level3CurvePoints;

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
    const isUnlocked = seasonId === 'tropical_coast' ? (i <= 3) : (i === 1);
    const isSprint = (seasonId === 'tropical_coast' && i === 2) ? true : ((seasonId === 'tropical_coast' && i === 3) ? false : (i % 2 !== 0));
    const laps = (seasonId === 'tropical_coast' && i === 3) ? 2 : (isSprint ? 1 : (i > 6 ? 3 : 2));
    const lengthMeters = (seasonId === 'tropical_coast' && i === 3) ? 1250 : ((seasonId === 'tropical_coast' && i === 2) ? 1100 : (700 + i * 50));

    let difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert' = 'Easy';
    if (i === 2) difficulty = 'Medium';
    else if (i === 3) difficulty = 'Hard';
    else if (i > 3 && i <= 6) difficulty = 'Medium';
    else if (i > 6 && i <= 8) difficulty = 'Hard';
    else if (i > 8) difficulty = 'Expert';

    const curvePoints = generateCurveForLevel(i, isSprint, seasonId);
    
    // Generate Checkpoints along curve points
    const checkpoints: CheckpointData[] = curvePoints.map((pt, idx) => ({
      id: idx + 1,
      position: [pt[0], pt[1], pt[2]],
      radius: 18,
    }));

    // Generate Scenery along track sides
    const scenery: SceneryObjectData[] = [];
    if (seasonId === 'tropical_coast' && i === 2) {
      scenery.push(...level2SceneryData);
    } else if (seasonId === 'tropical_coast' && i === 3) {
      scenery.push(...level3SceneryData);
    } else {
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
    }

    let levelName = isSprint ? `Level ${i} (Sprint Mission)` : `Level ${i} (Circuit Race)`;
    if (seasonId === 'tropical_coast' && i === 2) levelName = 'Level 2 (Flyover & Cave Sprint)';
    if (seasonId === 'tropical_coast' && i === 3) levelName = 'Level 3 (Stormy Rainforest Circuit)';

    const isRainyLevel = seasonId === 'tropical_coast' && i === 3;
    const levelEnv: TrackEnvironmentConfig = isRainyLevel
      ? {
          bgColor: '#1E293B',
          fogColor: '#334155',
          fogNear: 40,
          fogFar: 280,
          groundColor: '#7A6234',
          fluidColor: '#0284C7',
          roadColor: '#0F172A',
          sunColor: '#94A3B8',
          sunPosition: [20, 60, -20],
        }
      : env;

    const trackConfig: TrackConfigData = {
      id: `${seasonId}_lvl_${i}`,
      name: `${seasonName} - ${levelName}`,
      theme,
      difficulty,
      lengthMeters,
      laps,
      isClosed: !isSprint,
      startPosition: [0, 0, 12],
      startHeading: 0,
      curvePoints,
      checkpoints,
      scenery,
      environment: levelEnv,
      weather: isRainyLevel ? 'rain' : 'clear',
    };

    levels.push({
      id: `${seasonId}_lvl_${i}`,
      seasonId,
      levelNumber: i,
      name: levelName,
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

// Keep startup compatible with older Android JavaScript runtimes that do not
// expose Array.prototype.flatMap.
export const TRACKS_DATA: TrackConfigData[] = SEASONS_DATA.reduce<TrackConfigData[]>((tracks, season) => {
  season.levels.forEach((level) => tracks.push(level.trackConfig));
  return tracks;
}, []);
