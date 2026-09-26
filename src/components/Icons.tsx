import React from 'react';
import Svg, { Path, Circle, Polygon, Rect } from 'react-native-svg';

export interface IconProps {
  size?: number;
  color?: string;
  fill?: string;
  style?: any;
}

export const ArrowLeft: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

export const User: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

export const Check: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

export const Sparkles: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" fill={fill || "none"} />
  </Svg>
);

export const Car: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 3C2 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" />
    <Circle cx="7" cy="17" r="2" />
    <Circle cx="17" cy="17" r="2" />
  </Svg>
);

export const Zap: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={fill || "none"} />
  </Svg>
);

export const Trophy: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <Path d="M4 22h16" />
    <Path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <Path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <Path d="M18 2H6v7a6 6 0 0 0 12 0V2z" fill={fill || "none"} />
  </Svg>
);

export const Coins: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="8" cy="8" r="6" fill={fill || "none"} />
    <Path d="M18 8a6 6 0 0 1-6 6" />
    <Path d="M22 12a6 6 0 0 1-6 6" />
  </Svg>
);

export const Star: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={fill || "none"} />
  </Svg>
);

export const RotateCcw: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <Path d="M3 3v5h5" />
  </Svg>
);

export const Home: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={fill || "none"} />
    <Path d="M9 22V12h6v10" />
  </Svg>
);

export const Smartphone: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <Path d="M12 18h.01" />
  </Svg>
);

export const Gamepad2: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M6 11h4M8 9v4" />
    <Circle cx="15" cy="12" r="1" />
    <Circle cx="18" cy="10" r="1" />
    <Path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-1.2 10.3 2.198 11.758 1.954.84 3.84-.71 4.54-1.848a4.996 4.996 0 0 1 5.12 0c.7 1.138 2.586 2.688 4.54 1.848 3.398-1.458 2.204-11.706 2.198-11.758A4 4 0 0 0 17.32 5z" />
  </Svg>
);

export const Gem: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M6 3h12l4 6-10 12L2 9z" fill={fill || "none"} />
    <Path d="M11 3v18" />
    <Path d="M2 9h20" />
  </Svg>
);

export const BarChart3: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M3 3v18h18" />
    <Path d="M18 17V9" />
    <Path d="M13 17V5" />
    <Path d="M8 17v-3" />
  </Svg>
);

export const Gift: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Rect x="3" y="8" width="18" height="4" rx="1" />
    <Path d="M12 8v13" />
    <Path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <Path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
  </Svg>
);

export const Lightbulb: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.7 1.3 1.5 1.5 2.5" />
    <Path d="M9 18h6" />
    <Path d="M10 22h4" />
  </Svg>
);

export const Target: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="6" />
    <Circle cx="12" cy="12" r="2" fill={fill || "none"} />
  </Svg>
);

export const Flag: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" fill={fill || "none"} />
    <Path d="M4 22v-7" />
  </Svg>
);

export const ShoppingCart: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="9" cy="21" r="1" />
    <Circle cx="20" cy="21" r="1" />
    <Path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </Svg>
);

export const Settings: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

export const Sun: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="12" cy="12" r="4" fill={fill || "none"} />
    <Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </Svg>
);

export const Flame: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" fill={fill || "none"} />
  </Svg>
);

export const Snowflake: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M2 12h20M12 2v20M20 16l-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4" />
  </Svg>
);

export const Lock: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill={fill || "none"} />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

export const Play: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', fill, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Polygon points="5 3 19 12 5 21 5 3" fill={fill || "none"} />
  </Svg>
);
