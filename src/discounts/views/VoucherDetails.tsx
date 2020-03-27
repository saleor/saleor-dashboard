import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import AssignCategoriesDialog from "@saleor/components/AssignCategoryDialog";
import AssignCollectionDialog from "@saleor/components/AssignCollectionDialog";
import AssignProductDialog from "@saleor/components/AssignProductDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, PAGINATE_BY } from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import useShop from "@saleor/hooks/useShop";
import { commonMessages, sectionNames } from "@saleor/intl";
import useCategorySearch from "@saleor/searches/useCategorySearch";
import useCollectionSearch from "@saleor/searches/useCollectionSearch";
import useProductSearch from "@saleor/searches/useProductSearch";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { categoryUrl } from "../../categories/urls";
import { collectionUrl } from "../../collections/urls";
import { decimal, joinDateTime, maybe } from "../../misc";
import { productUrl } from "../../products/urls";
import {
  DiscountValueTypeEnum,
  VoucherTypeEnum
} from "../../types/globalTypes";
import DiscountCountrySelectDialog from "../components/DiscountCountrySelectDialog";
import VoucherDetailsPage, {
  VoucherDetailsPageTab
} from "../components/VoucherDetailsPage";
import {
  TypedVoucherCataloguesAdd,
  TypedVoucherCataloguesRemove,
  TypedVoucherDelete,
  TypedVoucherUpdate
} from "../mutations";
import { TypedVoucherDetails } from "../queries";
import { RequirementsPicker } from "../types";
import { VoucherCataloguesAdd } from "../types/VoucherCataloguesAdd";
import { VoucherCataloguesRemove } from "../types/VoucherCataloguesRemove";
import { VoucherDelete } from "../types/VoucherDelete";
import { VoucherUpdate } from "../types/VoucherUpdate";
import {
  voucherListUrl,
  voucherUrl,
  VoucherUrlQueryParams,
  VoucherUrlDialog
} from "../urls";

interface VoucherDetailsProps {
  id: string;
  params: VoucherUrlQueryParams;
}

export const VoucherDetails: React.FC<VoucherDetailsProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const paginate = usePaginator();
  const notify = useNotifier();
  const shop = useShop();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const intl = useIntl();
  const {
    search: searchCategories,
    result: searchCategoriesOpts
  } = useCategorySearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const {
    search: searchCollections,
    result: searchCollectionsOpts
  } = useCollectionSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const {
    search: searchProducts,
    result: searchProductsOpts
  } = useProductSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const paginationState = createPaginationState(PAGINATE_BY, params);
  const changeTab = (tab: VoucherDetailsPageTab) => {
    reset();
    navigate(
      voucherUrl(id, {
        activeTab: tab
      })
    );
  };

  const handleVoucherDelete = (data: VoucherDelete) => {
    if (data.voucherDelete.errors.length === 0) {
      notify({
        text: intl.formatMessage({
          defaultMessage: "Deleted voucher"
        })
      });
      navigate(voucherListUrl(), true);
    }
  };

  const handleVoucherUpdate = (data: VoucherUpdate) => {
    if (data.voucherUpdate.errors.length === 0) {
      closeModal();
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
    }
  };

  const [openModal, closeModal] = createDialogActionHandlers<
    VoucherUrlDialog,
    VoucherUrlQueryParams
  >(navigate, params => voucherUrl(id, params), params);

  const handleCatalogueAdd = (data: VoucherCataloguesAdd) => {
    if (data.voucherCataloguesAdd.errors.length === 0) {
      closeModal();
    }
  };

  const handleCatalogueRemove = (data: VoucherCataloguesRemove) => {
    if (data.voucherCataloguesRemove.errors.length === 0) {
      closeModal();
      reset();
    }
  };

  const canOpenBulkActionDialog = maybe(() => params.ids.length > 0);

  return (
    <TypedVoucherCataloguesRemove onCompleted={handleCatalogueRemove}>
      {(voucherCataloguesRemove, voucherCataloguesRemoveOpts) => (
        <TypedVoucherCataloguesAdd onCompleted={handleCatalogueAdd}>
          {(voucherCataloguesAdd, voucherCataloguesAddOpts) => (
            <TypedVoucherUpdate onCompleted={handleVoucherUpdate}>
              {(voucherUpdate, voucherUpdateOpts) => (
                <TypedVoucherDelete onCompleted={handleVoucherDelete}>
                  {(voucherDelete, voucherDeleteOpts) => (
                    <TypedVoucherDetails
                      displayLoader
                      variables={{ id, ...paginationState }}
                    >
                      {({ data, loading }) => {
                        const tabPageInfo =
                          params.activeTab === VoucherDetailsPageTab.categories
                            ? maybe(() => data.voucher.categories.pageInfo)
                            : params.activeTab ===
                              VoucherDetailsPageTab.collections
                            ? maybe(() => data.voucher.collections.pageInfo)
                            : maybe(() => data.voucher.products.pageInfo);

                        const handleCategoriesUnassign = (ids: string[]) =>
                          voucherCataloguesRemove({
                            variables: {
                              ...paginationState,
                              id,
                              input: {
                                categories: ids
                              }
                            }
                          });

                        const handleCollectionsUnassign = (ids: string[]) =>
                          voucherCataloguesRemove({
                            variables: {
                              ...paginationState,
                              id,
                              input: {
                                collections: ids
                              }
                            }
                          });

                        const handleProductsUnassign = (ids: string[]) =>
                          voucherCataloguesRemove({
                            variables: {
                              ...paginationState,
                              id,
                              input: {
                                products: ids
                              }
                            }
                          });

                        const {
                          loadNextPage,
                          loadPreviousPage,
                          pageInfo
                        } = paginate(tabPageInfo, paginationState, params);

                        return (
                          <>
                            <WindowTitle
                              title={intl.formatMessage(sectionNames.vouchers)}
                            />
                            <VoucherDetailsPage
                              defaultCurrency={maybe(
                                () => shop.defaultCurrency
                              )}
                              voucher={maybe(() => data.voucher)}
                              disabled={
                                loading || voucherCataloguesRemoveOpts.loading
                              }
                              errors={
                                voucherUpdateOpts.data?.voucherUpdate.errors ||
                                []
                              }
                              pageInfo={pageInfo}
                              onNextPage={loadNextPage}
                              onPreviousPage={loadPreviousPage}
                              onCategoryAssign={() =>
                                openModal("assign-category")
                              }
                              onCategoryClick={id => () =>
                                navigate(categoryUrl(id))}
                              onCollectionAssign={() =>
                                openModal("assign-collection")
                              }
                              onCollectionUnassign={collectionId =>
                                voucherCataloguesRemove({
                                  variables: {
                                    ...paginationState,
                                    id,
                                    input: {
                                      collections: [collectionId]
                                    }
                                  }
                                })
                              }
                              onCountryAssign={() =>
                                openModal("assign-country")
                              }
                              onCountryUnassign={countryCode =>
                                voucherUpdate({
                                  variables: {
                                    ...paginationState,
                                    id,
                                    input: {
                                      countries: data.voucher.countries
                                        .filter(
                                          country =>
                                            country.code !== countryCode
                                        )
                                        .map(country => country.code)
                                    }
                                  }
                                })
                              }
                              onCategoryUnassign={categoryId =>
                                voucherCataloguesRemove({
                                  variables: {
                                    ...paginationState,
                                    id,
                                    input: {
                                      categories: [categoryId]
                                    }
                                  }
                                })
                              }
                              onCollectionClick={id => () =>
                                navigate(collectionUrl(id))}
                              onProductAssign={() =>
                                openModal("assign-product")
                              }
                              onProductUnassign={productId =>
                                voucherCataloguesRemove({
                                  variables: {
                                    ...paginationState,
                                    id,
                                    input: {
                                      products: [productId]
                                    }
                                  }
                                })
                              }
                              onProductClick={id => () =>
                                navigate(productUrl(id))}
                              activeTab={params.activeTab}
                              onBack={() => navigate(voucherListUrl())}
                              onTabClick={changeTab}
                              onSubmit={formData =>
                                voucherUpdate({
                                  variables: {
                                    id,
                                    input: {
                                      applyOncePerCustomer:
                                        formData.applyOncePerCustomer,
                                      applyOncePerOrder:
                                        formData.applyOncePerOrder,
                                      discountValue:
                                        formData.discountType.toString() ===
                                        "SHIPPING"
                                          ? 100
                                          : decimal(formData.value),
                                      discountValueType:
                                        formData.discountType.toString() ===
                                        "SHIPPING"
                                          ? DiscountValueTypeEnum.PERCENTAGE
                                          : formData.discountType,
                                      endDate: formData.hasEndDate
                                        ? joinDateTime(
                                            formData.endDate,
                                            formData.endTime
                                          )
                                        : null,
                                      minAmountSpent:
                                        formData.requirementsPicker !==
                                        RequirementsPicker.ORDER
                                          ? 0
                                          : parseFloat(formData.minSpent),
                                      minCheckoutItemsQuantity:
                                        formData.requirementsPicker !==
                                        RequirementsPicker.ITEM
                                          ? 0
                                          : parseFloat(
                                              formData.minCheckoutItemsQuantity
                                            ),
                                      startDate: joinDateTime(
                                        formData.startDate,
                                        formData.startTime
                                      ),
                                      type:
                                        formData.discountType.toString() ===
                                        "SHIPPING"
                                          ? VoucherTypeEnum.SHIPPING
                                          : formData.type,
                                      usageLimit: formData.hasUsageLimit
                                        ? parseInt(formData.usageLimit, 10)
                                        : null
                                    }
                                  }
                                })
                              }
                              onRemove={() => openModal("remove")}
                              saveButtonBarState={voucherUpdateOpts.status}
                              categoryListToolbar={
                                <Button
                                  color="primary"
                                  onClick={() =>
                                    openModal("unassign-category", {
                                      ids: listElements
                                    })
                                  }
                                >
                                  <FormattedMessage
                                    defaultMessage="Unassign"
                                    description="unassign category from voucher, button"
                                    id="voucherDetailsUnassignCategory"
                                  />
                                </Button>
                              }
                              collectionListToolbar={
                                <Button
                                  color="primary"
                                  onClick={() =>
                                    openModal("unassign-collection", {
                                      ids: listElements
                                    })
                                  }
                                >
                                  <FormattedMessage
                                    defaultMessage="Unassign"
                                    description="unassign collection from voucher, button"
                                    id="voucherDetailsUnassignCollection"
                                  />
                                </Button>
                              }
                              productListToolbar={
                                <Button
                                  color="primary"
                                  onClick={() =>
                                    openModal("unassign-product", {
                                      ids: listElements
                                    })
                                  }
                                >
                                  <FormattedMessage
                                    defaultMessage="Unassign"
                                    description="unassign product from voucher, button"
                                    id="voucherDetailsUnassignProduct"
                                  />
                                </Button>
                              }
                              isChecked={isSelected}
                              selected={listElements.length}
                              toggle={toggle}
                              toggleAll={toggleAll}
                            />
                            <AssignCategoriesDialog
                              categories={maybe(() =>
                                searchCategoriesOpts.data.search.edges
                                  .map(edge => edge.node)
                                  .filter(
                                    suggestedCategory => suggestedCategory.id
                                  )
                              )}
                              confirmButtonState={
                                voucherCataloguesAddOpts.status
                              }
                              open={params.action === "assign-category"}
                              onFetch={searchCategories}
                              loading={searchCategoriesOpts.loading}
                              onClose={closeModal}
                              onSubmit={categories =>
                                voucherCataloguesAdd({
                                  variables: {
                                    ...paginationState,
                                    id,
                                    input: {
                                      categories: categories.map(
                                        product => product.id
                                      )
                                    }
                                  }
                                })
                              }
                            />
                            <AssignCollectionDialog
                              collections={maybe(() =>
                                searchCollectionsOpts.data.search.edges
                                  .map(edge => edge.node)
                                  .filter(
                                    suggestedCategory => suggestedCategory.id
                                  )
                              )}
                              confirmButtonState={
                                voucherCataloguesAddOpts.status
                              }
                              open={params.action === "assign-collection"}
                              onFetch={searchCollections}
                              loading={searchCollectionsOpts.loading}
                              onClose={closeModal}
                              onSubmit={collections =>
                                voucherCataloguesAdd({
                                  variables: {
                                    ...paginationState,
                                    id,
                                    input: {
                                      collections: collections.map(
                                        product => product.id
                                      )
                                    }
                                  }
                                })
                              }
                            />
                            <DiscountCountrySelectDialog
                              confirmButtonState={voucherUpdateOpts.status}
                              countries={maybe(() => shop.countries, [])}
                              onClose={() => navigate(voucherUrl(id))}
                              onConfirm={formData =>
                                voucherUpdate({
                                  variables: {
                                    id,
                                    input: {
                                      countries: formData.countries
                                    }
                                  }
                                })
                              }
                              open={params.action === "assign-country"}
                              initial={maybe(
                                () =>
                                  data.voucher.countries.map(
                                    country => country.code
                                  ),
                                []
                              )}
                            />
                            <AssignProductDialog
                              confirmButtonState={
                                voucherCataloguesAddOpts.status
                              }
                              open={params.action === "assign-product"}
                              onFetch={searchProducts}
                              loading={searchProductsOpts.loading}
                              onClose={closeModal}
                              onSubmit={products =>
                                voucherCataloguesAdd({
                                  variables: {
                                    ...paginationState,
                                    id,
                                    input: {
                                      products: products.map(
                                        product => product.id
                                      )
                                    }
                                  }
                                })
                              }
                              products={maybe(() =>
                                searchProductsOpts.data.search.edges
                                  .map(edge => edge.node)
                                  .filter(
                                    suggestedProduct => suggestedProduct.id
                                  )
                              )}
                            />
                            <ActionDialog
                              open={
                                params.action === "unassign-category" &&
                                canOpenBulkActionDialog
                              }
                              title={intl.formatMessage({
                                defaultMessage:
                                  "Unassign Categories From Voucher",
                                description: "dialog header"
                              })}
                              confirmButtonState={
                                voucherCataloguesRemoveOpts.status
                              }
                              onClose={closeModal}
                              onConfirm={() =>
                                handleCategoriesUnassign(params.ids)
                              }
                            >
                              {canOpenBulkActionDialog && (
                                <DialogContentText>
                                  <FormattedMessage
                                    defaultMessage="{counter,plural,one{Are you sure you want to unassign this category?} other{Are you sure you want to unassign {displayQuantity} categories?}}"
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
                            <ActionDialog
                              open={
                                params.action === "unassign-collection" &&
                                canOpenBulkActionDialog
                              }
                              title={intl.formatMessage({
                                defaultMessage:
                                  "Unassign Collections From Voucher",
                                description: "dialog header"
                              })}
                              confirmButtonState={
                                voucherCataloguesRemoveOpts.status
                              }
                              onClose={closeModal}
                              onConfirm={() =>
                                handleCollectionsUnassign(params.ids)
                              }
                            >
                              {canOpenBulkActionDialog && (
                                <DialogContentText>
                                  <FormattedMessage
                                    defaultMessage="{counter,plural,one{Are you sure you want to unassign this collection?} other{Are you sure you want to unassign {displayQuantity} collections?}}"
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
                            <ActionDialog
                              open={
                                params.action === "unassign-product" &&
                                canOpenBulkActionDialog
                              }
                              title={intl.formatMessage({
                                defaultMessage:
                                  "Unassign Products From Voucher",
                                description: "dialog header"
                              })}
                              confirmButtonState={
                                voucherCataloguesRemoveOpts.status
                              }
                              onClose={closeModal}
                              onConfirm={() =>
                                handleProductsUnassign(params.ids)
                              }
                            >
                              {canOpenBulkActionDialog && (
                                <DialogContentText>
                                  <FormattedMessage
                                    defaultMessage="{counter,plural,one{Are you sure you want to unassign this product?} other{Are you sure you want to unassign {displayQuantity} products?}}"
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
                            <ActionDialog
                              open={params.action === "remove"}
                              title={intl.formatMessage({
                                defaultMessage: "Delete Voucher",
                                description: "dialog header"
                              })}
                              confirmButtonState={voucherDeleteOpts.status}
                              onClose={closeModal}
                              variant="delete"
                              onConfirm={() =>
                                voucherDelete({
                                  variables: { id }
                                })
                              }
                            >
                              <DialogContentText>
                                <FormattedMessage
                                  defaultMessage="Are you sure you want to delete {voucherCode}?"
                                  description="dialog content"
                                  values={{
                                    voucherCode: (
                                      <strong>
                                        {maybe(() => data.voucher.code, "...")}
                                      </strong>
                                    )
                                  }}
                                />
                              </DialogContentText>
                            </ActionDialog>
                          </>
                        );
                      }}
                    </TypedVoucherDetails>
                  )}
                </TypedVoucherDelete>
              )}
            </TypedVoucherUpdate>
          )}
        </TypedVoucherCataloguesAdd>
      )}
    </TypedVoucherCataloguesRemove>
  );
};
export default VoucherDetails;
