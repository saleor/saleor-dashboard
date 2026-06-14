import { MONO_FONT_FAMILY } from "@dashboard/styles/monoFontFamily";
import { type CSSProperties } from "react";

import styles from "./CountPill.module.css";

export interface ModelTypeTabCount {
  value: number;
  hasMore: boolean;
}

export interface CountPillProps {
  count: ModelTypeTabCount | undefined;
  active?: boolean;
}

export const getCountLabel = (count: ModelTypeTabCount | undefined): string | null => {
  if (!count) {
    return null;
  }

  return count.hasMore ? `${count.value}+` : `${count.value}`;
};

export const CountPill = ({ count, active = false }: CountPillProps) => {
  const label = getCountLabel(count);

  if (!label) {
    return null;
  }

  const style: CSSProperties = { fontFamily: MONO_FONT_FAMILY };

  return (
    <span className={active ? styles.countPillActive : styles.countPill} style={style}>
      {label}
    </span>
  );
};
