// @ts-strict-ignore
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
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { SeoForm } from "@dashboard/components/SeoForm";
import {
  ChannelFragment,
  PermissionEnum,
  ProductChannelListingErrorFragment,
  ProductDetailsQuery,
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
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { maybe } from "@dashboard/misc";
import ProductExternalMediaDialog from "@dashboard/products/components/ProductExternalMediaDialog";
import { ProductOrganization } from "@dashboard/products/components/ProductOrganization/ProductOrganization";
import { mapByChannel } from "@dashboard/products/components/ProductUpdatePage/utils";
import { defaultGraphiQLQuery } from "@dashboard/products/queries";
import { productImageUrl, productListPath, productListUrl } from "@dashboard/products/urls";
import { ChoiceWithAncestors, getChoicesWithAncestors } from "@dashboard/products/utils/utils";
import { ProductVariantListError } from "@dashboard/products/views/ProductUpdate/handlers/errors";
import { UseProductUpdateHandlerError } from "@dashboard/products/views/ProductUpdate/handlers/useProductUpdateHandler";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { Box, Option } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { AttributeValuesMetadata, getChoices } from "../../utils/data";
import { ProductDetailsForm } from "../ProductDetailsForm";
import ProductMedia from "../ProductMedia";
import ProductTaxes from "../ProductTaxes";
import ProductVariants from "../ProductVariants";
import ProductUpdateForm from "./form";
import { messages } from "./messages";
import ProductChannelsListingsDialog from "./ProductChannelsListingsDialog";
import { ProductUpdateData, ProductUpdateHandlers, ProductUpdateSubmitData } from "./types";

export interface ProductUpdatePageProps {
  channels: ChannelFragment[];
  productId: string;
  channelsErrors: ProductChannelListingErrorFragment[];
  variantListErrors: ProductVariantListError[];
  errors: UseProductUpdateHandlerError[];
  collections: RelayToFlat<SearchCollectionsQuery["search"]>;
  categories: RelayToFlat<SearchCategoriesQuery["search"]>;
  attributeValues: RelayToFlat<SearchAttributeValuesQuery["attribute"]["choices"]>;
  disabled: boolean;
  fetchMoreCategories: FetchMoreProps;
  fetchMoreCollections: FetchMoreProps;
  isMediaUrlModalVisible?: boolean;
  limits: RefreshLimitsQuery["shop"]["limits"];
  variants: ProductDetailsVariantFragment[];
  media: ProductFragment["media"];
  product: ProductDetailsQuery["product"];
  header: string;
  saveButtonBarState: ConfirmButtonTransitionState;
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
  onAttributeValuesSearch: (id: string, query: string) => Promise<Option[]>;
  onAssignReferencesClick: (attribute: AttributeInput) => void;
  onCloseDialog: () => void;
  onImageDelete: (id: string) => () => void;
  onSubmit: (data: ProductUpdateSubmitData) => SubmitPromise;
  onVariantShow: (id: string) => void;
  onAttributeSelectBlur: () => void;
  onDelete: () => any;
  onImageReorder?: (event: { oldIndex: number; newIndex: number }) => any;
  onImageUpload: (file: File) => any;
  onMediaUrlUpload: (mediaUrl: string) => any;
  onSeoClick?: () => any;
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
  const [selectedCategory, setSelectedCategory] = useStateFromProps(product?.category?.name || "");
  const [mediaUrlModalStatus, setMediaUrlModalStatus] = useStateFromProps(
    isMediaUrlModalVisible || false,
  );
  const [selectedCollections, setSelectedCollections] = useStateFromProps(
    getChoices(maybe(() => product.collections, [])),
  );
  const [selectedTaxClass, setSelectedTaxClass] = useStateFromProps(product?.taxClass?.name ?? "");
  const categories = getChoicesWithAncestors(categoryChoiceList);
  const selectedProductCategory = product?.category
    ? getChoicesWithAncestors([product.category as ChoiceWithAncestors])[0]
    : undefined;
  const collections = getChoices(collectionChoiceList);
  const hasVariants = product?.productType?.hasVariants;
  const taxClassesChoices =
    taxClasses?.map(taxClass => ({
      label: taxClass.name,
      value: taxClass.id,
    })) || [];
  const canOpenAssignReferencesAttributeDialog = !!assignReferencesAttributeId;
  const handleAssignReferenceAttribute = (
    attributeValues: AttributeValuesMetadata[],
    data: ProductUpdateData,
    handlers: ProductUpdateHandlers,
  ) => {
    handlers.selectAttributeReference(
      assignReferencesAttributeId,
      mergeAttributeValues(
        assignReferencesAttributeId,
        attributeValues.map(({ value }) => value),
        data.attributes,
      ),
    );
    handlers.selectAttributeReferenceMetadata(assignReferencesAttributeId, attributeValues);
    onCloseDialog();
  };
  const { PRODUCT_DETAILS_MORE_ACTIONS } = useExtensions(extensionMountPoints.PRODUCT_DETAILS);
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
  const backLinkProductUrl = useBackLinkWithState({
    path: productListPath,
  });

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
      {({ change, data, handlers, submit, isSaveDisabled, attributeRichTextGetters }) => {
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

        const byChannel = mapByChannel(channels);
        const listings = data.channels.updateChannels?.map<ChannelData>(byChannel);

        const entityType = getReferenceAttributeEntityTypeFromAttribute(
          assignReferencesAttributeId,
          data.attributes,
        );

        return (
          <DetailPageLayout>
            <TopNav href={backLinkProductUrl} title={header}>
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
              <ProductMedia
                media={media}
                onImageDelete={onImageDelete}
                onImageReorder={onImageReorder}
                onImageUpload={onImageUpload}
                openMediaUrlModal={() => setMediaUrlModalStatus(true)}
                getImageEditUrl={imageId => productImageUrl(productId, imageId)}
              />
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
              <ProductVariants
                productId={productId}
                productName={product?.name}
                errors={variantListErrors}
                channels={listings}
                limits={limits}
                variants={variants}
                variantAttributes={product?.productType.variantAttributes}
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
                selectedProductCategory={selectedProductCategory}
              />
              <ChannelsAvailabilityCard {...availabilityCommonProps} channels={listings ?? []} />
              <Box paddingBottom={52}>
                <ProductTaxes
                  value={data.taxClassId}
                  disabled={disabled}
                  onChange={handlers.selectTaxClass}
                  taxClassDisplayName={selectedTaxClass}
                  taxClasses={taxClasses}
                  onFetchMore={fetchMoreTaxClasses}
                />
              </Box>
            </DetailPageLayout.RightSidebar>

            <Savebar>
              <Savebar.DeleteButton onClick={onDelete} />
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(productListUrl())} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={submit}
                disabled={isSaveDisabled}
              />
            </Savebar>

            {canOpenAssignReferencesAttributeDialog && entityType && (
              <AssignAttributeValueDialog
                entityType={entityType}
                confirmButtonState={"default"}
                products={referenceProducts}
                pages={referencePages}
                attribute={data.attributes.find(({ id }) => id === assignReferencesAttributeId)}
                hasMore={handlers.fetchMoreReferences?.hasMore}
                open={canOpenAssignReferencesAttributeDialog}
                onFetch={handlers.fetchReferences}
                onFetchMore={handlers.fetchMoreReferences?.onFetchMore}
                loading={handlers.fetchMoreReferences?.loading}
                onClose={onCloseDialog}
                onSubmit={attributeValues =>
                  handleAssignReferenceAttribute(
                    attributeValues.map(container => ({
                      value: container.id,
                      label: container.name,
                    })),
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
