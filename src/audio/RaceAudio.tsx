import React, { useEffect } from 'react';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { PlayerPhysics } from '../player/PlayerPhysics';
import { gameStateStore } from '../game/GameState';

const ENGINE = require('../../assets/audio/engine.wav');
const BOOST = require('../../assets/audio/boost.wav');
const SKID = require('../../assets/audio/skid.wav');
const IMPACT = require('../../assets/audio/impact.wav');
const COIN = require('../../assets/audio/coin.wav');
const BIRDS = require('../../assets/audio/birds.wav');

interface RaceAudioProps {
  physics: PlayerPhysics;
}

const replay = (player: ReturnType<typeof useAudioPlayer>) => {
  player.seekTo(0);
  player.play();
};

export const RaceAudio: React.FC<RaceAudioProps> = ({ physics }) => {
  const engine = useAudioPlayer(ENGINE);
  const boost = useAudioPlayer(BOOST);
  const skid = useAudioPlayer(SKID);
  const impact = useAudioPlayer(IMPACT);
  const coin = useAudioPlayer(COIN);
  const birds = useAudioPlayer(BIRDS);

  useEffect(() => {
    engine.loop = true;
    engine.volume = 0.42;
    skid.loop = true;
    skid.volume = 0.16;
    birds.loop = true;
    birds.volume = 0.08;

    void setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'doNotMix',
    });

    let wasBoosting = false;
    let wasDrifting = false;
    let wasHit = false;
    let lastCoins = gameStateStore.getMetrics().coins;

    const timer = setInterval(() => {
      const state = gameStateStore.getState();
      const racing = state === 'RACING';
      const speedRatio = Math.min(1, Math.abs(physics.speed) / 38);

      engine.volume = racing ? 0.18 + speedRatio * 0.34 : 0;
      engine.playbackRate = 0.82 + speedRatio * 0.6;
      birds.volume = racing ? 0.08 : 0;

      if (racing && !engine.playing) engine.play();
      if (!racing && engine.playing) engine.pause();
      if (racing && !birds.playing) birds.play();
      if (!racing && birds.playing) birds.pause();

      const drifting = racing && physics.isDrifting && Math.abs(physics.speed) > 8;
      if (drifting && !wasDrifting) skid.play();
      if (!drifting && wasDrifting) skid.pause();
      wasDrifting = drifting;

      if (racing && physics.isBoosting && !wasBoosting) replay(boost);
      wasBoosting = physics.isBoosting;

      const hit = physics.hitTimer > 0;
      if (hit && !wasHit) replay(impact);
      wasHit = hit;

      const coins = gameStateStore.getMetrics().coins;
      if (coins > lastCoins) replay(coin);
      lastCoins = coins;
    }, 50);

    return () => {
      clearInterval(timer);
      engine.pause();
      skid.pause();
      birds.pause();
    };
  }, [birds, boost, coin, engine, impact, physics, skid]);

  return null;
};