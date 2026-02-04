// @ts-strict-ignore
import { QueryResult } from "@apollo/client";
import {
  getReferenceAttributeEntityTypeFromAttribute,
  handleContainerReferenceAssignment,
} from "@dashboard/attributes/utils/data";
import { useUser } from "@dashboard/auth";
import { hasPermission } from "@dashboard/auth/misc";
import { ChannelPriceData } from "@dashboard/channels/utils";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import AssignAttributeValueDialog from "@dashboard/components/AssignAttributeValueDialog";
import {
  AttributeInput,
  Attributes,
  VariantAttributeScope,
} from "@dashboard/components/Attributes";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Grid from "@dashboard/components/Grid";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Link from "@dashboard/components/Link";
import { Metadata } from "@dashboard/components/Metadata/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import {
  PermissionEnum,
  ProductChannelListingErrorFragment,
  ProductErrorWithAttributesFragment,
  ProductVariantFragment,
  SearchAttributeValuesQuery,
  SearchCategoriesQuery,
  SearchCollectionsQuery,
  SearchPagesQuery,
  SearchProductsQuery,
  SearchWarehousesQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { VariantDetailsChannelsAvailabilityCard } from "@dashboard/products/components/ProductVariantChannels/ChannelsAvailabilityCard";
import { productUrl } from "@dashboard/products/urls";
import { getSelectedMedia } from "@dashboard/products/utils/data";
import { productTypeUrl } from "@dashboard/productTypes/urls";
import { TranslationsButton } from "@dashboard/translations/components/TranslationsButton/TranslationsButton";
import { productVariantUrl } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { Container, FetchMoreProps, RelayToFlat, ReorderAction } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, Skeleton, Text, Tooltip } from "@saleor/macaw-ui-next";
import { CircleHelp } from "lucide-react";
import { useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { ProductShipping } from "../ProductShipping";
import { ProductStocks } from "../ProductStocks";
import { useManageChannels } from "../ProductVariantChannels/useManageChannels";
import { VariantChannelsDialog } from "../ProductVariantChannels/VariantChannelsDialog";
import ProductVariantCheckoutSettings from "../ProductVariantCheckoutSettings/ProductVariantCheckoutSettings";
import ProductVariantEndPreorderDialog from "../ProductVariantEndPreorderDialog";
import ProductVariantMediaSelectDialog from "../ProductVariantImageSelectDialog";
import ProductVariantMedia from "../ProductVariantMedia";
import ProductVariantName from "../ProductVariantName";
import ProductVariantNavigation from "../ProductVariantNavigation";
import { ProductVariantPrice } from "../ProductVariantPrice";
import ProductVariantSetDefault from "../ProductVariantSetDefault";
import {
  ProductVariantUpdateData,
  ProductVariantUpdateForm,
  ProductVariantUpdateHandlers,
  ProductVariantUpdateSubmitData,
} from "./form";
import { VariantAttributesSection } from "./VariantAttributesSection";

const messages = defineMessages({
  nonSelectionAttributes: {
    id: "f3B4tc",
    defaultMessage: "Variant Attributes",
    description: "attributes, section header",
  },
  selectionAttributesHeader: {
    id: "o6260f",
    defaultMessage: "Variant Selection Attributes",
    description: "attributes, section header",
  },
});

function byAttributeScope(scope: VariantAttributeScope) {
  return (attribute: AttributeInput) => attribute.data.variantAttributeScope === scope;
}

interface ProductVariantPageProps {
  productId: string;
  assignReferencesAttributeId?: string;
  defaultVariantId?: string;
  defaultWeightUnit: string;
  errors: ProductErrorWithAttributesFragment[];
  header: string;
  channels: ChannelPriceData[];
  channelErrors: ProductChannelListingErrorFragment[];
  /** Whether the product type supports variant attributes */
  hasVariants: boolean;
  loading?: boolean;
  placeholderImage?: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  variant?: ProductVariantFragment;
  referencePages?: RelayToFlat<SearchPagesQuery["search"]>;
  referenceProducts?: RelayToFlat<SearchProductsQuery["search"]>;
  referenceCategories?: RelayToFlat<SearchCategoriesQuery["search"]>;
  referenceCollections?: RelayToFlat<SearchCollectionsQuery["search"]>;
  attributeValues: RelayToFlat<SearchAttributeValuesQuery["attribute"]["choices"]>;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchMoreReferenceProducts?: FetchMoreProps;
  fetchMoreReferenceCategories?: FetchMoreProps;
  fetchMoreReferenceCollections?: FetchMoreProps;
  fetchMoreAttributeValues?: FetchMoreProps;
  fetchReferencePages?: (data: string) => void;
  fetchReferenceProducts?: (data: string) => void;
  fetchReferenceCategories?: (data: string) => void;
  fetchReferenceCollections?: (data: string) => void;
  fetchAttributeValues: (query: string, attributeId: string) => void;
  onAssignReferencesClick: (attribute: AttributeInput) => void;
  onCloseDialog: () => void;
  onVariantPreorderDeactivate: (id: string) => void;
  variantDeactivatePreoderButtonState: ConfirmButtonTransitionState;
  onVariantReorder: ReorderAction;
  onAttributeSelectBlur: () => void;
  onDelete: () => any;
  onSubmit: (data: ProductVariantUpdateSubmitData) => any;
  onSetDefaultVariant: () => any;
  onWarehouseConfigure: () => any;
  fetchMoreWarehouses: () => void;
  searchWarehousesResult: QueryResult<SearchWarehousesQuery>;
  searchWarehouses: (query: string) => void;
}

export const ProductVariantPage = ({
  productId,
  channels,
  channelErrors,
  defaultVariantId,
  defaultWeightUnit,
  errors: apiErrors,
  hasVariants,
  header,
  loading,
  placeholderImage,
  saveButtonBarState,
  variant,
  referencePages = [],
  referenceProducts = [],
  referenceCategories = [],
  referenceCollections = [],
  attributeValues,
  onDelete,
  onSubmit,
  onVariantPreorderDeactivate,
  variantDeactivatePreoderButtonState,
  onVariantReorder,
  onSetDefaultVariant,
  onWarehouseConfigure,
  assignReferencesAttributeId,
  onAssignReferencesClick,
  fetchReferencePages,
  fetchReferenceProducts,
  fetchReferenceCategories,
  fetchReferenceCollections,
  fetchAttributeValues,
  fetchMoreReferencePages,
  fetchMoreReferenceProducts,
  fetchMoreReferenceCategories,
  fetchMoreReferenceCollections,
  fetchMoreAttributeValues,
  onCloseDialog,
  onAttributeSelectBlur,
  fetchMoreWarehouses,
  searchWarehousesResult,
  searchWarehouses,
}: ProductVariantPageProps) => {
  const intl = useIntl();
  const { user } = useUser();
  const canTranslate = user && hasPermission(PermissionEnum.MANAGE_TRANSLATIONS, user);
  const { lastUsedLocaleOrFallback } = useCachedLocales();
  const navigate = useNavigator();
  const { isOpen: isManageChannelsModalOpen, toggle: toggleManageChannels } = useManageChannels();
  const [isModalOpened, setModalStatus] = useState(false);
  const toggleModal = () => setModalStatus(!isModalOpened);
  const [isEndPreorderModalOpened, setIsEndPreorderModalOpened] = useState(false);
  const productMedia = [...(variant?.product?.media ?? [])]?.sort((prev, next) =>
    prev.sortOrder > next.sortOrder ? 1 : -1,
  );
  const canOpenAssignReferencesAttributeDialog = !!assignReferencesAttributeId;
  const handleDeactivatePreorder = async () => {
    await onVariantPreorderDeactivate(variant.id);
    setIsEndPreorderModalOpened(false);
  };
  const handleAssignReferenceAttribute = (
    attributeValues: Container[],
    data: ProductVariantUpdateData,
    handlers: ProductVariantUpdateHandlers,
  ) => {
    handleContainerReferenceAssignment(
      assignReferencesAttributeId,
      attributeValues,
      data.attributes,
      handlers,
    );
    onCloseDialog();
  };

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={productUrl(productId)}
        title={
          loading ? (
            <Skeleton __width="200px" />
          ) : (
            <Box display="flex" alignItems="center" gap={1}>
              <Text
                size={6}
                color="default2"
                ellipsis
                __maxWidth="200px"
                title={variant?.product?.name}
              >
                {variant?.product?.name}
              </Text>
              <Text size={6} color="default2">
                /
              </Text>
              <Text size={6}>{header}</Text>
            </Box>
          )
        }
      >
        {variant?.product?.defaultVariant?.id !== variant?.id && (
          <Box marginRight={3}>
            <ProductVariantSetDefault onSetDefaultVariant={onSetDefaultVariant} />
          </Box>
        )}
        {canTranslate && (
          <TranslationsButton
            onClick={() =>
              navigate(productVariantUrl(lastUsedLocaleOrFallback, productId, variant?.id))
            }
          />
        )}
      </TopNav>
      <DetailPageLayout.Content>
        <ProductVariantUpdateForm
          key={variant?.id}
          variant={variant}
          onSubmit={onSubmit}
          currentChannels={channels}
          referencePages={referencePages}
          referenceProducts={referenceProducts}
          referenceCategories={referenceCategories}
          referenceCollections={referenceCollections}
          fetchReferencePages={fetchReferencePages}
          fetchMoreReferencePages={fetchMoreReferencePages}
          fetchReferenceProducts={fetchReferenceProducts}
          fetchMoreReferenceProducts={fetchMoreReferenceProducts}
          fetchReferenceCategories={fetchReferenceCategories}
          fetchMoreReferenceCategories={fetchMoreReferenceCategories}
          fetchReferenceCollections={fetchReferenceCollections}
          fetchMoreReferenceCollections={fetchMoreReferenceCollections}
          assignReferencesAttributeId={assignReferencesAttributeId}
          loading={loading}
        >
          {({
            change,
            data,
            validationErrors,
            isSaveDisabled,
            handlers,
            submit,
            attributeRichTextGetters,
          }) => {
            const nonSelectionAttributes = data.attributes.filter(
              byAttributeScope(VariantAttributeScope.NOT_VARIANT_SELECTION),
            );
            const selectionAttributes = data.attributes.filter(
              byAttributeScope(VariantAttributeScope.VARIANT_SELECTION),
            );
            const media = getSelectedMedia(productMedia, data.media);
            const errors = [...apiErrors, ...validationErrors];
            const priceVariantErrors = [...channelErrors, ...validationErrors];

            return (
              <>
                <Grid variant="inverted">
                  <div>
                    <ProductVariantNavigation
                      productId={productId}
                      current={variant?.id}
                      defaultVariantId={defaultVariantId}
                      fallbackThumbnail={variant?.product?.thumbnail?.url}
                      variants={variant?.product.variants}
                      loading={loading}
                      onReorder={onVariantReorder}
                    />
                  </div>
                  <div>
                    <ProductVariantName
                      value={data.variantName}
                      onChange={change}
                      disabled={loading}
                      errors={errors}
                    />
                    <CardSpacer />
                    <VariantDetailsChannelsAvailabilityCard
                      variant={variant}
                      listings={data.channelListings}
                      disabled={loading}
                      onManageClick={toggleManageChannels}
                    />
                    {variant?.product?.productType && (
                      <VariantAttributesSection
                        title={intl.formatMessage(messages.nonSelectionAttributes)}
                        attributes={nonSelectionAttributes}
                        totalAttributesCount={data.attributes.length}
                        selectionAttributesExist={selectionAttributes.length > 0}
                        hasVariants={hasVariants}
                        attributeValues={attributeValues}
                        productTypeName={variant.product.productType.name}
                        productTypeUrl={productTypeUrl(variant.product.productType.id)}
                        loading={loading}
                        errors={errors}
                        onChange={handlers.selectAttribute}
                        onMultiChange={handlers.selectAttributeMultiple}
                        onFileChange={handlers.selectAttributeFile}
                        onReferencesRemove={handlers.selectAttributeReference}
                        onReferencesAddClick={onAssignReferencesClick}
                        onReferencesReorder={handlers.reorderAttributeValue}
                        fetchAttributeValues={fetchAttributeValues}
                        fetchMoreAttributeValues={fetchMoreAttributeValues}
                        onAttributeSelectBlur={onAttributeSelectBlur}
                        richTextGetters={attributeRichTextGetters}
                      />
                    )}
                    {hasVariants && selectionAttributes.length > 0 && (
                      <>
                        <CardSpacer />
                        <Attributes
                          title={
                            <Box display="flex" alignItems="center" gap={2}>
                              <Text size={5} fontWeight="bold">
                                {intl.formatMessage(messages.selectionAttributesHeader)}
                              </Text>
                              <Tooltip>
                                <Tooltip.Trigger>
                                  <Box color="default2" display="flex" alignItems="center">
                                    <CircleHelp
                                      size={iconSize.small}
                                      strokeWidth={iconStrokeWidthBySize.small}
                                    />
                                  </Box>
                                </Tooltip.Trigger>
                                <Tooltip.Content side="bottom">
                                  <Tooltip.Arrow />
                                  <FormattedMessage
                                    id="LhGd2m"
                                    defaultMessage="Attributes that define variant options customers can choose from on the storefront.{br}Can be adjusted in the {productTypeLink} settings."
                                    description="tooltip for variant selection attributes"
                                    values={{
                                      br: <br />,
                                      productTypeLink: variant?.product?.productType ? (
                                        <Link href={productTypeUrl(variant.product.productType.id)}>
                                          {variant.product.productType.name}
                                        </Link>
                                      ) : null,
                                    }}
                                  />
                                </Tooltip.Content>
                              </Tooltip>
                            </Box>
                          }
                          attributes={selectionAttributes}
                          attributeValues={attributeValues}
                          loading={loading}
                          disabled={loading}
                          errors={errors}
                          onChange={handlers.selectAttribute}
                          onMultiChange={handlers.selectAttributeMultiple}
                          onFileChange={handlers.selectAttributeFile}
                          onReferencesRemove={handlers.selectAttributeReference}
                          onReferencesAddClick={onAssignReferencesClick}
                          onReferencesReorder={handlers.reorderAttributeValue}
                          fetchAttributeValues={fetchAttributeValues}
                          fetchMoreAttributeValues={fetchMoreAttributeValues}
                          onAttributeSelectBlur={onAttributeSelectBlur}
                          richTextGetters={attributeRichTextGetters}
                        />
                        <CardSpacer />
                      </>
                    )}
                    <ProductVariantMedia
                      disabled={loading || productMedia.length === 0}
                      media={media}
                      placeholderImage={placeholderImage}
                      onImageAdd={toggleModal}
                    />
                    <CardSpacer />
                    <ProductVariantPrice
                      disabled={!variant}
                      productVariantChannelListings={data.channelListings.map(channel => ({
                        ...channel.data,
                        ...channel.value,
                      }))}
                      errors={priceVariantErrors}
                      loading={loading}
                      onChange={handlers.changeChannels}
                    />
                    <CardSpacer />
                    <ProductVariantCheckoutSettings
                      data={data}
                      disabled={loading}
                      errors={errors}
                      onChange={change}
                    />
                    <CardSpacer />

                    <ProductShipping
                      data={data}
                      disabled={loading}
                      errors={errors}
                      weightUnit={variant?.weight?.unit || defaultWeightUnit}
                      onChange={change}
                    />
                    <CardSpacer />
                    <ProductStocks
                      productVariantChannelListings={data.channelListings.map(channel => ({
                        ...channel.data,
                        ...channel.value,
                      }))}
                      warehouses={mapEdgesToItems(searchWarehousesResult?.data?.search) ?? []}
                      fetchMoreWarehouses={fetchMoreWarehouses}
                      hasMoreWarehouses={
                        searchWarehousesResult?.data?.search?.pageInfo?.hasNextPage
                      }
                      data={data}
                      loading={loading}
                      hasVariants={true}
                      errors={errors}
                      stocks={data.stocks}
                      onChange={handlers.changeStock}
                      onFormDataChange={change}
                      onWarehouseStockAdd={handlers.addStock}
                      onWarehouseStockDelete={handlers.deleteStock}
                      onWarehouseConfigure={onWarehouseConfigure}
                      isCreate={false}
                      searchWarehouses={searchWarehouses}
                    />
                    <CardSpacer />
                    <Metadata data={data} onChange={handlers.changeMetadata} />
                  </div>
                </Grid>
                <Savebar>
                  <Savebar.DeleteButton onClick={onDelete} />
                  <Savebar.Spacer />
                  <Savebar.CancelButton onClick={() => navigate(productUrl(productId))} />
                  <Savebar.ConfirmButton
                    transitionState={saveButtonBarState}
                    onClick={submit}
                    disabled={isSaveDisabled}
                  />
                </Savebar>
                {canOpenAssignReferencesAttributeDialog && (
                  <AssignAttributeValueDialog
                    entityType={getReferenceAttributeEntityTypeFromAttribute(
                      assignReferencesAttributeId,
                      data.attributes,
                    )}
                    confirmButtonState={"default"}
                    products={referenceProducts}
                    pages={referencePages}
                    collections={referenceCollections}
                    categories={referenceCategories}
                    attribute={data.attributes.find(({ id }) => id === assignReferencesAttributeId)}
                    hasMore={handlers.fetchMoreReferences?.hasMore}
                    open={canOpenAssignReferencesAttributeDialog}
                    onFetch={handlers.fetchReferences}
                    onFetchMore={handlers.fetchMoreReferences?.onFetchMore}
                    loading={handlers.fetchMoreReferences?.loading}
                    onClose={onCloseDialog}
                    onSubmit={attributeValues =>
                      handleAssignReferenceAttribute(attributeValues, data, handlers)
                    }
                  />
                )}
                {variant && (
                  <>
                    <VariantChannelsDialog
                      channelListings={variant.product.channelListings}
                      selectedChannelListings={data.channelListings}
                      open={isManageChannelsModalOpen}
                      onClose={toggleManageChannels}
                      onConfirm={handlers.updateChannels}
                    />
                    <ProductVariantMediaSelectDialog
                      onClose={toggleModal}
                      onConfirm={handlers.changeMedia}
                      open={isModalOpened}
                      media={productMedia}
                      selectedMedia={data.media}
                    />
                  </>
                )}
              </>
            );
          }}
        </ProductVariantUpdateForm>
      </DetailPageLayout.Content>
      {!!variant?.preorder && (
        <ProductVariantEndPreorderDialog
          confirmButtonState={variantDeactivatePreoderButtonState}
          onClose={() => setIsEndPreorderModalOpened(false)}
          onConfirm={handleDeactivatePreorder}
          open={isEndPreorderModalOpened}
          variantGlobalSoldUnits={variant?.preorder?.globalSoldUnits}
        />
      )}
    </DetailPageLayout>
  );
};

ProductVariantPage.displayName = "ProductVariantPage";
