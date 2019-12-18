import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
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

import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection, stopPropagation } from "@saleor/misc";
import { ListProps, SortPage } from "@saleor/types";
import { ServiceListUrlSortField } from "@saleor/services/urls";
import TableCellHeader from "@saleor/components/TableCellHeader";
import { getArrowDirection } from "@saleor/utils/sort";
import { ServiceList_serviceAccounts_edges_node } from "../../types/ServiceList";

export interface ServiceListProps
  extends ListProps,
    SortPage<ServiceListUrlSortField> {
  services: ServiceList_serviceAccounts_edges_node[];
  onRemove: (id: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colName: {
        "&&": {
          width: "auto"
        }
      }
    },
    colAction: {
      "&&": {
        paddingRight: theme.spacing(1)
      },
      textAlign: "right",
      width: 140
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
  }),
  { name: "ServiceList" }
);

const numberOfColumns = 2;

const ServiceList: React.FC<ServiceListProps> = props => {
  const {
    settings,
    disabled,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRemove,
    onRowClick,
    onSort,
    pageInfo,
    services,
    sort
  } = props;

  const classes = useStyles(props);

  return (
    <ResponsiveTable className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCellHeader
            direction={
              sort.sort === ServiceListUrlSortField.name
                ? getArrowDirection(sort.asc)
                : undefined
            }
            arrowPosition="right"
            onClick={() => onSort(ServiceListUrlSortField.name)}
            className={classes.colName}
          >
            <FormattedMessage
              defaultMessage="Name"
              description="service name"
            />
          </TableCellHeader>
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
    </ResponsiveTable>
  );
};
ServiceList.displayName = "ServiceList";
export default ServiceList;
