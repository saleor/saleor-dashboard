import { Box, useTheme } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Check } from "lucide-react";
import { CSSProperties, useMemo } from "react";

import styles from "./SelectableChip.module.css";

interface SwatchData {
  file?: { url: string } | null;
  value?: string | null; // hex color
}

interface SelectableChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  swatch?: SwatchData;
}

export const SelectableChip = ({
  label,
  selected,
  onClick,
  disabled = false,
  swatch,
}: SelectableChipProps) => {
  const { theme } = useTheme();
  const isDark = theme === "defaultDark";
  const hasSwatch = swatch?.file?.url || swatch?.value;

  const selectedStyle = useMemo((): CSSProperties | undefined => {
    if (!selected) return undefined;

    // Dark mode: white bg, dark text (PRIMARY = white in dark theme)
    // Light mode: dark bg, white text (PRIMARY = dark in light theme)
    return isDark
      ? { backgroundColor: "#ffffff", borderColor: "#ffffff", color: "#111827" }
      : { backgroundColor: "#111827", borderColor: "#111827", color: "#ffffff" };
  }, [selected, isDark]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(styles.chip, { [styles.selected]: selected })}
      style={selectedStyle}
    >
      <Box className={styles.content}>
        {hasSwatch && (
          <span
            className={styles.swatch}
            style={
              swatch.file?.url
                ? { backgroundImage: `url(${swatch.file.url})`, borderColor: "transparent" }
                : { backgroundColor: swatch.value ?? undefined, borderColor: "transparent" }
            }
          />
        )}
        <span className={styles.label}>{label}</span>
        {selected && <Check size={14} className={styles.checkIcon} />}
      </Box>
    </button>
  );
};
