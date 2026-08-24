// @ts-strict-ignore
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { getReferenceTypeConstraints } from "@dashboard/components/AssignAttributeValueDialog/getReferenceTypeConstraints";
import { getReferenceWhereConstraints } from "@dashboard/components/AssignAttributeValueDialog/mergeReferenceTypeWhereConstraints";
import { type AttributeInput } from "@dashboard/components/Attributes";
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, VALUES_PAGINATE_BY } from "@dashboard/config";
import { useRegisterEntityRefresh } from "@dashboard/extensions/entity-refresh";
import {
  type ProductMediaCreateMutation,
  type ProductMediaCreateMutationVariables,
  ProductMediaType,
  useProductDeleteMutation,
  useProductDetailsQuery,
  useProductMediaBulkDeleteMutation,
  useProductMediaCreateMutation,
  useProductMediaReorderMutation,
} from "@dashboard/graphql";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { commonMessages, errorMessages } from "@dashboard/intl";
import { useSearchAttributeValuesSuggestions } from "@dashboard/searches/useAttributeValueSearch";
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
import {
  useReferenceCategorySearch,
  useReferenceCollectionSearch,
  useReferencePageSearch,
  useReferenceProductSearch,
} from "@dashboard/searches/useReferenceSearch";
import { useTaxClassFetchMore } from "@dashboard/taxes/utils/useTaxClassFetchMore";
import { getProductErrorMessage } from "@dashboard/utils/errors";
import useAttributeValueSearchHandler from "@dashboard/utils/handlers/attributeValueSearchHandler";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { useAssignAttributeValueDialogFilterChangeHandlers } from "../../../components/AssignAttributeValueDialog/useAssignAttributeValueDialogFilterChangeHandlers";
import { getMutationState } from "../../../misc";
import { ProductDeleteDialog } from "../../components/ProductDeleteDialog/ProductDeleteDialog";
import { ProductMediaDeleteDialog } from "../../components/ProductMediaDeleteDialog/ProductMediaDeleteDialog";
import { ProductMetadataDialog } from "../../components/ProductMetadataDialog/ProductMetadataDialog";
import { useProductSetupCardDismiss } from "../../components/ProductSetupCard/useProductSetupCardDismiss";
import ProductUpdatePage from "../../components/ProductUpdatePage";
import { useProductVariantsGrid } from "../../hooks/useProductVariantsGrid";
import {
  productListUrl,
  productUrl,
  type ProductUrlDialog,
  type ProductUrlQueryParams,
  productVariantEditUrl,
} from "../../urls";
import {
  createImageReorderHandler,
  createImagesUploadCompleteHandler,
  createImageUploadHandler,
} from "./handlers";
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
  const { resetFormsState } = useExitFormDialog();
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
    getChoices: getAttributeValues,
    getFetchMore: getFetchMoreAttributeValues,
    search: searchAttributeValues,
    reset: searchAttributeReset,
  } = useAttributeValueSearchHandler(DEFAULT_INITIAL_SEARCH_DATA);
  const { data, loading, refetch } = useProductDetailsQuery({
    displayLoader: true,
    variables: {
      id,
      firstValues: VALUES_PAGINATE_BY,
    },
  });

  const {
    variants,
    loading: variantsLoading,
    refetch: refetchVariants,
    search: variantsSearch,
    setSearch: setVariantsSearch,
    pageInfo: variantsPageInfo,
    loadNextPage: loadNextVariantsPage,
    loadPreviousPage: loadPreviousVariantsPage,
    rangeLabel: variantsRangeLabel,
    totalCount: variantsTotalCount,
  } = useProductVariantsGrid({ productId: id });

  useRegisterEntityRefresh(async () => {
    await Promise.all([refetch(), refetchVariants()]);
  });

  const isSimpleProduct = !data?.product?.productType?.hasVariants;
  const { availableChannels } = useAppChannel(false);
  const limitOpts = useShopLimitsQuery({
    variables: {
      productVariants: true,
    },
  });
  const [reorderProductImages, reorderProductImagesOpts] = useProductMediaReorderMutation({
    onCompleted: data => {
      const result = data.productMediaReorder;

      if (!result) {
        notify({
          status: "error",
          text: intl.formatMessage(commonMessages.somethingWentWrong),
        });

        return;
      }

      const { errors } = result;

      if (errors.length) {
        errors.forEach(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl),
          }),
        );
      } else {
        notify({
          status: "success",
          text: intl.formatMessage(messages.mediaReorderSuccess),
        });
      }
    },
  });
  const [deleteProduct, deleteProductOpts] = useProductDeleteMutation({
    onCompleted: () => {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "vlVTmY",
          defaultMessage: "Product removed",
        }),
      });
      resetFormsState();
      navigate(productListUrl());
    },
  });
  const handleProductMediaCreateCompleted = useCallback(
    (data: ProductMediaCreateMutation) => {
      const errors = data.productMediaCreate?.errors ?? [];
      const imageError = errors.find(
        error => error.field === ("image" as keyof ProductMediaCreateMutationVariables),
      );

      if (imageError) {
        notify({
          status: "error",
          title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
          text: intl.formatMessage(errorMessages.imageUploadErrorText),
        });

        return;
      }

      if (errors.length) {
        errors.forEach(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl),
          }),
        );

        return;
      }

      notify({
        status: "success",
        text: intl.formatMessage(messages.mediaUploadSuccess),
      });
    },
    [intl, notify],
  );
  // File uploads report a single batch toast from ProductMedia; keep per-upload
  // notifications only for URL/oEmbed uploads via createProductMedia.
  const [createProductImage] = useProductMediaCreateMutation();
  const [openModal, closeModal] = createDialogActionHandlers<
    ProductUrlDialog,
    ProductUrlQueryParams
  >(navigate, params => productUrl(id, params), params);
  const setupEmphasized = params.action === "setup";
  const {
    isDismissed: setupCardDismissed,
    dismiss: dismissSetupCard,
    undismiss: undismissSetupCard,
  } = useProductSetupCardDismiss(id);
  const [bulkDeleteProductMedia, bulkDeleteProductMediaOpts] = useProductMediaBulkDeleteMutation({
    onCompleted: data => {
      const result = data.productMediaBulkDelete;

      if (!result) {
        notify({
          status: "error",
          text: intl.formatMessage(commonMessages.somethingWentWrong),
        });

        return;
      }

      const { errors } = result;

      if (errors.length) {
        errors.forEach(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl),
          }),
        );

        return;
      }

      closeModal();
      notify({
        status: "success",
        text: intl.formatMessage(messages.mediaDeleteSuccess, {
          counter: result.count,
        }),
      });
    },
  });
  const product = data?.product;
  const [deleteMediaType, setDeleteMediaType] = useState<ProductMediaType | null>(null);
  const mediaIdsToDelete = params.ids ?? [];

  useEffect(() => {
    if (params.action !== "remove-media") {
      setDeleteMediaType(null);
    }
  }, [params.action]);

  const isVideoMediaToDelete =
    mediaIdsToDelete.length === 1 && deleteMediaType === ProductMediaType.VIDEO;
  const getAttributeValuesSuggestions = useSearchAttributeValuesSuggestions();
  const [createProductMedia, createProductMediaOpts] = useProductMediaCreateMutation({
    onCompleted: handleProductMediaCreateCompleted,
  });
  const handleMediaUrlUpload = async (mediaUrl: string) => {
    const result = await createProductMedia({
      variables: {
        alt: "",
        mediaUrl,
        product: product.id,
      },
    });

    return result.data?.productMediaCreate?.errors ?? [];
  };
  const handleBack = () => navigate(productListUrl());

  const handleImageDelete = (mediaId: string) => () => {
    const mediaItem = product?.media?.find(item => item.id === mediaId);

    setDeleteMediaType(mediaItem?.type ?? null);
    openModal("remove-media", { ids: [mediaId] });
  };
  const handleImagesDelete = (mediaIds: string[]) => {
    if (mediaIds.length === 0) {
      return;
    }

    if (mediaIds.length === 1) {
      const mediaItem = product?.media?.find(item => item.id === mediaIds[0]);

      setDeleteMediaType(mediaItem?.type ?? null);
    } else {
      setDeleteMediaType(null);
    }

    openModal("remove-media", { ids: mediaIds });
  };
  const handleConfirmMediaDelete = () => {
    const currentMedia = product?.media;

    if (!product || !currentMedia || mediaIdsToDelete.length === 0) {
      return;
    }

    const idsToDelete = new Set(mediaIdsToDelete);

    bulkDeleteProductMedia({
      variables: { ids: mediaIdsToDelete },
      optimisticResponse: {
        __typename: "Mutation",
        productMediaBulkDelete: {
          __typename: "ProductMediaBulkDelete",
          errors: [],
          count: mediaIdsToDelete.length,
        },
      },
      update: cache => {
        cache.modify({
          id: cache.identify(product),
          fields: {
            media(existingMedia = [], { readField }) {
              return existingMedia.filter(
                mediaRef => !idsToDelete.has(readField("id", mediaRef) as string),
              );
            },
          },
        });
      },
    });
  };
  const [submit, submitOpts] = useProductUpdateHandler(product, variants);
  const handleImageUpload = createImageUploadHandler(id, variables =>
    createProductImage({ variables }),
  );
  const handleImagesUploadComplete = createImagesUploadCompleteHandler(notify, intl);
  const handleImageReorder = createImageReorderHandler(product, options =>
    reorderProductImages(options),
  );
  const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
    openModal("assign-attribute-value", { id: attribute.id });
  const disableFormSave =
    submitOpts.loading ||
    deleteProductOpts.loading ||
    reorderProductImagesOpts.loading ||
    (loading && !product);
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

  // Extract productType and pageType constraints from reference attribute for modal filter
  const initialConstraints = useMemo(
    () => getReferenceTypeConstraints(refAttr?.referenceTypes),
    [refAttr?.referenceTypes],
  );

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

  const {
    loadMore: loadMoreReferenceCategories,
    search: searchReferenceCategories,
    result: searchReferenceCategoriesOpts,
  } = useReferenceCategorySearch(refAttr);

  const {
    loadMore: loadMoreReferenceCollections,
    search: searchReferenceCollections,
    result: searchReferenceCollectionsOpts,
  } = useReferenceCollectionSearch(refAttr);

  const onFilterChange = useAssignAttributeValueDialogFilterChangeHandlers({
    refetchProducts: searchProductsOpts.refetch,
    refetchPages: searchPagesOpts.refetch,
    refetchCategories: searchReferenceCategoriesOpts.refetch,
    refetchCollections: searchReferenceCollectionsOpts.refetch,
    referenceWhereConstraints: getReferenceWhereConstraints(initialConstraints),
  });

  const categories = mapEdgesToItems(searchCategoriesOpts?.data?.search) || [];
  const referenceCategories = mapEdgesToItems(searchReferenceCategoriesOpts?.data?.search) || [];
  const collections = mapEdgesToItems(searchCollectionsOpts?.data?.search) || [];
  const attributeValues = getAttributeValues;
  const fetchMoreCollections = getSearchFetchMoreProps(searchCollectionsOpts, loadMoreCollections);
  const fetchMoreCategories = getSearchFetchMoreProps(searchCategoriesOpts, loadMoreCategories);
  const fetchMoreReferenceCategories = getSearchFetchMoreProps(
    searchReferenceCategoriesOpts,
    loadMoreReferenceCategories,
  );
  const fetchMoreReferenceCollections = getSearchFetchMoreProps(
    searchReferenceCollectionsOpts,
    loadMoreReferenceCollections,
  );
  const fetchMoreReferencePages = getSearchFetchMoreProps(searchPagesOpts, loadMorePages);
  const fetchMoreReferenceProducts = getSearchFetchMoreProps(searchProductsOpts, loadMoreProducts);
  const fetchMoreAttributeValues = getFetchMoreAttributeValues;
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
        refetch={async () => {
          await Promise.all([refetch(), refetchVariants()]);
        }}
        limits={limitOpts.data?.shop.limits}
        saveButtonBarState={formTransitionState}
        saveSteps={submitOpts.saveSteps}
        onDismissSaveSteps={submitOpts.clearSaveSteps}
        media={data?.product?.media}
        product={product}
        loading={loading && !product}
        taxClasses={taxClasses ?? []}
        fetchMoreTaxClasses={fetchMoreTaxClasses}
        variants={variants}
        variantsSearch={variantsSearch}
        onVariantsSearchChange={setVariantsSearch}
        variantsPageInfo={variantsPageInfo}
        onVariantsNextPage={loadNextVariantsPage}
        onVariantsPreviousPage={loadPreviousVariantsPage}
        variantsRangeLabel={variantsRangeLabel}
        variantsTotalCount={variantsTotalCount}
        variantsLoading={variantsLoading}
        onDelete={() => openModal("remove")}
        onShowMetadata={() => openModal("view-metadata")}
        onShowSetupChecklist={
          product
            ? () => {
                undismissSetupCard();
                openModal("setup");
              }
            : undefined
        }
        setupEmphasized={setupEmphasized}
        setupCardDismissed={setupCardDismissed}
        setupCardDisplayReady={Boolean(product) && !loading}
        onDismissSetupCard={() => {
          dismissSetupCard();

          if (setupEmphasized) {
            closeModal();
          }
        }}
        onImageReorder={handleImageReorder}
        onMediaUrlUpload={handleMediaUrlUpload}
        onSubmit={submit}
        onVariantShow={variantId =>
          navigate(productVariantEditUrl(variantId), {
            resetScroll: true,
          })
        }
        onImageUpload={handleImageUpload}
        onImagesUploadComplete={handleImagesUploadComplete}
        onImageDelete={handleImageDelete}
        onImagesDelete={handleImagesDelete}
        fetchMoreCategories={fetchMoreCategories}
        fetchMoreCollections={fetchMoreCollections}
        assignReferencesAttributeId={params.action === "assign-attribute-value" && params.id}
        onAssignReferencesClick={handleAssignAttributeReferenceClick}
        referencePages={mapEdgesToItems(searchPagesOpts?.data?.search) || []}
        referenceProducts={mapEdgesToItems(searchProductsOpts?.data?.search) || []}
        referenceCategories={referenceCategories}
        referenceCollections={mapEdgesToItems(searchReferenceCollectionsOpts?.data?.search) || []}
        fetchReferencePages={searchPages}
        fetchMoreReferencePages={fetchMoreReferencePages}
        fetchReferenceProducts={searchProducts}
        fetchMoreReferenceProducts={fetchMoreReferenceProducts}
        fetchReferenceCategories={searchReferenceCategories}
        fetchMoreReferenceCategories={fetchMoreReferenceCategories}
        fetchReferenceCollections={searchReferenceCollections}
        fetchMoreReferenceCollections={fetchMoreReferenceCollections}
        fetchMoreAttributeValues={fetchMoreAttributeValues}
        onCloseDialog={closeModal}
        onAttributeSelectBlur={searchAttributeReset}
        onAttributeValuesSearch={getAttributeValuesSuggestions}
        onFilterChange={onFilterChange}
        initialConstraints={initialConstraints}
      />
      <ProductMetadataDialog
        open={params.action === "view-metadata" && !!product}
        onClose={closeModal}
        product={product}
      />
      <ProductDeleteDialog
        open={params.action === "remove"}
        onClose={closeModal}
        confirmButtonState={deleteProductOpts.status}
        name={product?.name ?? ""}
        onConfirm={() => deleteProduct({ variables: { id } })}
      />
      <ProductMediaDeleteDialog
        open={params.action === "remove-media" && mediaIdsToDelete.length > 0}
        onClose={closeModal}
        confirmButtonState={bulkDeleteProductMediaOpts.status}
        quantity={mediaIdsToDelete.length}
        isVideo={isVideoMediaToDelete}
        onConfirm={handleConfirmMediaDelete}
      />
    </>
  );
};

export default ProductUpdate;
