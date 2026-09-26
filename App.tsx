import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { GameWorld } from './src/game/GameWorld';
import { GameHUD } from './src/components/GameHUD';
import { SplashScreenComponent } from './src/screens/SplashScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { MissionsScreen } from './src/screens/MissionsScreen';
import { GarageScreen } from './src/screens/GarageScreen';
import { DriverScreen } from './src/screens/DriverScreen';
import { ShopScreen } from './src/screens/ShopScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ResultsScreen } from './src/screens/ResultsScreen';
import { PlayerPhysics } from './src/player/PlayerPhysics';
import { gameStateStore, GameStateType, RaceMetrics } from './src/game/GameState';
import { TRACKS_DATA } from './src/track/TrackConfig';
import { CARS_DATA } from './src/data/cars';
import * as THREE from 'three';

export default function App() {
  const [gameState, setGameState] = useState<GameStateType>(gameStateStore.getState());
  const [metrics, setMetrics] = useState<RaceMetrics>(gameStateStore.getMetrics());

  useEffect(() => {
    const unsubscribe = gameStateStore.subscribe((state, m) => {
      setGameState(state);
      setMetrics({ ...m });
    });
    return unsubscribe;
  }, []);

  const physics = useMemo(() => {
    return new PlayerPhysics(new THREE.Vector3(0, 0, 0), Math.PI);
  }, []);

  const currentTrackData = useMemo(() => {
    return TRACKS_DATA.find((t) => t.id === metrics.selectedTrackId) || TRACKS_DATA[0];
  }, [metrics.selectedTrackId]);

  const currentCarData = useMemo(() => {
    return CARS_DATA.find((c) => c.id === metrics.selectedKartId) || CARS_DATA[0];
  }, [metrics.selectedKartId]);

  useEffect(() => {
    physics.setConfig(currentCarData.config);
  }, [currentCarData, physics]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.contentView}>
        {gameState === 'SPLASH' && <SplashScreenComponent />}
        {gameState === 'HOME' && <HomeScreen />}
        {gameState === 'MISSIONS' && <MissionsScreen />}
        {gameState === 'GARAGE' && <GarageScreen />}
        {gameState === 'DRIVERS' && <DriverScreen />}
        {gameState === 'SHOP' && <ShopScreen />}
        {gameState === 'SETTINGS' && <SettingsScreen />}
        {gameState === 'RESULTS' && <ResultsScreen />}

        {(gameState === 'RACING' || gameState === 'PAUSED' || gameState === 'COUNTDOWN') && (
          <>
            <GameWorld
              physics={physics}
              trackData={currentTrackData}
              kartColor={currentCarData.color}
            />
            <GameHUD />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  contentView: {
    flex: 1,
    position: 'relative',
  },
});
