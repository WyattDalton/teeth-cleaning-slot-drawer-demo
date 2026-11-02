import type { CSSProperties } from 'react';

export type StaffGlassCardSeed = string | number;

const DEFAULT_SHADOW = {
  x: '3px',
  y: '5px',
  blur: '9px',
  spread: '0px',
  opacity: '6%',
} as const;

function hashSeed(seed: StaffGlassCardSeed): number {
  const str = String(seed);
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Stable per-seed bottom-right shadow offsets for liquid-glass cards. */
export function getStaffGlassCardStyle(seed?: StaffGlassCardSeed): CSSProperties {
  if (seed == null) {
    return {
      '--staff-glass-shadow-x': DEFAULT_SHADOW.x,
      '--staff-glass-shadow-y': DEFAULT_SHADOW.y,
      '--staff-glass-shadow-blur': DEFAULT_SHADOW.blur,
      '--staff-glass-shadow-spread': DEFAULT_SHADOW.spread,
      '--staff-glass-shadow-opacity': DEFAULT_SHADOW.opacity,
    } as CSSProperties;
  }

  const n = hashSeed(seed);
  const offsetX = `${2 + (n % 4)}px`;
  const offsetY = `${4 + ((n >> 3) % 5)}px`;
  const blur = `${8 + ((n >> 6) % 5)}px`;
  const spread = `${(n >> 12) % 2}px`;
  const opacity = `${5 + ((n >> 9) % 4)}%`;

  return {
    '--staff-glass-shadow-x': offsetX,
    '--staff-glass-shadow-y': offsetY,
    '--staff-glass-shadow-blur': blur,
    '--staff-glass-shadow-spread': spread,
    '--staff-glass-shadow-opacity': opacity,
  } as CSSProperties;
}
