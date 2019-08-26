import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import useShop from "@saleor/hooks/useShop";
import { commonMessages, sectionNames } from "@saleor/intl";
import { getMutationState, maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import SaleListPage from "../components/SaleListPage";
import { TypedSaleBulkDelete } from "../mutations";
import { TypedSaleList } from "../queries";
import { SaleBulkDelete } from "../types/SaleBulkDelete";
import {
  saleAddUrl,
  saleListUrl,
  SaleListUrlQueryParams,
  saleUrl
} from "../urls";

interface SaleListProps {
  params: SaleListUrlQueryParams;
}

export const SaleList: React.StatelessComponent<SaleListProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const shop = useShop();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.SALES_LIST
  );
  const intl = useIntl();

  const closeModal = () => navigate(saleListUrl(), true);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const canOpenBulkActionDialog = maybe(() => params.ids.length > 0);

  return (
    <TypedSaleList displayLoader variables={paginationState}>
      {({ data, loading, refetch }) => {
        const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
          maybe(() => data.sales.pageInfo),
          paginationState,
          params
        );

        const handleSaleBulkDelete = (data: SaleBulkDelete) => {
          if (data.saleBulkDelete.errors.length === 0) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            reset();
            closeModal();
            refetch();
          }
        };

        return (
          <TypedSaleBulkDelete onCompleted={handleSaleBulkDelete}>
            {(saleBulkDelete, saleBulkDeleteOpts) => {
              const bulkRemoveTransitionState = getMutationState(
                saleBulkDeleteOpts.called,
                saleBulkDeleteOpts.loading,
                maybe(() => saleBulkDeleteOpts.data.saleBulkDelete.errors)
              );
              const onSaleBulkDelete = () =>
                saleBulkDelete({
                  variables: {
                    ids: params.ids
                  }
                });

              return (
                <>
                  <WindowTitle title={intl.formatMessage(sectionNames.sales)} />
                  <SaleListPage
                    defaultCurrency={maybe(() => shop.defaultCurrency)}
                    sales={maybe(() => data.sales.edges.map(edge => edge.node))}
                    settings={settings}
                    disabled={loading}
                    pageInfo={pageInfo}
                    onAdd={() => navigate(saleAddUrl)}
                    onNextPage={loadNextPage}
                    onPreviousPage={loadPreviousPage}
                    onUpdateListSettings={updateListSettings}
                    onRowClick={id => () => navigate(saleUrl(id))}
                    isChecked={isSelected}
                    selected={listElements.length}
                    toggle={toggle}
                    toggleAll={toggleAll}
                    toolbar={
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(
                            saleListUrl({
                              action: "remove",
                              ids: listElements
                            })
                          )
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  />
                  <ActionDialog
                    confirmButtonState={bulkRemoveTransitionState}
                    onClose={closeModal}
                    onConfirm={onSaleBulkDelete}
                    open={params.action === "remove" && canOpenBulkActionDialog}
                    title={intl.formatMessage({
                      defaultMessage: "Delete Sales",
                      description: "dialog header"
                    })}
                    variant="delete"
                  >
                    {canOpenBulkActionDialog && (
                      <DialogContentText>
                        <FormattedMessage
                          defaultMessage="Are you sure you want to delete {counter, plural,
                                    one {this sale}
                                    other {{displayQuantity} sales}
                                  }?"
                          description="dialog content"
                          values={{
                            counter: params.ids.length,
                            displayQuantity: (
                              <strong>{params.ids.length}</strong>
                            )
                          }}
                        />
                      </DialogContentText>
                    )}
                  </ActionDialog>
                </>
              );
            }}
          </TypedSaleBulkDelete>
        );
      }}
    </TypedSaleList>
  );
};
export default SaleList;
