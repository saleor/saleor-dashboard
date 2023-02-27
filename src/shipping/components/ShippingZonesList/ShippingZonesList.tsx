// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import Checkbox from "@dashboard/components/Checkbox";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableHead from "@dashboard/components/TableHead";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { ShippingZoneFragment } from "@dashboard/graphql";
import { maybe, renderCollection } from "@dashboard/misc";
import { shippingZoneAddUrl, shippingZoneUrl } from "@dashboard/shipping/urls";
import { ListActions, ListProps } from "@dashboard/types";
import { Card, TableBody, TableCell, TableFooter } from "@material-ui/core";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ShippingZonesListProps extends ListProps, ListActions {
  shippingZones: ShippingZoneFragment[];
  onRemove: (id: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    colAction: {
      "&:last-child": {
        paddingRight: theme.spacing(1),
      },
      width: 92,
    },
    colCountries: {
      width: 180,
    },
    colName: {
      paddingLeft: 0,
    },
    row: {
      cursor: "pointer",
    },
  }),
  { name: "ShippingZonesList" },
);

const numberOfColumns = 4;

const ShippingZonesList: React.FC<ShippingZonesListProps> = props => {
  const {
    disabled,
    settings,
    onRemove,
    onUpdateListSettings,
    shippingZones,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar,
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "h5r9+x",
          defaultMessage: "Shipping By Zone",
          description: "sort shipping methods by zone, section header",
        })}
        toolbar={
          <Button href={shippingZoneAddUrl} data-test-id="add-shipping-zone">
            <FormattedMessage
              id="mIUNgR"
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
              id="gRa/TS"
              defaultMessage="Name"
              description="shipping zone"
            />
          </TableCell>
          <TableCell className={classes.colCountries}>
            <FormattedMessage id="aMwxYb" defaultMessage="Countries" />
          </TableCell>
          <TableCell className={classes.colAction} />
        </TableHead>
        <TableFooter>
          <TableRowLink>
            <TablePaginationWithContext
              colSpan={numberOfColumns}
              settings={settings}
              disabled={disabled}
              onUpdateListSettings={onUpdateListSettings}
            />
          </TableRowLink>
        </TableFooter>
        <TableBody>
          {renderCollection(
            shippingZones,
            shippingZone => {
              const isSelected = shippingZone
                ? isChecked(shippingZone.id)
                : false;

              return (
                <TableRowLink
                  className={classes.row}
                  hover={!!shippingZone}
                  key={shippingZone ? shippingZone.id : "skeleton"}
                  href={shippingZone && shippingZoneUrl(shippingZone.id)}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      disableClickPropagation
                      onChange={() => toggle(shippingZone.id)}
                      data-test-id={maybe(() => shippingZone.id + "-checkbox")}
                    />
                  </TableCell>
                  <TableCell
                    className={classes.colName}
                    data-test-id={maybe(() => shippingZone.id + "-name")}
                  >
                    {maybe<React.ReactNode>(
                      () => shippingZone.name,
                      <Skeleton />,
                    )}
                  </TableCell>
                  <TableCell className={classes.colCountries}>
                    {maybe<React.ReactNode>(
                      () => shippingZone.countries.length,
                      <Skeleton />,
                    )}
                  </TableCell>
                  <TableCell className={classes.colAction}>
                    <TableButtonWrapper>
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
                    </TableButtonWrapper>
                  </TableCell>
                </TableRowLink>
              );
            },
            () => (
              <TableRowLink>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage
                    id="IhK1F3"
                    defaultMessage="No shipping zones found"
                  />
                </TableCell>
              </TableRowLink>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
ShippingZonesList.displayName = "ShippingZonesList";
export default ShippingZonesList;
