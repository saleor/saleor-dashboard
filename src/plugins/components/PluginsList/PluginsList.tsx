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
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";

import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import i18n from "@saleor/i18n";
import { maybe, renderCollection } from "@saleor/misc";
import { ListProps } from "@saleor/types";
import { translateBoolean } from "@saleor/utils/i18n";
import { Plugins_plugins_edges_node } from "../../types/Plugins";

export interface PluginListProps extends ListProps {
  plugins: Plugins_plugins_edges_node[];
}

const styles = (theme: Theme) =>
  createStyles({
    [theme.breakpoints.up("lg")]: {
      colAction: {
        "& svg": {
          color: theme.palette.primary.main
        },
        textAlign: "right"
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
  });

const numberOfColumns = 4;

const PluginList = withStyles(styles, { name: "PluginList" })(
  ({
    classes,
    settings,
    plugins,
    disabled,
    onNextPage,
    pageInfo,
    onRowClick,
    onUpdateListSettings,
    onPreviousPage
  }: PluginListProps & WithStyles<typeof styles>) => {
    return (
      <Card>
        <Table>
          <TableHead
            colSpan={numberOfColumns}
            disabled={disabled}
            items={plugins}
          >
            <TableCell className={classes.colName} padding="dense">
              {i18n.t("Name", { context: "table header" })}
            </TableCell>
            <TableCell className={classes.colActive} padding="dense">
              {i18n.t("Active", { context: "table header" })}
            </TableCell>
            <TableCell className={classes.colAction} padding="dense">
              {i18n.t("Action", { context: "table header" })}
            </TableCell>
          </TableHead>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={numberOfColumns}
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
                            label={translateBoolean(plugin.active)}
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
                    {i18n.t("No plugins found")}
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
PluginList.displayName = "PluginList";
export default PluginList;
