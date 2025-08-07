import React from "react";

import { LocaleConsumer } from "../Locale";
import { formatPercantage } from "./utils";

interface PercentProps {
  amount: number;
}

const Percent = ({ amount }: PercentProps) => (
  <LocaleConsumer>{({ locale }) => formatPercantage(amount, locale)}</LocaleConsumer>
);

Percent.displayName = "Percent";
export default Percent;
