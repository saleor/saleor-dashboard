import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import IconButtonTableCell from "@saleor/components/IconButtonTableCell";
import Money from "@saleor/components/Money";
import MoneyRange from "@saleor/components/MoneyRange";
import Skeleton from "@saleor/components/Skeleton";
import WeightRange from "@saleor/components/WeightRange";
import { maybe, renderCollection } from "../../../misc";
import { ICONBUTTON_SIZE } from "../../../theme";
import { ShippingZoneDetailsFragment_shippingMethods } from "../../types/ShippingZoneDetailsFragment";

export interface ShippingZoneRatesProps {
  disabled: boolean;
  rates: ShippingZoneDetailsFragment_shippingMethods[];
  variant: "price" | "weight";
  onRateAdd: () => void;
  onRateEdit: (id: string) => void;
  onRateRemove: (id: string) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    alignRight: {
      "&:last-child": {
        paddingRight: 0
      },
      paddingRight: 0,
      width: ICONBUTTON_SIZE + theme.spacing.unit / 2
    },
    nameColumn: {
      width: 300
    },
    valueColumn: {
      width: 300
    }
  });
const ShippingZoneRates = withStyles(styles, { name: "ShippingZoneRates" })(
  ({
    classes,
    disabled,
    onRateAdd,
    onRateEdit,
    onRateRemove,
    rates,
    variant
  }: ShippingZoneRatesProps & WithStyles<typeof styles>) => {
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
            <Button color="primary" onClick={onRateAdd}>
              <FormattedMessage
                defaultMessage="Create rate"
                description="button"
              />
            </Button>
          }
        />
        <Table>
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
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCollection(
              rates,
              rate => (
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
                        variant === "price" ? (
                          <MoneyRange
                            from={rate.minimumOrderPrice}
                            to={rate.maximumOrderPrice}
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
                  <TableCell>
                    {maybe<React.ReactNode>(
                      () => (
                        <Money money={rate.price} />
                      ),
                      <Skeleton />
                    )}
                  </TableCell>
                  <IconButtonTableCell
                    disabled={disabled}
                    onClick={() => onRateEdit(rate.id)}
                  >
                    <EditIcon />
                  </IconButtonTableCell>
                  <IconButtonTableCell
                    disabled={disabled}
                    onClick={() => onRateRemove(rate.id)}
                  >
                    <DeleteIcon />
                  </IconButtonTableCell>
                </TableRow>
              ),
              () => (
                <TableRow>
                  <TableCell colSpan={5}>
                    <FormattedMessage defaultMessage="No shipping rates found" />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Card>
    );
  }
);
ShippingZoneRates.displayName = "ShippingZoneRates";
export default ShippingZoneRates;
