import {
  extensionMountPoints,
  mapToMenuItemsForProductDetails,
  useExtensions,
} from "@dashboard/apps/hooks/useExtensions";
import {
  getReferenceAttributeEntityTypeFromAttribute,
  mergeAttributeValues,
} from "@dashboard/attributes/utils/data";
import { ChannelData } from "@dashboard/channels/utils";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import AssignAttributeValueDialog from "@dashboard/components/AssignAttributeValueDialog";
import { AttributeInput, Attributes } from "@dashboard/components/Attributes";
import CardSpacer from "@dashboard/components/CardSpacer";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata/Metadata";
import Savebar from "@dashboard/components/Savebar";
import { SeoForm } from "@dashboard/components/SeoForm";
import { Choice } from "@dashboard/components/SingleSelectField";
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
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { maybe } from "@dashboard/misc";
import ProductExternalMediaDialog from "@dashboard/products/components/ProductExternalMediaDialog";
import { defaultGraphiQLQuery } from "@dashboard/products/queries";
import { productImageUrl, productListUrl } from "@dashboard/products/urls";
import { ProductVariantListError } from "@dashboard/products/views/ProductUpdate/handlers/errors";
import { UseProductUpdateHandlerError } from "@dashboard/products/views/ProductUpdate/handlers/useProductUpdateHandler";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { getChoices } from "../../utils/data";
import { ProductDetailsForm } from "../ProductDetailsForm";
import ProductMedia from "../ProductMedia";
import { ProductOrganization } from "../ProductOrganization";
import ProductTaxes from "../ProductTaxes";
import ProductVariants from "../ProductVariants";
import ProductUpdateForm from "./form";
import { messages } from "./messages";
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

  const context = useDevModeContext();

  const openPlaygroundURL = () => {
    context.setDevModeContent(defaultGraphiQLQuery);
    context.setVariables(`{ "id": "${product?.id}" }`);
    context.setDevModeVisibility(true);
  };

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
              ...channel,
              ...listing,
              id: listing.channelId,
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
          <DetailPageLayout>
            <TopNav href={productListUrl()} title={header}>
              <TopNav.Menu
                items={[
                  ...extensionMenuItems,
                  {
                    label: intl.formatMessage(messages.openGraphiQL),
                    onSelect: openPlaygroundURL,
                    testId: "graphiql-redirect",
                  },
                ]}
                dataTestId="menu"
              />
            </TopNav>

            <DetailPageLayout.Content>
              <ProductDetailsForm
                data={data}
                disabled={disabled}
                errors={productErrors}
                onChange={change}
              />
              <CardSpacer />
              <ProductMedia
                media={media}
                onImageDelete={onImageDelete}
                onImageReorder={onImageReorder}
                onImageUpload={onImageUpload}
                openMediaUrlModal={() => setMediaUrlModalStatus(true)}
                getImageEditUrl={imageId => productImageUrl(productId, imageId)}
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
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
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
            </DetailPageLayout.RightSidebar>

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
          </DetailPageLayout>
        );
      }}
    </ProductUpdateForm>
  );
};
ProductUpdatePage.displayName = "ProductUpdatePage";
export default ProductUpdatePage;
