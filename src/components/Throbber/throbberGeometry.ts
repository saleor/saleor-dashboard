export const THROBBER_VIEWBOX_SIZE = 40;

export const THROBBER_VERTICES = [
  { x: 12, y: 15 },
  { x: 36, y: 15 },
  { x: 30, y: 25 },
  { x: 6, y: 25 },
] as const;

export const THROBBER_PATH_D = `M ${THROBBER_VERTICES.map(point => `${point.x} ${point.y}`).join(" L ")} Z`;

export const THROBBER_PATH_LENGTH = 89;
export const THROBBER_BEAM_LENGTH = 20;
export const THROBBER_ANIMATION_DURATION_MS = 1000;
