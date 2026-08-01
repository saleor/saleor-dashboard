import { TaxCalculationStrategy } from "@dashboard/graphql";
import { type MessageDescriptor } from "react-intl";

import { messages } from "./messages";

interface TaxStatusInput {
  chargeTaxes?: boolean | null;
  taxCalculationStrategy?: TaxCalculationStrategy | null;
}

export const getTaxStatusMessage = ({
  chargeTaxes,
  taxCalculationStrategy,
}: TaxStatusInput): MessageDescriptor => {
  if (!chargeTaxes) {
    return messages.taxStatusOff;
  }

  if (taxCalculationStrategy === TaxCalculationStrategy.TAX_APP) {
    return messages.taxStatusApp;
  }

  return messages.taxStatusFlatRates;
};
