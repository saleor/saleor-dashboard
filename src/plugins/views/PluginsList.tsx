import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";

import ActionDialog from "@saleor/components/ActionDialog";
import { configurationMenuUrl } from "@saleor/configuration";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import i18n from "@saleor/i18n";
import { getMutationState, maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import PluginsListPage from "../components/PluginsListPage/PluginsListPage";
import { TypedPluginsListQuery } from "../queries";
import {
  pluginsListUrl,
  PluginsListUrlDialog,
  PluginsListUrlQueryParams,
  pluginsUrl
} from "../urls";

interface PluginsListProps {
  params: PluginsListUrlQueryParams;
}

export const PluginsList: React.StatelessComponent<PluginsListProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.PAGES_LIST
  );
  const paginationState = createPaginationState(settings.rowNumber, params);

  return (
    <TypedPluginsListQuery displayLoader variables={paginationState}>
      {({ data, loading, refetch }) => {
        const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
          maybe(() => data.pages.pageInfo),
          paginationState,
          params
        );

        return (
          <>
            <PluginsListPage
              disabled={loading}
              settings={settings}
              plugins={maybe(() =>
                data.pluginConfigurations.edges.map(edge => edge.node)
              )}
              pageInfo={pageInfo}
              onBack={() => navigate(configurationMenuUrl)}
              onNextPage={loadNextPage}
              onPreviousPage={loadPreviousPage}
              onUpdateListSettings={updateListSettings}
              onRowClick={id => () => navigate(pluginsUrl(id))}
              isChecked={isSelected}
              selected={listElements.length}
              toggle={toggle}
              toggleAll={toggleAll}
            />
          </>
        );
      }}
    </TypedPluginsListQuery>
  );
};

export default PluginsList;
