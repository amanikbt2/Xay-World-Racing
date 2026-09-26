import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, User, Sparkles, Check } from '../components/Icons';
import { gameStateStore } from '../game/GameState';
import { DRIVERS_DATA, Driver } from '../data/drivers';
import { Colors } from '../theme/colors';

export const DriverScreen: React.FC = () => {
  const [selectedDriver, setSelectedDriver] = useState<Driver>(DRIVERS_DATA[0]);

  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    gameStateStore.updateMetrics({ selectedDriverId: driver.id });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => gameStateStore.setState('HOME')}
        >
          <ArrowLeft size={16} color={Colors.textLight} />
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
        <Text style={styles.titleText}>CHARACTERS & DRIVERS</Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Driver Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {DRIVERS_DATA.map((driver) => {
          const isSelected = selectedDriver.id === driver.id;

          return (
            <TouchableOpacity
              key={driver.id}
              activeOpacity={0.85}
              style={[
                styles.driverCard,
                { borderColor: isSelected ? Colors.accent : 'rgba(255, 255, 255, 0.15)' },
                isSelected ? styles.selectedCard : null,
              ]}
              onPress={() => handleSelectDriver(driver)}
            >
              {/* Avatar Circle */}
              <View style={[styles.avatarBox, { backgroundColor: driver.avatarColor }]}>
                <User size={36} color={Colors.textLight} />
              </View>

              <Text style={styles.driverName}>{driver.name}</Text>

              {/* Perk Box */}
              <View style={styles.perkBox}>
                <View style={styles.perkHeaderRow}>
                  <Sparkles size={14} color={Colors.secondary} />
                  <Text style={styles.perkName}>{driver.perkName}</Text>
                </View>
                <Text style={styles.perkDesc}>{driver.perkDescription}</Text>
              </View>

              {/* Select Button */}
              <TouchableOpacity
                style={[
                  styles.selectBtn,
                  { backgroundColor: isSelected ? Colors.accent : Colors.primary },
                ]}
                onPress={() => handleSelectDriver(driver)}
              >
                <View style={styles.btnContentRow}>
                  {isSelected && <Check size={14} color={Colors.textLight} />}
                  <Text style={styles.selectBtnText}>
                    {isSelected ? 'ACTIVE DRIVER' : 'EQUIP DRIVER'}
                  </Text>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 6,
  },
  backText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 14,
  },
  titleText: {
    color: Colors.textLight,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cardsContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 20,
  },
  driverCard: {
    width: 230,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
  },
  selectedCard: {
    transform: [{ scale: 1.04 }],
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  driverName: {
    color: Colors.textLight,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  perkBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 12,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
  },
  perkHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  perkName: {
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  perkDesc: {
    color: Colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
  selectBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectBtnText: {
    color: Colors.textLight,
    fontWeight: '900',
    fontSize: 13,
  },
});
