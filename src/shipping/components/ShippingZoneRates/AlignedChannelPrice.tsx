import { formatMoneyAmount } from "@dashboard/components/Money";
import useLocale from "@dashboard/hooks/useLocale";
import { type IMoney } from "@dashboard/utils/intl";
import { useMemo } from "react";

import styles from "./ShippingZoneRateChannelTable.module.css";

interface AlignedChannelPriceProps {
  money: IMoney;
}

const getDecimalSeparator = (locale: string): string => {
  const parts = new Intl.NumberFormat(locale).formatToParts(1.1);

  return parts.find(part => part.type === "decimal")?.value ?? ".";
};

export const AlignedChannelPrice = ({ money }: AlignedChannelPriceProps): JSX.Element => {
  const { locale } = useLocale();
  const decimalSeparator = useMemo(() => getDecimalSeparator(locale), [locale]);
  const formatted = formatMoneyAmount(money, locale);
  const separatorIndex = formatted.lastIndexOf(decimalSeparator);
  const whole = separatorIndex === -1 ? formatted : formatted.slice(0, separatorIndex);
  const fraction = separatorIndex === -1 ? "" : formatted.slice(separatorIndex);

  return (
    <span className={styles.priceValue} data-test-id="money-value">
      <span className={styles.currency}>{money.currency}</span>
      <span className={styles.whole}>{whole}</span>
      <span className={styles.fraction}>{fraction}</span>
    </span>
  );
};
