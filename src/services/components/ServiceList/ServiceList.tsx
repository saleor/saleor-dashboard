import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import { FormattedMessage } from "react-intl";

import Checkbox from "@saleor/components/Checkbox";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection } from "@saleor/misc";
import { ListActions, ListProps } from "@saleor/types";
import { ServiceList_serviceAccounts_edges_node } from "../../types/ServiceList";

export interface ServiceListProps extends ListProps, ListActions {
  services: ServiceList_serviceAccounts_edges_node[];
  onRemove: (id: string) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    [theme.breakpoints.up("lg")]: {
      colName: {
        "&&": {
          width: "auto"
        }
      }
    },
    colAction: {
      "&&": {
        paddingRight: theme.spacing.unit
      },
      textAlign: "right",
      width: 100
    },
    colName: {
      paddingLeft: 0,
      width: 250
    },
    table: {
      tableLayout: "fixed"
    }
  });

const numberOfColumns = 3;

const ServiceList = withStyles(styles, {
  name: "ServiceList"
})(
  ({
    classes,
    settings,
    disabled,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRemove,
    onRowClick,
    pageInfo,
    services,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar
  }: ServiceListProps & WithStyles<typeof styles>) => (
    <Table className={classes.table}>
      <TableHead
        colSpan={numberOfColumns}
        selected={selected}
        disabled={disabled}
        items={services}
        toggleAll={toggleAll}
        toolbar={toolbar}
      >
        <TableCell className={classes.colName}>
          <FormattedMessage defaultMessage="Code" description="voucher code" />
        </TableCell>
        <TableCell />
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
          services,
          service => {
            const isSelected = service ? isChecked(service.id) : false;

            return (
              <TableRow
                className={!!service ? classes.tableRow : undefined}
                hover={!!service}
                key={service ? service.id : "skeleton"}
                selected={isSelected}
                onClick={service ? onRowClick(service.id) : undefined}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(service.id)}
                  />
                </TableCell>
                <TableCell className={classes.colName}>
                  <span data-tc="name">
                    {maybe<React.ReactNode>(() => service.name, <Skeleton />)}
                  </span>
                  <Typography data-tc="isActive" variant="caption">
                    {maybe(() =>
                      service.isActive ? (
                        <FormattedMessage
                          defaultMessage="active"
                          description="account status"
                        />
                      ) : (
                        <FormattedMessage
                          defaultMessage="inactive"
                          description="account status"
                        />
                      )
                    )}
                  </Typography>
                </TableCell>
                <TableCell className={classes.colAction}>
                  <IconButton
                    color="primary"
                    onClick={service ? onRowClick(service.id) : undefined}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={service ? () => onRemove(service.id) : undefined}
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
                <FormattedMessage defaultMessage="No service accounts found" />
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  )
);
ServiceList.displayName = "ServiceList";
export default ServiceList;
