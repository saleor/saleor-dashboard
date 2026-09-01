import { MONO_FONT_FAMILY } from "@dashboard/styles/monoFontFamily";
import { type CSSProperties } from "react";

import styles from "./CountPill.module.css";

export interface CountPillValue {
  value: number;
  hasMore: boolean;
}

interface CountPillProps {
  count: CountPillValue | undefined;
  active?: boolean;
}

const getCountLabel = (count: CountPillValue | undefined): string | null => {
  if (!count) {
    return null;
  }

  return count.hasMore ? `${count.value}+` : `${count.value}`;
};

export const countPillFromNumber = (value: number): CountPillValue | undefined =>
  value > 0 ? { value, hasMore: false } : undefined;

export const CountPill = ({ count, active = false }: CountPillProps): JSX.Element | null => {
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
