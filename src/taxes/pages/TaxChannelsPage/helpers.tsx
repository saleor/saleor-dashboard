import {
  TaxCalculationStrategy,
  TaxConfigurationFragment,
  TaxConfigurationPerCountryFragment,
} from "@dashboard/graphql";

const isStrategyFlatRates = (strategy: string | null) =>
  strategy === TaxCalculationStrategy.FLAT_RATES;

export const getTaxCalculationStrategy = (taxCalculationStrategy: string) =>
  isStrategyFlatRates(taxCalculationStrategy)
    ? TaxCalculationStrategy.FLAT_RATES
    : TaxCalculationStrategy.TAX_APP;

export const getTaxAppId = (taxCalculationStrategy: string) =>
  isStrategyFlatRates(taxCalculationStrategy) ? null : taxCalculationStrategy;

export const getSelectedTaxStrategy = (
  currentTaxConfiguration:
    | TaxConfigurationFragment
    | TaxConfigurationPerCountryFragment,
) =>
  isStrategyFlatRates(currentTaxConfiguration?.taxCalculationStrategy)
    ? TaxCalculationStrategy.FLAT_RATES
    : currentTaxConfiguration?.taxAppId ?? "legacy-flow";
