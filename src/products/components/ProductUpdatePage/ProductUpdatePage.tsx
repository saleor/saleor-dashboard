// @ts-strict-ignore
import {
  getReferenceAttributeEntityTypeFromAttribute,
  handleMetadataReferenceAssignment,
} from "@dashboard/attributes/utils/data";
import { useUser } from "@dashboard/auth";
import { hasPermission } from "@dashboard/auth/misc";
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
import { useActiveAppExtension } from "@dashboard/extensions/components/AppExtensionContext/AppExtensionContextProvider";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForProductDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
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
import { FormChange, SubmitPromise } from "@dashboard/hooks/useForm";
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
import { TranslationsButton } from "@dashboard/translations/components/TranslationsButton/TranslationsButton";
import { productUrl as createTranslateProductUrl } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { UseRichTextResult } from "@dashboard/utils/richText/useRichText";
import { OutputData } from "@editorjs/editorjs";
import { Box, Divider, Option } from "@saleor/macaw-ui-next";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { AttributeValuesMetadata, getChoices } from "../../utils/data";
import { ProductDetailsForm } from "../ProductDetailsForm";
import ProductMedia from "../ProductMedia";
import { ProductShipping } from "../ProductShipping";
import ProductTaxes from "../ProductTaxes";
import ProductVariants from "../ProductVariants";
import ProductUpdateForm from "./form";
import { messages } from "./messages";
import ProductChannelsListingsDialog from "./ProductChannelsListingsDialog";
import { ProductUpdateData, ProductUpdateHandlers, ProductUpdateSubmitData } from "./types";

interface ProductUpdatePageProps {
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
  product?: ProductDetailsQuery["product"];
  header: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  taxClasses: TaxClassBaseFragment[];
  fetchMoreTaxClasses: FetchMoreProps;
  referencePages?: RelayToFlat<SearchPagesQuery["search"]>;
  referenceProducts?: RelayToFlat<SearchProductsQuery["search"]>;
  referenceCategories?: RelayToFlat<SearchCategoriesQuery["search"]>;
  referenceCollections?: RelayToFlat<SearchCollectionsQuery["search"]>;
  assignReferencesAttributeId?: string;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchMoreReferenceProducts?: FetchMoreProps;
  fetchMoreReferenceCategories?: FetchMoreProps;
  fetchMoreReferenceCollections?: FetchMoreProps;
  fetchMoreAttributeValues?: FetchMoreProps;
  isSimpleProduct: boolean;
  fetchCategories: (query: string) => void;
  fetchCollections: (query: string) => void;
  fetchReferencePages?: (data: string) => void;
  fetchReferenceProducts?: (data: string) => void;
  fetchReferenceCategories?: (data: string) => void;
  fetchReferenceCollections?: (data: string) => void;
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

const ProductUpdatePage = ({
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
  referenceCategories = [],
  referenceCollections = [],
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
  fetchReferenceCategories,
  fetchMoreReferenceCategories,
  fetchReferenceCollections,
  fetchMoreReferenceCollections,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  refetch,
  onCloseDialog,
  onAttributeSelectBlur,
}: ProductUpdatePageProps) => {
  // Cache inner form data so it can be passed into App when modal is opened
  const dataCache = useRef<ProductUpdateData | null>(null);
  // Description is not passed in root "data"
  const descriptionCache = useRef<OutputData | null>(null);
  // Store form change handler to allow updating form from outside render prop
  const changeHandlerRef = useRef<FormChange | null>(null);
  // Store richText ref to allow updating description from outside render prop
  const richTextRef = useRef<UseRichTextResult | null>(null);

  const intl = useIntl();
  const { user } = useUser();
  const canTranslate = user && hasPermission(PermissionEnum.MANAGE_TRANSLATIONS, user);
  const { lastUsedLocaleOrFallback } = useCachedLocales();
  const navigate = useNavigator();
  const [channelPickerOpen, setChannelPickerOpen] = useState(false);
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
    handleMetadataReferenceAssignment(
      assignReferencesAttributeId,
      attributeValues,
      data.attributes,
      handlers,
    );
    onCloseDialog();
  };
  const { PRODUCT_DETAILS_MORE_ACTIONS, PRODUCT_DETAILS_WIDGETS } = useExtensions(
    extensionMountPoints.PRODUCT_DETAILS,
  );
  const productErrors = useMemo(
    () =>
      errors.filter(
        error => error.__typename === "ProductError",
      ) as ProductErrorWithAttributesFragment[],
    [errors],
  );
  const productOrganizationErrors = useMemo(
    () =>
      [...errors, ...channelsErrors].filter(err =>
        ["ProductChannelListingError", "ProductError"].includes(err.__typename),
      ) as Array<ProductErrorFragment | ProductChannelListingErrorFragment>,
    [errors, channelsErrors],
  );
  const extensionMenuItems = getExtensionsItemsForProductDetails(PRODUCT_DETAILS_MORE_ACTIONS, {
    productId: productId,
    productSlug: product?.slug,
  });
  const context = useDevModeContext();
  const openPlaygroundURL = () => {
    context.setDevModeContent(defaultGraphiQLQuery);
    context.setVariables(`{ "id": "${product?.id}" }`);
    context.setDevModeVisibility(true);
  };
  const backLinkProductUrl = useBackLinkWithState({
    path: productListPath,
  });

  const { attachFormState, active, framesByFormType } = useActiveAppExtension();

  const formFramesFromApp = framesByFormType["product-edit"];

  useEffect(() => {
    if (!formFramesFromApp || !changeHandlerRef.current) {
      return;
    }

    const lastFrame = formFramesFromApp[formFramesFromApp.length - 1];

    // Handle productName field
    if (lastFrame?.fields?.productName) {
      const productNameField = lastFrame.fields.productName;

      const newProductName = productNameField.value;
      const currentProductName = dataCache.current?.name;

      // Only update if the value has changed
      if (newProductName !== currentProductName) {
        changeHandlerRef.current({
          target: {
            name: "name",
            value: newProductName,
          },
        });
      }
    }

    // Handle productDescription field
    if (lastFrame?.fields?.productDescription) {
      const productDescriptionField = lastFrame.fields.productDescription;

      const newProductDescription = productDescriptionField.value;

      // cache may be empty if editor was not used before sending event to app
      const productDescriptionWithFallback = descriptionCache.current ?? product.description;

      try {
        const parsedEditorJs = JSON.parse(newProductDescription) as OutputData;

        // Only update if the value has changed
        if (
          JSON.stringify(parsedEditorJs.blocks) !==
          JSON.stringify(productDescriptionWithFallback.blocks)
        ) {
          // Update the EditorJS content directly
          if (richTextRef.current?.editorRef?.current) {
            richTextRef.current.editorRef.current.render(parsedEditorJs).then(() => {
              // Mark as dirty and trigger change after render completes
              richTextRef.current.handleChange();
            });
          }
        }
      } catch (e) {
        console.error(e);

        console.warn("App returned invalid response for product description field, ignoring");
      }
    }
  }, [formFramesFromApp]);

  useEffect(() => {
    if (active && product) {
      attachFormState({
        form: "product-edit",
        productId: productId,
        fields: {
          productName: {
            currentValue: dataCache.current?.name ?? product.name,
            type: "short-text",
            fieldName: "productName",
            originalValue: product.name,
          },
          productDescription: {
            currentValue: descriptionCache.current
              ? JSON.stringify(descriptionCache.current)
              : product.description,
            type: "editorjs",
            fieldName: "productDescription",
            originalValue: product.description,
          },
        },
      });
    }
  }, [active, product, productId]);

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
      disabled={disabled}
      refetch={refetch}
    >
      {({ change, data, handlers, submit, isSaveDisabled, attributeRichTextGetters, richText }) => {
        // Store change handler so it can be accessed from useEffect
        changeHandlerRef.current = change;
        // Store richText so it can be accessed from useEffect
        richTextRef.current = richText;

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

        dataCache.current = data;

        const byChannel = mapByChannel(channels);
        const listings = data.channels.updateChannels?.map<ChannelData>(byChannel);

        const entityType = getReferenceAttributeEntityTypeFromAttribute(
          assignReferencesAttributeId,
          data.attributes,
        );

        return (
          <DetailPageLayout>
            <TopNav href={backLinkProductUrl} title={header}>
              {canTranslate && (
                <TranslationsButton
                  marginRight={3}
                  onClick={() =>
                    navigate(createTranslateProductUrl(lastUsedLocaleOrFallback, productId))
                  }
                />
              )}
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
                onDescriptionChange={value => {
                  descriptionCache.current = value;
                }}
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
              {isSimpleProduct && (
                <>
                  <ProductShipping
                    data={data}
                    disabled={disabled}
                    errors={productErrors}
                    weightUnit={product?.weight?.unit}
                    onChange={change}
                  />
                  <CardSpacer />
                </>
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
              {PRODUCT_DETAILS_WIDGETS.length > 0 && productId && (
                <>
                  <Divider />
                  <AppWidgets
                    extensions={PRODUCT_DETAILS_WIDGETS}
                    params={{
                      productId: productId,
                      productSlug: product?.slug,
                    }}
                  />
                </>
              )}
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
