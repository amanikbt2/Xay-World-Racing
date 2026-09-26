import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, Coins, Gem, Zap } from '../components/Icons';
import { gameStateStore } from '../game/GameState';
import { Colors } from '../theme/colors';

export const ShopScreen: React.FC = () => {
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
        <Text style={styles.titleText}>SHOP & UPGRADES</Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Shop Offer Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {/* Coin Pack */}
        <View style={styles.offerCard}>
          <View style={styles.iconCircle}>
            <Coins size={36} color={Colors.gold} />
          </View>
          <Text style={styles.offerTitle}>COIN CHEST</Text>
          <Text style={styles.offerAmount}>+25,000 Coins</Text>
          <TouchableOpacity style={styles.buyBtn}>
            <View style={styles.btnContentRow}>
              <Gem size={14} color={Colors.textLight} />
              <Text style={styles.buyBtnText}>20 GEMS</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Gem Pack */}
        <View style={styles.offerCard}>
          <View style={styles.iconCircle}>
            <Gem size={36} color="#00E5FF" />
          </View>
          <Text style={styles.offerTitle}>GEM VAULT</Text>
          <Text style={styles.offerAmount}>+100 Gems</Text>
          <TouchableOpacity style={styles.buyBtn}>
            <Text style={styles.buyBtnText}>$1.99</Text>
          </TouchableOpacity>
        </View>

        {/* Nitro Engine Upgrade */}
        <View style={styles.offerCard}>
          <View style={styles.iconCircle}>
            <Zap size={36} color={Colors.secondary} />
          </View>
          <Text style={styles.offerTitle}>TURBO ENGINE</Text>
          <Text style={styles.offerAmount}>+10% Max Speed</Text>
          <TouchableOpacity style={styles.buyBtn}>
            <View style={styles.btnContentRow}>
              <Coins size={14} color={Colors.textLight} />
              <Text style={styles.buyBtnText}>15,000</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 24,
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
  offerCard: {
    width: 210,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  offerTitle: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
  },
  offerAmount: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  buyBtn: {
    backgroundColor: Colors.accent,
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
  buyBtnText: {
    color: Colors.textLight,
    fontWeight: '900',
    fontSize: 14,
  },
});
