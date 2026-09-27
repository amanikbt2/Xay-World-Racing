import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageSourcePropType } from 'react-native';
import { Sun, Flame, Sparkles, Snowflake, Lock, Star, Play, ArrowLeft } from '../components/Icons';
import { gameStateStore } from '../game/GameState';
import { SEASONS_DATA, SeasonData, SubLevelData } from '../track/TrackConfig';

const background = require('../../assets/garage_bg.jpg');
const levelArt: ImageSourcePropType[] = [
  require('../../assets/card_adventure.png'),
  require('../../assets/card_cars.png'),
  require('../../assets/card_characters.png'),
];

export const MissionsScreen: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState<SeasonData>(SEASONS_DATA[0]);
  const [showLevelPicker, setShowLevelPicker] = useState(false);

  const startLevel = (level: SubLevelData) => {
    if (!level.unlocked) return;
    gameStateStore.updateMetrics({ selectedTrackId: level.trackConfig.id });
    gameStateStore.setState('COUNTDOWN');
  };

  const seasonIcon = (name: string, active: boolean, size = 14) => {
    const props = { size, color: active ? '#FFFFFF' : '#C4D0D9' };
    if (name === 'flame') return <Flame {...props} />;
    if (name === 'sparkles') return <Sparkles {...props} />;
    if (name === 'snowflake') return <Snowflake {...props} />;
    return <Sun {...props} />;
  };

  const openSeason = (season: SeasonData) => {
    setSelectedSeason(season);
    setShowLevelPicker(true);
  };

  const renderLevelCard = (level: SubLevelData, index: number, picker = false) => {
    const unlocked = level.unlocked;
    const image = picker ? (index === 0 ? levelArt[0] : background) : levelArt[index % levelArt.length];

    return (
      <View key={level.id} style={[styles.levelCard, picker && styles.pickerCard]}>
        <View style={[styles.cardImageWrap, picker && styles.pickerImageWrap]}>
          <Image source={image} style={styles.cardImage} resizeMode="cover" />
          <View style={styles.imageShade} />
          {unlocked ? (
            <Text style={styles.levelImageText}>{picker ? 'Level ' + level.levelNumber : 'LVL ' + level.levelNumber}</Text>
          ) : (
            <View style={styles.lockBadge}><Lock size={picker ? 25 : 30} color="#FFFFFF" /></View>
          )}
        </View>
        {!picker && (
          <View style={styles.cardBody}>
            <View style={styles.titleRow}>
              <Text style={styles.levelTitle}>{level.name}</Text>
              <View style={[styles.diffTag, { backgroundColor: unlocked ? '#48C979' : '#D34E4E' }]}>
                <Text style={styles.diffText}>{level.difficulty}</Text>
              </View>
            </View>
            <View style={styles.starsRow}>{[0, 1, 2].map((star) => <Star key={star} size={14} color="#FFD04A" fill="#FFD04A" />)}</View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>◩ {level.lengthMeters}m</Text>
              <Text style={styles.infoText}>▣ {level.laps} Laps</Text>
            </View>
            <TouchableOpacity disabled={!unlocked} style={[styles.raceBtn, unlocked ? styles.startBtn : styles.lockedBtn]} onPress={() => picker ? startLevel(level) : openSeason(selectedSeason)}>
              {unlocked ? <Play size={14} color="#FFFFFF" fill="#FFFFFF" /> : <Lock size={14} color="#E0E5EA" />}
              <Text style={styles.raceBtnText}>{unlocked ? 'START RACE' : 'LOCKED'}</Text>
            </TouchableOpacity>
          </View>
        )}
        {picker && (
          <View style={styles.pickerCardFooter}>
            <View style={styles.pickerStars}>{[0, 1, 2].map((star) => <Star key={star} size={10} color={unlocked ? '#FFD04A' : '#CBD2D8'} fill={unlocked ? '#FFD04A' : 'transparent'} />)}</View>
            <TouchableOpacity disabled={!unlocked} style={[styles.raceBtn, unlocked ? styles.startBtn : styles.lockedBtn]} onPress={() => picker ? startLevel(level) : openSeason(selectedSeason)}>
              {unlocked ? <Play size={12} color="#FFFFFF" fill="#FFFFFF" /> : <Lock size={12} color="#E0E5EA" />}
              <Text style={styles.raceBtnText}>{unlocked ? 'START RACE' : 'LOCKED'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image source={background} style={styles.background} resizeMode="cover" />
      <View style={styles.tint} />
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => showLevelPicker ? setShowLevelPicker(false) : gameStateStore.setState('HOME')}>
          <ArrowLeft size={14} color="#FFFFFF" />
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
        <View style={styles.titlePlate}>
          <Text style={styles.titleText}>{showLevelPicker ? 'SEASON: ' + selectedSeason.name.toUpperCase() : 'SELECT SEASON & LEVEL'}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>
      {showLevelPicker ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pickerContent}>
          <Text style={styles.selectLevelText}>SELECT LEVEL</Text>
          <View style={styles.levelGrid}>
            {selectedSeason.levels.map((level, index) => renderLevelCard(level, index, true))}
          </View>
        </ScrollView>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.seasonPillsRow}>
            {SEASONS_DATA.map((season) => (
              <TouchableOpacity key={season.id} style={styles.seasonPill} onPressIn={() => openSeason(season)} onPress={() => openSeason(season)} activeOpacity={0.85}>
                {seasonIcon(season.iconName, false)}
                <Text style={styles.seasonPillText}>{season.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsContainer}>
            {selectedSeason.levels.slice(0, 3).map((level, index) => renderLevelCard(level, index))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#45515E' },
  background: { ...StyleSheet.absoluteFill, width: '100%', height: '100%' },
  tint: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(28, 39, 51, 0.25)' },
  headerRow: { height: 70, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 3 },
  headerSpacer: { width: 120 },
  backBtn: { height: 32, minWidth: 88, paddingHorizontal: 9, borderRadius: 11, backgroundColor: 'rgba(71, 81, 94, 0.88)', borderWidth: 1.3, borderColor: 'rgba(245, 248, 250, 0.62)', flexDirection: 'row', alignItems: 'center', gap: 7 },
  backText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
  titlePlate: { paddingHorizontal: 25, paddingVertical: 8, borderBottomLeftRadius: 22, borderBottomRightRadius: 22, backgroundColor: 'rgba(43, 53, 65, 0.92)', borderWidth: 1.4, borderTopWidth: 0, borderColor: 'rgba(242, 246, 250, 0.56)' },
  titleText: { color: '#FFFFFF', fontSize: 19, fontWeight: '900', letterSpacing: 0.7 },
  seasonPillsRow: { paddingHorizontal: 35, gap: 8, alignItems: 'center', height: 54, zIndex: 3 },
  seasonPill: { height: 32, paddingHorizontal: 13, borderRadius: 18, backgroundColor: 'rgba(89, 101, 114, 0.9)', borderWidth: 1.2, borderColor: 'rgba(236, 242, 246, 0.5)', flexDirection: 'row', alignItems: 'center', gap: 5 },
  seasonPillText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  cardsContainer: { paddingHorizontal: 34, gap: 18, alignItems: 'center', paddingBottom: 22, zIndex: 2 },
  levelCard: { width: 184, minHeight: 306, borderRadius: 16, overflow: 'hidden', backgroundColor: 'rgba(80, 91, 103, 0.87)', borderWidth: 1.5, borderColor: 'rgba(244, 248, 251, 0.68)', elevation: 9 },
  cardImageWrap: { height: 108, overflow: 'hidden', position: 'relative', backgroundColor: '#2C3948' },
  cardImage: { width: '100%', height: '100%' },
  imageShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(22, 30, 39, 0.14)' },
  levelImageText: { position: 'absolute', alignSelf: 'center', top: 12, color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
  lockBadge: { position: 'absolute', alignSelf: 'center', top: 12, width: 34, height: 34, borderRadius: 26, backgroundColor: 'rgba(44, 53, 64, 0.75)', borderWidth: 1.5, borderColor: 'rgba(236, 242, 246, 0.62)', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: 10, flex: 1 },
  titleRow: { minHeight: 38, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 5 },
  levelTitle: { flex: 1, color: '#FFFFFF', fontSize: 12, lineHeight: 14, fontWeight: '900' },
  diffTag: { paddingVertical: 3, paddingHorizontal: 5, borderRadius: 6 },
  diffText: { color: '#FFFFFF', fontSize: 8, fontWeight: '900' },
  starsRow: { flexDirection: 'row', gap: 2, marginTop: 3, marginBottom: 7 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 7, paddingVertical: 5, borderRadius: 7, backgroundColor: 'rgba(21, 29, 38, 0.64)', marginBottom: 9 },
  infoText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  raceBtn: { minHeight: 21, borderRadius: 6, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5, borderWidth: 1.2 },
  startBtn: { backgroundColor: '#35C970', borderColor: '#8AEEB0' },
  lockedBtn: { backgroundColor: 'rgba(92, 101, 112, 0.82)', borderColor: 'rgba(238, 242, 245, 0.55)' },
  raceBtnText: { color: '#FFFFFF', fontSize: 8, fontWeight: '900' },
  pickerContent: { paddingHorizontal: 18, paddingBottom: 18 },
  selectLevelText: { alignSelf: 'center', color: '#FFFFFF', fontSize: 16, fontWeight: '900', marginTop: 2, marginBottom: 7 },
  levelGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 5 },
  pickerCard: { width: '16.5%', minHeight: 103, borderRadius: 10 },
  pickerImageWrap: { height: 53 },
  pickerCardFooter: { padding: 4 },
  pickerStars: { flexDirection: 'row', gap: 1, marginBottom: 2 },
});
