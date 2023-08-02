import React from "react";

import { LocaleConsumer } from "../Locale";
import { formatPercantage } from "./utils";

interface PercentProps {
  amount: number;
}

const Percent: React.FC<PercentProps> = ({ amount }) => (
  <LocaleConsumer>
    {({ locale }) => formatPercantage(amount, locale)}
  </LocaleConsumer>
);
Percent.displayName = "Percent";
export default Percent;
