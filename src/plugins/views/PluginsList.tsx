import { configurationMenuUrl } from "@saleor/configuration";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import React from "react";

import PluginsListPage from "../components/PluginsListPage/PluginsListPage";
import { TypedPluginsListQuery } from "../queries";
import { PluginsListUrlQueryParams, pluginsUrl } from "../urls";

interface PluginsListProps {
  params: PluginsListUrlQueryParams;
}

export const PluginsList: React.StatelessComponent<PluginsListProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const paginate = usePaginator();
  const { updateListSettings, settings } = useListSettings(
    ListViews.PLUGINS_LIST
  );
  const paginationState = createPaginationState(settings.rowNumber, params);

  return (
    <TypedPluginsListQuery displayLoader variables={paginationState}>
      {({ data, loading }) => {
        const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
          maybe(() => data.plugins.pageInfo),
          paginationState,
          params
        );
        return (
          <>
            <PluginsListPage
              disabled={loading}
              settings={settings}
              plugins={maybe(() => data.plugins.edges.map(edge => edge.node))}
              pageInfo={pageInfo}
              onAdd={() => navigate(configurationMenuUrl)}
              onBack={() => navigate(configurationMenuUrl)}
              onNextPage={loadNextPage}
              onPreviousPage={loadPreviousPage}
              onUpdateListSettings={updateListSettings}
              onRowClick={id => () => navigate(pluginsUrl(id))}
            />
          </>
        );
      }}
    </TypedPluginsListQuery>
  );
};

export default PluginsList;
