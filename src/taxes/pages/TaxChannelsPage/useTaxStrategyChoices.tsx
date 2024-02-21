import {
  TaxCalculationStrategy,
  useTaxStrategyChoicesQuery,
} from "@dashboard/graphql";
import React from "react";

import { FlatTaxRateLabel, PluginLabel, TaxAppLabel } from "../../components";

const flatTaxRateChoice = {
  label: <FlatTaxRateLabel />,
  value: TaxCalculationStrategy.FLAT_RATES,
};

const legacyPluginTaxChoice = {
  label: <PluginLabel />,
  value: "plugin:mirumee.taxes.avalara",
};

export const useTaxStrategyChoices = () => {
  const { data, loading } = useTaxStrategyChoicesQuery();
  const taxAppsChoices =
    data?.shop.availableTaxApps.map(app => ({
      value: app.identifier,
      label: (
        <TaxAppLabel
          name={app.name}
          created={app.created}
          version={app.version}
          id={app.id}
          identifier={app.identifier}
          logoUrl={app.brand?.logo?.default}
        />
      ),
    })) ?? [];

  return {
    taxStrategyChoices: [
      ...taxAppsChoices,
      flatTaxRateChoice,
      legacyPluginTaxChoice,
    ],
    loading,
  };
};
