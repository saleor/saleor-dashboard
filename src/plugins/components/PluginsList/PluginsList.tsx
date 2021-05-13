import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TablePagination from "@saleor/components/TablePagination";
import { renderCollection } from "@saleor/misc";
import { PluginListUrlSortField } from "@saleor/plugins/urls";
import { makeStyles } from "@saleor/theme";
import { ListProps, SortPage } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import { Plugins_plugins_edges_node } from "../../types/Plugins";
import PluginChannelAvailabilityCell from "./PluginChannelAvailabilityCell";
import PluginChannelConfigurationCell from "./PluginChannelConfigurationCell";
import PluginListTableHead from "./PluginListTableHead";

export const useStyles = makeStyles(
  () => ({
    link: {
      cursor: "pointer"
    }
  }),
  { name: "PluginsList" }
);

export interface PluginListProps
  extends ListProps,
    SortPage<PluginListUrlSortField> {
  plugins: Plugins_plugins_edges_node[];
}

const totalColSpan = 10;

const PluginList: React.FC<PluginListProps> = props => {
  const {
    settings,
    plugins,
    disabled,
    onNextPage,
    pageInfo,
    sort,
    onRowClick,
    onSort,
    onUpdateListSettings,
    onPreviousPage
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <ResponsiveTable>
      <PluginListTableHead sort={sort} onSort={onSort} />
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={totalColSpan}
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
          plugin =>
            plugin ? (
              <TableRow
                hover={!!plugin}
                className={!!plugin ? classes.link : undefined}
                onClick={plugin ? onRowClick(plugin.id) : undefined}
                key={plugin ? plugin.id : "skeleton"}
              >
                <TableCell colSpan={5}>{plugin.name}</TableCell>
                <PluginChannelConfigurationCell plugin={plugin} />
                <PluginChannelAvailabilityCell plugin={plugin} />
                <TableCell align="right">
                  <div onClick={plugin ? onRowClick(plugin.id) : undefined}>
                    <EditIcon />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={totalColSpan}>
                  <Skeleton />
                </TableCell>
              </TableRow>
            ),
          () => (
            <TableRow>
              <TableCell colSpan={totalColSpan}>
                {intl.formatMessage({
                  defaultMessage: "No plugins found"
                })}
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
PluginList.displayName = "PluginList";
export default PluginList;
