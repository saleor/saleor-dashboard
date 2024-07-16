import { AppUrls } from "@dashboard/apps/urls";
import { TaxCalculationStrategy, useTaxStrategyChoicesQuery } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Button, ExternalLinkIcon, Option, Text } from "@saleor/macaw-ui-next";
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
  const navigate = useNavigator();
  const navigateToAppScreen = (id: string) => {
    navigate(AppUrls.resolveAppDetailsUrl(id));
  };

  const taxAppsChoices =
    data?.shop.availableTaxApps.map(app => ({
      value: app.identifier,
      label: (
        <TaxAppLabel
          name={app.name}
          created={app.created}
          version={app.version}
          id={app.id}
          logoUrl={app.brand?.logo?.default}
        />
      ),
      endAdornment: (
        <Button onClick={() => navigateToAppScreen(app.id)} variant="tertiary">
          <Box display="flex" alignItems="center" gap={1}>
            {app.identifier && (
              <Text
                color="default2"
                size={2}
                ellipsis
                __maxWidth="100px"
                textDecoration="underline"
              >
                {app.identifier}
              </Text>
            )}
            <ExternalLinkIcon size="small" color="default2" />
          </Box>
        </Button>
      ),
    })) ?? [];

  return {
    taxStrategyChoices: [
      ...taxAppsChoices,
      flatTaxRateChoice,
      legacyPluginTaxChoice,
    ] as unknown as Option[],
    loading,
  };
};
