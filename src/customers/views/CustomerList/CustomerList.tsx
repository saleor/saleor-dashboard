import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
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
import { getMutationState, maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import CustomerListPage from "../../components/CustomerListPage";
import { TypedBulkRemoveCustomers } from "../../mutations";
import { TypedCustomerListQuery } from "../../queries";
import { BulkRemoveCustomers } from "../../types/BulkRemoveCustomers";
import {
  customerAddUrl,
  customerListUrl,
  CustomerListUrlDialog,
  CustomerListUrlFilters,
  CustomerListUrlQueryParams,
  customerUrl
} from "../../urls";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab
} from "./filter";

interface CustomerListProps {
  params: CustomerListUrlQueryParams;
}

export const CustomerList: React.StatelessComponent<CustomerListProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.CUSTOMER_LIST
  );
  const intl = useIntl();

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab === undefined
      ? areFiltersApplied(params)
        ? tabs.length + 1
        : 0
      : parseInt(params.activeTab, 0);

  const changeFilterField = (filter: CustomerListUrlFilters) => {
    reset();
    navigate(
      customerListUrl({
        ...getActiveFilters(params),
        ...filter,
        activeTab: undefined
      })
    );
  };

  const closeModal = () =>
    navigate(
      customerListUrl({
        ...params,
        action: undefined,
        ids: undefined
      }),
      true
    );

  const openModal = (action: CustomerListUrlDialog, ids?: string[]) =>
    navigate(
      customerListUrl({
        ...params,
        action,
        ids
      })
    );

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      customerListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );
  };

  const handleTabDelete = () => {
    deleteFilterTab(currentTab);
    reset();
    navigate(customerListUrl());
  };

  const handleTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params)
    }),
    [params]
  );

  return (
    <TypedCustomerListQuery displayLoader variables={queryVariables}>
      {({ data, loading, refetch }) => {
        const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
          maybe(() => data.customers.pageInfo),
          paginationState,
          params
        );

        const handleBulkCustomerDelete = (data: BulkRemoveCustomers) => {
          if (data.customerBulkDelete.errors.length === 0) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            reset();
            refetch();
            closeModal();
          }
        };

        return (
          <TypedBulkRemoveCustomers onCompleted={handleBulkCustomerDelete}>
            {(bulkRemoveCustomers, bulkRemoveCustomersOpts) => {
              const removeTransitionState = getMutationState(
                bulkRemoveCustomersOpts.called,
                bulkRemoveCustomersOpts.loading,
                maybe(
                  () => bulkRemoveCustomersOpts.data.customerBulkDelete.errors
                )
              );

              return (
                <>
                  <CustomerListPage
                    currentTab={currentTab}
                    initialSearch={params.query || ""}
                    onSearchChange={query => changeFilterField({ query })}
                    onAll={() => navigate(customerListUrl())}
                    onTabChange={handleTabChange}
                    onTabDelete={() => openModal("delete-search")}
                    onTabSave={() => openModal("save-search")}
                    tabs={tabs.map(tab => tab.name)}
                    customers={maybe(() =>
                      data.customers.edges.map(edge => edge.node)
                    )}
                    settings={settings}
                    disabled={loading}
                    pageInfo={pageInfo}
                    onAdd={() => navigate(customerAddUrl)}
                    onNextPage={loadNextPage}
                    onPreviousPage={loadPreviousPage}
                    onUpdateListSettings={updateListSettings}
                    onRowClick={id => () => navigate(customerUrl(id))}
                    toolbar={
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(
                            customerListUrl({
                              action: "remove",
                              ids: listElements
                            })
                          )
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                    isChecked={isSelected}
                    selected={listElements.length}
                    toggle={toggle}
                    toggleAll={toggleAll}
                  />
                  <ActionDialog
                    open={
                      params.action === "remove" &&
                      maybe(() => params.ids.length > 0)
                    }
                    onClose={closeModal}
                    confirmButtonState={removeTransitionState}
                    onConfirm={() =>
                      bulkRemoveCustomers({
                        variables: {
                          ids: params.ids
                        }
                      })
                    }
                    variant="delete"
                    title={intl.formatMessage({
                      defaultMessage: "Delete Customers",
                      description: "dialog header"
                    })}
                  >
                    <DialogContentText>
                      <FormattedMessage
                        defaultMessage="Are you sure you want to delete {counter, plural,
                          one {this customer}
                          other {{displayQuantity} customers}
                        }?"
                        values={{
                          counter: maybe(() => params.ids.length),
                          displayQuantity: (
                            <strong>{maybe(() => params.ids.length)}</strong>
                          )
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
            }}
          </TypedBulkRemoveCustomers>
        );
      }}
    </TypedCustomerListQuery>
  );
};
export default CustomerList;
