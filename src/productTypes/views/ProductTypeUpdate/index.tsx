import Button from "@material-ui/core/Button";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { attributeUrl } from "@saleor/attributes/urls";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { getMutationState, maybe } from "@saleor/misc";
import AssignAttributeDialog from "@saleor/productTypes/components/AssignAttributeDialog";
import { ReorderEvent } from "@saleor/types";
import { AttributeTypeEnum } from "@saleor/types/globalTypes";
import ProductTypeAttributeUnassignDialog from "../../components/ProductTypeAttributeUnassignDialog";
import ProductTypeBulkAttributeUnassignDialog from "../../components/ProductTypeBulkAttributeUnassignDialog";
import ProductTypeDeleteDialog from "../../components/ProductTypeDeleteDialog";
import ProductTypeDetailsPage, {
  ProductTypeForm
} from "../../components/ProductTypeDetailsPage";
import ProductTypeOperations from "../../containers/ProductTypeOperations";
import SearchAttributes from "../../containers/SearchAttributes";
import { TypedProductTypeDetailsQuery } from "../../queries";
import { AssignAttribute } from "../../types/AssignAttribute";
import { ProductTypeDelete } from "../../types/ProductTypeDelete";
import { ProductTypeUpdate as ProductTypeUpdateMutation } from "../../types/ProductTypeUpdate";
import { UnassignAttribute } from "../../types/UnassignAttribute";
import {
  productTypeListUrl,
  productTypeUrl,
  ProductTypeUrlQueryParams
} from "../../urls";
import { ProductTypeUpdateErrors } from "./errors";

interface ProductTypeUpdateProps {
  id: string;
  params: ProductTypeUrlQueryParams;
}

export const ProductTypeUpdate: React.FC<ProductTypeUpdateProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const productAttributeListActions = useBulkActions();
  const variantAttributeListActions = useBulkActions();
  const intl = useIntl();

  return (
    <ProductTypeUpdateErrors>
      {({ errors, set: setErrors }) => (
        <TypedProductTypeDetailsQuery
          displayLoader
          variables={{ id }}
          require={["productType"]}
        >
          {({ data, loading: dataLoading }) => {
            const closeModal = () => navigate(productTypeUrl(id), true);

            const handleAttributeAssignSuccess = (data: AssignAttribute) => {
              if (data.attributeAssign.errors.length === 0) {
                notify({
                  text: intl.formatMessage(commonMessages.savedChanges)
                });
                closeModal();
              } else if (
                data.attributeAssign.errors !== null &&
                data.attributeAssign.errors.length > 0
              ) {
                setErrors.addAttributeErrors(data.attributeAssign.errors);
              }
            };
            const handleAttributeUnassignSuccess = (
              data: UnassignAttribute
            ) => {
              if (data.attributeUnassign.errors.length === 0) {
                notify({
                  text: intl.formatMessage(commonMessages.savedChanges)
                });
                closeModal();
                productAttributeListActions.reset();
                variantAttributeListActions.reset();
              }
            };
            const handleProductTypeDeleteSuccess = (
              deleteData: ProductTypeDelete
            ) => {
              if (deleteData.productTypeDelete.errors.length === 0) {
                notify({
                  text: intl.formatMessage({
                    defaultMessage: "Product type deleted"
                  })
                });
                navigate(productTypeListUrl(), true);
              }
            };
            const handleProductTypeUpdateSuccess = (
              updateData: ProductTypeUpdateMutation
            ) => {
              if (
                !updateData.productTypeUpdate.errors ||
                updateData.productTypeUpdate.errors.length === 0
              ) {
                notify({
                  text: intl.formatMessage(commonMessages.savedChanges)
                });
              } else if (
                updateData.productTypeUpdate.errors !== null &&
                updateData.productTypeUpdate.errors.length > 0
              ) {
                setErrors.formErrors(updateData.productTypeUpdate.errors);
              }
            };

            return (
              <ProductTypeOperations
                productType={maybe(() => data.productType)}
                onAssignAttribute={handleAttributeAssignSuccess}
                onUnassignAttribute={handleAttributeUnassignSuccess}
                onProductTypeDelete={handleProductTypeDeleteSuccess}
                onProductTypeUpdate={handleProductTypeUpdateSuccess}
                onProductTypeAttributeReorder={() => undefined}
              >
                {({
                  assignAttribute,
                  deleteProductType,
                  unassignAttribute,
                  updateProductType,
                  reorderAttribute
                }) => {
                  const handleProductTypeDelete = () =>
                    deleteProductType.mutate({ id });
                  const handleProductTypeUpdate = (
                    formData: ProductTypeForm
                  ) => {
                    updateProductType.mutate({
                      id,
                      input: {
                        hasVariants: formData.hasVariants,
                        isShippingRequired: formData.isShippingRequired,
                        name: formData.name,
                        productAttributes: formData.productAttributes.map(
                          choice => choice.value
                        ),
                        taxCode: formData.taxType,
                        variantAttributes: formData.variantAttributes.map(
                          choice => choice.value
                        ),
                        weight: formData.weight
                      }
                    });
                  };
                  const handleAssignAttribute = () =>
                    assignAttribute.mutate({
                      id,
                      operations: params.ids.map(id => ({
                        id,
                        type: AttributeTypeEnum[params.type]
                      }))
                    });

                  const handleAttributeUnassign = () =>
                    unassignAttribute.mutate({
                      id,
                      ids: [params.id]
                    });

                  const handleBulkAttributeUnassign = () =>
                    unassignAttribute.mutate({
                      id,
                      ids: params.ids
                    });

                  const loading = updateProductType.opts.loading || dataLoading;

                  const assignTransactionState = getMutationState(
                    assignAttribute.opts.called,
                    assignAttribute.opts.loading,
                    maybe(
                      () => assignAttribute.opts.data.attributeAssign.errors
                    )
                  );

                  const unassignTransactionState = getMutationState(
                    unassignAttribute.opts.called,
                    unassignAttribute.opts.loading,
                    maybe(
                      () => unassignAttribute.opts.data.attributeUnassign.errors
                    )
                  );

                  const deleteTransactionState = getMutationState(
                    deleteProductType.opts.called,
                    deleteProductType.opts.loading,
                    maybe(
                      () => deleteProductType.opts.data.productTypeDelete.errors
                    )
                  );

                  const formTransitionState = getMutationState(
                    updateProductType.opts.called,
                    updateProductType.opts.loading,
                    maybe(
                      () => updateProductType.opts.data.productTypeUpdate.errors
                    )
                  );

                  const handleAttributeReorder = (
                    event: ReorderEvent,
                    type: AttributeTypeEnum
                  ) => {
                    const attributes =
                      type === AttributeTypeEnum.PRODUCT
                        ? data.productType.productAttributes
                        : data.productType.variantAttributes;

                    reorderAttribute.mutate({
                      move: {
                        id: attributes[event.oldIndex].id,
                        sortOrder: event.newIndex - event.oldIndex
                      },
                      productTypeId: id,
                      type
                    });
                  };

                  return (
                    <>
                      <WindowTitle title={maybe(() => data.productType.name)} />
                      <ProductTypeDetailsPage
                        defaultWeightUnit={maybe(
                          () => data.shop.defaultWeightUnit
                        )}
                        disabled={loading}
                        errors={errors.formErrors}
                        pageTitle={maybe(() => data.productType.name)}
                        productType={maybe(() => data.productType)}
                        saveButtonBarState={formTransitionState}
                        taxTypes={maybe(() => data.taxTypes, [])}
                        onAttributeAdd={type =>
                          navigate(
                            productTypeUrl(id, {
                              action: "assign-attribute",
                              type
                            })
                          )
                        }
                        onAttributeClick={attributeId =>
                          navigate(attributeUrl(attributeId))
                        }
                        onAttributeReorder={handleAttributeReorder}
                        onAttributeUnassign={attributeId =>
                          navigate(
                            productTypeUrl(id, {
                              action: "unassign-attribute",
                              id: attributeId
                            })
                          )
                        }
                        onBack={() => navigate(productTypeListUrl())}
                        onDelete={() =>
                          navigate(
                            productTypeUrl(id, {
                              action: "remove"
                            })
                          )
                        }
                        onSubmit={handleProductTypeUpdate}
                        productAttributeList={{
                          isChecked: productAttributeListActions.isSelected,
                          selected:
                            productAttributeListActions.listElements.length,
                          toggle: productAttributeListActions.toggle,
                          toggleAll: productAttributeListActions.toggleAll,
                          toolbar: (
                            <Button
                              color="primary"
                              onClick={() =>
                                navigate(
                                  productTypeUrl(id, {
                                    action: "unassign-attributes",
                                    ids:
                                      productAttributeListActions.listElements
                                  })
                                )
                              }
                            >
                              <FormattedMessage
                                defaultMessage="Unassign"
                                description="unassign attribute from product type, button"
                              />
                            </Button>
                          )
                        }}
                        variantAttributeList={{
                          isChecked: variantAttributeListActions.isSelected,
                          selected:
                            variantAttributeListActions.listElements.length,
                          toggle: variantAttributeListActions.toggle,
                          toggleAll: variantAttributeListActions.toggleAll,
                          toolbar: (
                            <Button
                              color="primary"
                              onClick={() =>
                                navigate(
                                  productTypeUrl(id, {
                                    action: "unassign-attributes",
                                    ids:
                                      variantAttributeListActions.listElements
                                  })
                                )
                              }
                            >
                              <FormattedMessage
                                defaultMessage="Unassign"
                                description="unassign attribute from product type, button"
                              />
                            </Button>
                          )
                        }}
                      />
                      {!dataLoading && (
                        <SearchAttributes
                          variables={{
                            first: 15,
                            id,
                            query: ""
                          }}
                        >
                          {({ search, result }) => {
                            const fetchMore = () =>
                              result.loadMore(
                                (prev, next) => {
                                  if (
                                    prev.productType.availableAttributes
                                      .pageInfo.endCursor ===
                                    next.productType.availableAttributes
                                      .pageInfo.endCursor
                                  ) {
                                    return prev;
                                  }
                                  return {
                                    ...prev,
                                    productType: {
                                      ...prev.productType,
                                      availableAttributes: {
                                        ...prev.productType.availableAttributes,
                                        edges: [
                                          ...prev.productType
                                            .availableAttributes.edges,
                                          ...next.productType
                                            .availableAttributes.edges
                                        ],
                                        pageInfo:
                                          next.productType.availableAttributes
                                            .pageInfo
                                      }
                                    }
                                  };
                                },
                                {
                                  after:
                                    result.data.productType.availableAttributes
                                      .pageInfo.endCursor
                                }
                              );

                            return (
                              <>
                                {Object.keys(AttributeTypeEnum).map(key => (
                                  <AssignAttributeDialog
                                    attributes={maybe(() =>
                                      result.data.productType.availableAttributes.edges.map(
                                        edge => edge.node
                                      )
                                    )}
                                    confirmButtonState={assignTransactionState}
                                    errors={maybe(
                                      () =>
                                        assignAttribute.opts.data.attributeAssign.errors.map(
                                          err => err.message
                                        ),
                                      []
                                    )}
                                    loading={result.loading}
                                    onClose={closeModal}
                                    onSubmit={handleAssignAttribute}
                                    onFetch={search}
                                    onFetchMore={fetchMore}
                                    onOpen={result.refetch}
                                    hasMore={maybe(
                                      () =>
                                        result.data.productType
                                          .availableAttributes.pageInfo
                                          .hasNextPage,
                                      false
                                    )}
                                    open={
                                      params.action === "assign-attribute" &&
                                      params.type === AttributeTypeEnum[key]
                                    }
                                    selected={maybe(() => params.ids, [])}
                                    onToggle={attributeId => {
                                      const ids = maybe(() => params.ids, []);
                                      navigate(
                                        productTypeUrl(id, {
                                          ...params,
                                          ids: ids.includes(attributeId)
                                            ? params.ids.filter(
                                                selectedId =>
                                                  selectedId !== attributeId
                                              )
                                            : [...ids, attributeId]
                                        })
                                      );
                                    }}
                                    key={key}
                                  />
                                ))}
                              </>
                            );
                          }}
                        </SearchAttributes>
                      )}
                      <ProductTypeDeleteDialog
                        confirmButtonState={deleteTransactionState}
                        name={maybe(() => data.productType.name, "...")}
                        open={params.action === "remove"}
                        onClose={() => navigate(productTypeUrl(id))}
                        onConfirm={handleProductTypeDelete}
                      />
                      <ProductTypeBulkAttributeUnassignDialog
                        attributeQuantity={maybe(() => params.ids.length)}
                        confirmButtonState={unassignTransactionState}
                        onClose={closeModal}
                        onConfirm={handleBulkAttributeUnassign}
                        open={params.action === "unassign-attributes"}
                        productTypeName={maybe(
                          () => data.productType.name,
                          "..."
                        )}
                      />
                      <ProductTypeAttributeUnassignDialog
                        attributeName={maybe(
                          () =>
                            [
                              ...data.productType.productAttributes,
                              ...data.productType.variantAttributes
                            ].find(attribute => attribute.id === params.id)
                              .name,
                          "..."
                        )}
                        confirmButtonState={unassignTransactionState}
                        onClose={closeModal}
                        onConfirm={handleAttributeUnassign}
                        open={params.action === "unassign-attribute"}
                        productTypeName={maybe(
                          () => data.productType.name,
                          "..."
                        )}
                      />
                    </>
                  );
                }}
              </ProductTypeOperations>
            );
          }}
        </TypedProductTypeDetailsQuery>
      )}
    </ProductTypeUpdateErrors>
  );
};
export default ProductTypeUpdate;
