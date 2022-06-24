import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { TablePaginationWithContext } from "@saleor/components/TablePagination";
import { PluginBaseFragment } from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import { EditIcon, makeStyles } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import { PluginListUrlSortField, pluginUrl } from "@saleor/plugins/urls";
import { ListProps, SortPage } from "@saleor/types";
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
        <TableRow>
          <TablePaginationWithContext
            colSpan={totalColSpan}
            onUpdateListSettings={onUpdateListSettings}
            settings={settings}
            disabled={disabled}
          />
        </TableRow>
      </TableFooter>
      <TableBody>
        {renderCollection(
          plugins,
          plugin =>
            plugin ? (
              <TableRow
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
                  id: "Co2U4u",
                  defaultMessage: "No plugins found",
                })}
              </TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
PluginList.displayName = "PluginList";
export default PluginList;
