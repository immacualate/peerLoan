
export interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  direction: number;
  opacity: number;
  trail: {x: number, y: number, opacity: number}[];
  isRocket: boolean;
  isOrbit: boolean;
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitCenterX?: number;
  orbitCenterY?: number;
  orbitAngle?: number;
  shape?: 'circle' | 'square' | 'triangle' | 'diamond' | 'hex' | 'star';
}

export const COLORS = [
  'rgba(51, 195, 240, 0.7)',   // peerLoan blue
  'rgba(155, 135, 245, 0.7)',  // peerLoan purple
  'rgba(66, 220, 163, 0.7)',   // peerLoan green
  'rgba(255, 255, 255, 0.4)',  // white
  'rgba(255, 215, 0, 0.5)',    // gold
  'rgba(138, 43, 226, 0.6)',   // purple
];

export const WEB3_COLORS = [
  'rgba(30, 190, 165, 0.65)',  // web3 teal
  'rgba(255, 88, 181, 0.5)',   // web3 pink
  'rgba(120, 118, 238, 0.6)',  // web3 purple
  'rgba(245, 171, 53, 0.55)',  // web3 orange
  'rgba(14, 165, 233, 0.6)',   // web3 blue
  'rgba(99, 102, 241, 0.6)',   // web3 indigo
];
