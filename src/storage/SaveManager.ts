import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserSaveData {
  saveVersion: number;
  selectedKartId: string;
  unlockedKartIds: string[];
  coins: number;
  xp: number;
  trophies: number;
  unlockedTracks: string[];
  bestLapTimes: Record<string, number>;
  settings: {
    musicVolume: number;
    sfxVolume: number;
    vibration: boolean;
    graphicsQuality: 'Low' | 'Medium' | 'High';
  };
}

const DEFAULT_SAVE_DATA: UserSaveData = {
  saveVersion: 1,
  selectedKartId: 'speedster_01',
  unlockedKartIds: ['speedster_01'],
  coins: 250,
  xp: 0,
  trophies: 0,
  unlockedTracks: ['tropical_coast_lvl_1', 'tropical_coast_lvl_2', 'tropical_coast_lvl_3'],
  bestLapTimes: {},
  settings: {
    musicVolume: 0.8,
    sfxVolume: 1.0,
    vibration: true,
    graphicsQuality: 'High',
  },
};

const STORAGE_KEY = '@xayrush_kart_save_v1';

export class SaveManager {
  public static async loadSave(): Promise<UserSaveData> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_SAVE_DATA };

      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.saveVersion === 1) {
        return {
          ...DEFAULT_SAVE_DATA,
          ...parsed,
          settings: {
            ...DEFAULT_SAVE_DATA.settings,
            ...(parsed.settings || {}),
          },
        };
      }
      return { ...DEFAULT_SAVE_DATA };
    } catch (err) {
      console.warn('Failed to load save data, using defaults:', err);
      return { ...DEFAULT_SAVE_DATA };
    }
  }

  public static async saveProgress(data: Partial<UserSaveData>): Promise<boolean> {
    try {
      const current = await SaveManager.loadSave();
      const updated: UserSaveData = {
        ...current,
        ...data,
        settings: {
          ...current.settings,
          ...(data.settings || {}),
        },
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (err) {
      console.error('Failed to write save data:', err);
      return false;
    }
  }

  public static async resetSave(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to reset save data:', err);
    }
  }
}
