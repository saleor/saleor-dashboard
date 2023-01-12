import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { PluginBaseFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { renderCollection } from "@dashboard/misc";
import { PluginListUrlSortField, pluginUrl } from "@dashboard/plugins/urls";
import { ListProps, SortPage } from "@dashboard/types";
import { TableBody, TableCell, TableFooter } from "@material-ui/core";
import { EditIcon, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import PluginChannelAvailabilityCell from "./PluginChannelAvailabilityCell";
import PluginChannelConfigurationCell from "./PluginChannelConfigurationCell";
import PluginListTableHead from "./PluginListTableHead";

export const useStyles = makeStyles(
  () => ({
    link: {
      cursor: "pointer",
    },
  }),
  { name: "PluginsList" },
);

export interface PluginListProps
  extends ListProps,
    SortPage<PluginListUrlSortField> {
  plugins: PluginBaseFragment[];
}

const totalColSpan = 10;

const PluginList: React.FC<PluginListProps> = props => {
  const {
    settings,
    plugins,
    disabled,
    sort,
    onSort,
    onUpdateListSettings,
  } = props;
  const classes = useStyles(props);
  const navigate = useNavigator();
  const intl = useIntl();

  return (
    <ResponsiveTable>
      <PluginListTableHead sort={sort} onSort={onSort} />
      <TableFooter>
        <TableRowLink>
          <TablePaginationWithContext
            colSpan={totalColSpan}
            onUpdateListSettings={onUpdateListSettings}
            settings={settings}
            disabled={disabled}
          />
        </TableRowLink>
      </TableFooter>
      <TableBody>
        {renderCollection(
          plugins,
          plugin =>
            plugin ? (
              <TableRowLink
                data-test-id="plugin"
                hover={!!plugin}
                className={!!plugin ? classes.link : undefined}
                // FIXME: middle click doesn't work - issues with deployments
                // shows 404 not found
                onClick={() => plugin && navigate(pluginUrl(plugin.id))}
                key={plugin ? plugin.id : "skeleton"}
              >
                <TableCell colSpan={5}>{plugin.name}</TableCell>
                <PluginChannelConfigurationCell plugin={plugin} />
                <PluginChannelAvailabilityCell plugin={plugin} />
                <TableCell align="right">
                  <EditIcon />
                </TableCell>
              </TableRowLink>
            ) : (
              <TableRowLink>
                <TableCell colSpan={totalColSpan}>
                  <Skeleton />
                </TableCell>
              </TableRowLink>
            ),
          () => (
            <TableRowLink>
              <TableCell colSpan={totalColSpan}>
                {intl.formatMessage({
                  id: "Co2U4u",
                  defaultMessage: "No plugins found",
                })}
              </TableCell>
            </TableRowLink>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
PluginList.displayName = "PluginList";
export default PluginList;
