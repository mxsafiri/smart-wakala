declare module 'react-circular-progressbar' {
  import React from 'react';

  export interface CircularProgressbarStyles {
    rotation?: number;
    strokeLinecap?: 'butt' | 'round' | 'square';
    textSize?: string;
    pathTransition?: string;
    textColor?: string;
    pathColor?: string;
    trailColor?: string;
    backgroundColor?: string;
  }

  export interface CircularProgressbarProps {
    value: number;
    minValue?: number;
    maxValue?: number;
    text?: string;
    className?: string;
    counterClockwise?: boolean;
    circleRatio?: number;
    styles?: {
      root?: React.CSSProperties;
      path?: React.CSSProperties;
      trail?: React.CSSProperties;
      text?: React.CSSProperties;
      background?: React.CSSProperties;
    };
    strokeWidth?: number;
    background?: boolean;
    backgroundPadding?: number;
  }

  export function buildStyles(styles: CircularProgressbarStyles): {
    root?: React.CSSProperties;
    path?: React.CSSProperties;
    trail?: React.CSSProperties;
    text?: React.CSSProperties;
    background?: React.CSSProperties;
  };

  export const CircularProgressbar: React.FC<CircularProgressbarProps>;
  
  export default CircularProgressbar;
}
