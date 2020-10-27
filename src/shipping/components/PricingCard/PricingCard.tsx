import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { ChannelShippingData } from "@saleor/channels/utils";
import CardTitle from "@saleor/components/CardTitle";
import PriceField from "@saleor/components/PriceField";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableHead from "@saleor/components/TableHead";
import { ShippingChannelsErrorFragment } from "@saleor/fragments/types/ShippingChannelsErrorFragment";
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
  onChange
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const formErrors = getFormChannelErrors(["price"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Pricing",
          description: "pricing card title"
        })}
      />
      <CardContent className={classes.pricingContent}>
        <Typography variant="caption" className={classes.caption}>
          {intl.formatMessage({
            defaultMessage:
              "Channels that don’t have assigned prices will use their parent channel to define the price. Price will be converted to channel’s currency",
            description: "info text"
          })}
        </Typography>
        <ResponsiveTable className={classes.table}>
          <TableHead colSpan={numberOfColumns} disabled={disabled} items={[]}>
            <TableCell className={classes.colName}>
              <span>
                <FormattedMessage
                  defaultMessage="Channel name"
                  description="column title"
                />
              </span>
            </TableCell>
            <TableCell className={classes.colType}>
              <span>
                <FormattedMessage
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
                <TableRow key={channel.id}>
                  <TableCell>
                    <Typography>{channel.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <PriceField
                      disabled={disabled}
                      error={!!error}
                      label={intl.formatMessage({
                        defaultMessage: "Price",
                        description: "column title"
                      })}
                      name="price"
                      value={channel.price}
                      onChange={e =>
                        onChange(channel.id, {
                          ...channel,
                          price: e.target.value
                        })
                      }
                      currencySymbol={channel.currency}
                      required
                      hint={error && getShippingErrorMessage(error, intl)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </ResponsiveTable>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
