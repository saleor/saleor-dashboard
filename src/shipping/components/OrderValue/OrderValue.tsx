import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableHead from "@saleor/components/TableHead";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getShippingPriceRateErrorMessage } from "./errors";
import { useStyles } from "./styles";

export interface FormData {
  name: string;
  noValueLimits: boolean;
  minValue: string;
  maxValue: string;
  isFree: boolean;
  price: string;
  type: ShippingMethodTypeEnum;
}

export interface IOrderValueProps {
  channels: any[];
  data: any;
  disabled: boolean;
  variant?: ShippingMethodTypeEnum;
}

const numberOfColumns = 3;

export const OrderValue: React.FC<IOrderValueProps> = ({
  channels,
  data,
  disabled
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  // {{addChannels: [{channelId: ID!, price: Decimal!, minValue: Decimal, maxValue: Decimal}}}
  // {{removeChannels: [ID!]}}

  // const initialForm: FormData = {
  //   isFree: false,
  //   maxValue: "",
  //   minValue: "",
  //   name: "",
  //   noValueLimits: false,
  //   price: "",
  //   type: null
  // };

  const getErrorMessage = getShippingPriceRateErrorMessage;

  const change = () => null;
  const formErrors: any = {};

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Order value",
          description: "price rates order value"
        })}
      />
      <CardContent>
        <ControlledCheckbox
          name={"noValueLimits"}
          label={
            <>
              <FormattedMessage
                defaultMessage="There are no value limits"
                description="shipping method has no value limits"
              />
              <Typography variant="caption">
                {intl.formatMessage({
                  defaultMessage:
                    "This rate will apply to all orders of all prices"
                })}
              </Typography>
            </>
          }
          checked={data.noValueLimits}
          onChange={change}
          disabled={disabled}
        />
        <Typography variant="caption" className={classes.info}>
          <FormattedMessage
            defaultMessage="Channels that don’t have assigned discounts will use their parent channel to define the price. Price will be converted to channel’s currency"
            description="channels discount"
          />
        </Typography>

        {!data.noValueLimits && (
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
              {channels?.map(channel => (
                <TableRow key={channel.id}>
                  <TableCell>
                    <Typography>{channel.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <TextField
                      disabled={disabled}
                      error={!!formErrors.minimumOrderPrice}
                      fullWidth
                      helperText={getErrorMessage(
                        formErrors.minimumOrderPrice,
                        intl
                      )}
                      label={intl.formatMessage({
                        defaultMessage: "Min Value"
                      })}
                      name={"minValue"}
                      type="number"
                      value={channel.minValue}
                      onChange={change}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      disabled={disabled}
                      error={!!formErrors.maximumOrderPrice}
                      fullWidth
                      helperText={getErrorMessage(
                        formErrors.maximumOrderPrice,
                        intl
                      )}
                      label={intl.formatMessage({
                        defaultMessage: "Max Value"
                      })}
                      name={"maxValue"}
                      type="number"
                      value={channel.maxValue}
                      onChange={change}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </ResponsiveTable>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderValue;

// <Form initial={initialForm} onSubmit={onSubmit}>
//   {({ change, data }) => (
