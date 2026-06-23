import Money from "@dashboard/components/Money";
import MoneyRange from "@dashboard/components/MoneyRange";
import responsiveTableStyles from "@dashboard/components/ResponsiveTable/ResponsiveTable.module.css";
import { Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { shippingZoneMethodsMessages } from "./messages";
import { SetUpPricingButton } from "./SetUpPricingButton";
import styles from "./ShippingZoneRateChannelTable.module.css";
import {
  CHANNEL_SEARCH_THRESHOLD,
  filterZoneChannels,
  getChannelListing,
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
}: ShippingZoneRateChannelTableProps) => {
  const intl = useIntl();
  const [query, setQuery] = useState("");
  const filteredChannels = useMemo(
    () => filterZoneChannels(zoneChannels, query),
    [query, zoneChannels],
  );
  const showSearch = zoneChannels.length > CHANNEL_SEARCH_THRESHOLD;

  return (
    <div className={styles.root}>
      {showSearch && (
        <Box
          paddingX={5}
          paddingY={4}
          borderBottomStyle="solid"
          borderColor="default1"
          borderBottomWidth={1}
        >
          <TextField
            fullWidth
            label={intl.formatMessage(shippingZoneMethodsMessages.searchChannels)}
            name="channel-search"
            onChange={event => setQuery(event.target.value)}
            value={query}
          />
        </Box>
      )}
      <div className={styles.channelTableScroll}>
        <Table className={responsiveTableStyles.table}>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage {...shippingZoneMethodsMessages.channelColumn} />
              </TableCell>
              {variant === "price" && (
                <TableCell>
                  <FormattedMessage {...shippingZoneMethodsMessages.orderValueRangeColumn} />
                </TableCell>
              )}
              <TableCell align="right">
                <FormattedMessage {...shippingZoneMethodsMessages.priceColumn} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredChannels.map(channel => {
              const listing = getChannelListing(rate, channel.id);

              return (
                <TableRow key={channel.id}>
                  <TableCell>
                    <Text>{channel.name}</Text>
                  </TableCell>
                  {variant === "price" && (
                    <TableCell>
                      {listing ? (
                        <MoneyRange
                          from={listing.minimumOrderPrice ?? undefined}
                          to={listing.maximumOrderPrice ?? undefined}
                        />
                      ) : (
                        <Text color="default2">
                          <FormattedMessage {...shippingZoneMethodsMessages.notConfigured} />
                        </Text>
                      )}
                    </TableCell>
                  )}
                  <TableCell align="right" data-test-id="shipping-rate-price">
                    <div className={styles.priceCellContent}>
                      {listing ? (
                        <Money money={listing.price} />
                      ) : (
                        <SetUpPricingButton
                          disabled={disabled}
                          href={getRateChannelSetupHref(rate.id, channel.id)}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

ShippingZoneRateChannelTable.displayName = "ShippingZoneRateChannelTable";
