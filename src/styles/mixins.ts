import { CSSProperties } from "react";

export const triangle = (color: string, width: number): CSSProperties => ({
  borderBottom: `${width}px solid ${color}`,
  borderLeft: `${width}px solid transparent`,
  borderRight: `${width}px solid transparent`,
  height: 0,
  width: 0,
});
