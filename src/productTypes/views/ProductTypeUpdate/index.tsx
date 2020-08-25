import Button from "@material-ui/core/Button";
import { attributeUrl } from "@saleor/attributes/urls";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import AssignAttributeDialog from "@saleor/productTypes/components/AssignAttributeDialog";
import { useProductTypeUpdateMutation } from "@saleor/productTypes/mutations";
import { ReorderEvent } from "@saleor/types";
import { AttributeTypeEnum } from "@saleor/types/globalTypes";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ProductTypeAttributeUnassignDialog from "../../components/ProductTypeAttributeUnassignDialog";
import ProductTypeBulkAttributeUnassignDialog from "../../components/ProductTypeBulkAttributeUnassignDialog";
import ProductTypeDeleteDialog from "../../components/ProductTypeDeleteDialog";
import ProductTypeDetailsPage, {
  ProductTypeForm
} from "../../components/ProductTypeDetailsPage";
import ProductTypeOperations from "../../containers/ProductTypeOperations";
import useAvailableAttributeSearch from "../../hooks/useAvailableAttributeSearch";
import { TypedProductTypeDetailsQuery } from "../../queries";
import { AssignAttribute } from "../../types/AssignAttribute";
import { ProductTypeDelete } from "../../types/ProductTypeDelete";
import { UnassignAttribute } from "../../types/UnassignAttribute";
import {
  productTypeListUrl,
  productTypeUrl,
  ProductTypeUrlQueryParams
} from "../../urls";

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
  const { loadMore, search, result } = useAvailableAttributeSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      id
    }
  });
  const [errors, setErrors] = React.useState({
    addAttributeErrors: [],
    editAttributeErrors: [],
    formErrors: []
  });

  const [
    updateProductType,
    updateProductTypeOpts
  ] = useProductTypeUpdateMutation({
    onCompleted: updateData => {
      if (
        !updateData.productTypeUpdate.errors ||
        updateData.productTypeUpdate.errors.length === 0
      ) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
      } else if (
        updateData.productTypeUpdate.errors !== null &&
        updateData.productTypeUpdate.errors.length > 0
      ) {
        setErrors(prevErrors => ({
          ...prevErrors,
          formErrors: updateData.productTypeUpdate.errors
        }));
      }
    }
  });

  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const handleBack = () => navigate(productTypeListUrl());

  const handleProductTypeUpdate = async (formData: ProductTypeForm) => {
    const result = await updateProductType({
      variables: {
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
      }
    });

    return result.data.productTypeUpdate.errors;
  };

  return (
    <TypedProductTypeDetailsQuery displayLoader variables={{ id }}>
      {({ data, loading: dataLoading }) => {
        const productType = data?.productType;

        if (productType === null) {
          return <NotFoundPage onBack={handleBack} />;
        }

        const closeModal = () => navigate(productTypeUrl(id), true);

        const handleAttributeAssignSuccess = (data: AssignAttribute) => {
          if (data.attributeAssign.errors.length === 0) {
            notify({
              status: "success",
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            closeModal();
          } else if (
            data.attributeAssign.errors !== null &&
            data.attributeAssign.errors.length > 0
          ) {
            setErrors(prevErrors => ({
              ...prevErrors,
              addAttributeErrors: data.attributeAssign.errors
            }));
          }
        };
        const handleAttributeUnassignSuccess = (data: UnassignAttribute) => {
          if (data.attributeUnassign.errors.length === 0) {
            notify({
              status: "success",
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
              status: "success",
              text: intl.formatMessage({
                defaultMessage: "Product type deleted"
              })
            });
            navigate(productTypeListUrl(), true);
          }
        };
        const handleSubmit = createMetadataUpdateHandler(
          data?.productType,
          handleProductTypeUpdate,
          variables => updateMetadata({ variables }),
          variables => updatePrivateMetadata({ variables })
        );

        return (
          <ProductTypeOperations
            productType={maybe(() => data.productType)}
            onAssignAttribute={handleAttributeAssignSuccess}
            onUnassignAttribute={handleAttributeUnassignSuccess}
            onProductTypeDelete={handleProductTypeDeleteSuccess}
            onProductTypeAttributeReorder={() => undefined}
          >
            {({
              assignAttribute,
              deleteProductType,
              unassignAttribute,
              reorderAttribute
            }) => {
              const handleProductTypeDelete = () =>
                deleteProductType.mutate({ id });
              const handleProductTypeVariantsToggle = (hasVariants: boolean) =>
                updateProductType({
                  variables: {
                    id,
                    input: {
                      hasVariants
                    }
                  }
                });
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

              const loading = updateProductTypeOpts.loading || dataLoading;

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
                    defaultWeightUnit={maybe(() => data.shop.defaultWeightUnit)}
                    disabled={loading}
                    errors={errors.formErrors}
                    pageTitle={maybe(() => data.productType.name)}
                    productType={maybe(() => data.productType)}
                    saveButtonBarState={updateProductTypeOpts.status}
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
                    onBack={handleBack}
                    onDelete={() =>
                      navigate(
                        productTypeUrl(id, {
                          action: "remove"
                        })
                      )
                    }
                    onHasVariantsToggle={handleProductTypeVariantsToggle}
                    onSubmit={handleSubmit}
                    productAttributeList={{
                      isChecked: productAttributeListActions.isSelected,
                      selected: productAttributeListActions.listElements.length,
                      toggle: productAttributeListActions.toggle,
                      toggleAll: productAttributeListActions.toggleAll,
                      toolbar: (
                        <Button
                          color="primary"
                          onClick={() =>
                            navigate(
                              productTypeUrl(id, {
                                action: "unassign-attributes",
                                ids: productAttributeListActions.listElements
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
                      selected: variantAttributeListActions.listElements.length,
                      toggle: variantAttributeListActions.toggle,
                      toggleAll: variantAttributeListActions.toggleAll,
                      toolbar: (
                        <Button
                          color="primary"
                          onClick={() =>
                            navigate(
                              productTypeUrl(id, {
                                action: "unassign-attributes",
                                ids: variantAttributeListActions.listElements
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
                  {!dataLoading &&
                    Object.keys(AttributeTypeEnum).map(key => (
                      <AssignAttributeDialog
                        attributes={maybe(() =>
                          result.data.productType.availableAttributes.edges.map(
                            edge => edge.node
                          )
                        )}
                        confirmButtonState={assignAttribute.opts.status}
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
                        onFetchMore={loadMore}
                        onOpen={result.refetch}
                        hasMore={maybe(
                          () =>
                            result.data.productType.availableAttributes.pageInfo
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
                                    selectedId => selectedId !== attributeId
                                  )
                                : [...ids, attributeId]
                            })
                          );
                        }}
                        key={key}
                      />
                    ))}
                  <ProductTypeDeleteDialog
                    confirmButtonState={deleteProductType.opts.status}
                    name={maybe(() => data.productType.name, "...")}
                    open={params.action === "remove"}
                    onClose={() => navigate(productTypeUrl(id))}
                    onConfirm={handleProductTypeDelete}
                  />
                  <ProductTypeBulkAttributeUnassignDialog
                    attributeQuantity={maybe(() => params.ids.length)}
                    confirmButtonState={unassignAttribute.opts.status}
                    onClose={closeModal}
                    onConfirm={handleBulkAttributeUnassign}
                    open={params.action === "unassign-attributes"}
                    productTypeName={maybe(() => data.productType.name, "...")}
                  />
                  <ProductTypeAttributeUnassignDialog
                    attributeName={maybe(
                      () =>
                        [
                          ...data.productType.productAttributes,
                          ...data.productType.variantAttributes
                        ].find(attribute => attribute.id === params.id).name,
                      "..."
                    )}
                    confirmButtonState={unassignAttribute.opts.status}
                    onClose={closeModal}
                    onConfirm={handleAttributeUnassign}
                    open={params.action === "unassign-attribute"}
                    productTypeName={maybe(() => data.productType.name, "...")}
                  />
                </>
              );
            }}
          </ProductTypeOperations>
        );
      }}
    </TypedProductTypeDetailsQuery>
  );
};
export default ProductTypeUpdate;
