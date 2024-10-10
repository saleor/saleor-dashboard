// @ts-strict-ignore
import AssignAttributeDialog from "@dashboard/components/AssignAttributeDialog";
import AttributeUnassignDialog from "@dashboard/components/AttributeUnassignDialog";
import BulkAttributeUnassignDialog from "@dashboard/components/BulkAttributeUnassignDialog";
import { Button } from "@dashboard/components/Button";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import TypeDeleteWarningDialog from "@dashboard/components/TypeDeleteWarningDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  AssignProductAttributeMutation,
  ProductAttributeType,
  ProductTypeAttributeReorderMutation,
  ProductTypeDeleteMutation,
  UnassignProductAttributeMutation,
  useProductAttributeAssignmentUpdateMutation,
  useProductTypeDetailsQuery,
  useProductTypeUpdateMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import { useListSelectedItems } from "@dashboard/hooks/useListSelectedItems";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { getStringOrPlaceholder, maybe } from "@dashboard/misc";
import useProductTypeDelete from "@dashboard/productTypes/hooks/useProductTypeDelete";
import useProductTypeOperations from "@dashboard/productTypes/hooks/useProductTypeOperations";
import useAvailableProductAttributeSearch from "@dashboard/searches/useAvailableProductAttributeSearch";
import { useTaxClassFetchMore } from "@dashboard/taxes/utils/useTaxClassFetchMore";
import { ReorderEvent } from "@dashboard/types";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ProductTypeDetailsPage, { ProductTypeForm } from "../../components/ProductTypeDetailsPage";
import { productTypeListUrl, productTypeUrl, ProductTypeUrlQueryParams } from "../../urls";

interface ProductTypeUpdateProps {
  id: string;
  params: ProductTypeUrlQueryParams;
}

export const ProductTypeUpdate: React.FC<ProductTypeUpdateProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const productAttributeListActions = useBulkActions();
  const variantAttributeListActions = useBulkActions();
  const assignAttributesActions = useListSelectedItems<string>();
  const intl = useIntl();
  const { loadMore, search, result } = useAvailableProductAttributeSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      id,
    },
  });
  const [errors, setErrors] = React.useState({
    addAttributeErrors: [],
    editAttributeErrors: [],
    formErrors: [],
  });
  const [updateProductType, updateProductTypeOpts] = useProductTypeUpdateMutation({
    onCompleted: updateData => {
      if (
        !updateData.productTypeUpdate.errors ||
        updateData.productTypeUpdate.errors.length === 0
      ) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      } else if (
        updateData.productTypeUpdate.errors !== null &&
        updateData.productTypeUpdate.errors.length > 0
      ) {
        setErrors(prevErrors => ({
          ...prevErrors,
          formErrors: updateData.productTypeUpdate.errors,
        }));
      }
    },
  });
  const [updateProductAttributes, updateProductAttributesOpts] =
    useProductAttributeAssignmentUpdateMutation({
      onCompleted: updateData => {
        if (
          updateData.productAttributeAssignmentUpdate.errors !== null &&
          updateData.productAttributeAssignmentUpdate.errors.length > 0
        ) {
          setErrors(prevErrors => ({
            ...prevErrors,
            formErrors: updateData.productAttributeAssignmentUpdate.errors,
          }));
        }
      },
    });
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const [selectedVariantAttributes, setSelectedVariantAttributes] = React.useState<string[]>([]);
  const handleProductTypeUpdate = async (formData: ProductTypeForm) => {
    const operations = formData.variantAttributes.map(variantAttribute => ({
      id: variantAttribute.value,
      variantSelection: selectedVariantAttributes.includes(variantAttribute.value),
    }));
    const productAttributeUpdateResult = await updateProductAttributes({
      variables: {
        productTypeId: id,
        operations,
      },
    });
    const result = await updateProductType({
      variables: {
        id,
        input: {
          hasVariants: formData.hasVariants,
          isShippingRequired: formData.isShippingRequired,
          name: formData.name,
          kind: formData.kind,
          productAttributes: formData.productAttributes.map(choice => choice.value),
          taxClass: formData.taxClassId,
          variantAttributes: formData.variantAttributes.map(choice => choice.value),
          weight: formData.weight,
        },
      },
    });

    return [
      ...result.data.productTypeUpdate.errors,
      ...productAttributeUpdateResult.data.productAttributeAssignmentUpdate.errors,
    ];
  };
  const { data, loading: dataLoading } = useProductTypeDetailsQuery({
    displayLoader: true,
    variables: { id },
  });
  const { taxClasses, fetchMoreTaxClasses } = useTaxClassFetchMore();
  const productType = data?.productType;

  const productTypeDeleteData = useProductTypeDelete({
    singleId: id,
    params,
    typeBaseData: productType ? [productType] : undefined,
  });
  const closeModal = () => navigate(productTypeUrl(id), { replace: true });
  const handleAttributeAssignSuccess = (data: AssignProductAttributeMutation) => {
    if (data.productAttributeAssign.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
      closeModal();
    } else if (
      data.productAttributeAssign.errors !== null &&
      data.productAttributeAssign.errors.length > 0
    ) {
      setErrors(prevErrors => ({
        ...prevErrors,
        addAttributeErrors: data.productAttributeAssign.errors,
      }));
    }
  };
  const handleAttributeUnassignSuccess = (data: UnassignProductAttributeMutation) => {
    if (data.productAttributeUnassign.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
      closeModal();
      productAttributeListActions.reset();
      variantAttributeListActions.reset();
    }
  };
  const handleProductTypeDeleteSuccess = (deleteData: ProductTypeDeleteMutation) => {
    if (deleteData.productTypeDelete.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "F3Upht",
          defaultMessage: "Product type deleted",
        }),
      });
      navigate(productTypeListUrl(), { replace: true });
    }
  };
  const handleAttributeReorderSuccess = (data: ProductTypeAttributeReorderMutation) => {
    if (data.productTypeReorderAttributes.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
    }
  };
  const { assignAttribute, deleteProductType, unassignAttribute, reorderAttribute } =
    useProductTypeOperations({
      onAssignAttribute: handleAttributeAssignSuccess,
      onProductTypeAttributeReorder: handleAttributeReorderSuccess,
      onProductTypeDelete: handleProductTypeDeleteSuccess,
      onUnassignAttribute: handleAttributeUnassignSuccess,
      productType: data?.productType,
    });
  const handleSubmit = createMetadataUpdateHandler(
    data?.productType,
    handleProductTypeUpdate,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables }),
  );
  const handleProductTypeDelete = () => deleteProductType.mutate({ id });
  const handleProductTypeVariantsToggle = (hasVariants: boolean) =>
    updateProductType({
      variables: {
        id,
        input: {
          hasVariants,
        },
      },
    });
  const handleAssignAttribute = async () => {
    await assignAttribute.mutate({
      id,
      operations: assignAttributesActions.selectedItems.map(id => ({
        id,
        type: ProductAttributeType[params.type],
      })),
    });

    assignAttributesActions.clearSelectedItems();
  };
  const handleAttributeUnassign = () =>
    unassignAttribute.mutate({
      id,
      ids: [params.id],
    });
  const handleBulkProductAttributeUnassign = () =>
    unassignAttribute.mutate({
      id,
      ids: productAttributeListActions.listElements,
    });
  const handleBulkVariantAttributeUnassign = () =>
    unassignAttribute.mutate({
      id,
      ids: variantAttributeListActions.listElements,
    });
  const loading =
    updateProductTypeOpts.loading || updateProductAttributesOpts.loading || dataLoading;
  const handleAttributeReorder = (event: ReorderEvent, type: ProductAttributeType) => {
    const attributes =
      type === ProductAttributeType.PRODUCT
        ? data.productType.productAttributes
        : data.productType.variantAttributes;

    reorderAttribute.mutate({
      move: {
        id: attributes[event.oldIndex].id,
        sortOrder: event.newIndex - event.oldIndex,
      },
      productTypeId: id,
      type,
    });
  };

  if (productType === null) {
    return <NotFoundPage backHref={productTypeListUrl()} />;
  }

  return (
    <>
      <WindowTitle title={maybe(() => data.productType.name)} />
      <ProductTypeDetailsPage
        defaultWeightUnit={maybe(() => data.shop.defaultWeightUnit)}
        disabled={loading}
        errors={errors.formErrors}
        pageTitle={maybe(() => data.productType.name)}
        productType={maybe(() => data.productType)}
        saveButtonBarState={updateProductTypeOpts.status || updateProductAttributesOpts.status}
        taxClasses={taxClasses ?? []}
        selectedVariantAttributes={selectedVariantAttributes}
        setSelectedVariantAttributes={setSelectedVariantAttributes}
        onAttributeAdd={type =>
          navigate(
            productTypeUrl(id, {
              action: "assign-attribute",
              type,
            }),
          )
        }
        onAttributeReorder={handleAttributeReorder}
        onAttributeUnassign={attributeId =>
          navigate(
            productTypeUrl(id, {
              action: "unassign-attribute",
              id: attributeId,
            }),
          )
        }
        onDelete={() =>
          navigate(
            productTypeUrl(id, {
              action: "remove",
            }),
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
              onClick={() =>
                navigate(
                  productTypeUrl(id, {
                    action: "unassign-product-attributes",
                  }),
                )
              }
            >
              <FormattedMessage
                id="S7j+Wf"
                defaultMessage="Unassign"
                description="unassign attribute from product type, button"
              />
            </Button>
          ),
        }}
        variantAttributeList={{
          isChecked: variantAttributeListActions.isSelected,
          selected: variantAttributeListActions.listElements.length,
          toggle: variantAttributeListActions.toggle,
          toggleAll: variantAttributeListActions.toggleAll,
          toolbar: (
            <Button
              onClick={() =>
                navigate(
                  productTypeUrl(id, {
                    action: "unassign-variant-attributes",
                  }),
                )
              }
            >
              <FormattedMessage
                id="S7j+Wf"
                defaultMessage="Unassign"
                description="unassign attribute from product type, button"
              />
            </Button>
          ),
        }}
        onFetchMoreTaxClasses={fetchMoreTaxClasses}
      />
      {!dataLoading && (
        <>
          {Object.keys(ProductAttributeType).map(key => (
            <AssignAttributeDialog
              attributes={mapEdgesToItems(result?.data?.productType?.availableAttributes)}
              confirmButtonState={assignAttribute.opts.status}
              errors={maybe(
                () =>
                  assignAttribute.opts.data.productAttributeAssign.errors.map(err => err.message),
                [],
              )}
              loading={result.loading}
              onClose={() => {
                closeModal();
                assignAttributesActions.clearSelectedItems();
              }}
              onSubmit={handleAssignAttribute}
              onFetch={search}
              onFetchMore={loadMore}
              onOpen={result.refetch}
              hasMore={maybe(
                () => result.data.productType.availableAttributes.pageInfo.hasNextPage,
                false,
              )}
              open={
                params.action === "assign-attribute" && params.type === ProductAttributeType[key]
              }
              selected={assignAttributesActions.selectedItems}
              onToggle={assignAttributesActions.toggleSelectItem}
              key={key}
            />
          ))}
          {productType && (
            <TypeDeleteWarningDialog
              {...productTypeDeleteData}
              typesData={[productType]}
              typesToDelete={[id]}
              onClose={closeModal}
              onDelete={handleProductTypeDelete}
              deleteButtonState={deleteProductType.opts.status}
            />
          )}
        </>
      )}

      <BulkAttributeUnassignDialog
        title={intl.formatMessage({
          id: "r1aQ2f",
          defaultMessage: "Unassign Attribute from Product Type",
          description: "dialog header",
        })}
        attributeQuantity={
          params.action === "unassign-product-attributes"
            ? productAttributeListActions.listElements.length
            : variantAttributeListActions.listElements.length
        }
        confirmButtonState={unassignAttribute.opts.status}
        onClose={closeModal}
        onConfirm={
          params.action === "unassign-product-attributes"
            ? handleBulkProductAttributeUnassign
            : handleBulkVariantAttributeUnassign
        }
        open={["unassign-product-attributes", "unassign-variant-attributes"].includes(
          params.action,
        )}
        itemTypeName={getStringOrPlaceholder(data?.productType.name)}
      />
      <AttributeUnassignDialog
        title={intl.formatMessage({
          id: "UJnqdm",
          defaultMessage: "Unassign Attribute From Product Type",
          description: "dialog header",
        })}
        attributeName={maybe(
          () =>
            [...data.productType.productAttributes, ...data.productType.variantAttributes].find(
              attribute => attribute.id === params.id,
            ).name,
          "...",
        )}
        confirmButtonState={unassignAttribute.opts.status}
        onClose={closeModal}
        onConfirm={handleAttributeUnassign}
        open={params.action === "unassign-attribute"}
        itemTypeName={getStringOrPlaceholder(data?.productType.name)}
      />
    </>
  );
};
export default ProductTypeUpdate;
