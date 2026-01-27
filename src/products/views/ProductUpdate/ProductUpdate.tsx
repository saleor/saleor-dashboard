// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { AttributeInput } from "@dashboard/components/Attributes";
import { InitialConstraints } from "@dashboard/components/ModalFilters/entityConfigs/ModalProductFilterProvider";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, VALUES_PAGINATE_BY } from "@dashboard/config";
import {
  ErrorPolicyEnum,
  ProductMediaCreateMutationVariables,
  ProductVariantBulkCreateInput,
  ProductWhereInput,
  useProductDeleteMutation,
  useProductDetailsQuery,
  useProductMediaCreateMutation,
  useProductMediaDeleteMutation,
  useProductMediaReorderMutation,
  useProductVariantBulkCreateMutation,
} from "@dashboard/graphql";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { errorMessages } from "@dashboard/intl";
import { useSearchAttributeValuesSuggestions } from "@dashboard/searches/useAttributeValueSearch";
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
import {
  useReferencePageSearch,
  useReferenceProductSearch,
} from "@dashboard/searches/useReferenceSearch";
import { useTaxClassFetchMore } from "@dashboard/taxes/utils/useTaxClassFetchMore";
import { getProductErrorMessage } from "@dashboard/utils/errors";
import useAttributeValueSearchHandler from "@dashboard/utils/handlers/attributeValueSearchHandler";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useCallback, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getMutationState } from "../../../misc";
import ProductUpdatePage from "../../components/ProductUpdatePage";
import {
  productListUrl,
  productUrl,
  ProductUrlDialog,
  ProductUrlQueryParams,
  productVariantEditUrl,
} from "../../urls";
import { createImageReorderHandler, createImageUploadHandler } from "./handlers";
import { useProductUpdateHandler } from "./handlers/useProductUpdateHandler";
import { productUpdatePageMessages as messages } from "./messages";

interface ProductUpdateProps {
  id: string;
  params: ProductUrlQueryParams;
}

const ProductUpdate = ({ id, params }: ProductUpdateProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const {
    loadMore: loadMoreCategories,
    search: searchCategories,
    result: searchCategoriesOpts,
  } = useCategorySearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMoreCollections,
    search: searchCollections,
    result: searchCollectionsOpts,
  } = useCollectionSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMoreAttributeValues,
    search: searchAttributeValues,
    result: searchAttributeValuesOpts,
    reset: searchAttributeReset,
  } = useAttributeValueSearchHandler(DEFAULT_INITIAL_SEARCH_DATA);
  const { data, loading, refetch } = useProductDetailsQuery({
    displayLoader: true,
    variables: {
      id,
      firstValues: VALUES_PAGINATE_BY,
    },
  });
  const isSimpleProduct = !data?.product?.productType?.hasVariants;
  const { availableChannels } = useAppChannel(false);
  const limitOpts = useShopLimitsQuery({
    variables: {
      productVariants: true,
    },
  });
  const [reorderProductImages, reorderProductImagesOpts] = useProductMediaReorderMutation({});
  const [deleteProduct, deleteProductOpts] = useProductDeleteMutation({
    onCompleted: () => {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "vlVTmY",
          defaultMessage: "Product removed",
        }),
      });
      navigate(productListUrl());
    },
  });
  const [createProductImage, createProductImageOpts] = useProductMediaCreateMutation({
    onCompleted: data => {
      const imageError = data.productMediaCreate.errors.find(
        error => error.field === ("image" as keyof ProductMediaCreateMutationVariables),
      );

      if (imageError) {
        notify({
          status: "error",
          title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
          text: intl.formatMessage(errorMessages.imageUploadErrorText),
        });
      }
    },
  });
  const [deleteProductImage] = useProductMediaDeleteMutation({
    onCompleted: () =>
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "Gi8zwc",
          defaultMessage: "Image deleted",
        }),
      }),
  });
  const [bulkCreateVariants] = useProductVariantBulkCreateMutation();
  const [openModal, closeModal] = createDialogActionHandlers<
    ProductUrlDialog,
    ProductUrlQueryParams
  >(navigate, params => productUrl(id, params), params);
  const product = data?.product;
  const getAttributeValuesSuggestions = useSearchAttributeValuesSuggestions();
  const [createProductMedia, createProductMediaOpts] = useProductMediaCreateMutation({
    onCompleted: data => {
      const errors = data.productMediaCreate.errors;

      if (errors.length) {
        errors.map(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl),
          }),
        );
      } else {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "lUvX5F",
            defaultMessage: "Image added",
          }),
        });
      }
    },
  });
  const handleMediaUrlUpload = (mediaUrl: string) => {
    const variables = {
      alt: "",
      mediaUrl,
      product: product.id,
    };

    createProductMedia({
      variables,
    });
  };
  const handleBack = () => navigate(productListUrl());

  /**
   * Handles bulk variant creation with two-tier error handling:
   *
   * 1. Attribute errors (e.g., missing required attribute) → returned in `attributeErrors`
   *    and displayed INLINE next to the field in the generator modal. No notification shown.
   *
   * 2. Other errors (e.g., duplicate SKU, network) → shown as NOTIFICATIONS.
   *    Only the first unique error is shown to avoid notification spam.
   *
   * This split ensures users see actionable errors where they can fix them (inline),
   * while general failures are communicated via notifications.
   */
  const handleBulkCreateVariants = useCallback(
    async (inputs: ProductVariantBulkCreateInput[]) => {
      const result = await bulkCreateVariants({
        variables: {
          id,
          inputs,
          errorPolicy: ErrorPolicyEnum.REJECT_FAILED_ROWS,
        },
      });

      const bulkErrors = result.data?.productVariantBulkCreate.errors ?? [];
      const results = result.data?.productVariantBulkCreate.results ?? [];
      const successCount = results.filter(
        r => r.productVariant && (!r.errors || r.errors.length === 0),
      ).length;
      const failedCount = results.filter(r => r.errors && r.errors.length > 0).length;

      // Categorize errors: attribute-specific (inline) vs other (notifications)
      const attributeErrors: Array<{
        attributeId: string;
        code: string;
        message: string | null;
      }> = [];
      const otherErrors: Array<{ message: string | null }> = [];

      results
        .flatMap(r => r.errors ?? [])
        .forEach(error => {
          if (error.attributes && error.attributes.length > 0) {
            error.attributes.forEach(attrId => {
              attributeErrors.push({
                attributeId: attrId,
                code: error.code,
                message: error.message,
              });
            });
          } else {
            otherErrors.push({ message: error.message });
          }
        });

      bulkErrors.forEach(error => {
        otherErrors.push({ message: getProductErrorMessage(error, intl) });
      });

      // Show notifications based on outcome (skip if attribute errors will be shown inline)
      if (successCount > 0 && failedCount === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(messages.variantBulkCreateSuccess, { count: successCount }),
        });
        refetch();
      } else if (successCount > 0 && failedCount > 0) {
        notify({
          status: "warning",
          text: intl.formatMessage(messages.variantBulkCreatePartial, {
            success: successCount,
            failed: failedCount,
          }),
        });
        refetch();
      } else if (attributeErrors.length === 0 && otherErrors.length > 0) {
        const uniqueMessages = [...new Set(otherErrors.map(e => e.message).filter(Boolean))];

        if (uniqueMessages[0]) {
          notify({
            status: "error",
            text: uniqueMessages[0],
          });
        }
      }

      return {
        success: successCount > 0,
        successCount,
        failedCount,
        attributeErrors,
        otherErrors,
      };
    },
    [bulkCreateVariants, id, intl, notify, refetch],
  );
  const handleImageDelete = (id: string) => () => deleteProductImage({ variables: { id } });
  const [submit, submitOpts] = useProductUpdateHandler(product);
  const handleImageUpload = createImageUploadHandler(id, variables =>
    createProductImage({ variables }),
  );
  const handleImageReorder = createImageReorderHandler(product, variables =>
    reorderProductImages({ variables }),
  );
  const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
    navigate(
      productUrl(id, {
        ...params,
        action: "assign-attribute-value",
        id: attribute.id,
      }),
      { resetScroll: false },
    );
  const disableFormSave =
    submitOpts.loading ||
    createProductImageOpts.loading ||
    deleteProductOpts.loading ||
    reorderProductImagesOpts.loading ||
    createProductMediaOpts.loading ||
    loading;
  const formTransitionState = getMutationState(
    submitOpts.called,
    submitOpts.loading,
    submitOpts.errors,
    createProductMediaOpts.data?.productMediaCreate.errors,
  );
  const refAttr =
    params.action === "assign-attribute-value" && params.id
      ? product?.attributes?.find(a => a.attribute.id === params.id)?.attribute
      : undefined;

  // Extract productType constraints from reference attribute for modal filter
  const initialConstraints = useMemo((): InitialConstraints | undefined => {
    if (!refAttr?.referenceTypes?.length) {
      return undefined;
    }

    // Filter to get only ProductType references
    const productTypeRefs = refAttr.referenceTypes.filter(
      (t): t is { __typename: "ProductType"; id: string; name: string } =>
        t?.__typename === "ProductType" && Boolean(t?.id),
    );

    if (productTypeRefs.length === 0) {
      return undefined;
    }

    return {
      productTypes: productTypeRefs.map(t => ({ id: t.id, name: t.name })),
    };
  }, [refAttr?.referenceTypes]);

  const {
    loadMore: loadMoreProducts,
    search: searchProducts,
    result: searchProductsOpts,
  } = useReferenceProductSearch(refAttr);

  const {
    loadMore: loadMorePages,
    search: searchPages,
    result: searchPagesOpts,
  } = useReferencePageSearch(refAttr);

  const handleProductFilterChange = useCallback(
    (filterVariables: ProductWhereInput, channel: string | undefined, query: string) => {
      searchProductsOpts.refetch({
        ...DEFAULT_INITIAL_SEARCH_DATA,
        where: filterVariables,
        channel,
        query,
      });
    },
    [searchProductsOpts.refetch],
  );

  const categories = mapEdgesToItems(searchCategoriesOpts?.data?.search) || [];
  const collections = mapEdgesToItems(searchCollectionsOpts?.data?.search) || [];
  const attributeValues = mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) || [];
  const fetchMoreCollections = getSearchFetchMoreProps(searchCollectionsOpts, loadMoreCollections);
  const fetchMoreCategories = getSearchFetchMoreProps(searchCategoriesOpts, loadMoreCategories);
  const fetchMoreReferencePages = getSearchFetchMoreProps(searchPagesOpts, loadMorePages);
  const fetchMoreReferenceProducts = getSearchFetchMoreProps(searchProductsOpts, loadMoreProducts);
  const fetchMoreAttributeValues = {
    hasMore: !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo?.hasNextPage,
    loading: !!searchAttributeValuesOpts.loading,
    onFetchMore: loadMoreAttributeValues,
  };
  const { taxClasses, fetchMoreTaxClasses } = useTaxClassFetchMore();

  if (product === null) {
    return <NotFoundPage onBack={handleBack} />;
  }

  return (
    <>
      <WindowTitle title={data?.product?.name} />
      <ProductUpdatePage
        channels={availableChannels}
        productId={id}
        isSimpleProduct={isSimpleProduct}
        channelsErrors={submitOpts.channelsErrors}
        categories={categories}
        collections={collections}
        attributeValues={attributeValues}
        disabled={disableFormSave}
        errors={submitOpts.errors}
        variantListErrors={submitOpts.variantListErrors}
        fetchCategories={searchCategories}
        fetchCollections={searchCollections}
        fetchAttributeValues={searchAttributeValues}
        refetch={refetch}
        limits={limitOpts.data?.shop.limits}
        saveButtonBarState={formTransitionState}
        media={data?.product?.media}
        header={product?.name}
        product={product}
        taxClasses={taxClasses ?? []}
        fetchMoreTaxClasses={fetchMoreTaxClasses}
        variants={product?.variants}
        onDelete={() => openModal("remove")}
        onImageReorder={handleImageReorder}
        onMediaUrlUpload={handleMediaUrlUpload}
        onSubmit={submit}
        onVariantShow={variantId =>
          navigate(productVariantEditUrl(variantId), {
            resetScroll: true,
          })
        }
        onImageUpload={handleImageUpload}
        onImageDelete={handleImageDelete}
        fetchMoreCategories={fetchMoreCategories}
        fetchMoreCollections={fetchMoreCollections}
        assignReferencesAttributeId={params.action === "assign-attribute-value" && params.id}
        onAssignReferencesClick={handleAssignAttributeReferenceClick}
        referencePages={mapEdgesToItems(searchPagesOpts?.data?.search) || []}
        referenceProducts={mapEdgesToItems(searchProductsOpts?.data?.search) || []}
        referenceCategories={mapEdgesToItems(searchCategoriesOpts?.data?.search) || []}
        referenceCollections={mapEdgesToItems(searchCollectionsOpts?.data?.search) || []}
        fetchReferencePages={searchPages}
        fetchMoreReferencePages={fetchMoreReferencePages}
        fetchReferenceProducts={searchProducts}
        fetchMoreReferenceProducts={fetchMoreReferenceProducts}
        fetchReferenceCategories={searchCategories}
        fetchMoreReferenceCategories={fetchMoreCategories}
        fetchReferenceCollections={searchCollections}
        fetchMoreReferenceCollections={fetchMoreCollections}
        fetchMoreAttributeValues={fetchMoreAttributeValues}
        onCloseDialog={() => navigate(productUrl(id), { resetScroll: false })}
        onAttributeSelectBlur={searchAttributeReset}
        onAttributeValuesSearch={getAttributeValuesSuggestions}
        onProductFilterChange={handleProductFilterChange}
        onBulkCreateVariants={handleBulkCreateVariants}
        initialConstraints={initialConstraints}
      />
      <ActionDialog
        open={params.action === "remove"}
        onClose={closeModal}
        confirmButtonState={deleteProductOpts.status}
        onConfirm={() => deleteProduct({ variables: { id } })}
        variant="delete"
        title={intl.formatMessage(messages.deleteProductDialogTitle)}
      >
        <FormattedMessage
          {...messages.deleteProductDialogSubtitle}
          values={{ name: product?.name }}
        />
      </ActionDialog>
    </>
  );
};

export default ProductUpdate;
