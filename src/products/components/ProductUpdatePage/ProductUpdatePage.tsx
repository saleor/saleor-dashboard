import {
  extensionMountPoints,
  mapToMenuItemsForProductDetails,
  useExtensions,
} from "@saleor/apps/useExtensions";
import {
  getReferenceAttributeEntityTypeFromAttribute,
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
import { Choice } from "@saleor/components/SingleSelectField";
import {
  ChannelFragment,
  PermissionEnum,
  ProductChannelListingErrorFragment,
  ProductDetailsVariantFragment,
  ProductErrorFragment,
  ProductErrorWithAttributesFragment,
  ProductFragment,
  RefreshLimitsQuery,
  SearchAttributeValuesQuery,
  SearchCategoriesQuery,
  SearchCollectionsQuery,
  SearchPagesQuery,
  SearchProductsQuery,
  TaxClassBaseFragment,
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
import { ProductVariantListError } from "@saleor/products/views/ProductUpdate/handlers/errors";
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
import ProductUpdateForm from "./form";
import ProductChannelsListingsDialog from "./ProductChannelsListingsDialog";
import {
  ProductUpdateData,
  ProductUpdateHandlers,
  ProductUpdateSubmitData,
} from "./types";

export interface ProductUpdatePageProps {
  channels: ChannelFragment[];
  productId: string;
  channelsErrors: ProductChannelListingErrorFragment[];
  variantListErrors: ProductVariantListError[];
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
  taxClasses: TaxClassBaseFragment[];
  fetchMoreTaxClasses: FetchMoreProps;
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
  refetch: () => Promise<any>;
  onAttributeValuesSearch: (
    id: string,
    query: string,
  ) => Promise<Array<Choice<string, string>>>;
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
  variantListErrors,
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
  taxClasses,
  fetchMoreTaxClasses,
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
  onAttributeValuesSearch,
  onAssignReferencesClick,
  fetchReferencePages,
  fetchMoreReferencePages,
  fetchReferenceProducts,
  fetchMoreReferenceProducts,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  refetch,
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

  const [selectedTaxClass, setSelectedTaxClass] = useStateFromProps(
    product?.taxClass?.name ?? "",
  );

  const categories = getChoices(categoryChoiceList);
  const collections = getChoices(collectionChoiceList);
  const hasVariants = product?.productType?.hasVariants;
  const taxClassesChoices =
    taxClasses?.map(taxClass => ({
      label: taxClass.name,
      value: taxClass.id,
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

  const productOrganizationErrors = React.useMemo(
    () =>
      [...errors, ...channelsErrors].filter(err =>
        ["ProductChannelListingError", "ProductError"].includes(err.__typename),
      ) as Array<ProductErrorFragment | ProductChannelListingErrorFragment>,
    [errors, channelsErrors],
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
      setSelectedTaxClass={setSelectedTaxClass}
      taxClasses={taxClassesChoices}
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
      refetch={refetch}
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

        const listings = data.channels.updateChannels.map<ChannelData>(
          listing => {
            const channel = channels?.find(ac => ac.id === listing.channelId);
            return {
              id: listing.channelId,
              ...channel,
              ...listing,
              availableForPurchase: listing.availableForPurchaseDate,
              currency: channel.currencyCode,
            };
          },
        );

        const entityType = getReferenceAttributeEntityTypeFromAttribute(
          assignReferencesAttributeId,
          data.attributes,
        );

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
                    productName={product?.name}
                    errors={variantListErrors}
                    channels={listings}
                    limits={limits}
                    variants={variants}
                    variantAttributes={product?.productType.variantAttributes}
                    warehouses={warehouses}
                    onAttributeValuesSearch={onAttributeValuesSearch}
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
                    errors={productOrganizationErrors}
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
                    channels={listings}
                  />
                  <CardSpacer />
                  <ProductTaxes
                    value={data.taxClassId}
                    disabled={disabled}
                    onChange={handlers.selectTaxClass}
                    taxClassDisplayName={selectedTaxClass}
                    taxClasses={taxClasses}
                    onFetchMore={fetchMoreTaxClasses}
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
              {canOpenAssignReferencesAttributeDialog && entityType && (
                <AssignAttributeValueDialog
                  entityType={entityType}
                  confirmButtonState={"default"}
                  products={referenceProducts}
                  pages={referencePages}
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
              <ProductChannelsListingsDialog
                channels={channels}
                data={data}
                onClose={() => setChannelPickerOpen(false)}
                open={channelPickerOpen}
                onConfirm={handlers.updateChannelList}
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
