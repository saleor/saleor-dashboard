import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { commonMessages } from "@saleor/intl";
import { PAGINATE_BY } from "../../config";
import { configurationMenuUrl } from "../../configuration";
import { getMutationState, maybe } from "../../misc";
import ProductTypeListPage from "../components/ProductTypeListPage";
import { TypedProductTypeBulkDeleteMutation } from "../mutations";
import { TypedProductTypeListQuery } from "../queries";
import { ProductTypeBulkDelete } from "../types/ProductTypeBulkDelete";
import {
  productTypeAddUrl,
  productTypeListUrl,
  ProductTypeListUrlQueryParams,
  productTypeUrl
} from "../urls";

interface ProductTypeListProps {
  params: ProductTypeListUrlQueryParams;
}

export const ProductTypeList: React.StatelessComponent<
  ProductTypeListProps
> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const intl = useIntl();

  const closeModal = () => navigate(productTypeListUrl(), true);

  const paginationState = createPaginationState(PAGINATE_BY, params);
  return (
    <TypedProductTypeListQuery displayLoader variables={paginationState}>
      {({ data, loading, refetch }) => {
        const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
          maybe(() => data.productTypes.pageInfo),
          paginationState,
          params
        );

        const handleProductTypeBulkDelete = (data: ProductTypeBulkDelete) => {
          if (data.productTypeBulkDelete.errors.length === 0) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            reset();
            refetch();
            navigate(
              productTypeListUrl({
                ...params,
                action: undefined,
                ids: undefined
              })
            );
          }
        };

        return (
          <TypedProductTypeBulkDeleteMutation
            onCompleted={handleProductTypeBulkDelete}
          >
            {(productTypeBulkDelete, productTypeBulkDeleteOpts) => {
              const bulkRemoveTransitionState = getMutationState(
                productTypeBulkDeleteOpts.called,
                productTypeBulkDeleteOpts.loading,
                maybe(
                  () =>
                    productTypeBulkDeleteOpts.data.productTypeBulkDelete.errors
                )
              );

              const onProductTypeBulkDelete = () =>
                productTypeBulkDelete({
                  variables: {
                    ids: params.ids
                  }
                });
              return (
                <>
                  <ProductTypeListPage
                    disabled={loading}
                    productTypes={maybe(() =>
                      data.productTypes.edges.map(edge => edge.node)
                    )}
                    pageInfo={pageInfo}
                    onAdd={() => navigate(productTypeAddUrl)}
                    onBack={() => navigate(configurationMenuUrl)}
                    onNextPage={loadNextPage}
                    onPreviousPage={loadPreviousPage}
                    onRowClick={id => () => navigate(productTypeUrl(id))}
                    isChecked={isSelected}
                    selected={listElements.length}
                    toggle={toggle}
                    toggleAll={toggleAll}
                    toolbar={
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(
                            productTypeListUrl({
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
                    onConfirm={onProductTypeBulkDelete}
                    open={params.action === "remove"}
                    title={intl.formatMessage({
                      defaultMessage: "Delete Product Types",
                      description: "dialog header"
                    })}
                    variant="delete"
                  >
                    <DialogContentText>
                      <FormattedMessage
                        defaultMessage="Are you sure you want to delete {counter, plural,
            one {this product type}
            other {{displayQuantity} product types}
          }?"
                        description="dialog content"
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
          </TypedProductTypeBulkDeleteMutation>
        );
      }}
    </TypedProductTypeListQuery>
  );
};
ProductTypeList.displayName = "ProductTypeList";
export default ProductTypeList;
