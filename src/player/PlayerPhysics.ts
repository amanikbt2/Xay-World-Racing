import * as THREE from 'three';
import { KartConfig, DEFAULT_KART_CONFIG, GAME_PHYSICS } from '../game/GameConfig';
import { InputState } from './PlayerInput';

export class PlayerPhysics {
  public position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public rotation: THREE.Euler = new THREE.Euler(0, 0, 0, 'YXZ');

  public speed: number = 0;
  public heading: number = 0;
  public driftAngle: number = 0;
  public isDrifting: boolean = false;
  public driftCharge: number = 0;
  public isBoosting: boolean = false;
  public boostTimer: number = 0;

  private config: KartConfig = DEFAULT_KART_CONFIG;

  constructor(initialPosition?: THREE.Vector3, initialHeading: number = 0) {
    if (initialPosition) {
      this.position.copy(initialPosition);
    }
    this.heading = initialHeading;
    this.rotation.y = initialHeading;
  }

  public setConfig(config: KartConfig) {
    this.config = config;
  }

  public reset(pos: [number, number, number], initialHeading: number) {
    this.position.set(pos[0], pos[1], pos[2]);
    this.heading = initialHeading;
    this.rotation.y = initialHeading;
    this.speed = 0;
    this.velocity.set(0, 0, 0);
    this.isDrifting = false;
    this.driftCharge = 0;
    this.isBoosting = false;
    this.boostTimer = 0;
  }

  public update(delta: number, input: InputState) {
    // 1. Boost Timer update
    if (input.boost && !this.isBoosting && this.driftCharge >= 0.5) {
      this.isBoosting = true;
      this.boostTimer = this.config.boostDuration;
      this.driftCharge = 0;
    }

    if (this.isBoosting) {
      this.boostTimer -= delta;
      if (this.boostTimer <= 0) {
        this.isBoosting = false;
        this.boostTimer = 0;
      }
    }

    const currentMaxSpeed = this.isBoosting 
      ? this.config.maxSpeed * this.config.boostMultiplier 
      : this.config.maxSpeed;

    // 2. Acceleration & Braking
    if (input.accelerate) {
      const accelRate = this.isBoosting ? this.config.acceleration * 1.6 : this.config.acceleration;
      this.speed += accelRate * delta;
    } else if (input.brake) {
      if (this.speed > 0.5) {
        this.speed -= this.config.brakeForce * delta;
      } else {
        this.speed -= (this.config.acceleration * 0.6) * delta;
      }
    } else {
      this.speed *= Math.pow(this.config.friction, delta * 60);
    }

    const maxReverse = -this.config.reverseMaxSpeed;
    this.speed = THREE.MathUtils.clamp(this.speed, maxReverse, currentMaxSpeed);

    // 3. Steering logic (Supports both tiltSteerValue & button presses)
    let steerDir = 0;
    if (Math.abs(input.tiltSteerValue) > 0.05) {
      steerDir = -input.tiltSteerValue; // Tilt steering value
    } else {
      if (input.steerLeft) steerDir += 1;
      if (input.steerRight) steerDir -= 1;
    }

    const speedFactor = THREE.MathUtils.clamp(Math.abs(this.speed) / this.config.maxSpeed, 0, 1);

    if (input.drift && Math.abs(this.speed) > 10 && steerDir !== 0) {
      this.isDrifting = true;
      this.driftAngle = THREE.MathUtils.lerp(
        this.driftAngle, 
        steerDir * 0.45, 
        delta * 6
      );
      this.driftCharge = Math.min(1.0, this.driftCharge + delta * 0.4);
    } else {
      this.isDrifting = false;
      this.driftAngle = THREE.MathUtils.lerp(this.driftAngle, 0, delta * 8);
    }

    const turnMult = this.isDrifting ? this.config.driftFactor : 1.0;
    this.heading += steerDir * this.config.steeringStrength * speedFactor * turnMult * delta;
    this.rotation.y = this.heading + this.driftAngle;

    const targetRoll = -steerDir * speedFactor * (this.isDrifting ? 0.15 : 0.08);
    this.rotation.z = THREE.MathUtils.lerp(this.rotation.z, targetRoll, delta * 8);

    // 4. Update Position Vector
    const forwardX = -Math.sin(this.heading);
    const forwardZ = -Math.cos(this.heading);

    this.velocity.x = forwardX * this.speed;
    this.velocity.z = forwardZ * this.speed;
    this.velocity.y = 0;

    this.position.x += this.velocity.x * delta;
    this.position.z += this.velocity.z * delta;
    this.position.y = GAME_PHYSICS.groundY;
  }
}
