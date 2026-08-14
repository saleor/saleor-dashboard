// @ts-strict-ignore
import { AssignedAttributesBulkDeleteButton } from "@dashboard/attributes/components/AssignedAttributesCard/AssignedAttributesBulkDeleteButton";
import { type AttributePageFormData } from "@dashboard/attributes/components/AttributePage";
import AssignAttributeDialog from "@dashboard/components/AssignAttributeDialog";
import { AttributeUnassignDialog } from "@dashboard/components/AttributeUnassignDialog";
import { usePendingAttributeUnassign } from "@dashboard/components/AttributeUnassignDialog/usePendingAttributeUnassign";
import { BulkAttributeUnassignDialog } from "@dashboard/components/BulkAttributeUnassignDialog";
import {
  type AttributeCreateSubmitData,
  CreateAttributeDialog,
} from "@dashboard/components/CreateAttributeDialog/CreateAttributeDialog";
import { messages as createAttributeMessages } from "@dashboard/components/CreateAttributeDialog/messages";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import TypeDeleteWarningDialog from "@dashboard/components/TypeDeleteWarningDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  type AssignProductAttributeMutation,
  AttributeErrorCode,
  type AttributeErrorFragment,
  AttributeTypeEnum,
  ProductAttributeType,
  type ProductTypeAttributeReorderMutation,
  type ProductTypeDeleteMutation,
  type UnassignProductAttributeMutation,
  useAssignProductAttributeMutation,
  useAttributeCreateMutation,
  useProductAttributeAssignmentUpdateMutation,
  useProductTypeDetailsQuery,
  useProductTypeUpdateMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import { useListSelectedItems } from "@dashboard/hooks/useListSelectedItems";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getStringOrPlaceholder, maybe } from "@dashboard/misc";
import useProductTypeDelete from "@dashboard/productTypes/hooks/useProductTypeDelete";
import useProductTypeOperations from "@dashboard/productTypes/hooks/useProductTypeOperations";
import { useProductTypeVariantSelection } from "@dashboard/productTypes/hooks/useProductTypeVariantSelection";
import useAvailableProductAttributeSearch from "@dashboard/searches/useAvailableProductAttributeSearch";
import { useTaxClassFetchMore } from "@dashboard/taxes/utils/useTaxClassFetchMore";
import { type ReorderEvent } from "@dashboard/types";
import { getProductErrorMessage } from "@dashboard/utils/errors";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createMetadataCreateHandler from "@dashboard/utils/handlers/metadataCreateHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useState } from "react";
import { useIntl } from "react-intl";

import ProductTypeDetailsPage, {
  type ProductTypeForm,
} from "../../components/ProductTypeDetailsPage";
import { ProductTypeMetadataDialog } from "../../components/ProductTypeMetadataDialog/ProductTypeMetadataDialog";
import { executeProductTypeAttributeCreate } from "../../handlers/productTypeAttributeCreateHandler";
import {
  productTypeListUrl,
  productTypeUrl,
  type ProductTypeUrlDialog,
  type ProductTypeUrlQueryParams,
} from "../../urls";
import {
  buildProductTypeSaveInput,
  buildVariantSelectionOperations,
  findProductTypeAttributeName,
} from "../../utils/productTypePageForm";

interface ProductTypeUpdateProps {
  id: string;
  params: ProductTypeUrlQueryParams;
}

const ProductTypeUpdate = ({ id, params }: ProductTypeUpdateProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const [openModal, closeModal] = createDialogActionHandlers<
    ProductTypeUrlDialog,
    ProductTypeUrlQueryParams
  >(navigate, dialogParams => productTypeUrl(id, dialogParams), params, ["type"]);
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
  const [errors, setErrors] = useState({
    addAttributeErrors: [],
    editAttributeErrors: [],
    formErrors: [],
  });
  const [updateProductType, updateProductTypeOpts] = useProductTypeUpdateMutation({
    // Field errors are rendered inline on the product type form.
    disableErrorHandling: true,
    onCompleted: updateData => {
      if (
        !updateData.productTypeUpdate.errors ||
        updateData.productTypeUpdate.errors.length === 0
      ) {
        notify({
          status: "success",
          text: intl.formatMessage({ id: "6j4TUi", defaultMessage: "Product type updated" }),
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
      // Field errors are rendered inline on the product type form.
      disableErrorHandling: true,
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
  const [assignCreatedAttribute, assignCreatedAttributeOpts] = useAssignProductAttributeMutation();
  const [attributeCreate, attributeCreateOpts] = useAttributeCreateMutation();
  const {
    data,
    loading: dataLoading,
    refetch,
  } = useProductTypeDetailsQuery({
    displayLoader: true,
    variables: { id },
  });
  const { taxClasses, fetchMoreTaxClasses } = useTaxClassFetchMore();
  const productType = data?.productType;
  const { selectedVariantAttributes, setSelectedVariantAttributes } =
    useProductTypeVariantSelection(id, productType?.assignedVariantAttributes);
  const pendingUnassign = usePendingAttributeUnassign(params.id);
  const handleProductTypeUpdate = async (formData: ProductTypeForm) => {
    const operations = buildVariantSelectionOperations(
      productType?.assignedVariantAttributes,
      selectedVariantAttributes,
    );
    const productAttributeUpdateResult =
      operations.length > 0
        ? await updateProductAttributes({
            variables: {
              productTypeId: id,
              operations,
            },
          })
        : undefined;
    const result = await updateProductType({
      variables: {
        id,
        input: buildProductTypeSaveInput(formData),
      },
    });

    return [
      ...result.data.productTypeUpdate.errors,
      ...(productAttributeUpdateResult?.data.productAttributeAssignmentUpdate.errors ?? []),
    ];
  };

  const productTypeDeleteData = useProductTypeDelete({
    singleId: id,
    params,
    typeBaseData: productType ? [productType] : undefined,
  });
  const createAttributeAssignmentType = ProductAttributeType[params.type];
  const handleAttributeAssignSuccess = (data: AssignProductAttributeMutation) => {
    if (data.productAttributeAssign.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({ id: "6j4TUi", defaultMessage: "Product type updated" }),
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
        text: intl.formatMessage({ id: "6j4TUi", defaultMessage: "Product type updated" }),
      });
      pendingUnassign.clear();
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
    const error = data.productTypeReorderAttributes.errors[0];

    if (error) {
      notify({
        status: "error",
        text: getProductErrorMessage(error, intl),
      });
      refetch();
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
  const handleCreateAttribute = async ({
    formData,
    values,
  }: AttributeCreateSubmitData): Promise<AttributeErrorFragment[]> => {
    if (!createAttributeAssignmentType) {
      return [
        {
          __typename: "AttributeError",
          code: AttributeErrorCode.INVALID,
          field: null,
          message: intl.formatMessage(createAttributeMessages.createFailed),
        },
      ];
    }

    const submitWithMetadata = createMetadataCreateHandler(
      async (data: AttributePageFormData) => {
        const outcome = await executeProductTypeAttributeCreate(
          {
            productTypeId: id,
            productAttributeType: createAttributeAssignmentType,
            formData: data,
            values,
            createFailedMessage: intl.formatMessage(createAttributeMessages.createFailed),
            formatAssignErrors: errors =>
              errors.map(error => getProductErrorMessage(error, intl)).join(" "),
          },
          {
            attributeCreate,
            assignCreatedAttribute,
          },
        );

        if (outcome.assignErrorMessage) {
          notify({
            status: "error",
            text: outcome.assignErrorMessage,
          });
        }

        return outcome;
      },
      updateMetadata,
      updatePrivateMetadata,
      () => {
        notify({
          status: "success",
          text: intl.formatMessage(createAttributeMessages.createdAndAssigned),
        });
        closeModal();
      },
    );

    return (await submitWithMetadata(formData)) as AttributeErrorFragment[];
  };
  const handleAttributeUnassign = () => {
    const attributeId = pendingUnassign.takeAttributeId();

    if (!attributeId) {
      return;
    }

    unassignAttribute.mutate({
      id,
      ids: [attributeId],
    });
  };
  const handleBulkProductAttributeUnassign = () => {
    const ids = productAttributeListActions.listElements.filter(Boolean);

    if (ids.length === 0) {
      return;
    }

    unassignAttribute.mutate({
      id,
      ids,
    });
  };
  const handleBulkVariantAttributeUnassign = () => {
    const ids = variantAttributeListActions.listElements.filter(Boolean);

    if (ids.length === 0) {
      return;
    }

    unassignAttribute.mutate({
      id,
      ids,
    });
  };
  const loading =
    updateProductTypeOpts.loading || updateProductAttributesOpts.loading || dataLoading;
  const handleAttributeReorder = (event: ReorderEvent, type: ProductAttributeType) => {
    const attributes =
      type === ProductAttributeType.PRODUCT
        ? data.productType.productAttributes
        : (data.productType.assignedVariantAttributes?.map(assigned => assigned.attribute) ??
          data.productType.variantAttributes);

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
        productType={maybe(() => data.productType)}
        saveButtonBarState={updateProductTypeOpts.status || updateProductAttributesOpts.status}
        taxClasses={taxClasses ?? []}
        selectedVariantAttributes={selectedVariantAttributes}
        setSelectedVariantAttributes={setSelectedVariantAttributes}
        onAttributeAdd={type =>
          openModal("assign-attribute", {
            type,
          })
        }
        onAttributeCreate={type =>
          openModal("create-attribute", {
            type,
          })
        }
        onAttributeReorder={handleAttributeReorder}
        onAttributeUnassign={attributeId => {
          if (!pendingUnassign.beginUnassign(attributeId)) {
            return;
          }

          openModal("unassign-attribute", {
            id: attributeId,
          });
        }}
        onDelete={() => openModal("remove")}
        onShowMetadata={() => openModal("view-metadata", { id: undefined })}
        onHasVariantsToggle={handleProductTypeVariantsToggle}
        onSubmit={handleProductTypeUpdate}
        productAttributeList={{
          isChecked: productAttributeListActions.isSelected,
          selected: productAttributeListActions.listElements.length,
          toggle: productAttributeListActions.toggle,
          toggleAll: productAttributeListActions.toggleAll,
          toolbar: (
            <AssignedAttributesBulkDeleteButton
              onClick={() => openModal("unassign-product-attributes")}
              label={intl.formatMessage({
                id: "S7j+Wf",
                defaultMessage: "Unassign",
                description: "unassign attribute from product type, button",
              })}
            />
          ),
        }}
        variantAttributeList={{
          isChecked: variantAttributeListActions.isSelected,
          selected: variantAttributeListActions.listElements.length,
          toggle: variantAttributeListActions.toggle,
          toggleAll: variantAttributeListActions.toggleAll,
          toolbar: (
            <AssignedAttributesBulkDeleteButton
              onClick={() => openModal("unassign-variant-attributes")}
              label={intl.formatMessage({
                id: "S7j+Wf",
                defaultMessage: "Unassign",
                description: "unassign attribute from product type, button",
              })}
            />
          ),
        }}
        onFetchMoreTaxClasses={fetchMoreTaxClasses}
      />
      {!dataLoading && (
        <>
          {productType && (
            <>
              <ProductTypeMetadataDialog
                open={params.action === "view-metadata" && !!productType}
                onClose={closeModal}
                productType={productType}
                refetchProductType={refetch}
              />
              <CreateAttributeDialog
                attributeType={AttributeTypeEnum.PRODUCT_TYPE}
                confirmButtonState={
                  attributeCreateOpts.loading || assignCreatedAttributeOpts.loading
                    ? "loading"
                    : attributeCreateOpts.status
                }
                contextName={productType.name}
                disabled={attributeCreateOpts.loading || assignCreatedAttributeOpts.loading}
                errors={attributeCreateOpts.data?.attributeCreate?.errors ?? []}
                open={
                  params.action === "create-attribute" && Boolean(createAttributeAssignmentType)
                }
                onClose={closeModal}
                onSubmit={handleCreateAttribute}
              />
            </>
          )}
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
      {Object.keys(ProductAttributeType).map(key => (
        <AssignAttributeDialog
          attributes={mapEdgesToItems(result?.data?.productType?.availableAttributes)}
          confirmButtonState={assignAttribute.opts.status}
          errors={maybe(
            () => assignAttribute.opts.data.productAttributeAssign.errors.map(err => err.message),
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
          open={params.action === "assign-attribute" && params.type === ProductAttributeType[key]}
          selected={assignAttributesActions.selectedItems}
          onToggle={assignAttributesActions.toggleSelectItem}
          key={key}
        />
      ))}

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
        attributeName={getStringOrPlaceholder(
          findProductTypeAttributeName(data?.productType, pendingUnassign.attributeId),
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
