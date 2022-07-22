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
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import SeoForm from "@saleor/components/SeoForm";
import {
  ChannelFragment,
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
import useNavigator from "@saleor/hooks/useNavigator";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { maybe } from "@saleor/misc";
import ProductExternalMediaDialog from "@saleor/products/components/ProductExternalMediaDialog";
import { productImageUrl, productListUrl } from "@saleor/products/urls";
import { UseProductUpdateHandlerError } from "@saleor/products/views/ProductUpdate/handlers/useProductUpdateHandler";
import { FetchMoreProps, RelayToFlat } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import { getChoices } from "../../utils/data";
import ProductDetailsForm from "../ProductDetailsForm";
import ProductMedia from "../ProductMedia";
import ProductOrganization from "../ProductOrganization";
import ProductTaxes from "../ProductTaxes";
import ProductVariants from "../ProductVariants";
import ProductUpdateForm, {
  ProductUpdateData,
  ProductUpdateHandlers,
  ProductUpdateSubmitData,
} from "./form";

export interface ProductUpdatePageProps {
  channels: ChannelFragment[];
  productId: string;
  channelsErrors: ProductChannelListingErrorFragment[];
  errors: UseProductUpdateHandlerError[];
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
  onImageDelete: (id: string) => () => void;
  onSubmit: (data: ProductUpdateSubmitData) => SubmitPromise;
  onVariantShow: (id: string) => void;
  onAttributeSelectBlur: () => void;
  onDelete();
  onImageReorder?(event: { oldIndex: number; newIndex: number });
  onImageUpload(file: File);
  onMediaUrlUpload(mediaUrl: string);
  onSeoClick?();
}

export const ProductUpdatePage: React.FC<ProductUpdatePageProps> = ({
  productId,
  disabled,
  categories: categoryChoiceList,
  channels,
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
  taxTypes,
  referencePages = [],
  referenceProducts = [],
  onDelete,
  onImageDelete,
  onImageReorder,
  onImageUpload,
  onMediaUrlUpload,
  onVariantShow,
  onSeoClick,
  onSubmit,
  isMediaUrlModalVisible,
  assignReferencesAttributeId,
  onAssignReferencesClick,
  fetchReferencePages,
  fetchMoreReferencePages,
  fetchReferenceProducts,
  fetchMoreReferenceProducts,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  onCloseDialog,
  onAttributeSelectBlur,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const [channelPickerOpen, setChannelPickerOpen] = React.useState(false);

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

  const productErrors = React.useMemo(
    () =>
      errors.filter(
        error => error.__typename === "ProductError",
      ) as ProductErrorWithAttributesFragment[],
    [errors],
  );

  const extensionMenuItems = mapToMenuItemsForProductDetails(
    PRODUCT_DETAILS_MORE_ACTIONS,
    productId,
  );

  return (
    <ProductUpdateForm
      isSimpleProduct={isSimpleProduct}
      onSubmit={onSubmit}
      product={product}
      categories={categories}
      collections={collections}
      selectedCollections={selectedCollections}
      setSelectedCategory={setSelectedCategory}
      setSelectedCollections={setSelectedCollections}
      setSelectedTaxType={setSelectedTaxType}
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
          allChannelsCount: channels?.length,
          disabled,
          onChange: handlers.changeChannels,
          openModal: () => setChannelPickerOpen(true),
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
                    errors={productErrors}
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
                      errors={productErrors}
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
                  <ProductVariants
                    limits={limits}
                    variants={variants}
                    variantAttributes={product?.productType.variantAttributes}
                    warehouses={warehouses}
                    onChange={handlers.changeVariants}
                    onRowClick={onVariantShow}
                  />
                  <CardSpacer />
                  <SeoForm
                    errors={productErrors}
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
                    errors={productErrors}
                    fetchCategories={fetchCategories}
                    fetchCollections={fetchCollections}
                    fetchMoreCategories={fetchMoreCategories}
                    fetchMoreCollections={fetchMoreCollections}
                    productType={product?.productType}
                    onCategoryChange={handlers.selectCategory}
                    onCollectionChange={handlers.selectCollection}
                  />
                  <CardSpacer />
                  <ChannelsAvailabilityCard
                    {...availabilityCommonProps}
                    channels={data.channels.updateChannels.map<ChannelData>(
                      listing => ({
                        id: listing.channelId,
                        ...channels?.find(ac => ac.id === listing.channelId),
                        ...listing,
                        availableForPurchase: listing.availableForPurchaseDate,
                      }),
                    )}
                  />
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
              <ChannelsAvailabilityDialog
                isSelected={({ id }) =>
                  !!data.channels.updateChannels.find(
                    listing => listing.channelId === id,
                  )
                }
                channels={channels}
                onChange={({ id }) => handlers.toggleChannel(id)}
                onClose={() => setChannelPickerOpen(false)}
                open={channelPickerOpen}
                title={intl.formatMessage({
                  id: "Eau5AV",
                  defaultMessage: "Manage Products Channel Availability",
                })}
                confirmButtonState="default"
                selected={data.channels.updateChannels.length}
                onConfirm={() => setChannelPickerOpen(false)}
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
