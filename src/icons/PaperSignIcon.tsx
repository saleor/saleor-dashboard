import { iconSize } from "@dashboard/components/icons";

/**
 * Pixel Paper mark (the storefront sign), 12×12 grid matching public/logo.svg.
 */
const PAPER_MARK_RECTS: ReadonlyArray<{ x: number; y: number; width: number }> = [
  { x: 2, y: 0, width: 8 },
  { x: 0, y: 1, width: 12 },
  { x: 0, y: 2, width: 3 },
  { x: 8, y: 2, width: 4 },
  { x: 0, y: 3, width: 3 },
  { x: 5, y: 3, width: 3 },
  { x: 9, y: 3, width: 3 },
  { x: 0, y: 4, width: 3 },
  { x: 4, y: 4, width: 3 },
  { x: 9, y: 4, width: 3 },
  { x: 0, y: 5, width: 4 },
  { x: 9, y: 5, width: 3 },
  { x: 0, y: 6, width: 12 },
  { x: 0, y: 7, width: 10 },
  { x: 0, y: 8, width: 3 },
  { x: 0, y: 9, width: 3 },
  { x: 0, y: 10, width: 3 },
  { x: 0, y: 11, width: 2 },
];

interface PaperSignIconProps {
  size?: number;
}

export const PaperSignIcon = ({ size = iconSize.small }: PaperSignIconProps): JSX.Element => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    {PAPER_MARK_RECTS.map(rect => (
      <rect key={`${rect.x}-${rect.y}`} x={rect.x} y={rect.y} width={rect.width} height={1} />
    ))}
  </svg>
);
