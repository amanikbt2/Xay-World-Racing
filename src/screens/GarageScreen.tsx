import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, Car, Check } from '../components/Icons';
import { gameStateStore } from '../game/GameState';
import { CARS_DATA, CarItem } from '../data/cars';
import { Colors } from '../theme/colors';

export const GarageScreen: React.FC = () => {
  const [selectedCar, setSelectedCar] = useState<CarItem>(CARS_DATA[0]);

  const handleSelectCar = (car: CarItem) => {
    setSelectedCar(car);
    gameStateStore.updateMetrics({ selectedKartId: car.id });
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
        <Text style={styles.titleText}>GARAGE & KART SELECT</Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Car Selection Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {CARS_DATA.map((car) => {
          const isSelected = selectedCar.id === car.id;

          return (
            <TouchableOpacity
              key={car.id}
              activeOpacity={0.85}
              style={[
                styles.carCard,
                { borderColor: isSelected ? Colors.accent : 'rgba(255, 255, 255, 0.15)' },
                isSelected ? styles.selectedCard : null,
              ]}
              onPress={() => handleSelectCar(car)}
            >
              {/* Color Visual Block */}
              <View style={[styles.carVisualBox, { backgroundColor: car.color }]}>
                <Car size={48} color={Colors.textLight} />
              </View>

              <Text style={styles.carName}>{car.name}</Text>
              <Text style={styles.carDesc}>{car.description}</Text>

              {/* Stat Progress Bars */}
              <View style={styles.statsContainer}>
                {/* Speed */}
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>SPEED</Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${car.baseStats.speed}%`, backgroundColor: Colors.primary }]} />
                  </View>
                </View>

                {/* Acceleration */}
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>ACCEL</Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${car.baseStats.acceleration}%`, backgroundColor: Colors.secondary }]} />
                  </View>
                </View>

                {/* Handling */}
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>STEER</Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${car.baseStats.handling}%`, backgroundColor: Colors.accent }]} />
                  </View>
                </View>
              </View>

              {/* Equip Button */}
              <TouchableOpacity
                style={[
                  styles.selectBtn,
                  { backgroundColor: isSelected ? Colors.accent : Colors.primary },
                ]}
                onPress={() => handleSelectCar(car)}
              >
                <View style={styles.btnContentRow}>
                  {isSelected && <Check size={14} color={Colors.textLight} />}
                  <Text style={styles.selectBtnText}>
                    {isSelected ? 'EQUIPPED' : 'EQUIP KART'}
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
  carCard: {
    width: 250,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
  },
  selectedCard: {
    transform: [{ scale: 1.04 }],
    elevation: 8,
  },
  carVisualBox: {
    width: '100%',
    height: 90,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  carName: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
  },
  carDesc: {
    color: Colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  statsContainer: {
    width: '100%',
    gap: 6,
    marginBottom: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 10,
    borderRadius: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    color: Colors.textLight,
    fontSize: 10,
    fontWeight: 'bold',
    width: 45,
  },
  barBg: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
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
