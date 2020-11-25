import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { ChannelShippingData } from "@saleor/channels/utils";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import PriceField from "@saleor/components/PriceField";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableHead from "@saleor/components/TableHead";
import { ShippingChannelsErrorFragment } from "@saleor/fragments/types/ShippingChannelsErrorFragment";
import { ChangeEvent } from "@saleor/hooks/useForm";
import {
  getFormChannelError,
  getFormChannelErrors
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
  noLimits: boolean;
  onChange: (event: ChangeEvent) => void;
  onChannelsChange: (channelId: string, value: Value) => void;
}

const numberOfColumns = 3;

export const OrderValue: React.FC<OrderValueProps> = ({
  channels,
  errors,
  noLimits,
  disabled,
  onChannelsChange,
  onChange
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const formErrors = getFormChannelErrors(
    ["maximumOrderPrice", "minimumOrderPrice"],
    errors
  );

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Order Value",
          description: "card title"
        })}
      />
      <CardContent className={classes.content}>
        <div className={classes.subheader}>
          <ControlledCheckbox
            name="noLimits"
            label={
              <>
                <FormattedMessage
                  defaultMessage="There are no value limits"
                  description="checkbox label"
                />
                <Typography variant="caption" className={classes.caption}>
                  {intl.formatMessage({
                    defaultMessage:
                      "This rate will apply to all orders of all prices",
                    description: "price rates info"
                  })}
                </Typography>
              </>
            }
            checked={noLimits}
            onChange={onChange}
            disabled={disabled}
          />
          <Typography variant="caption" className={classes.info}>
            <FormattedMessage
              defaultMessage="Channels that don’t have assigned discounts will use their parent channel to define the price. Price will be converted to channel’s currency"
              description="channels discount info"
            />
          </Typography>
        </div>
        {!noLimits && (
          <ResponsiveTable className={classes.table}>
            <TableHead colSpan={numberOfColumns} disabled={disabled} items={[]}>
              <TableCell className={classes.colName}>
                <span>
                  <FormattedMessage
                    defaultMessage="Channel name"
                    description="channel name"
                  />
                </span>
              </TableCell>
              <TableCell className={classes.colType}>
                <span>
                  <FormattedMessage
                    defaultMessage="Min. value"
                    description="min price in channel"
                  />
                </span>
              </TableCell>
              <TableCell className={classes.colType}>
                <span>
                  <FormattedMessage
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
                  channel.id
                );
                const maxError = getFormChannelError(
                  formErrors.maximumOrderPrice,
                  channel.id
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
                          defaultMessage: "Min Value"
                        })}
                        name={`minValue:${channel.name}`}
                        value={channel.minValue}
                        onChange={e =>
                          onChannelsChange(channel.id, {
                            ...channel,
                            minValue: e.target.value
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
                          defaultMessage: "Max Value"
                        })}
                        name={`maxValue:${channel.name}`}
                        value={channel.maxValue}
                        InputProps={{ inputProps: { min: channel.minValue } }}
                        onChange={e =>
                          onChannelsChange(channel.id, {
                            ...channel,
                            maxValue: e.target.value
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
      </CardContent>
    </Card>
  );
};

export default OrderValue;
