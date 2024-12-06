// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { AttributeInput } from "@dashboard/components/Attributes";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, VALUES_PAGINATE_BY } from "@dashboard/config";
import {
  ProductMediaCreateMutationVariables,
  useProductDeleteMutation,
  useProductDetailsQuery,
  useProductMediaCreateMutation,
  useProductMediaDeleteMutation,
  useProductMediaReorderMutation,
} from "@dashboard/graphql";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages, errorMessages } from "@dashboard/intl";
import { useSearchAttributeValuesSuggestions } from "@dashboard/searches/useAttributeValueSearch";
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
import usePageSearch from "@dashboard/searches/usePageSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";
import { useTaxClassFetchMore } from "@dashboard/taxes/utils/useTaxClassFetchMore";
import { getProductErrorMessage } from "@dashboard/utils/errors";
import useAttributeValueSearchHandler from "@dashboard/utils/handlers/attributeValueSearchHandler";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";
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

export const ProductUpdate = ({ id, params }: ProductUpdateProps) => {
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
    loadMore: loadMorePages,
    search: searchPages,
    result: searchPagesOpts,
  } = usePageSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMoreProducts,
    search: searchProducts,
    result: searchProductsOpts,
  } = useProductSearch({
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
        text: intl.formatMessage(commonMessages.savedChanges),
      }),
  });
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
          text: intl.formatMessage(commonMessages.savedChanges),
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
          navigate(productVariantEditUrl(product.id, variantId), {
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
        fetchReferencePages={searchPages}
        fetchMoreReferencePages={fetchMoreReferencePages}
        fetchReferenceProducts={searchProducts}
        fetchMoreReferenceProducts={fetchMoreReferenceProducts}
        fetchMoreAttributeValues={fetchMoreAttributeValues}
        onCloseDialog={() => navigate(productUrl(id), { resetScroll: false })}
        onAttributeSelectBlur={searchAttributeReset}
        onAttributeValuesSearch={getAttributeValuesSuggestions}
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
