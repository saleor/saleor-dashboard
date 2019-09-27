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
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import { FormattedMessage } from "react-intl";

import Skeleton from "@saleor/components/Skeleton";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection, stopPropagation } from "@saleor/misc";
import { ListProps } from "@saleor/types";
import { ServiceList_serviceAccounts_edges_node } from "../../types/ServiceList";

export interface ServiceListProps extends ListProps {
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
    },
    tableRow: {
      cursor: "pointer"
    }
  });

const numberOfColumns = 2;

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
    services
  }: ServiceListProps & WithStyles<typeof styles>) => (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell className={classes.colName}>
            <FormattedMessage
              defaultMessage="Name"
              description="service name"
            />
          </TableCell>
          <TableCell />
        </TableRow>
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
          service => (
            <TableRow
              className={!!service ? classes.tableRow : undefined}
              hover={!!service}
              key={service ? service.id : "skeleton"}
              onClick={service ? onRowClick(service.id) : undefined}
            >
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
                  onClick={
                    service
                      ? stopPropagation(() => onRemove(service.id))
                      : undefined
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ),
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
