import { SUCCESS_ICON_COLOR } from "@dashboard/colors";
import MoneyRange from "@dashboard/components/MoneyRange";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Globe } from "lucide-react";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AlignedChannelPrice } from "./AlignedChannelPrice";
import { shippingZoneMethodsMessages } from "./messages";
import { SetUpPricingButton } from "./SetUpPricingButton";
import styles from "./ShippingZoneRateChannelTable.module.css";
import {
  CHANNEL_SEARCH_THRESHOLD,
  filterZoneChannels,
  getChannelListing,
  hasChannelPrice,
  type ShippingRate,
  type ZoneChannel,
} from "./utils";

interface ShippingZoneRateChannelTableProps {
  rate: ShippingRate;
  zoneChannels: ZoneChannel[];
  variant: "price" | "weight";
  disabled: boolean;
  getRateChannelSetupHref: (rateId: string, channelId: string) => string;
}

export const ShippingZoneRateChannelTable = ({
  rate,
  zoneChannels,
  variant,
  disabled,
  getRateChannelSetupHref,
}: ShippingZoneRateChannelTableProps): JSX.Element => {
  const intl = useIntl();
  const [query, setQuery] = useState("");
  const filteredChannels = useMemo(
    () => filterZoneChannels(zoneChannels, query),
    [query, zoneChannels],
  );
  const showSearch = zoneChannels.length > CHANNEL_SEARCH_THRESHOLD;
  const isPriceVariant = variant === "price";
  const columnsClass = isPriceVariant ? styles.columnsPrice : styles.columnsWeight;

  return (
    <div className={styles.root}>
      {showSearch && (
        <Box className={styles.search}>
          <Input
            size="small"
            label={intl.formatMessage(shippingZoneMethodsMessages.searchChannels)}
            name="channel-search"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </Box>
      )}
      <div className={styles.list} data-test-id="shipping-rate-channel-list">
        <Box className={clsx(styles.headerRow, columnsClass)}>
          <Text size={2} color="default2">
            <FormattedMessage {...shippingZoneMethodsMessages.channelColumn} />
          </Text>
          {isPriceVariant && (
            <Text size={2} color="default2">
              <FormattedMessage {...shippingZoneMethodsMessages.orderValueRangeColumn} />
            </Text>
          )}
          <Text size={2} color="default2" textAlign="right">
            <FormattedMessage {...shippingZoneMethodsMessages.priceColumn} />
          </Text>
        </Box>
        {filteredChannels.map(channel => {
          const listing = getChannelListing(rate, channel.id);
          const isPriced = hasChannelPrice(rate, channel.id);

          return (
            <Box key={channel.id} className={clsx(styles.row, columnsClass)}>
              <Box className={styles.channelCell}>
                <Globe
                  size={14}
                  aria-hidden="true"
                  className={styles.channelIcon}
                  color={isPriced ? SUCCESS_ICON_COLOR : "var(--mu-colors-text-default2)"}
                />
                <Text size={3} className={styles.channelName} title={channel.name}>
                  {channel.name}
                </Text>
              </Box>
              {isPriceVariant && (
                <Box className={styles.rangeCell}>
                  {listing ? (
                    <MoneyRange
                      from={listing.minimumOrderPrice ?? undefined}
                      to={listing.maximumOrderPrice ?? undefined}
                    />
                  ) : (
                    <Text size={3} color="default2">
                      <FormattedMessage {...shippingZoneMethodsMessages.notConfigured} />
                    </Text>
                  )}
                </Box>
              )}
              <Box className={styles.priceCell} data-test-id="shipping-rate-price">
                {isPriced && listing?.price ? (
                  <AlignedChannelPrice money={listing.price} />
                ) : (
                  <SetUpPricingButton
                    disabled={disabled}
                    href={getRateChannelSetupHref(rate.id, channel.id)}
                  />
                )}
              </Box>
            </Box>
          );
        })}
      </div>
    </div>
  );
};

ShippingZoneRateChannelTable.displayName = "ShippingZoneRateChannelTable";
