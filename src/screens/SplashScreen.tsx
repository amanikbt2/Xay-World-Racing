import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Zap } from '../components/Icons';
import { gameStateStore } from '../game/GameState';
import { Colors } from '../theme/colors';

const splashImage = require('../../assets/splash.png');

export const SplashScreenComponent: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        return prev + 10;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyG') {
          gameStateStore.setState('HOME');
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  const handleStart = () => {
    gameStateStore.setState('HOME');
  };

  return (
    <View style={styles.container}>
      {/* Fullscreen Artwork Image */}
      <Image source={splashImage} style={styles.bgImage} resizeMode="cover" />

      {/* Dark Overlay gradient for contrast */}
      <View style={styles.overlay}>
        {/* Bottom Loading / Tap Container */}
        <View style={styles.bottomContainer}>
          {!isReady ? (
            <View style={styles.loadingBox}>
              <Text style={styles.loadingText}>LOADING XAY WORLD... {progress}%</Text>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${progress}%` }]} />
              </View>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.tapStartBtn}
              onPress={handleStart}
            >
              <View style={styles.btnContentRow}>
                <Zap size={22} color={Colors.gold} fill={Colors.gold} />
                <Text style={styles.tapStartText}>TAP TO START</Text>
                <Zap size={22} color={Colors.gold} fill={Colors.gold} />
              </View>
              <Text style={styles.pressKeySub}>(OR PRESS SPACE / ENTER ON PC)</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  bgImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  bottomContainer: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingBox: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  loadingText: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  barBg: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 5,
  },
  tapStartBtn: {
    backgroundColor: Colors.primary,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gold,
    elevation: 10,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tapStartText: {
    color: Colors.textLight,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  pressKeySub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
