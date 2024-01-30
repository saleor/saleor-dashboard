import {
  TaxCalculationStrategy,
  useTaxStrategyChoicesQuery,
} from "@dashboard/graphql";
import React from "react";

import { FlatTaxRateLabel, TaxAppLabel } from "../../components";

const flatTaxRateChoice = {
  label: <FlatTaxRateLabel />,
  value: TaxCalculationStrategy.FLAT_RATES,
};

export const useTaxStrategyChoices = () => {
  const { data } = useTaxStrategyChoicesQuery();
  const taxAppsChoices =
    data?.shop.availableTaxApps.map(app => ({
      value: app.identifier,
      label: <TaxAppLabel app={app} />,
    })) ?? [];

  return [...taxAppsChoices, flatTaxRateChoice];
};
