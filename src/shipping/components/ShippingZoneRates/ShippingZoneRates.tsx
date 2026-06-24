// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { Placeholder } from "@dashboard/components/Placeholder";
import { type ShippingZoneDetailsFragment } from "@dashboard/graphql";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { rippleShippingRateEditor } from "@dashboard/shipping/ripples/shippingRateEditor";
import { Box, Button, Skeleton } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { shippingZoneMethodsMessages } from "./messages";
import { ShippingMethodTypesHelpTooltip } from "./ShippingMethodTypesHelpTooltip";
import { ShippingZoneRateItem } from "./ShippingZoneRateItem";
import { type ZoneChannel } from "./utils";

interface ShippingZoneRatesProps {
  disabled: boolean;
  rates: ShippingZoneDetailsFragment["shippingMethods"];
  zoneChannels: ZoneChannel[];
  variant: "price" | "weight";
  testId?: string;
  onRateAdd: () => void;
  getRateEditHref: (id: string) => string;
  getRateChannelSetupHref: (rateId: string, channelId: string) => string;
  getRateTranslationHref?: (id: string) => string;
  onRateRemove: (id: string) => void;
}

export const ShippingZoneRates = ({
  disabled,
  onRateAdd,
  getRateEditHref,
  getRateChannelSetupHref,
  getRateTranslationHref,
  onRateRemove,
  rates,
  zoneChannels,
  variant,
  testId,
}: ShippingZoneRatesProps) => {
  const intl = useIntl();
  const sectionTitle =
    variant === "price"
      ? intl.formatMessage(shippingZoneMethodsMessages.priceBasedSectionTitle)
      : intl.formatMessage(shippingZoneMethodsMessages.weightBasedSectionTitle);

  return (
    <DashboardCard data-test-id={variant === "price" ? "price-based-rates" : "weight-based-rates"}>
      <DashboardCard.Header>
        <Box display="flex" alignItems="center" gap={2}>
          <DashboardCard.Title>{sectionTitle}</DashboardCard.Title>
          {variant === "price" && <ShippingMethodTypesHelpTooltip />}
          {variant === "price" && <Ripple model={rippleShippingRateEditor} />}
        </Box>
        <DashboardCard.Toolbar>
          <Button disabled={disabled} onClick={onRateAdd} data-test-id={testId} variant="secondary">
            <FormattedMessage {...shippingZoneMethodsMessages.addShippingMethod} />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {rates === undefined ? (
          <Skeleton />
        ) : rates.length === 0 ? (
          <Placeholder>
            <FormattedMessage {...shippingZoneMethodsMessages.noShippingMethods} />
          </Placeholder>
        ) : (
          <Box>
            {renderCollection(rates, rate =>
              maybe(
                () => (
                  <ShippingZoneRateItem
                    key={rate.id}
                    rate={rate}
                    zoneChannels={zoneChannels}
                    variant={variant}
                    disabled={disabled}
                    getRateEditHref={getRateEditHref}
                    getRateChannelSetupHref={getRateChannelSetupHref}
                    getRateTranslationHref={getRateTranslationHref}
                    onRateRemove={onRateRemove}
                  />
                ),
                <Skeleton />,
              ),
            )}
          </Box>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ShippingZoneRates.displayName = "ShippingZoneRates";
