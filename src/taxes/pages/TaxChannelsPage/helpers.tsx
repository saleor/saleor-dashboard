import {
  TaxCalculationStrategy,
  TaxConfigurationFragment,
} from "@dashboard/graphql";

// TODO: add unit tests
const isStrategyFlatRates = (strategy: string) =>
  strategy === TaxCalculationStrategy.FLAT_RATES;

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
