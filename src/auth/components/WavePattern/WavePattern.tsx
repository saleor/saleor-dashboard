import clsx from "clsx";
import { type ReactNode, useId } from "react";

import styles from "./WavePattern.module.css";

interface WavePatternProps {
  className?: string;
}

/**
 * Brand wave texture: 64x20 single-period sine wave rotated -24deg.
 * Matches saleor-branding and saleor-cloud-console WavePattern geometry.
 */
export const WavePattern = ({ className }: WavePatternProps): ReactNode => {
  const rawId = useId();
  const patternId = `saleor-wave-${rawId.replace(/:/g, "")}`;

  return (
    <svg className={clsx(styles.waves, className)} aria-hidden="true">
      <defs>
        <pattern
          id={patternId}
          width="64"
          height="20"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-24)"
        >
          <path
            d="M0 10 C11.6 2 20.4 2 32 10 S52.4 18 64 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};
