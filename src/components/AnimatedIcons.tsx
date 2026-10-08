import React from 'react';

interface AnimatedIconProps {
  className?: string;
}

export const AnimatedLayers = ({ className }: AnimatedIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 2 7 12 12 22 7 12 2">
      <animate attributeName="points" values="12 2 2 7 12 12 22 7 12 2; 12 4 2 9 12 14 22 9 12 4; 12 2 2 7 12 12 22 7 12 2" dur="2s" repeatCount="indefinite"/>
    </polygon>
    <polyline points="2 12 12 17 22 12">
      <animate attributeName="points" values="2 12 12 17 22 12; 2 14 12 19 22 14; 2 12 12 17 22 12" dur="2s" repeatCount="indefinite" begin="0.2s"/>
    </polyline>
    <polyline points="2 17 12 22 22 17">
      <animate attributeName="points" values="2 17 12 22 22 17; 2 19 12 24 22 19; 2 17 12 22 22 17" dur="2s" repeatCount="indefinite" begin="0.4s"/>
    </polyline>
  </svg>
);

export const AnimatedDroplet = ({ className }: AnimatedIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z">
      <animateTransform attributeName="transform" type="translate" values="0,0; 0,2; 0,0" dur="2s" repeatCount="indefinite" />
    </path>
    <circle cx="12" cy="15" r="1" opacity="0">
      <animate attributeName="r" values="1; 6" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0; 0.5; 0" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

export const AnimatedSparkle = ({ className }: AnimatedIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <g>
      <animateTransform attributeName="transform" type="rotate" values="0 12 12; 90 12 12" dur="3s" repeatCount="indefinite" />
      <path d="M12 3v18" />
      <path d="M3 12h18" />
      <path d="M5.6 5.6l12.7 12.7" />
      <path d="M18.4 5.6l-12.7 12.7" />
      <circle cx="12" cy="12" r="2" fill="currentColor">
        <animate attributeName="r" values="2; 4; 2" dur="1s" repeatCount="indefinite" />
      </circle>
    </g>
  </svg>
);

export const AnimatedFlame = ({ className }: AnimatedIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z">
      <animate attributeName="d" values="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z; M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-1.224-3.054 1-5 .5 1.5 2.5 3.9 3 5.5 1 2.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z; M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" dur="1s" repeatCount="indefinite" />
    </path>
  </svg>
);

export const AnimatedInterlock = ({ className }: AnimatedIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,0; -2,0; 0,0" dur="2s" repeatCount="indefinite" />
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    </g>
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,0; 2,0; 0,0" dur="2s" repeatCount="indefinite" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </g>
  </svg>
);

export const AnimatedLeaf = ({ className }: AnimatedIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <g transform-origin="12 12">
      <animateTransform attributeName="transform" type="rotate" values="-10; 10; -10" dur="3s" repeatCount="indefinite" />
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 22l7-7" />
    </g>
  </svg>
);

export const AnimatedAcoustic = ({ className }: AnimatedIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 5L6 9H2v6h4l5 4V5z" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" opacity="0.3">
      <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.5s" repeatCount="indefinite" />
    </path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" opacity="0.3">
      <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.5s" repeatCount="indefinite" begin="0.2s" />
    </path>
  </svg>
);

export const AnimatedFeather = ({ className }: AnimatedIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <g transform-origin="12 12">
      <animateTransform attributeName="transform" type="translate" values="0,0; 0,-3; 0,0" dur="4s" repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="rotate" values="0; 10; 0; -10; 0" dur="4s" repeatCount="indefinite" additive="sum" />
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </g>
  </svg>
);
