import {
  Button,
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CardTitle from "@saleor/components/CardTitle";
import IconButtonTableCell from "@saleor/components/IconButtonTableCell";
import Money from "@saleor/components/Money";
import MoneyRange from "@saleor/components/MoneyRange";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import WeightRange from "@saleor/components/WeightRange";
import { ShippingZoneDetailsFragment_shippingMethods } from "@saleor/fragments/types/ShippingZoneDetailsFragment";
import { makeStyles } from "@saleor/theme";
import { ChannelProps } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { ICONBUTTON_SIZE } from "../../../theme";

export interface ShippingZoneRatesProps extends ChannelProps {
  disabled: boolean;
  rates: ShippingZoneDetailsFragment_shippingMethods[];
  variant: "price" | "weight";
  testId?: string;
  onRateAdd: () => void;
  onRateEdit: (id: string) => void;
  onRateRemove: (id: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    alignRight: {
      paddingRight: 24,
      width: ICONBUTTON_SIZE + theme.spacing(0.5)
    },
    buttonColumn: {
      padding: "4px 0",
      width: "62px"
    },
    nameColumn: {
      width: "auto"
    },
    valueColumn: {
      width: "auto"
    }
  }),
  { name: "ShippingZoneRates" }
);
const ShippingZoneRates: React.FC<ShippingZoneRatesProps> = props => {
  const {
    disabled,
    onRateAdd,
    onRateEdit,
    onRateRemove,
    rates,
    selectedChannelId,
    variant,
    testId
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        height="const"
        title={
          variant === "price"
            ? intl.formatMessage({
                defaultMessage: "Price Based Rates",
                description: "price based shipping methods, section header"
              })
            : intl.formatMessage({
                defaultMessage: "Weight Based Rates",
                description: "weight based shipping methods, section header"
              })
        }
        toolbar={
          <Button
            color="primary"
            disabled={disabled}
            onClick={onRateAdd}
            data-test-id={testId}
          >
            <FormattedMessage
              defaultMessage="Create rate"
              description="button"
            />
          </Button>
        }
      />
      <ResponsiveTable>
        <TableHead>
          <TableRow>
            <TableCell className={classes.nameColumn}>
              <FormattedMessage
                defaultMessage="Name"
                description="shipping method name"
              />
            </TableCell>
            <TableCell className={classes.valueColumn}>
              {variant === "price"
                ? intl.formatMessage({
                    defaultMessage: "Value Range",
                    description: "shipping method price range"
                  })
                : intl.formatMessage({
                    defaultMessage: "Weight Range",
                    description: "shipping method weight range"
                  })}
            </TableCell>
            <TableCell className={classes.nameColumn}>
              <FormattedMessage
                defaultMessage="Price"
                description="shipping method price"
              />
            </TableCell>
            <TableCell className={classes.buttonColumn} />
            <TableCell className={classes.buttonColumn} />
          </TableRow>
        </TableHead>
        <TableBody>
          {renderCollection(
            rates,
            rate => {
              const channel = rate?.channelListings?.find(
                listing => listing.channel.id === selectedChannelId
              );
              return (
                <TableRow
                  hover={!!rate}
                  key={rate ? rate.id : "skeleton"}
                  onClick={!!rate ? () => onRateEdit(rate.id) : undefined}
                >
                  <TableCell className={classes.nameColumn}>
                    {maybe<React.ReactNode>(() => rate.name, <Skeleton />)}
                  </TableCell>
                  <TableCell>
                    {maybe<React.ReactNode>(
                      () =>
                        rate && !channel ? (
                          "-"
                        ) : variant === "price" ? (
                          <MoneyRange
                            from={channel.minimumOrderPrice}
                            to={channel.maximumOrderPrice}
                          />
                        ) : (
                          <WeightRange
                            from={rate.minimumOrderWeight}
                            to={rate.maximumOrderWeight}
                          />
                        ),
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell data-test-id="shipping-rate-price">
                    {maybe<React.ReactNode>(
                      () =>
                        rate && !channel ? (
                          "-"
                        ) : (
                          <Money money={channel.price} />
                        ),
                      <Skeleton />
                    )}
                  </TableCell>
                  <IconButtonTableCell
                    disabled={disabled}
                    onClick={() => onRateEdit(rate.id)}
                    className={classes.buttonColumn}
                  >
                    <EditIcon />
                  </IconButtonTableCell>
                  <IconButtonTableCell
                    disabled={disabled}
                    onClick={() => onRateRemove(rate.id)}
                    className={classes.buttonColumn}
                  >
                    <DeleteIcon />
                  </IconButtonTableCell>
                </TableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={5}>
                  <FormattedMessage defaultMessage="No shipping rates found" />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
ShippingZoneRates.displayName = "ShippingZoneRates";
export default ShippingZoneRates;
