import useLocale from "@dashboard/hooks/useLocale";
import { IMoney } from "@dashboard/utils/intl";

import { formatMoneyAmount } from ".";
import styles from "./Money.module.css";

interface MoneyProps {
  money: IMoney | null;
}

const Money = (props: MoneyProps) => {
  const { money, ...rest } = props;
  const { locale } = useLocale();

  if (!money) {
    return null;
  }

  return (
    <span data-test-id="money-value" className={styles.root} {...rest}>
      <span className={styles.currency}>{money.currency}</span>
      {formatMoneyAmount(money, locale)}
    </span>
  );
};

Money.displayName = "Money";
export default Money;
