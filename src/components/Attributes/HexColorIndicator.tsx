import clsx from "clsx";
import { type CSSProperties, useEffect, useState } from "react";

import { getHexColor } from "./getHexColor";
import styles from "./HexColorIndicator.module.css";

/** Keeps the indicator while the user edits through an invalid value, e.g. `#FFF` → `#FF` → `#FF0`. */
const HIDE_DELAY_MS = 500;

type Phase = "shown" | "leaving" | "hidden";

type HexColorIndicatorCssVars = CSSProperties & {
  "--hex-color": string;
};

interface HexColorIndicatorProps {
  value: string | null | undefined;
}

export const HexColorIndicator = ({ value }: HexColorIndicatorProps): React.ReactNode => {
  const color = getHexColor(value);
  const [shownColor, setShownColor] = useState(color);
  const [phase, setPhase] = useState<Phase>(color ? "shown" : "hidden");

  if (color && (color !== shownColor || phase !== "shown")) {
    setShownColor(color);
    setPhase("shown");
  }

  useEffect(
    function hideAfterDelay() {
      if (color || phase !== "shown") {
        return;
      }

      const timeout = setTimeout((): void => setPhase("leaving"), HIDE_DELAY_MS);

      return (): void => clearTimeout(timeout);
    },
    [color, phase],
  );

  if (phase === "hidden" || !shownColor) {
    return null;
  }

  const style: HexColorIndicatorCssVars = { "--hex-color": shownColor };

  return (
    <span
      aria-hidden
      className={clsx(styles.indicator, phase === "leaving" && styles.leaving)}
      data-test-id="hex-color-indicator"
      style={style}
      onAnimationEnd={() => {
        if (phase === "leaving") {
          setPhase("hidden");
        }
      }}
    />
  );
};
