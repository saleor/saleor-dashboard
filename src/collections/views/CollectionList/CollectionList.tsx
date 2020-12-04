import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ActionDialog from "@saleor/components/ActionDialog";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData
} from "@saleor/components/SaveFilterTabDialog";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { commonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { getSortParams } from "@saleor/utils/sort";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CollectionListPage from "../../components/CollectionListPage/CollectionListPage";
import { useCollectionBulkDelete } from "../../mutations";
import { useCollectionListQuery } from "../../queries";
import {
  collectionAddUrl,
  collectionListUrl,
  CollectionListUrlDialog,
  CollectionListUrlQueryParams,
  collectionUrl
} from "../../urls";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface CollectionListProps {
  params: CollectionListUrlQueryParams;
}

export const CollectionList: React.FC<CollectionListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.COLLECTION_LIST
  );
  const intl = useIntl();

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params)
    }),
    [params]
  );
  const { data, loading, refetch } = useCollectionListQuery({
    displayLoader: true,
    variables: queryVariables
  });

  const [
    collectionBulkDelete,
    collectionBulkDeleteOpts
  ] = useCollectionBulkDelete({
    onCompleted: data => {
      if (data.collectionBulkDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        refetch();
        reset();
        closeModal();
      }
    }
  });

  const { availableChannels, channel } = useAppChannel();

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab === undefined
      ? areFiltersApplied(params)
        ? tabs.length + 1
        : 0
      : parseInt(params.activeTab, 0);

  const handleSearchChange = (query: string) => {
    navigate(
      collectionListUrl({
        ...getActiveFilters(params),
        activeTab: undefined,
        query
      })
    );
  };

  const [openModal, closeModal] = createDialogActionHandlers<
    CollectionListUrlDialog,
    CollectionListUrlQueryParams
  >(navigate, collectionListUrl, params);

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      collectionListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );
  };

  const handleTabDelete = () => {
    deleteFilterTab(currentTab);
    reset();
    navigate(collectionListUrl());
  };

  const handleTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    maybe(() => data.collections.pageInfo),
    paginationState,
    params
  );

  const handleSort = createSortHandler(navigate, collectionListUrl, params);

  return (
    <>
      <CollectionListPage
        currentTab={currentTab}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onAdd={() => navigate(collectionAddUrl())}
        onAll={() => navigate(collectionListUrl())}
        onTabChange={handleTabChange}
        onTabDelete={() => openModal("delete-search")}
        onTabSave={() => openModal("save-search")}
        tabs={tabs.map(tab => tab.name)}
        disabled={loading}
        collections={maybe(() => data.collections.edges.map(edge => edge.node))}
        settings={settings}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
        onSort={handleSort}
        onUpdateListSettings={updateListSettings}
        pageInfo={pageInfo}
        sort={getSortParams(params)}
        onRowClick={id => () => navigate(collectionUrl(id))}
        toolbar={
          <IconButton
            color="primary"
            onClick={() =>
              openModal("remove", {
                ids: listElements
              })
            }
          >
            <DeleteIcon />
          </IconButton>
        }
        isChecked={isSelected}
        selected={listElements.length}
        toggle={toggle}
        toggleAll={toggleAll}
        channelsCount={availableChannels?.length}
        selectedChannelId={channel.id}
      />
      <ActionDialog
        open={params.action === "remove" && maybe(() => params.ids.length > 0)}
        onClose={closeModal}
        confirmButtonState={collectionBulkDeleteOpts.status}
        onConfirm={() =>
          collectionBulkDelete({
            variables: {
              ids: params.ids
            }
          })
        }
        variant="delete"
        title={intl.formatMessage({
          defaultMessage: "Delete collections",
          description: "dialog title"
        })}
      >
        <DialogContentText>
          <FormattedMessage
            defaultMessage="{counter,plural,one{Are you sure you want to delete this collection?} other{Are you sure you want to delete {displayQuantity} collections?}}"
            values={{
              counter: maybe(() => params.ids.length),
              displayQuantity: <strong>{maybe(() => params.ids.length)}</strong>
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <SaveFilterTabDialog
        open={params.action === "save-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={handleTabSave}
      />
      <DeleteFilterTabDialog
        open={params.action === "delete-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={handleTabDelete}
        tabName={maybe(() => tabs[currentTab - 1].name, "...")}
      />
    </>
  );
};
export default CollectionList;
