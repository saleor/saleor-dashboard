import { ChannelShippingData } from "@dashboard/channels/utils";
import CardTitle from "@dashboard/components/CardTitle";
import PriceField from "@dashboard/components/PriceField";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableHead from "@dashboard/components/TableHead";
import TableRowLink from "@dashboard/components/TableRowLink";
import { ShippingChannelsErrorFragment } from "@dashboard/graphql";
import {
  getFormChannelError,
  getFormChannelErrors,
} from "@dashboard/utils/errors";
import getShippingErrorMessage from "@dashboard/utils/errors/shipping";
import {
  Card,
  CardContent,
  TableBody,
  TableCell,
  Typography,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

interface Value {
  maxValue: string;
  minValue: string;
  price: string;
}

export interface PricingCardProps {
  channels: ChannelShippingData[];
  errors: ShippingChannelsErrorFragment[];
  disabled: boolean;
  onChange: (channelId: string, value: Value) => void;
}

const numberOfColumns = 2;

export const PricingCard: React.FC<PricingCardProps> = ({
  channels,
  disabled,
  errors,
  onChange,
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const formErrors = getFormChannelErrors(["price"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "TnTi/a",
          defaultMessage: "Pricing",
          description: "pricing card title",
        })}
      />
      <CardContent className={classes.pricingContent}>
        <Typography variant="caption" className={classes.caption}>
          {intl.formatMessage({
            id: "VvA7ai",
            defaultMessage:
              "Channels that don’t have assigned prices will use their parent channel to define the price. Price will be converted to channel’s currency",
            description: "info text",
          })}
        </Typography>
        <ResponsiveTable className={classes.table}>
          <TableHead colSpan={numberOfColumns} disabled={disabled} items={[]}>
            <TableCell className={classes.colName}>
              <span>
                <FormattedMessage
                  id="Hj3T7P"
                  defaultMessage="Channel name"
                  description="column title"
                />
              </span>
            </TableCell>
            <TableCell className={classes.colType}>
              <span>
                <FormattedMessage
                  id="1shOIS"
                  defaultMessage="Price"
                  description="column title"
                />
              </span>
            </TableCell>
          </TableHead>
          <TableBody>
            {channels?.map(channel => {
              const error = getFormChannelError(formErrors.price, channel.id);

              return (
                <TableRowLink key={channel.id}>
                  <TableCell>
                    <Typography>{channel.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <PriceField
                      disabled={disabled}
                      error={!!error}
                      label={intl.formatMessage({
                        id: "1shOIS",
                        defaultMessage: "Price",
                        description: "column title",
                      })}
                      name="price"
                      value={channel.price}
                      onChange={e =>
                        onChange(channel.id, {
                          ...channel,
                          price: e.target.value,
                        })
                      }
                      currencySymbol={channel.currency}
                      required
                      hint={error && getShippingErrorMessage(error, intl)}
                    />
                  </TableCell>
                </TableRowLink>
              );
            })}
          </TableBody>
        </ResponsiveTable>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
