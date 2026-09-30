import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  BarChart3, Gift, Coins, Gem, Lightbulb, Check, Target, Car, User,
  Flag, ShoppingCart, Settings,
} from '../components/Icons';
import { gameStateStore, RaceMetrics } from '../game/GameState';
import { GarageShowcase3D } from '../components/GarageShowcase3D';
import { CARS_DATA } from '../data/cars';

const GlassCard: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <View style={[styles.glassCard, style]}>{children}</View>
);

export const HomeScreen: React.FC = () => {
  const [metrics, setMetrics] = useState<RaceMetrics>(gameStateStore.getMetrics());

  useEffect(() => {
    const unsubscribe = gameStateStore.subscribe((_, m) => setMetrics({ ...m }));
    return unsubscribe;
  }, []);

  const activeCar = CARS_DATA.find((c) => c.id === metrics.selectedKartId) || CARS_DATA[0];

  return (
    <View style={styles.container}>
      <GarageShowcase3D kartColor={activeCar.color} />

      <View pointerEvents="none" style={styles.vignette} />

      <View style={styles.titlePill}>
        <Text style={styles.titleText}>RACE LEGENDS</Text>
      </View>

      <View pointerEvents="box-none" style={styles.topHeader}>
        <GlassCard style={styles.rankCard}>
          <View style={styles.rankRow}>
            <View style={styles.rankIconBox}><BarChart3 size={18} color="#BFEAFF" /></View>
            <View>
              <Text style={styles.kicker}>RANK</Text>
              <Text style={styles.rankValue}>{metrics.rank}<Text style={styles.rankMax}> / {metrics.maxRank}</Text></Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
            <View style={styles.progressCheck}><Check size={8} color="#FFFFFF" /></View>
          </View>
        </GlassCard>

        <TouchableOpacity style={styles.giftButton} activeOpacity={0.82}>
          <Gift size={20} color="#FFD05A" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>

        <View style={styles.currencyGroup}>
          <GlassCard style={styles.currencyCard}>
            <Coins size={16} color="#F9C94A" fill="#D78D26" />
            <Text style={styles.currencyText}>{metrics.coins.toLocaleString()}</Text>
          </GlassCard>
          <GlassCard style={styles.currencyCard}>
            <Gem size={15} color="#E3F8FF" fill="#55C9EC" />
            <Text style={styles.currencyText}>{metrics.gems}</Text>
          </GlassCard>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.smartRaceCard}
        onPress={() => gameStateStore.setState('RACING')}
      >
        <View style={styles.bulbBadge}><Lightbulb size={18} color="#FFD25E" fill="#FFD25E" /></View>
        <View>
          <Text style={styles.smartTitle}>SMART</Text>
          <Text style={styles.smartTitle}>RACE</Text>
        </View>
        <View style={styles.tapCircle}><Text style={styles.tapHand}>☝</Text></View>
      </TouchableOpacity>

      <GlassCard style={styles.missionsCard}>
        <Text style={styles.missionsTitle}>DAILY MISSIONS:</Text>
        <Text style={styles.missionsProgress}>2/5 COMPLETE</Text>
        <View style={styles.missionChecks}>
          <Check size={12} color="#FFC857" />
          <Check size={12} color="#FFC857" />
          <View style={styles.emptyMission} />
          <View style={styles.emptyMission} />
          <Target size={13} color="#FFB84A" />
        </View>
      </GlassCard>

      <View pointerEvents="box-none" style={styles.bottomDockContainer}>
        <View style={styles.dockBar}>
          <TouchableOpacity style={styles.dockItem} onPress={() => gameStateStore.setState('GARAGE')}>
            <Car size={18} color="#F5F7FA" />
            <Text style={styles.dockLabel}>CARS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dockItem} onPress={() => gameStateStore.setState('DRIVERS')}>
            <User size={18} color="#F5F7FA" />
            <Text style={styles.dockLabel}>CHARACTERS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playButton} activeOpacity={0.88} onPress={() => gameStateStore.setState('MISSIONS')}>
            <Flag size={20} color="#FFFFFF" fill="rgba(255,255,255,0.2)" />
            <Text style={styles.playText}>PLAY</Text>
            <View style={styles.playGlow} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dockItem} onPress={() => gameStateStore.setState('SHOP')}>
            <ShoppingCart size={19} color="#F5F7FA" />
            <Text style={styles.dockLabel}>SHOP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dockItem} onPress={() => gameStateStore.setState('SETTINGS')}>
            <Settings size={19} color="#F5F7FA" />
            <Text style={styles.dockLabel}>SETTINGS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#596570' },
  vignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 17, 26, 0.13)',
  },
  titlePill: {
    position: 'absolute', top: 0, alignSelf: 'center', zIndex: 12,
    paddingHorizontal: 20, paddingVertical: 4, borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
    backgroundColor: 'rgba(53, 63, 75, 0.82)', borderWidth: 1.5, borderTopWidth: 0,
    borderColor: 'rgba(235, 241, 248, 0.45)',
  },
  titleText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900', letterSpacing: 1.5},
  topHeader: {
    position: 'absolute', top: 14, left: 14, right: 14, zIndex: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  glassCard: {
    backgroundColor: 'rgba(82, 92, 104, 0.73)', borderWidth: 1.2, borderColor: 'rgba(246, 249, 252, 0.52)',
elevation: 4,
  },
  rankCard: { width: 125, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 14 },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  rankIconBox: { width: 24, height: 24, borderRadius: 6, backgroundColor: 'rgba(208, 224, 236, 0.22)', alignItems: 'center', justifyContent: 'center' },
  kicker: { color: '#E4E8EB', fontSize: 9, fontWeight: '800', letterSpacing: 0.4 },
  rankValue: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  rankMax: { color: '#E3E8ED', fontSize: 9, fontWeight: '700' },
  progressTrack: { height: 5, marginTop: 5, borderRadius: 5, backgroundColor: 'rgba(20, 32, 42, 0.35)', position: 'relative' },
  progressFill: { width: '42%', height: 5, borderRadius: 5, backgroundColor: '#4ED889' },
  progressCheck: { position: 'absolute', right: -6, top: -5, width: 15, height: 15, borderRadius: 8, backgroundColor: '#4DD185', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#DFEEE7' },
  giftButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(112, 123, 135, 0.86)', borderWidth: 1.5, borderColor: 'rgba(235, 241, 246, 0.6)', alignItems: 'center', justifyContent: 'center',elevation: 6 },
  notificationDot: { position: 'absolute', right: 2, top: 1, width: 10, height: 10, borderRadius: 5, backgroundColor: '#F15C73', borderWidth: 1.5, borderColor: '#F5F7FA' },
  currencyGroup: { flexDirection: 'row', gap: 7 },
  currencyCard: { minWidth: 70, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 6 },
  currencyText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  smartRaceCard: {
    position: 'absolute', left: 14, top: '38%', zIndex: 10, width: 118, height: 54, borderRadius: 16,
    backgroundColor: 'rgba(78, 89, 102, 0.84)', borderWidth: 1.2, borderColor: 'rgba(239, 245, 249, 0.58)',
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 8,
elevation: 6,
  },
  bulbBadge: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(238, 204, 114, 0.16)' },
  smartTitle: { color: '#F6F8FB', fontSize: 11, lineHeight: 12, fontWeight: '900', letterSpacing: 0.3},
  tapCircle: { position: 'absolute', right: 7, bottom: 7, width: 16, height: 16, borderRadius: 8, backgroundColor: '#56A9D7', alignItems: 'center', justifyContent: 'center' },
  tapHand: { color: '#FFFFFF', fontSize: 10 },
  missionsCard: { position: 'absolute', right: 14, bottom: 68, zIndex: 10, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 12, minWidth: 115, alignItems: 'center' },
  missionsTitle: { color: '#F1F4F7', fontSize: 9, fontWeight: '800', letterSpacing: 0.3 },
  missionsProgress: { color: '#FFFFFF', fontSize: 9, fontWeight: '900', marginTop: 1 },
  missionChecks: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  emptyMission: { width: 10, height: 10, borderRadius: 2, borderWidth: 1.5, borderColor: '#E5E9EE' },
  bottomDockContainer: { position: 'absolute', bottom: 8, left: 14, right: 14, zIndex: 10, alignItems: 'center' },
  dockBar: { width: '100%', maxWidth: 920, height: 48, borderRadius: 15, backgroundColor: 'rgba(93, 104, 116, 0.86)', borderWidth: 1.2, borderColor: 'rgba(241, 245, 249, 0.6)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 10 },
  dockItem: { minWidth: 50, alignItems: 'center', justifyContent: 'center', gap: 2 },
  dockLabel: { color: '#F4F6F8', fontSize: 8, fontWeight: '900', letterSpacing: 0.4},
  playButton: { height: 56, minWidth: 125, marginTop: -12, borderRadius: 18, backgroundColor: 'rgba(115, 126, 138, 0.95)', borderWidth: 1.5, borderColor: 'rgba(244, 247, 250, 0.75)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,elevation: 8 },
  playText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900', letterSpacing: 0.8},
  playGlow: { position: 'absolute', bottom: -8, width: 80, height: 14, borderRadius: 50, backgroundColor: 'rgba(102, 221, 247, 0.43)' },
});
