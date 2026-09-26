import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ArrowLeft, Smartphone, Gamepad2 } from '../components/Icons';
import { gameStateStore } from '../game/GameState';
import { inputManager } from '../player/PlayerInput';
import { Colors } from '../theme/colors';

export const SettingsScreen: React.FC = () => {
  const [graphicsQuality, setGraphicsQuality] = useState<'Low' | 'Medium' | 'High'>('High');
  const [vibration, setVibration] = useState<boolean>(true);
  const [tiltSteering, setTiltSteering] = useState<boolean>(inputManager.isTiltSteeringEnabled);

  const handleToggleTilt = (enabled: boolean) => {
    setTiltSteering(enabled);
    inputManager.isTiltSteeringEnabled = enabled;
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
        <Text style={styles.titleText}>SETTINGS</Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Settings Options Box */}
      <View style={styles.settingsBox}>
        {/* Control Mode: Tilt Steering vs Touch Buttons */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Mobile Control Mode</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.optionBtn,
                tiltSteering ? styles.activeOption : null,
              ]}
              onPress={() => handleToggleTilt(true)}
            >
              <View style={styles.btnContentRow}>
                <Smartphone size={16} color={Colors.textLight} />
                <Text style={styles.optionText}>TILT STEERING</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionBtn,
                !tiltSteering ? styles.activeOption : null,
              ]}
              onPress={() => handleToggleTilt(false)}
            >
              <View style={styles.btnContentRow}>
                <Gamepad2 size={16} color={Colors.textLight} />
                <Text style={styles.optionText}>TOUCH BUTTONS</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Graphics Quality */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Graphics Quality</Text>
          <View style={styles.buttonGroup}>
            {(['Low', 'Medium', 'High'] as const).map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.optionBtn,
                  graphicsQuality === preset ? styles.activeOption : null,
                ]}
                onPress={() => setGraphicsQuality(preset)}
              >
                <Text style={styles.optionText}>{preset}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Haptics */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Touch Vibration Haptics</Text>
          <TouchableOpacity
            style={[styles.toggleBtn, vibration ? styles.toggleOn : styles.toggleOff]}
            onPress={() => setVibration(!vibration)}
          >
            <Text style={styles.toggleText}>{vibration ? 'ENABLED' : 'DISABLED'}</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Policy Link */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Legal & Privacy</Text>
          <TouchableOpacity
            style={styles.privacyBtn}
            onPress={() => {
              if (typeof window !== 'undefined') {
                window.open('/privacy', '_blank');
              } else {
                Linking.openURL('/privacy');
              }
            }}
          >
            <Text style={styles.privacyBtnText}>VIEW PRIVACY POLICY</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  settingsBox: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#1E293B',
    padding: 24,
    borderRadius: 20,
    gap: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  settingItem: {
    gap: 8,
  },
  settingLabel: {
    color: Colors.textLight,
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  optionBtn: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeOption: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  optionText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 12,
  },
  toggleBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleOn: {
    backgroundColor: Colors.accent,
  },
  toggleOff: {
    backgroundColor: Colors.warning,
  },
  toggleText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 14,
  },
  privacyBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  privacyBtnText: {
    color: Colors.accent,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
});
