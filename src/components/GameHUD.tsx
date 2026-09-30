import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { gameStateStore, RaceMetrics, GameStateType } from '../game/GameState';
import { inputManager } from '../player/PlayerInput';
import { Colors } from '../theme/colors';

export const GameHUD: React.FC = () => {
  const [metrics, setMetrics] = useState<RaceMetrics>(gameStateStore.getMetrics());
  const [gameState, setGameState] = useState<GameStateType>(gameStateStore.getState());
  const [tutorialStep, setTutorialStep] = useState(0);

  useEffect(() => {
    const unsubscribe = gameStateStore.subscribe((state, m) => {
      setGameState(state);
      setMetrics({ ...m });
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    if (gameState !== 'COUNTDOWN') return;

    let remaining = 3;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;
    gameStateStore.updateMetrics({ countdown: remaining });
    const timer = setInterval(() => {
      remaining -= 1;
      gameStateStore.updateMetrics({ countdown: Math.max(remaining, 0) });
      if (remaining <= 0) {
        clearInterval(timer);
        finishTimer = setTimeout(() => gameStateStore.setState('RACING'), 650);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, [gameState]);

  useEffect(() => {
    const isTutorialRace = metrics.selectedTrackId === 'tropical_coast_lvl_1';
    if (!isTutorialRace || gameState !== 'RACING') {
      const animationId = requestAnimationFrame(() => setTutorialStep(0));
      return () => cancelAnimationFrame(animationId);
    }

    const timer = setInterval(() => {
      setTutorialStep((step) => Math.min(step + 1, 5));
    }, 3200);

    return () => clearInterval(timer);
  }, [gameState, metrics.selectedTrackId]);
  const handleTouchDown = (key: 'accelerate' | 'brake' | 'steerLeft' | 'steerRight' | 'boost' | 'drift') => {
    inputManager.setTouchInput(key, true);
  };

  const handleTouchUp = (key: 'accelerate' | 'brake' | 'steerLeft' | 'steerRight' | 'boost' | 'drift') => {
    inputManager.setTouchInput(key, false);
  };

  return (
    <View pointerEvents="box-none" style={styles.overlayContainer}>
      {/* Top Header Metrics Bar */}
      <View pointerEvents="box-none" style={styles.topHeader}>
        {/* Position */}
        <View style={styles.statBadge}>
          <Text style={styles.statLabel}>POSITION</Text>
          <Text style={styles.statValue}>{metrics.position}<Text style={styles.statSub}>/{metrics.totalRacers}</Text></Text>
        </View>

        {/* Lap / Progress */}
        <View style={styles.statBadge}>
          <Text style={styles.statLabel}>{metrics.totalLaps === 1 ? 'PROGRESS' : 'LAP'}</Text>
          <Text style={styles.statValue}>
            {metrics.totalLaps === 1
              ? `${metrics.progressPercent}%`
              : `${metrics.lap}/${metrics.totalLaps}`}
          </Text>
        </View>

        {/* Pause Button */}
        <TouchableOpacity
          style={styles.pauseBtn}
          onPress={() => gameStateStore.setState(gameState === 'PAUSED' ? 'RACING' : 'PAUSED')}
        >
          <Text style={styles.pauseBtnText}>{gameState === 'PAUSED' ? '▶' : '❚❚'}</Text>
        </TouchableOpacity>
      </View>

      {/* Speedometer & Boost Gauge */}
      <View pointerEvents="none" style={styles.speedometerBox}>
        <Text style={styles.speedValue}>{metrics.speed}</Text>
        <Text style={styles.speedUnit}>KM/H</Text>
        <View style={styles.boostBarBackground}>
          <View
            style={[
              styles.boostBarFill,
              { width: `${Math.round(metrics.boostCharge * 100)}%` },
              metrics.isBoosting ? styles.boostingBar : null,
            ]}
          />
        </View>
        <Text style={styles.boostLabel}>
          {metrics.isBoosting ? '⚡ BOOSTING!' : 'DRIFT BOOST'}
        </Text>
      </View>

      {/* On-Screen Mobile Touch Controls */}
      <View pointerEvents="box-none" style={styles.touchControlsContainer}>
        {/* Steering Left / Right (Left Side) */}
        <View style={styles.leftPadGroup}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.controlBtn}
            onPressIn={() => handleTouchDown('steerLeft')}
            onPressOut={() => handleTouchUp('steerLeft')}
          >
            <Text style={styles.controlText}>◀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.controlBtn}
            onPressIn={() => handleTouchDown('steerRight')}
            onPressOut={() => handleTouchUp('steerRight')}
          >
            <Text style={styles.controlText}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons (Right Side: Brake, Boost, Gas) */}
        <View style={styles.rightPadGroup}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.controlBtn, styles.driftBtn]}
            onPressIn={() => handleTouchDown('drift')}
            onPressOut={() => handleTouchUp('drift')}
          >
            <Text style={styles.controlTextSmall}>DRIFT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.controlBtn, styles.brakeBtn]}
            onPressIn={() => handleTouchDown('brake')}
            onPressOut={() => handleTouchUp('brake')}
          >
            <Text style={styles.controlTextSmall}>BRAKE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.controlBtn, styles.gasBtn]}
            onPressIn={() => handleTouchDown('accelerate')}
            onPressOut={() => handleTouchUp('accelerate')}
          >
            <Text style={styles.controlText}>GAS</Text>
          </TouchableOpacity>
        </View>
      </View>

      {gameState === 'COUNTDOWN' && (
        <View pointerEvents="none" style={styles.countdownOverlay}>
          <Text style={styles.countdownLabel}>GET READY</Text>
          <Text style={styles.countdownNumber}>
            {metrics.countdown > 0 ? metrics.countdown : 'GO!'}
          </Text>
          <View style={styles.countdownLine} />
        </View>
      )}
      {metrics.selectedTrackId === 'tropical_coast_lvl_1' &&
        (gameState === 'COUNTDOWN' || gameState === 'RACING') && (
        <View pointerEvents="box-none" style={styles.tutorialWrap}>
          <TouchableOpacity
            activeOpacity={0.92}
            style={styles.tutorialBubble}
            onPress={() => setTutorialStep((step) => Math.min(step + 1, 5))}
          >
            <View style={styles.officerBadge}>
              <Text style={styles.officerEmoji}>🚓</Text>
            </View>
            <View style={styles.tutorialCopy}>
              <Text style={styles.tutorialSpeaker}>RACE OFFICER</Text>
              <Text style={styles.tutorialText}>
                {gameState === 'COUNTDOWN'
                  ? 'Welcome, rookie. Watch the lights and get ready!'
                  : [
                      'Tilt your phone left or right to steer.',
                      'Press GAS to accelerate down the road.',
                      'Brake before sharp corners and use DRIFT to turn.',
                      'You are competing with other racers!',
                      'Find the best route and reach the finish line!',
                      'Great driving! Keep your speed and finish the tutorial.',
                    ][tutorialStep]}
              </Text>
              <Text style={styles.tutorialHint}>TAP TO CONTINUE</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {/* Countdown / Pause Overlays */}
      {gameState === 'PAUSED' && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>RACE PAUSED</Text>

            <View style={styles.modalBtnStack}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.modalBtn}
                onPress={() => gameStateStore.setState('RACING')}
              >
                <Text style={styles.modalBtnText}>▶   RESUME</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modalBtn, styles.restartBtn]}
                onPress={() => gameStateStore.setState('COUNTDOWN')}
              >
                <Text style={styles.modalBtnText}>🔄   RESTART</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modalBtn, styles.homeBtn]}
                onPress={() => gameStateStore.setState('HOME')}
              >
                <Text style={styles.modalBtnText}>🏠   HOME</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    padding: 16,
    zIndex: 10,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: 'bold',
  },
  statValue: {
    color: Colors.textLight,
    fontSize: 22,
    fontWeight: 'bold',
  },
  statSub: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  pauseBtn: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  pauseBtnText: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
  },
  speedometerBox: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  speedValue: {
    color: Colors.textLight,
    fontSize: 32,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  speedUnit: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: -4,
  },
  boostBarBackground: {
    width: 120,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  boostBarFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
  },
  boostingBar: {
    backgroundColor: Colors.accent,
  },
  boostLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 2,
  },
  touchControlsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  leftPadGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  rightPadGroup: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  controlBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(30, 41, 59, 0.75)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gasBtn: {
    backgroundColor: 'rgba(46, 213, 115, 0.75)',
    borderColor: Colors.accent,
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  brakeBtn: {
    backgroundColor: 'rgba(255, 71, 87, 0.75)',
    borderColor: Colors.primary,
  },
  driftBtn: {
    backgroundColor: 'rgba(255, 165, 2, 0.75)',
    borderColor: Colors.secondary,
  },
  controlText: {
    color: Colors.textLight,
    fontSize: 20,
    fontWeight: 'bold',
  },
  controlTextSmall: {
    color: Colors.textLight,
    fontSize: 11,
    fontWeight: 'bold',
  },
  tutorialWrap: {
    position: 'absolute',
    top: 76,
    left: 18,
    right: 18,
    alignItems: 'center',
  },
  tutorialBubble: {
    maxWidth: 430,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(22, 35, 49, 0.92)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 220, 125, 0.78)',
elevation: 8,
  },
  officerBadge: {
    width: 45,
    height: 45,
    borderRadius: 24,
    backgroundColor: '#2F79B7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#BDE7FF',
  },
  officerEmoji: {
    fontSize: 23,
  },
  tutorialCopy: {
    flex: 1,
  },
  tutorialSpeaker: {
    color: '#FFD166',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  tutorialText: {
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  tutorialHint: {
    color: '#9DB5C8',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: 0.8,
  },  countdownOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 13, 22, 0.18)',
  },
  countdownLabel: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 4,
},
  countdownNumber: {
    color: '#FFD166',
    fontSize: 112,
    lineHeight: 120,
    fontWeight: '900',
    fontStyle: 'italic',
},
  countdownLine: {
    width: 86,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#55D6BE',
  },  modalOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#1E293B',
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    width: 300,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  modalTitle: {
    color: Colors.textLight,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 20,
  },
  modalBtnStack: {
    width: '100%',
    gap: 12,
  },
  modalBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    width: '100%',
  },
  restartBtn: {
    backgroundColor: '#3B82F6',
  },
  homeBtn: {
    backgroundColor: '#EF4444',
  },
  modalBtnText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  webControlsBanner: {
    position: 'absolute',
    top: 64,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  webControlsText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  webControlsTitle: {
    color: Colors.textLight,
    fontWeight: 'bold',
  },
  webControlsKey: {
    color: Colors.accent,
    fontWeight: 'bold',
  },
});
