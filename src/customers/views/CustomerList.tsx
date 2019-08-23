import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
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
import CustomerListPage from "../components/CustomerListPage";
import { TypedBulkRemoveCustomers } from "../mutations";
import { TypedCustomerListQuery } from "../queries";
import { BulkRemoveCustomers } from "../types/BulkRemoveCustomers";
import {
  customerAddUrl,
  customerListUrl,
  CustomerListUrlQueryParams,
  customerUrl
} from "../urls";

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

  const closeModal = () =>
    navigate(
      customerListUrl({
        ...params,
        action: undefined,
        ids: undefined
      }),
      true
    );

  const paginationState = createPaginationState(settings.rowNumber, params);

  return (
    <TypedCustomerListQuery displayLoader variables={paginationState}>
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
                      defaultMessage: "Delete customers",
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
