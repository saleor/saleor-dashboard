import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import { useIntl } from "react-intl";

import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import TablePagination from "@saleor/components/TablePagination";
import { translateBoolean } from "@saleor/intl";
import { maybe, renderCollection } from "@saleor/misc";
import { ListProps } from "@saleor/types";
import { Plugins_plugins_edges_node } from "../../types/Plugins";

export interface PluginListProps extends ListProps {
  plugins: Plugins_plugins_edges_node[];
}

const useStyles = makeStyles(theme => ({
  [theme.breakpoints.up("lg")]: {
    colAction: {
      "& svg": {
        color: theme.palette.primary.main
      },
      textAlign: "right" as "right"
    },
    colActive: {},
    colName: {}
  },
  colAction: {},
  colActive: {},
  colName: {},
  link: {
    cursor: "pointer"
  }
}));

const numberOfColumns = 4;

const PluginList: React.FC<PluginListProps> = props => {
  const {
    settings,
    plugins,
    disabled,
    onNextPage,
    pageInfo,
    onRowClick,
    onUpdateListSettings,
    onPreviousPage
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();
  return (
    <Card>
      <ResponsiveTable>
        <TableHead>
          <TableCell className={classes.colName}>
            {intl.formatMessage({
              defaultMessage: "Name",
              description: "plugin name"
            })}
          </TableCell>
          <TableCell className={classes.colActive}>
            {intl.formatMessage({
              defaultMessage: "Active",
              description: "plugin status"
            })}
          </TableCell>
          <TableCell className={classes.colAction}>
            {intl.formatMessage({
              defaultMessage: "Action",
              description: "user action bar"
            })}
          </TableCell>
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
            plugins,
            plugin => {
              return (
                <TableRow
                  hover={!!plugin}
                  className={!!plugin ? classes.link : undefined}
                  onClick={plugin ? onRowClick(plugin.id) : undefined}
                  key={plugin ? plugin.id : "skeleton"}
                >
                  <TableCell className={classes.colName}>
                    {maybe<React.ReactNode>(() => plugin.name, <Skeleton />)}
                  </TableCell>
                  <TableCell className={classes.colActive}>
                    {maybe<React.ReactNode>(
                      () => (
                        <StatusLabel
                          label={translateBoolean(plugin.active, intl)}
                          status={plugin.active ? "success" : "error"}
                        />
                      ),
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colAction}>
                    <div onClick={plugin ? onRowClick(plugin.id) : undefined}>
                      <EditIcon />
                    </div>
                  </TableCell>
                </TableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  {intl.formatMessage({
                    defaultMessage: "No plugins found"
                  })}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
PluginList.displayName = "PluginList";
export default PluginList;
