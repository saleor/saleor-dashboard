import {
  TaxCalculationStrategy,
  TaxConfigurationFragment,
  useTaxStrategyChoicesQuery,
} from "@dashboard/graphql";
import React from "react";

import { FlatTaxRateLabel, TaxAppLabel } from "./TaxAppLabel";

const flatTaxRateChoice = {
  label: <FlatTaxRateLabel />,
  value: TaxCalculationStrategy.FLAT_RATES,
};

const isStrategyFlatRates = (strategy: string) =>
  strategy === TaxCalculationStrategy.FLAT_RATES;

export const useTaxStrategyChoices = () => {
  const { data } = useTaxStrategyChoicesQuery();
  const taxAppsChoices =
    data?.shop.availableTaxApps.map(app => ({
      value: app.id,
      label: <TaxAppLabel app={app} />,
    })) ?? [];

  return [...taxAppsChoices, flatTaxRateChoice];
};

export const getTaxCalculationStrategy = (taxCalculationStrategy: string) =>
  isStrategyFlatRates(taxCalculationStrategy)
    ? TaxCalculationStrategy.FLAT_RATES
    : TaxCalculationStrategy.TAX_APP;

export const getTaxAppId = (taxCalculationStrategy: string) =>
  isStrategyFlatRates(taxCalculationStrategy) ? null : taxCalculationStrategy;

export const getSelectedTaxStrategy = (
  currentTaxConfiguration: TaxConfigurationFragment,
) =>
  isStrategyFlatRates(currentTaxConfiguration?.taxCalculationStrategy)
    ? TaxCalculationStrategy.FLAT_RATES
    : currentTaxConfiguration?.taxAppId;
