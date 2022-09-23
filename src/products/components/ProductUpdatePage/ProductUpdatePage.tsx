import { OutputData } from "@editorjs/editorjs";
import {
  extensionMountPoints,
  mapToMenuItemsForProductDetails,
  useExtensions,
} from "@saleor/apps/useExtensions";
import {
  getAttributeValuesFromReferences,
  mergeAttributeValues,
} from "@saleor/attributes/utils/data";
import { ChannelData } from "@saleor/channels/utils";
import AssignAttributeValueDialog from "@saleor/components/AssignAttributeValueDialog";
import Attributes, { AttributeInput } from "@saleor/components/Attributes";
import { Backlink } from "@saleor/components/Backlink";
import CardMenu from "@saleor/components/CardMenu";
import CardSpacer from "@saleor/components/CardSpacer";
import ChannelsAvailabilityCard from "@saleor/components/ChannelsAvailabilityCard";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import SeoForm from "@saleor/components/SeoForm";
import {
  PermissionEnum,
  ProductChannelListingErrorFragment,
  ProductDetailsVariantFragment,
  ProductErrorWithAttributesFragment,
  ProductFragment,
  RefreshLimitsQuery,
  SearchAttributeValuesQuery,
  SearchCategoriesQuery,
  SearchCollectionsQuery,
  SearchPagesQuery,
  SearchProductsQuery,
  TaxTypeFragment,
  WarehouseFragment,
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { FormsetData } from "@saleor/hooks/useFormset";
import useNavigator from "@saleor/hooks/useNavigator";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { maybe } from "@saleor/misc";
import ProductExternalMediaDialog from "@saleor/products/components/ProductExternalMediaDialog";
import ProductVariantPrice from "@saleor/products/components/ProductVariantPrice";
import { productImageUrl, productListUrl } from "@saleor/products/urls";
import { ChannelsWithVariantsData } from "@saleor/products/views/ProductUpdate/types";
import {
  ChannelProps,
  FetchMoreProps,
  ListActions,
  RelayToFlat,
  ReorderAction,
} from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import ChannelsWithVariantsAvailabilityCard from "../../../channels/ChannelsWithVariantsAvailabilityCard/ChannelsWithVariantsAvailabilityCard";
import { getChoices, ProductUpdatePageFormData } from "../../utils/data";
import ProductDetailsForm from "../ProductDetailsForm";
import ProductMedia from "../ProductMedia";
import ProductOrganization from "../ProductOrganization";
import ProductShipping from "../ProductShipping/ProductShipping";
import ProductStocks, { ProductStockInput } from "../ProductStocks";
import ProductTaxes from "../ProductTaxes";
import ProductVariants from "../ProductVariants";
import ProductUpdateForm, {
  ProductUpdateData,
  ProductUpdateHandlers,
} from "./form";

export interface ProductUpdatePageProps extends ListActions, ChannelProps {
  productId: string;
  channelsWithVariantsData: ChannelsWithVariantsData;
  setChannelsData: (data: ChannelData[]) => void;
  onChannelsChange: (data: ChannelData[]) => void;
  channelsData: ChannelData[];
  currentChannels: ChannelData[];
  allChannelsCount: number;
  channelsErrors: ProductChannelListingErrorFragment[];
  defaultWeightUnit: string;
  errors: ProductErrorWithAttributesFragment[];
  placeholderImage: string;
  collections: RelayToFlat<SearchCollectionsQuery["search"]>;
  categories: RelayToFlat<SearchCategoriesQuery["search"]>;
  attributeValues: RelayToFlat<
    SearchAttributeValuesQuery["attribute"]["choices"]
  >;
  disabled: boolean;
  fetchMoreCategories: FetchMoreProps;
  fetchMoreCollections: FetchMoreProps;
  isMediaUrlModalVisible?: boolean;
  limits: RefreshLimitsQuery["shop"]["limits"];
  variants: ProductDetailsVariantFragment[];
  media: ProductFragment["media"];
  product: ProductFragment;
  header: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  warehouses: WarehouseFragment[];
  taxTypes: TaxTypeFragment[];
  referencePages?: RelayToFlat<SearchPagesQuery["search"]>;
  referenceProducts?: RelayToFlat<SearchProductsQuery["search"]>;
  assignReferencesAttributeId?: string;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchMoreReferenceProducts?: FetchMoreProps;
  fetchMoreAttributeValues?: FetchMoreProps;
  isSimpleProduct: boolean;
  fetchCategories: (query: string) => void;
  fetchCollections: (query: string) => void;
  fetchReferencePages?: (data: string) => void;
  fetchReferenceProducts?: (data: string) => void;
  fetchAttributeValues: (query: string, attributeId: string) => void;
  onAssignReferencesClick: (attribute: AttributeInput) => void;
  onCloseDialog: () => void;
  onVariantReorder: ReorderAction;
  onVariantEndPreorderDialogOpen: () => void;
  onImageDelete: (id: string) => () => void;
  onSubmit: (data: ProductUpdatePageSubmitData) => SubmitPromise;
  openChannelsModal: () => void;
  onAttributeSelectBlur: () => void;
  onDelete();
  onImageReorder?(event: { oldIndex: number; newIndex: number });
  onImageUpload(file: File);
  onMediaUrlUpload(mediaUrl: string);
  onSeoClick?();
  onSetDefaultVariant(variant: ProductDetailsVariantFragment);
  onWarehouseConfigure();
}

export interface ProductUpdatePageSubmitData extends ProductUpdatePageFormData {
  addStocks: ProductStockInput[];
  attributes: AttributeInput[];
  attributesWithNewFileValue: FormsetData<null, File>;
  collections: string[];
  description: OutputData;
  removeStocks: string[];
  updateStocks: ProductStockInput[];
}

export const ProductUpdatePage: React.FC<ProductUpdatePageProps> = ({
  productId,
  defaultWeightUnit,
  disabled,
  categories: categoryChoiceList,
  channelsErrors,
  collections: collectionChoiceList,
  attributeValues,
  isSimpleProduct,
  errors,
  fetchCategories,
  fetchCollections,
  fetchMoreCategories,
  fetchMoreCollections,
  media,
  header,
  limits,
  placeholderImage,
  product,
  saveButtonBarState,
  variants,
  warehouses,
  setChannelsData,
  taxTypes,
  referencePages = [],
  referenceProducts = [],
  onDelete,
  allChannelsCount,
  currentChannels,
  onImageDelete,
  onImageReorder,
  onImageUpload,
  onMediaUrlUpload,
  openChannelsModal,
  onSeoClick,
  onSubmit,
  channelsData,
  onSetDefaultVariant,
  onVariantReorder,
  onVariantEndPreorderDialogOpen,
  onWarehouseConfigure,
  isChecked,
  isMediaUrlModalVisible,
  selected,
  selectedChannelId,
  toggle,
  toggleAll,
  toolbar,
  assignReferencesAttributeId,
  onAssignReferencesClick,
  fetchReferencePages,
  fetchMoreReferencePages,
  fetchReferenceProducts,
  fetchMoreReferenceProducts,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  onCloseDialog,
  channelsWithVariantsData,
  onChannelsChange,
  onAttributeSelectBlur,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const [selectedCategory, setSelectedCategory] = useStateFromProps(
    product?.category?.name || "",
  );

  const [mediaUrlModalStatus, setMediaUrlModalStatus] = useStateFromProps(
    isMediaUrlModalVisible || false,
  );

  const [selectedCollections, setSelectedCollections] = useStateFromProps(
    getChoices(maybe(() => product.collections, [])),
  );

  const [selectedTaxType, setSelectedTaxType] = useStateFromProps(
    product?.taxType.description,
  );

  const categories = getChoices(categoryChoiceList);
  const collections = getChoices(collectionChoiceList);
  const hasVariants = product?.productType?.hasVariants;
  const taxTypeChoices =
    taxTypes?.map(taxType => ({
      label: taxType.description,
      value: taxType.taxCode,
    })) || [];

  const canOpenAssignReferencesAttributeDialog = !!assignReferencesAttributeId;

  const handleAssignReferenceAttribute = (
    attributeValues: string[],
    data: ProductUpdateData,
    handlers: ProductUpdateHandlers,
  ) => {
    handlers.selectAttributeReference(
      assignReferencesAttributeId,
      mergeAttributeValues(
        assignReferencesAttributeId,
        attributeValues,
        data.attributes,
      ),
    );
    onCloseDialog();
  };

  const { PRODUCT_DETAILS_MORE_ACTIONS } = useExtensions(
    extensionMountPoints.PRODUCT_DETAILS,
  );

  const extensionMenuItems = mapToMenuItemsForProductDetails(
    PRODUCT_DETAILS_MORE_ACTIONS,
    productId,
  );

  return (
    <ProductUpdateForm
      isSimpleProduct={isSimpleProduct}
      currentChannels={currentChannels}
      channelsData={channelsData}
      setChannelsData={setChannelsData}
      onSubmit={onSubmit}
      product={product}
      categories={categories}
      collections={collections}
      channelsWithVariants={channelsWithVariantsData}
      selectedCollections={selectedCollections}
      setSelectedCategory={setSelectedCategory}
      setSelectedCollections={setSelectedCollections}
      setSelectedTaxType={setSelectedTaxType}
      setChannels={onChannelsChange}
      taxTypes={taxTypeChoices}
      warehouses={warehouses}
      hasVariants={hasVariants}
      referencePages={referencePages}
      referenceProducts={referenceProducts}
      fetchReferencePages={fetchReferencePages}
      fetchMoreReferencePages={fetchMoreReferencePages}
      fetchReferenceProducts={fetchReferenceProducts}
      fetchMoreReferenceProducts={fetchMoreReferenceProducts}
      assignReferencesAttributeId={assignReferencesAttributeId}
      disabled={disabled}
    >
      {({
        change,
        data,
        formErrors,
        handlers,
        submit,
        isSaveDisabled,
        attributeRichTextGetters,
      }) => {
        const availabilityCommonProps = {
          managePermissions: [PermissionEnum.MANAGE_PRODUCTS],
          messages: {
            hiddenLabel: intl.formatMessage({
              id: "saKXY3",
              defaultMessage: "Not published",
              description: "product label",
            }),

            visibleLabel: intl.formatMessage({
              id: "qJedl0",
              defaultMessage: "Published",
              description: "product label",
            }),
          },
          errors: channelsErrors,
          allChannelsCount,
          disabled,
          onChange: handlers.changeChannels,
          openModal: openChannelsModal,
        };

        return (
          <>
            <Container>
              <Backlink href={productListUrl()}>
                {intl.formatMessage(sectionNames.products)}
              </Backlink>
              <PageHeader title={header}>
                {extensionMenuItems.length > 0 && (
                  <CardMenu
                    menuItems={extensionMenuItems}
                    data-test-id="menu"
                  />
                )}
              </PageHeader>
              <Grid richText>
                <div>
                  <ProductDetailsForm
                    data={data}
                    disabled={disabled}
                    errors={errors}
                    onChange={change}
                  />
                  <CardSpacer />
                  <ProductMedia
                    media={media}
                    placeholderImage={placeholderImage}
                    onImageDelete={onImageDelete}
                    onImageReorder={onImageReorder}
                    onImageUpload={onImageUpload}
                    openMediaUrlModal={() => setMediaUrlModalStatus(true)}
                    getImageEditUrl={imageId =>
                      productImageUrl(productId, imageId)
                    }
                  />
                  <CardSpacer />
                  {data.attributes.length > 0 && (
                    <Attributes
                      attributes={data.attributes}
                      attributeValues={attributeValues}
                      errors={errors}
                      loading={disabled}
                      disabled={disabled}
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
                  <CardSpacer />
                  {isSimpleProduct && (
                    <>
                      <ProductVariantPrice
                        ProductVariantChannelListings={data.channelListings}
                        errors={channelsErrors}
                        loading={disabled}
                        onChange={handlers.changeChannelPrice}
                      />
                      <CardSpacer />
                    </>
                  )}
                  {hasVariants ? (
                    <ProductVariants
                      productId={productId}
                      disabled={disabled}
                      limits={limits}
                      variants={variants}
                      product={product}
                      onVariantReorder={onVariantReorder}
                      onSetDefaultVariant={onSetDefaultVariant}
                      toolbar={toolbar}
                      isChecked={isChecked}
                      selected={selected}
                      selectedChannelId={selectedChannelId}
                      toggle={toggle}
                      toggleAll={toggleAll}
                    />
                  ) : (
                    <>
                      <ProductShipping
                        data={data}
                        disabled={disabled}
                        errors={errors}
                        weightUnit={product?.weight?.unit || defaultWeightUnit}
                        onChange={change}
                      />
                      <CardSpacer />
                      <ProductStocks
                        onVariantChannelListingChange={
                          handlers.changeChannelPreorder
                        }
                        productVariantChannelListings={data.channelListings}
                        onEndPreorderTrigger={
                          !!variants?.[0]?.preorder
                            ? () => onVariantEndPreorderDialogOpen()
                            : null
                        }
                        data={data}
                        disabled={disabled}
                        hasVariants={false}
                        errors={errors}
                        formErrors={formErrors}
                        stocks={data.stocks}
                        warehouses={warehouses}
                        onChange={handlers.changeStock}
                        onFormDataChange={change}
                        onChangePreorderEndDate={handlers.changePreorderEndDate}
                        onWarehouseStockAdd={handlers.addStock}
                        onWarehouseStockDelete={handlers.deleteStock}
                        onWarehouseConfigure={onWarehouseConfigure}
                      />
                    </>
                  )}
                  <CardSpacer />
                  <SeoForm
                    errors={errors}
                    title={data.seoTitle}
                    titlePlaceholder={data.name}
                    description={data.seoDescription}
                    descriptionPlaceholder={""} // TODO: cast description to string
                    slug={data.slug}
                    slugPlaceholder={data.name}
                    loading={disabled}
                    onClick={onSeoClick}
                    onChange={change}
                    helperText={intl.formatMessage({
                      id: "LKoIB1",
                      defaultMessage:
                        "Add search engine title and description to make this product easier to find",
                    })}
                  />
                  <CardSpacer />
                  <Metadata data={data} onChange={handlers.changeMetadata} />
                </div>
                <div>
                  <ProductOrganization
                    canChangeType={false}
                    categories={categories}
                    categoryInputDisplayValue={selectedCategory}
                    collections={collections}
                    collectionsInputDisplayValue={selectedCollections}
                    data={data}
                    disabled={disabled}
                    errors={[...errors, ...channelsErrors]}
                    fetchCategories={fetchCategories}
                    fetchCollections={fetchCollections}
                    fetchMoreCategories={fetchMoreCategories}
                    fetchMoreCollections={fetchMoreCollections}
                    productType={product?.productType}
                    onCategoryChange={handlers.selectCategory}
                    onCollectionChange={handlers.selectCollection}
                  />
                  <CardSpacer />
                  {isSimpleProduct ? (
                    <ChannelsAvailabilityCard
                      {...availabilityCommonProps}
                      channels={data.channelListings}
                    />
                  ) : product?.variants.length === 0 ? (
                    <ChannelsAvailabilityCard
                      {...availabilityCommonProps}
                      channelsList={data.channelListings}
                    />
                  ) : (
                    <ChannelsWithVariantsAvailabilityCard
                      messages={{
                        hiddenLabel: intl.formatMessage({
                          id: "saKXY3",
                          defaultMessage: "Not published",
                          description: "product label",
                        }),

                        visibleLabel: intl.formatMessage({
                          id: "qJedl0",
                          defaultMessage: "Published",
                          description: "product label",
                        }),
                      }}
                      errors={channelsErrors}
                      channels={data.channelsData}
                      channelsWithVariantsData={channelsWithVariantsData}
                      variants={variants}
                      onChange={handlers.changeChannels}
                      openModal={openChannelsModal}
                    />
                  )}
                  <CardSpacer />
                  <ProductTaxes
                    data={data}
                    disabled={disabled}
                    selectedTaxTypeDisplayName={selectedTaxType}
                    taxTypes={taxTypes}
                    onChange={change}
                    onTaxTypeChange={handlers.selectTaxRate}
                  />
                </div>
              </Grid>
              <Savebar
                onCancel={() => navigate(productListUrl())}
                onDelete={onDelete}
                onSubmit={submit}
                state={saveButtonBarState}
                disabled={isSaveDisabled}
              />
              {canOpenAssignReferencesAttributeDialog && (
                <AssignAttributeValueDialog
                  attributeValues={getAttributeValuesFromReferences(
                    assignReferencesAttributeId,
                    data.attributes,
                    referencePages,
                    referenceProducts,
                  )}
                  hasMore={handlers.fetchMoreReferences?.hasMore}
                  open={canOpenAssignReferencesAttributeDialog}
                  onFetch={handlers.fetchReferences}
                  onFetchMore={handlers.fetchMoreReferences?.onFetchMore}
                  loading={handlers.fetchMoreReferences?.loading}
                  onClose={onCloseDialog}
                  onSubmit={attributeValues =>
                    handleAssignReferenceAttribute(
                      attributeValues,
                      data,
                      handlers,
                    )
                  }
                />
              )}

              <ProductExternalMediaDialog
                product={product}
                onClose={() => setMediaUrlModalStatus(false)}
                open={mediaUrlModalStatus}
                onSubmit={onMediaUrlUpload}
              />
            </Container>
          </>
        );
      }}
    </ProductUpdateForm>
  );
};
ProductUpdatePage.displayName = "ProductUpdatePage";
export default ProductUpdatePage;
