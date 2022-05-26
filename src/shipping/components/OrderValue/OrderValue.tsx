import {
  Card,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import { ChannelShippingData } from "@saleor/channels/utils";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import PriceField from "@saleor/components/PriceField";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableHead from "@saleor/components/TableHead";
import { ShippingChannelsErrorFragment } from "@saleor/graphql";
import { ChangeEvent } from "@saleor/hooks/useForm";
import {
  getFormChannelError,
  getFormChannelErrors,
} from "@saleor/utils/errors";
import getShippingErrorMessage from "@saleor/utils/errors/shipping";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

interface Value {
  maxValue: string;
  minValue: string;
}
export interface OrderValueProps {
  channels: ChannelShippingData[];
  errors: ShippingChannelsErrorFragment[];
  disabled: boolean;
  orderValueRestricted: boolean;
  onChange: (event: ChangeEvent) => void;
  onChannelsChange: (channelId: string, value: Value) => void;
}

const numberOfColumns = 3;

export const OrderValue: React.FC<OrderValueProps> = ({
  channels,
  errors,
  orderValueRestricted,
  disabled,
  onChannelsChange,
  onChange,
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const formErrors = getFormChannelErrors(
    ["maximumOrderPrice", "minimumOrderPrice"],
    errors,
  );

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "yatGsm",
          defaultMessage: "Order Value",
          description: "card title",
        })}
      />
      <div className={classes.content}>
        <div className={classes.subheader}>
          <ControlledCheckbox
            name="orderValueRestricted"
            label={
              <>
                <FormattedMessage
                  id="Dgp38J"
                  defaultMessage="Restrict order value"
                  description="checkbox label"
                />
                <Typography variant="caption">
                  {intl.formatMessage({
                    id: "aZDHYr",
                    defaultMessage: "This rate will apply to all orders",
                    description: "price rates info",
                  })}
                </Typography>
              </>
            }
            checked={orderValueRestricted}
            onChange={onChange}
            disabled={disabled}
          />
          <VerticalSpacer />
          <FormattedMessage
            id="u5c/tR"
            defaultMessage="Channels that don’t have assigned discounts will use their parent channel to define the price. Price will be converted to channel’s currency"
            description="channels discount info"
          />
          <VerticalSpacer />
        </div>
        {orderValueRestricted && (
          <ResponsiveTable className={classes.table}>
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
              {channels?.map(channel => {
                const minError = getFormChannelError(
                  formErrors.minimumOrderPrice,
                  channel.id,
                );
                const maxError = getFormChannelError(
                  formErrors.maximumOrderPrice,
                  channel.id,
                );

                return (
                  <TableRow key={channel.id}>
                    <TableCell>
                      <Typography>{channel.name}</Typography>
                    </TableCell>
                    <TableCell className={classes.price}>
                      <PriceField
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
                            minValue: e.target.value,
                          })
                        }
                        currencySymbol={channel.currency}
                        hint={
                          minError && getShippingErrorMessage(minError, intl)
                        }
                      />
                    </TableCell>
                    <TableCell className={classes.price}>
                      <PriceField
                        disabled={disabled}
                        error={!!maxError}
                        label={intl.formatMessage({
                          id: "vjsfyn",
                          defaultMessage: "Max Value",
                        })}
                        name={`maxValue:${channel.name}`}
                        value={channel.maxValue}
                        InputProps={{ inputProps: { min: channel.minValue } }}
                        onChange={e =>
                          onChannelsChange(channel.id, {
                            ...channel,
                            maxValue: e.target.value,
                          })
                        }
                        currencySymbol={channel.currency}
                        hint={
                          maxError && getShippingErrorMessage(maxError, intl)
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </ResponsiveTable>
        )}
      </div>
    </Card>
  );
};

export default OrderValue;
