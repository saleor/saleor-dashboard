import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { useIntl } from "react-intl";

import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab
} from "@saleor/attributes/views/AttributeList/filters";
import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData
} from "@saleor/components/SaveFilterTabDialog";
import { configurationMenuUrl } from "@saleor/configuration";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { PAGINATE_BY } from "../../../config";
import useBulkActions from "../../../hooks/useBulkActions";
import { getMutationState, maybe } from "../../../misc";
import AttributeBulkDeleteDialog from "../../components/AttributeBulkDeleteDialog";
import AttributeListPage from "../../components/AttributeListPage";
import { AttributeBulkDeleteMutation } from "../../mutations";
import { AttributeListQuery } from "../../queries";
import { AttributeBulkDelete } from "../../types/AttributeBulkDelete";
import {
  attributeAddUrl,
  attributeListUrl,
  AttributeListUrlDialog,
  AttributeListUrlFilters,
  AttributeListUrlQueryParams,
  attributeUrl
} from "../../urls";

interface AttributeListProps {
  params: AttributeListUrlQueryParams;
}

const AttributeList: React.FC<AttributeListProps> = ({ params }) => {
  const navigate = useNavigator();
  const paginate = usePaginator();
  const notify = useNotifier();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const intl = useIntl();

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab === undefined
      ? areFiltersApplied(params)
        ? tabs.length + 1
        : 0
      : parseInt(params.activeTab, 0);

  const closeModal = () =>
    navigate(
      attributeListUrl({
        ...params,
        action: undefined,
        ids: undefined
      }),
      true
    );

  const openModal = (action: AttributeListUrlDialog, ids?: string[]) =>
    navigate(
      attributeListUrl({
        ...params,
        action,
        ids
      })
    );

  const changeFilterField = (filter: AttributeListUrlFilters) => {
    reset();
    navigate(
      attributeListUrl({
        ...getActiveFilters(params),
        ...filter,
        activeTab: undefined
      })
    );
  };

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      attributeListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );
  };

  const handleTabDelete = () => {
    deleteFilterTab(currentTab);
    reset();
    navigate(attributeListUrl());
  };

  const handleTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  const paginationState = createPaginationState(PAGINATE_BY, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params)
    }),
    [params]
  );

  return (
    <AttributeListQuery variables={queryVariables}>
      {({ data, loading, refetch }) => {
        const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
          maybe(() => data.attributes.pageInfo),
          paginationState,
          params
        );

        const handleBulkDelete = (data: AttributeBulkDelete) => {
          if (data.attributeBulkDelete.errors.length === 0) {
            closeModal();
            notify({
              text: intl.formatMessage({
                defaultMessage: "Attributes successfully delete",
                description: "deleted multiple attributes"
              })
            });
            reset();
            refetch();
          }
        };

        return (
          <AttributeBulkDeleteMutation onCompleted={handleBulkDelete}>
            {(attributeBulkDelete, attributeBulkDeleteOpts) => {
              const bulkDeleteMutationState = getMutationState(
                attributeBulkDeleteOpts.called,
                attributeBulkDeleteOpts.loading,
                maybe(
                  () => attributeBulkDeleteOpts.data.attributeBulkDelete.errors
                )
              );

              return (
                <>
                  <AttributeListPage
                    attributes={maybe(() =>
                      data.attributes.edges.map(edge => edge.node)
                    )}
                    currentTab={currentTab}
                    disabled={loading || attributeBulkDeleteOpts.loading}
                    initialSearch={params.query || ""}
                    isChecked={isSelected}
                    onAdd={() => navigate(attributeAddUrl())}
                    onAll={() => navigate(attributeListUrl())}
                    onBack={() => navigate(configurationMenuUrl)}
                    onNextPage={loadNextPage}
                    onPreviousPage={loadPreviousPage}
                    onRowClick={id => () => navigate(attributeUrl(id))}
                    onSearchChange={query => changeFilterField({ query })}
                    onTabChange={handleTabChange}
                    onTabDelete={() => openModal("delete-search")}
                    onTabSave={() => openModal("save-search")}
                    pageInfo={pageInfo}
                    selected={listElements.length}
                    tabs={tabs.map(tab => tab.name)}
                    toggle={toggle}
                    toggleAll={toggleAll}
                    toolbar={
                      <IconButton
                        color="primary"
                        onClick={() => openModal("remove", listElements)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  />
                  <AttributeBulkDeleteDialog
                    confirmButtonState={bulkDeleteMutationState}
                    open={
                      params.action === "remove" &&
                      maybe(() => params.ids.length > 0)
                    }
                    onConfirm={() =>
                      attributeBulkDelete({ variables: { ids: params.ids } })
                    }
                    onClose={closeModal}
                    quantity={maybe(() => params.ids.length)}
                  />
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
            }}
          </AttributeBulkDeleteMutation>
        );
      }}
    </AttributeListQuery>
  );
};
AttributeList.displayName = "AttributeList";

export default AttributeList;
