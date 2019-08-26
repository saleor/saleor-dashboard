import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import Checkbox from "@saleor/components/Checkbox";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection } from "@saleor/misc";
import { ICONBUTTON_SIZE } from "@saleor/theme";
import { ListActions, ListProps } from "@saleor/types";
import { ShippingZoneFragment } from "../../types/ShippingZoneFragment";

export interface ShippingZonesListProps extends ListProps, ListActions {
  shippingZones: ShippingZoneFragment[];
  onAdd: () => void;
  onRemove: (id: string) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    [theme.breakpoints.up("lg")]: {
      colCountries: {},
      colName: { width: 200 }
    },
    alignRight: {
      "&:last-child": {
        paddingRight: theme.spacing.unit
      },
      width: ICONBUTTON_SIZE + theme.spacing.unit / 2
    },
    colCountries: {},
    colName: {},
    row: {
      cursor: "pointer"
    }
  });

const numberOfColumns = 4;

const ShippingZonesList = withStyles(styles, { name: "ShippingZonesList" })(
  ({
    classes,
    disabled,
    settings,
    onAdd,
    onNextPage,
    onPreviousPage,
    onRemove,
    onUpdateListSettings,
    onRowClick,
    pageInfo,
    shippingZones,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar
  }: ShippingZonesListProps & WithStyles<typeof styles>) => {
    const intl = useIntl();

    return (
      <Card>
        <CardTitle
          height="const"
          title={intl.formatMessage({
            defaultMessage: "Shipping by zone",
            description: "sort shipping methods by zone, section header"
          })}
          toolbar={
            <Button color="primary" onClick={onAdd}>
              <FormattedMessage
                defaultMessage="Add shipping zone"
                description="button"
              />
            </Button>
          }
        />
        <Table>
          <TableHead
            colSpan={numberOfColumns}
            selected={selected}
            disabled={disabled}
            items={shippingZones}
            toggleAll={toggleAll}
            toolbar={toolbar}
          >
            <TableCell className={classes.colName}>
              <FormattedMessage
                defaultMessage="Name"
                description="shipping zone"
              />
            </TableCell>
            <TableCell className={classes.colCountries}>
              <FormattedMessage defaultMessage="Countries" />
            </TableCell>
            <TableCell />
          </TableHead>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={4}
                settings={settings}
                hasNextPage={
                  pageInfo && !disabled ? pageInfo.hasNextPage : false
                }
                onNextPage={onNextPage}
                onUpdateListSettings={onUpdateListSettings}
                hasPreviousPage={
                  pageInfo && !disabled ? pageInfo.hasPreviousPage : false
                }
                onPreviousPage={onPreviousPage}
              />
            </TableRow>
          </TableFooter>
          <TableBody>
            {renderCollection(
              shippingZones,
              shippingZone => {
                const isSelected = shippingZone
                  ? isChecked(shippingZone.id)
                  : false;

                return (
                  <TableRow
                    className={classes.row}
                    hover={!!shippingZone}
                    key={shippingZone ? shippingZone.id : "skeleton"}
                    onClick={shippingZone && onRowClick(shippingZone.id)}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        disabled={disabled}
                        disableClickPropagation
                        onChange={() => toggle(shippingZone.id)}
                      />
                    </TableCell>
                    <TableCell className={classes.colName}>
                      {maybe<React.ReactNode>(
                        () => shippingZone.name,
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.colCountries}>
                      {maybe<React.ReactNode>(
                        () => shippingZone.countries.length,
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.alignRight}>
                      <IconButton
                        color="primary"
                        disabled={disabled}
                        onClick={event => {
                          event.stopPropagation();
                          onRemove(shippingZone.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              },
              () => (
                <TableRow>
                  <TableCell colSpan={numberOfColumns}>
                    <FormattedMessage defaultMessage="No shipping zones found" />
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
ShippingZonesList.displayName = "ShippingZonesList";
export default ShippingZonesList;
