import { ChannelShippingData } from "@dashboard/channels/utils";
import CardTitle from "@dashboard/components/CardTitle";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import PriceField from "@dashboard/components/PriceField";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableHead from "@dashboard/components/TableHead";
import TableRowLink from "@dashboard/components/TableRowLink";
import { ShippingChannelsErrorFragment } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { ChannelError, getFormChannelError, getFormChannelErrors } from "@dashboard/utils/errors";
import getShippingErrorMessage from "@dashboard/utils/errors/shipping";
import { Card, TableBody, TableCell, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

interface Value {
  maxValue: string;
  minValue: string;
  price: string;
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
    errors as ChannelError[],
  );

  return (
    <Card data-test-id="order-value">
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
            data-test-id="order-value-checkbox"
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
                const minError = getFormChannelError(formErrors.minimumOrderPrice, channel.id);
                const maxError = getFormChannelError(formErrors.maximumOrderPrice, channel.id);

                return (
                  <TableRowLink key={channel.id}>
                    <TableCell>
                      <Typography>{channel.name}</Typography>
                    </TableCell>
                    <TableCell className={classes.price}>
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
                            minValue: e.target.value,
                          })
                        }
                        currencySymbol={channel.currency}
                        hint={minError && getShippingErrorMessage(minError, intl)}
                      />
                    </TableCell>
                    <TableCell className={classes.price}>
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
                            maxValue: e.target.value,
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
        )}
      </div>
    </Card>
  );
};

export default OrderValue;
