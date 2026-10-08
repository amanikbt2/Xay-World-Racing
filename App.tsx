import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
const GameWorld = React.lazy(() => import('./src/game/GameWorld').then(({ GameWorld: component }) => ({ default: component })));
import { GameHUD } from './src/components/GameHUD';
const SplashScreenComponent = React.lazy(() => import('./src/screens/SplashScreen').then(({ SplashScreenComponent: component }) => ({ default: component })));
const HomeScreen = React.lazy(() => import('./src/screens/HomeScreen').then(({ HomeScreen: component }) => ({ default: component })));
const MissionsScreen = React.lazy(() => import('./src/screens/MissionsScreen').then(({ MissionsScreen: component }) => ({ default: component })));
const GarageScreen = React.lazy(() => import('./src/screens/GarageScreen').then(({ GarageScreen: component }) => ({ default: component })));
const DriverScreen = React.lazy(() => import('./src/screens/DriverScreen').then(({ DriverScreen: component }) => ({ default: component })));
const ShopScreen = React.lazy(() => import('./src/screens/ShopScreen').then(({ ShopScreen: component }) => ({ default: component })));
const SettingsScreen = React.lazy(() => import('./src/screens/SettingsScreen').then(({ SettingsScreen: component }) => ({ default: component })));
const ResultsScreen = React.lazy(() => import('./src/screens/ResultsScreen').then(({ ResultsScreen: component }) => ({ default: component })));
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
        <Suspense fallback={<View style={styles.loadingRace} />}>
          {gameState === 'SPLASH' && <SplashScreenComponent />}
          {gameState === 'HOME' && <HomeScreen />}
          {gameState === 'MISSIONS' && <MissionsScreen />}
          {gameState === 'GARAGE' && <GarageScreen />}
          {gameState === 'DRIVERS' && <DriverScreen />}
          {gameState === 'SHOP' && <ShopScreen />}
          {gameState === 'SETTINGS' && <SettingsScreen />}
          {gameState === 'RESULTS' && <ResultsScreen />}
        </Suspense>

        {(gameState === 'RACING' || gameState === 'PAUSED' || gameState === 'COUNTDOWN') && (
          <>
            <Suspense fallback={<View style={styles.loadingRace} />}>
              <GameWorld
                physics={physics}
                trackData={currentTrackData}
                kartColor={currentCarData.color}
              />
            </Suspense>
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
  loadingRace: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F172A',
  },
});
