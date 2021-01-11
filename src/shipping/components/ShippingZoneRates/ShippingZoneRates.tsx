import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
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
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { ICONBUTTON_SIZE } from "../../../theme";

export interface ShippingZoneRatesProps {
  disabled: boolean;
  rates: ShippingZoneDetailsFragment_shippingMethods[];
  variant: "price" | "weight";
  onRateAdd: () => void;
  onRateEdit: (id: string) => void;
  onRateRemove: (id: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    alignRight: {
      "&:last-child": {
        paddingRight: 0
      },
      paddingRight: 0,
      width: ICONBUTTON_SIZE + theme.spacing(0.5)
    },
    nameColumn: {
      width: 300
    },
    valueColumn: {
      width: 300
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
    variant
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
          <Button color="primary" disabled={disabled} onClick={onRateAdd}>
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
      </ResponsiveTable>
    </Card>
  );
};
ShippingZoneRates.displayName = "ShippingZoneRates";
export default ShippingZoneRates;
