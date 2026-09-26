import { Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export interface InputState {
  accelerate: boolean;
  brake: boolean;
  steerLeft: boolean;
  steerRight: boolean;
  boost: boolean;
  drift: boolean;
  pause: boolean;
  tiltSteerValue: number; // -1 (full left) to +1 (full right)
}

class PlayerInputManager {
  private state: InputState = {
    accelerate: false,
    brake: false,
    steerLeft: false,
    steerRight: false,
    boost: false,
    drift: false,
    pause: false,
    tiltSteerValue: 0,
  };

  private touchControls: Partial<InputState> = {};
  public isTiltSteeringEnabled: boolean = true;
  private accelSubscription: any = null;

  constructor() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
      window.addEventListener('deviceorientation', this.handleWebOrientation);
    }
    this.enableTiltSensors();
  }

  public enableTiltSensors() {
    try {
      Accelerometer.setUpdateInterval(30); // 30ms updates
      this.accelSubscription = Accelerometer.addListener((data) => {
        if (!this.isTiltSteeringEnabled) return;
        // In landscape orientation, y-axis represents tilt roll angle
        const tilt = data.y; // -1 to 1
        const deadzone = 0.08;

        if (Math.abs(tilt) > deadzone) {
          // Clamp tilt between -1 and 1
          this.state.tiltSteerValue = Math.max(-1, Math.min(1, tilt * 2.2));
          this.state.steerLeft = tilt < -deadzone;
          this.state.steerRight = tilt > deadzone;
        } else {
          this.state.tiltSteerValue = 0;
          this.state.steerLeft = false;
          this.state.steerRight = false;
        }
      });
    } catch (err) {
      console.warn('Accelerometer not supported on this platform:', err);
    }
  }

  private handleWebOrientation = (e: DeviceOrientationEvent) => {
    if (!this.isTiltSteeringEnabled) return;
    const gamma = e.gamma || 0; // Left to right tilt in degrees (-90 to 90)
    const deadzone = 5;

    if (Math.abs(gamma) > deadzone) {
      const normalized = Math.max(-1, Math.min(1, gamma / 35));
      this.state.tiltSteerValue = normalized;
      this.state.steerLeft = normalized < 0;
      this.state.steerRight = normalized > 0;
    } else {
      this.state.tiltSteerValue = 0;
      this.state.steerLeft = false;
      this.state.steerRight = false;
    }
  };

  private isTypingTarget(target: EventTarget | null): boolean {
    if (!target) return false;
    const element = target as HTMLElement;
    const tagName = element.tagName?.toLowerCase();
    return (
      tagName === 'input' ||
      tagName === 'textarea' ||
      element.isContentEditable
    );
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.isTypingTarget(e.target)) return;

    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
      case 'KeyG':
        this.state.accelerate = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
      case 'KeyB':
        this.state.brake = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.state.steerLeft = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.state.steerRight = true;
        break;
      case 'Space':
        this.state.boost = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
      case 'KeyC':
        this.state.drift = true;
        break;
      case 'Escape':
      case 'KeyP':
        this.state.pause = true;
        break;
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (this.isTypingTarget(e.target)) return;

    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
      case 'KeyG':
        this.state.accelerate = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
      case 'KeyB':
        this.state.brake = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.state.steerLeft = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.state.steerRight = false;
        break;
      case 'Space':
        this.state.boost = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
      case 'KeyC':
        this.state.drift = false;
        break;
      case 'Escape':
      case 'KeyP':
        this.state.pause = false;
        break;
    }
  };

  public setTouchInput(key: keyof InputState, value: boolean) {
    (this.touchControls as any)[key] = value;
  }

  public getInput(): InputState {
    return {
      accelerate: this.state.accelerate || !!this.touchControls.accelerate,
      brake: this.state.brake || !!this.touchControls.brake,
      steerLeft: this.state.steerLeft || !!this.touchControls.steerLeft,
      steerRight: this.state.steerRight || !!this.touchControls.steerRight,
      boost: this.state.boost || !!this.touchControls.boost,
      drift: this.state.drift || !!this.touchControls.drift,
      pause: this.state.pause || !!this.touchControls.pause,
      tiltSteerValue: this.state.tiltSteerValue,
    };
  }

  public resetPauseTrigger() {
    this.state.pause = false;
    this.touchControls.pause = false;
  }

  public dispose() {
    if (this.accelSubscription) {
      this.accelSubscription.remove();
    }
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
      window.removeEventListener('deviceorientation', this.handleWebOrientation);
    }
  }
}

export const inputManager = new PlayerInputManager();
