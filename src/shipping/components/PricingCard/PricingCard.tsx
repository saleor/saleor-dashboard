import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableHead from "@saleor/components/TableHead";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface PricingCardProps {
  channels: any[];
  disabled: boolean;
  onChange: (channelId: string, value: { price: number }) => void;
}

const numberOfColumns = 2;

export const PricingCard: React.FC<PricingCardProps> = ({
  channels,
  disabled,
  onChange
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Pricing",
          description: "pricing card title"
        })}
      />
      <CardContent>
        <Typography variant="caption">
          {intl.formatMessage({
            defaultMessage:
              "Channels that don’t have assigned prices will use their parent channel to define the price. Price will be converted to channel’s currency",
            description: "channels price info"
          })}
        </Typography>
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
                  defaultMessage="Price"
                  description="price in channel"
                />
              </span>
            </TableCell>
          </TableHead>
          <TableBody>
            {channels?.map(channel => (
              <TableRow key={channel.id}>
                <TableCell>
                  <Typography>{channel.name}</Typography>
                </TableCell>
                <TableCell>
                  <TextField
                    disabled={disabled}
                    fullWidth
                    label={intl.formatMessage({
                      defaultMessage: "Price"
                    })}
                    name={"price"}
                    type="number"
                    value={channel.price}
                    onChange={e =>
                      onChange(channel.id, {
                        ...channel,
                        price: e.target.value
                      })
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ResponsiveTable>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
