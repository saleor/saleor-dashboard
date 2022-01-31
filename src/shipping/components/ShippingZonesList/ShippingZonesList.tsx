import {
  Card,
  TableBody,
  TableCell,
  TableFooter,
  TableRow
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { ShippingZoneFragment } from "@saleor/fragments/types/ShippingZoneFragment";
import { Button, DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import { maybe, renderCollection } from "@saleor/misc";
import { ListActions, ListProps } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ShippingZonesListProps extends ListProps, ListActions {
  shippingZones: ShippingZoneFragment[];
  onAdd: () => void;
  onRemove: (id: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    colAction: {
      "&:last-child": {
        paddingRight: theme.spacing(1)
      },
      width: 92
    },
    colCountries: {
      width: 180
    },
    colName: {
      paddingLeft: 0
    },
    row: {
      cursor: "pointer"
    }
  }),
  { name: "ShippingZonesList" }
);

const numberOfColumns = 4;

const ShippingZonesList: React.FC<ShippingZonesListProps> = props => {
  const {
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
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        height="const"
        title={intl.formatMessage({
          defaultMessage: "Shipping By Zone",
          description: "sort shipping methods by zone, section header"
        })}
        toolbar={
          <Button onClick={onAdd} data-test-id="add-shipping-zone">
            <FormattedMessage
              defaultMessage="Create shipping zone"
              description="button"
            />
          </Button>
        }
      />
      <ResponsiveTable>
        <colgroup>
          <col />
          <col className={classes.colName} />
          <col className={classes.colCountries} />
          <col className={classes.colAction} />
        </colgroup>
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
          <TableCell className={classes.colAction} />
        </TableHead>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={numberOfColumns}
              settings={settings}
              hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
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
                  <TableCell className={classes.colAction}>
                    <IconButton
                      variant="secondary"
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
      </ResponsiveTable>
    </Card>
  );
};
ShippingZonesList.displayName = "ShippingZonesList";
export default ShippingZonesList;
