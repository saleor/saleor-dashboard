import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import AssignAttributeDialog from "@saleor/productTypes/components/AssignAttributeDialog";
import useAvailableAttributeSearch from "@saleor/productTypes/hooks/useAvailableAttributeSearch";
import {
  useAssignAttributeMutation,
  useUnassignAttributeMutation
} from "@saleor/productTypes/mutations";
import { AttributeTypeEnum } from "@saleor/types/globalTypes";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import { useWarehouseList } from "@saleor/warehouses/queries";
import React from "react";
import { useIntl } from "react-intl";

import { decimal, weight } from "../../misc";
import ProductVariantCreatePage, {
  ProductVariantCreatePageSubmitData
} from "../components/ProductVariantCreatePage";
import {
  useProductVariantReorderMutation,
  useVariantCreateMutation
} from "../mutations";
import { useProductVariantCreateQuery } from "../queries";
import {
  productListUrl,
  productUrl,
  productVariantAddUrl,
  productVariantEditUrl,
  ProductVariantEditUrlQueryParams
} from "../urls";
import { createVariantReorderHandler } from "./ProductUpdate/handlers";

interface ProductVariantCreateProps {
  productId: string;
  params: ProductVariantEditUrlQueryParams;
}

export const ProductVariant: React.FC<ProductVariantCreateProps> = ({
  productId,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();
  const warehouses = useWarehouseList({
    displayLoader: true,
    variables: {
      first: 50
    }
  });

  const {
    data,
    loading: productLoading,
    refetch
  } = useProductVariantCreateQuery({
    displayLoader: true,
    variables: { id: productId }
  });

  const [variantCreate, variantCreateResult] = useVariantCreateMutation({
    onCompleted: data => {
      if (data.productVariantCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(
          productVariantEditUrl(
            productId,
            data.productVariantCreate.productVariant.id
          )
        );
      }
    }
  });
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const closeModal = () => navigate(productVariantAddUrl(productId), true);

  const [
    unassignAttribute,
    unassignAttributeOpts
  ] = useUnassignAttributeMutation({
    onCompleted: data => {
      if (data.attributeUnassign.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Attribute removed"
          })
        });
        refetch();
      }
    }
  });
  const [assignAttribute, assignAttributeOpts] = useAssignAttributeMutation({
    onCompleted: data => {
      if (data.attributeAssign.errors.length === 0) {
        refetch();
        closeModal();
      }
    }
  });

  const { loadMore, search, result } = useAvailableAttributeSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      id: data?.product?.productType?.id || ""
    }
  });

  const product = data?.product;

  if (product === null) {
    return <NotFoundPage onBack={() => navigate(productListUrl())} />;
  }

  const [
    reorderProductVariants,
    reorderProductVariantsOpts
  ] = useProductVariantReorderMutation({});

  const handleVariantReorder = createVariantReorderHandler(product, variables =>
    reorderProductVariants({ variables })
  );

  const handleBack = () => navigate(productUrl(productId));
  const handleCreate = async (formData: ProductVariantCreatePageSubmitData) => {
    const result = await variantCreate({
      variables: {
        input: {
          attributes: formData.attributes
            .filter(attribute => attribute.value !== "")
            .map(attribute => ({
              id: attribute.id,
              values: [attribute.value]
            })),
          costPrice: decimal(formData.costPrice),
          price: decimal(formData.price),
          product: productId,
          sku: formData.sku,
          stocks: formData.stocks.map(stock => ({
            quantity: parseInt(stock.value, 0),
            warehouse: stock.id
          })),
          trackInventory: true,
          weight: weight(formData.weight)
        }
      }
    });

    return result.data.productVariantCreate?.productVariant?.id || null;
  };
  const handleSubmit = createMetadataCreateHandler(
    handleCreate,
    updateMetadata,
    updatePrivateMetadata
  );
  const handleVariantClick = (id: string) =>
    navigate(productVariantEditUrl(productId, id));

  const handleAttributeRemove = (attrId: string) =>
    unassignAttribute({
      variables: {
        id: data?.product.productType.id,
        ids: [attrId]
      }
    });

  const handleAssignAttribute = () =>
    assignAttribute({
      variables: {
        id: data?.product.productType.id,
        operations: params.ids.map(id => ({
          id,
          type: AttributeTypeEnum.VARIANT
        }))
      }
    });

  const disableForm =
    productLoading ||
    variantCreateResult.loading ||
    unassignAttributeOpts?.loading ||
    reorderProductVariantsOpts.loading;

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          defaultMessage: "Create variant",
          description: "window title"
        })}
      />
      <AssignAttributeDialog
        attributes={result?.data?.productType?.availableAttributes.edges.map(
          edge => edge.node
        )}
        confirmButtonState={assignAttributeOpts.status}
        errors={
          assignAttributeOpts?.data?.attributeAssign?.errors.map(
            err => err.message
          ) || []
        }
        loading={assignAttributeOpts.loading}
        onClose={closeModal}
        onSubmit={handleAssignAttribute}
        onFetch={search}
        onFetchMore={loadMore}
        onOpen={result.refetch}
        hasMore={
          !!result?.data?.productType?.availableAttributes.pageInfo.hasNextPage
        }
        open={params.action === "assign-attribute"}
        selected={params?.ids || []}
        onToggle={attributeId => {
          const ids = params?.ids || [];
          navigate(
            productVariantAddUrl(productId, {
              ...params,
              ids: ids.includes(attributeId)
                ? params.ids.filter(selectedId => selectedId !== attributeId)
                : [...ids, attributeId]
            })
          );
        }}
        type="edit"
      />
      <ProductVariantCreatePage
        currencySymbol={shop?.defaultCurrency}
        disabled={disableForm}
        errors={variantCreateResult.data?.productVariantCreate.errors || []}
        header={intl.formatMessage({
          defaultMessage: "Create Variant",
          description: "header"
        })}
        product={data?.product}
        onBack={handleBack}
        onSubmit={handleSubmit}
        onVariantClick={handleVariantClick}
        onVariantReorder={handleVariantReorder}
        saveButtonBarState={variantCreateResult.status}
        warehouses={
          warehouses.data?.warehouses.edges.map(edge => edge.node) || []
        }
        weightUnit={shop?.defaultWeightUnit}
        onAttributeAdd={() =>
          navigate(
            productVariantAddUrl(productId, {
              ...params,
              action: "assign-attribute"
            })
          )
        }
        onAttributeRemove={handleAttributeRemove}
      />
    </>
  );
};
export default ProductVariant;
