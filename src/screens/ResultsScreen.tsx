import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trophy, Coins, Star, RotateCcw, Home } from '../components/Icons';
import { gameStateStore } from '../game/GameState';
import { Colors } from '../theme/colors';

export const ResultsScreen: React.FC = () => {
  const metrics = gameStateStore.getMetrics();

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    const millis = Math.floor((totalSeconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
  };

  const handleRetry = () => {
    gameStateStore.setState('RACING');
  };

  const handleMenu = () => {
    gameStateStore.setState('HOME');
  };

  return (
    <View style={styles.container}>
      <View style={styles.resultBox}>
        {/* Trophy & Title */}
        <Trophy size={60} color={Colors.gold} />
        <Text style={styles.victoryTitle}>VICTORY!</Text>
        <Text style={styles.placeText}>1ST PLACE</Text>

        {/* Time & Rewards Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL TIME</Text>
            <Text style={styles.statValue}>{formatTime(metrics.timeSeconds || 48.25)}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>REWARDS EARNED</Text>
            <View style={styles.rewardsContentRow}>
              <Coins size={16} color={Colors.gold} />
              <Text style={styles.rewardText}>+100</Text>
              <Star size={16} color={Colors.secondary} />
              <Text style={styles.rewardText}>+150 XP</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, styles.retryBtn]}
            onPress={handleRetry}
          >
            <View style={styles.btnContentRow}>
              <RotateCcw size={16} color={Colors.textLight} />
              <Text style={styles.btnText}>RETRY RACE</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.menuBtn]}
            onPress={handleMenu}
          >
            <View style={styles.btnContentRow}>
              <Home size={16} color={Colors.textLight} />
              <Text style={styles.btnText}>MAIN MENU</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  resultBox: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gold,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  victoryTitle: {
    color: Colors.gold,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 8,
  },
  placeText: {
    color: Colors.accent,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  statsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 16,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statValue: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: '900',
  },
  rewardsContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 14,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  retryBtn: {
    backgroundColor: Colors.primary,
  },
  menuBtn: {
    backgroundColor: Colors.accent,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnText: {
    color: Colors.textLight,
    fontWeight: '900',
    fontSize: 14,
  },
});
