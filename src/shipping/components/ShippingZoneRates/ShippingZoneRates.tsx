// @ts-strict-ignore
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
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
  const hasRates = rates !== undefined && rates.length > 0;

  return (
    <DetailSettingsCard
      data-test-id={variant === "price" ? "price-based-rates" : "weight-based-rates"}
      title={
        <Box display="inline-flex" alignItems="center" gap={1}>
          <Box as="span">{sectionTitle}</Box>
          {variant === "price" && <ShippingMethodTypesHelpTooltip />}
          {variant === "price" && <Ripple model={rippleShippingRateEditor} />}
        </Box>
      }
      headerEnd={
        <Button
          disabled={disabled}
          onClick={onRateAdd}
          data-test-id={testId}
          variant="secondary"
          size="small"
        >
          <FormattedMessage {...shippingZoneMethodsMessages.addShippingMethod} />
        </Button>
      }
      contentFlush={hasRates}
    >
      {rates === undefined ? (
        <Skeleton />
      ) : rates.length === 0 ? (
        <Placeholder>
          <FormattedMessage {...shippingZoneMethodsMessages.noShippingMethods} />
        </Placeholder>
      ) : (
        <Box display="flex" flexDirection="column" gap={2} padding={4}>
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
    </DetailSettingsCard>
  );
};

ShippingZoneRates.displayName = "ShippingZoneRates";
