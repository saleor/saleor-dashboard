import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box, useTheme } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Check } from "lucide-react";
import { useMemo, useState } from "react";

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

// Theme-aware color definitions
const getChipColors = (isDark: boolean, selected: boolean, isHovered: boolean) => {
  if (selected) {
    // Selected: inverted colors
    if (isDark) {
      return {
        bg: isHovered ? "#e5e7eb" : "#ffffff",
        border: isHovered ? "#e5e7eb" : "#ffffff",
        color: "#111827",
      };
    }

    return {
      bg: isHovered ? "#374151" : "#111827",
      border: isHovered ? "#374151" : "#111827",
      color: "#ffffff",
    };
  }

  // Unselected
  if (isDark) {
    return {
      bg: isHovered ? "#1f2937" : "transparent",
      border: isHovered ? "#111827" : "#374151",
      color: "#f3f4f6",
    };
  }

  return {
    bg: isHovered ? "#f3f4f6" : "transparent",
    border: isHovered ? "#111827" : "#d1d5db",
    color: "#111827",
  };
};

export const SelectableChip = ({
  label,
  selected,
  onClick,
  disabled = false,
  swatch,
}: SelectableChipProps) => {
  const { theme } = useTheme();
  const isDark = theme === "defaultDark";
  const [isHovered, setIsHovered] = useState(false);
  const hasSwatch = swatch?.file?.url || swatch?.value;

  const colors = useMemo(
    () => getChipColors(isDark, selected, isHovered && !disabled),
    [isDark, selected, isHovered, disabled],
  );

  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(styles.chip, { [styles.disabled]: disabled })}
      __backgroundColor={colors.bg}
      __borderColor={colors.border}
      __color={colors.color}
    >
      <Box className={styles.content}>
        {hasSwatch && (
          <span
            className={styles.swatch}
            style={
              swatch.file?.url
                ? { backgroundImage: `url(${swatch.file.url})` }
                : { backgroundColor: swatch.value ?? undefined }
            }
          />
        )}
        <span className={styles.label}>{label}</span>
        {selected && (
          <Check
            size={iconSize.small}
            strokeWidth={iconStrokeWidthBySize.small}
            className={styles.checkIcon}
          />
        )}
      </Box>
    </Box>
  );
};
