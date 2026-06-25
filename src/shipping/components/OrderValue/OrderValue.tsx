import { type ChannelShippingData, sortChannelShippingDataByName } from "@dashboard/channels/utils";
import { DashboardCard } from "@dashboard/components/Card";
import PriceField from "@dashboard/components/PriceField";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import TableHead from "@dashboard/components/TableHead";
import TableRowLink from "@dashboard/components/TableRowLink";
import { type ShippingChannelsErrorFragment } from "@dashboard/graphql";
import { normalizeChannelPriceValue } from "@dashboard/shipping/utils/channelPricingState";
import {
  type ChannelError,
  getFormChannelError,
  getFormChannelErrors,
} from "@dashboard/utils/errors";
import getShippingErrorMessage from "@dashboard/utils/errors/shipping";
import { TableBody, TableCell } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import shippingPriceTableStyles from "../ShippingPriceTable.module.css";
import { useStyles } from "./styles";

interface Value {
  maxValue: string;
  minValue: string;
  price: string;
}
interface OrderValueProps {
  channels: ChannelShippingData[];
  errors: ShippingChannelsErrorFragment[];
  disabled: boolean;
  onChannelsChange: (channelId: string, value: Value) => void;
}

const numberOfColumns = 3;

const OrderValue = ({ channels, errors, disabled, onChannelsChange }: OrderValueProps) => {
  const classes = useStyles({});
  const intl = useIntl();
  const formErrors = getFormChannelErrors(
    ["maximumOrderPrice", "minimumOrderPrice"],
    errors as ChannelError[],
  );
  const sortedChannels = useMemo(() => sortChannelShippingDataByName(channels), [channels]);

  return (
    <DashboardCard data-test-id="order-value">
      <DashboardCard.Header>
        <Box display="flex" flexDirection="column">
          <DashboardCard.Title>
            {intl.formatMessage({
              id: "yatGsm",
              defaultMessage: "Order Value",
              description: "card title",
            })}
          </DashboardCard.Title>
          <DashboardCard.Subtitle fontSize={3} color="default2">
            <FormattedMessage
              id="AdOnH8"
              defaultMessage="Leave min and max empty to apply this rate to orders of any value."
              description="order value restrictions helper"
            />
          </DashboardCard.Subtitle>
        </Box>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <ResponsiveTable
          className={clsx(classes.table, shippingPriceTableStyles.shippingPriceTable)}
        >
          <TableHead colSpan={numberOfColumns} disabled={disabled} items={[]}>
            <TableCell className={classes.colName}>
              <span>
                <FormattedMessage
                  id="UymotP"
                  defaultMessage="Channel name"
                  description="channel name"
                />
              </span>
            </TableCell>
            <TableCell className={classes.colType}>
              <span>
                <FormattedMessage
                  id="0FexL7"
                  defaultMessage="Min. value"
                  description="min price in channel"
                />
              </span>
            </TableCell>
            <TableCell className={classes.colType}>
              <span>
                <FormattedMessage
                  id="ER/yBq"
                  defaultMessage="Max. value"
                  description="max price in channel"
                />
              </span>
            </TableCell>
          </TableHead>
          <TableBody>
            {sortedChannels?.map(channel => {
              const minError = getFormChannelError(formErrors.minimumOrderPrice, channel.id);
              const maxError = getFormChannelError(formErrors.maximumOrderPrice, channel.id);

              return (
                <TableRowLink key={channel.id}>
                  <TableCell>
                    <Text>{channel.name}</Text>
                  </TableCell>
                  <TableCell
                    className={clsx(
                      classes.price,
                      shippingPriceTableStyles.shippingPriceTableInputCell,
                    )}
                  >
                    <PriceField
                      data-test-id="min-value-price-input"
                      disabled={disabled}
                      error={!!minError}
                      label={intl.formatMessage({
                        id: "kN6SLs",
                        defaultMessage: "Min Value",
                      })}
                      name={`minValue:${channel.name}`}
                      value={channel.minValue}
                      onChange={e =>
                        onChannelsChange(channel.id, {
                          ...channel,
                          minValue: normalizeChannelPriceValue(e.target.value),
                        })
                      }
                      currencySymbol={channel.currency}
                      hint={minError && getShippingErrorMessage(minError, intl)}
                    />
                  </TableCell>
                  <TableCell
                    className={clsx(
                      classes.price,
                      shippingPriceTableStyles.shippingPriceTableInputCell,
                    )}
                  >
                    <PriceField
                      data-test-id="max-value-price-input"
                      disabled={disabled}
                      error={!!maxError}
                      label={intl.formatMessage({
                        id: "vjsfyn",
                        defaultMessage: "Max Value",
                      })}
                      name={`maxValue:${channel.name}`}
                      value={channel.maxValue}
                      minValue={channel.minValue}
                      onChange={e =>
                        onChannelsChange(channel.id, {
                          ...channel,
                          maxValue: normalizeChannelPriceValue(e.target.value),
                        })
                      }
                      currencySymbol={channel.currency}
                      hint={maxError && getShippingErrorMessage(maxError, intl)}
                    />
                  </TableCell>
                </TableRowLink>
              );
            })}
          </TableBody>
        </ResponsiveTable>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default OrderValue;
