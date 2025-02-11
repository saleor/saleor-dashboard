import { IMoney } from "@dashboard/utils/intl";
import { useIntl } from "react-intl";

import { LocaleConsumer } from "../Locale";
import { getMoneyRange } from "./utils";

export interface MoneyRangeProps {
  from?: IMoney;
  to?: IMoney;
}

export const MoneyRange = ({ from, to }: MoneyRangeProps) => {
  const intl = useIntl();

  return <LocaleConsumer>{({ locale }) => getMoneyRange(locale, intl, from, to)}</LocaleConsumer>;
};

MoneyRange.displayName = "MoneyRange";
export default MoneyRange;
