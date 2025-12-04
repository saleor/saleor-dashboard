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
    | TaxConfigurationPerCountryFragment
    | undefined,
) =>
  isStrategyFlatRates(currentTaxConfiguration?.taxCalculationStrategy ?? null)
    ? TaxCalculationStrategy.FLAT_RATES
    : (currentTaxConfiguration?.taxAppId ?? "legacy-flow");
