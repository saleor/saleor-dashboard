// @ts-strict-ignore
import {
  getReferenceAttributeEntityTypeFromAttribute,
  handleMetadataReferenceAssignment,
} from "@dashboard/attributes/utils/data";
import { hasPermission } from "@dashboard/auth/misc";
import { useUser } from "@dashboard/auth/useUser";
import { channelUrl } from "@dashboard/channels/urls";
import { type ChannelData } from "@dashboard/channels/utils";
import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
import AssignAttributeValueDialog, {
  type AssignAttributeValueDialogFilterChangeMap,
} from "@dashboard/components/AssignAttributeValueDialog";
import { type AttributeInput, Attributes } from "@dashboard/components/Attributes";
import CardSpacer from "@dashboard/components/CardSpacer";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { type InitialPageConstraints } from "@dashboard/components/ModalFilters/entityConfigs/ModalPageFilterProvider";
import { type InitialConstraints } from "@dashboard/components/ModalFilters/entityConfigs/ModalProductFilterProvider";
import { Savebar } from "@dashboard/components/Savebar";
import { SeoForm } from "@dashboard/components/SeoForm";
import { useActiveAppExtension } from "@dashboard/extensions/components/AppExtensionContext/AppExtensionContextProvider";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForProductDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  type ChannelFragment,
  PermissionEnum,
  type ProductChannelListingErrorFragment,
  type ProductDetailsQuery,
  type ProductDetailsVariantFragment,
  type ProductErrorFragment,
  type ProductErrorWithAttributesFragment,
  type ProductFragment,
  type RefreshLimitsQuery,
  type SearchAttributeValuesQuery,
  type SearchCategoriesQuery,
  type SearchCollectionsQuery,
  type SearchPagesQuery,
  type SearchProductsQuery,
  type TaxClassBaseFragment,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { type FormChange, type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { maybe } from "@dashboard/misc";
import { ProductExternalMediaDialog } from "@dashboard/products/components/ProductExternalMediaDialog/ProductExternalMediaDialog";
import { ProductOrganization } from "@dashboard/products/components/ProductOrganization/ProductOrganization";
import { mapByChannel } from "@dashboard/products/components/ProductUpdatePage/utils";
import { defaultGraphiQLQuery } from "@dashboard/products/queries";
import { rippleProductMetadata } from "@dashboard/products/ripples/productMetadata";
import { productImageUrl, productListPath, productListUrl } from "@dashboard/products/urls";
import { type ChoiceWithAncestors, getChoicesWithAncestors } from "@dashboard/products/utils/utils";
import { type ProductVariantListError } from "@dashboard/products/views/ProductUpdate/handlers/errors";
import { type ProductSaveStepResult } from "@dashboard/products/views/ProductUpdate/handlers/productSaveSteps";
import { type UseProductUpdateHandlerError } from "@dashboard/products/views/ProductUpdate/handlers/useProductUpdateHandler";
import { productTypeUrl } from "@dashboard/productTypes/urls";
import { TranslationsButton } from "@dashboard/translations/components/TranslationsButton/TranslationsButton";
import { productUrl as createTranslateProductUrl } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { type FetchMoreProps, type RelayToFlat } from "@dashboard/types";
import { type UseRichTextResult } from "@dashboard/utils/richText/useRichText";
import { type OutputData } from "@editorjs/editorjs";
import { Box, Divider, type Option } from "@saleor/macaw-ui-next";
import { ListChecks, Shapes, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { type AttributeValuesMetadata, getChoices } from "../../utils/data";
import { ProductDetailsForm } from "../ProductDetailsForm";
import { AvailabilityCard } from "../ProductDoctor/AvailabilityCard";
import { useProductAvailabilityDiagnostics } from "../ProductDoctor/hooks/useProductAvailabilityDiagnostics";
import { useProductDoctorVariants } from "../ProductDoctor/hooks/useProductDoctorVariants";
import { mapProductToDiagnosticData } from "../ProductDoctor/utils/mapProductToDiagnosticData";
import { mergeFormDataWithChannelSummaries } from "../ProductDoctor/utils/mergeChannelSummaries";
import ProductMedia from "../ProductMedia";
import {
  getMakeAvailableChannelOpts,
  getProductSetupReadinessFromPage,
} from "../ProductSetupCard/buildProductSetupReadiness";
import { ProductSetupCard } from "../ProductSetupCard/ProductSetupCard";
import { scrollToProductSetupTarget } from "../ProductSetupCard/scrollToProductSetupTarget";
import { ProductShipping } from "../ProductShipping";
import { ProductTaxes } from "../ProductTaxes/ProductTaxes";
import { ProductVariants } from "../ProductVariants/ProductVariants";
import ProductUpdateForm from "./form";
import { messages } from "./messages";
import ProductChannelsListingsDialog from "./ProductChannelsListingsDialog";
import { ProductSaveCompositionHint } from "./ProductSaveCompositionHint";
import { ProductSaveStepsBanner } from "./ProductSaveStepsBanner";
import { ProductDetailsTitle } from "./Title";
import {
  type ProductUpdateData,
  type ProductUpdateHandlers,
  type ProductUpdateSubmitData,
} from "./types";

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
  variantsSearch?: string;
  onVariantsSearchChange?: (query: string) => void;
  variantsPageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
  onVariantsNextPage?: () => void;
  onVariantsPreviousPage?: () => void;
  variantsRangeLabel?: string | null;
  variantsTotalCount?: number | null;
  variantsLoading?: boolean;
  media: ProductFragment["media"];
  product?: ProductDetailsQuery["product"];
  loading?: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  saveSteps?: ProductSaveStepResult[];
  onDismissSaveSteps?: () => void;
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
  onImagesDelete: (ids: string[]) => void;
  onSubmit: (data: ProductUpdateSubmitData) => SubmitPromise;
  onVariantShow: (id: string) => void;
  onAttributeSelectBlur: () => void;
  onDelete: () => any;
  onShowMetadata: () => void;
  onImageReorder?: (event: { oldIndex: number; newIndex: number }) => any;
  onImageUpload: (file: File) => any;
  onImagesUploadComplete?: (result: { successCount: number; failureCount: number }) => void;
  onMediaUrlUpload: (mediaUrl: string) => SubmitPromise<ProductErrorFragment[]>;
  onSeoClick?: () => any;
  onFilterChange?: AssignAttributeValueDialogFilterChangeMap;
  initialConstraints?: InitialConstraints & InitialPageConstraints;
  /** When set, TopNav offers “Show setup checklist”. */
  onShowSetupChecklist?: () => void;
  setupEmphasized?: boolean;
  setupCardDismissed?: boolean;
  setupCardDisplayReady?: boolean;
  onDismissSetupCard?: () => void;
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
  limits,
  product,
  loading,
  saveButtonBarState,
  saveSteps = [],
  onDismissSaveSteps,
  variants,
  variantsSearch,
  onVariantsSearchChange,
  variantsPageInfo,
  onVariantsNextPage,
  onVariantsPreviousPage,
  variantsRangeLabel,
  variantsTotalCount,
  variantsLoading,
  taxClasses,
  fetchMoreTaxClasses,
  referencePages = [],
  referenceProducts = [],
  referenceCategories = [],
  referenceCollections = [],
  onDelete,
  onShowMetadata,
  onImageDelete,
  onImagesDelete,
  onImageReorder,
  onImageUpload,
  onImagesUploadComplete,
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
  onFilterChange,
  initialConstraints,
  onShowSetupChecklist,
  setupEmphasized = false,
  setupCardDismissed = false,
  setupCardDisplayReady = true,
  onDismissSetupCard,
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
  const showProductDetailsWidgets = PRODUCT_DETAILS_WIDGETS.length > 0 && !!productId;
  const context = useDevModeContext();
  const openPlaygroundURL = useCallback(() => {
    if (!product?.id) {
      return;
    }

    context.setDevModeContent(defaultGraphiQLQuery);
    context.setVariables(`{ "id": "${product.id}" }`);
    context.setDevModeVisibility(true);
  }, [context, product?.id]);
  const canManageProductTypes =
    user && hasPermission(PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES, user);
  const backLinkProductUrl = useBackLinkWithState({
    path: productListPath,
  });

  // Product Doctor catalog is walked separately from the paginated/searchable grid
  // so diagnostics are not polluted by the current page or search filter.
  const {
    variants: doctorVariantList,
    totalCount: doctorVariantsTotalCount,
    loading: doctorVariantsLoading,
    error: doctorVariantsError,
    complete: doctorVariantsComplete,
    refetch: refetchDoctorVariants,
  } = useProductDoctorVariants({
    productId,
    skip: !product,
  });
  const productDiagnosticData = useMemo(
    () =>
      mapProductToDiagnosticData(
        product
          ? {
              ...product,
              variants: doctorVariantList,
              variantsTotalCount: doctorVariantsTotalCount,
            }
          : null,
      ),
    [doctorVariantList, doctorVariantsTotalCount, product],
  );
  const availabilityDiagnostics = useProductAvailabilityDiagnostics({
    product: productDiagnosticData,
    enabled: Boolean(product) && doctorVariantsComplete,
  });

  // Keep the card in a loading skeleton while the doctor catalog walks, and
  // avoid a false “no issues” flash when diagnostics are still disabled.
  const diagnosticsForCard = useMemo(
    () => ({
      ...availabilityDiagnostics,
      isLoading:
        doctorVariantsLoading ||
        (Boolean(product) && !doctorVariantsComplete && !doctorVariantsError) ||
        availabilityDiagnostics.isLoading,
    }),
    [
      availabilityDiagnostics,
      doctorVariantsComplete,
      doctorVariantsError,
      doctorVariantsLoading,
      product,
    ],
  );

  const refetchWithDoctorCatalog = useCallback(async () => {
    await Promise.all([refetch(), refetchDoctorVariants()]);
  }, [refetch, refetchDoctorVariants]);

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
      const productDescriptionWithFallback =
        descriptionCache.current ?? (JSON.parse(product.description) as OutputData);

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
      refetch={refetchWithDoctorCatalog}
      variants={variants}
    >
      {({
        change,
        data,
        handlers,
        submit,
        isSaveDisabled,
        pendingVariantDeleteCount,
        saveComposition,
        attributeRichTextGetters,
        richText,
        stagedVariantCreates,
      }) => {
        // Store change handler so it can be accessed from useEffect
        changeHandlerRef.current = change;
        // Store richText so it can be accessed from useEffect
        richTextRef.current = richText;

        dataCache.current = data;

        const byChannel = mapByChannel(channels);
        const listings = data.channels.updateChannels?.map<ChannelData>(byChannel);

        const mergedChannelSummaries = mergeFormDataWithChannelSummaries(
          diagnosticsForCard.channelSummaries,
          data.channels.updateChannels,
          channels,
        );
        const setupReadiness = getProductSetupReadinessFromPage({
          categoryId: data.category,
          formChannelListings: data.channels.updateChannels,
          removeChannelIds: data.channels.removeChannels,
          channelSummaries: mergedChannelSummaries,
          diagnostics: diagnosticsForCard,
          productDiagnostic: productDiagnosticData,
          mediaCount: media?.length ?? 0,
          slug: data.slug,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
        });
        const showSetupCard =
          Boolean(product) &&
          setupCardDisplayReady &&
          !diagnosticsForCard.isLoading &&
          // Incomplete doctor walks must not drive readiness; allow force-open via ⚙️.
          (doctorVariantsComplete || setupEmphasized) &&
          (setupEmphasized || (!setupCardDismissed && !setupReadiness.coreReady));

        const menuItems: TopNavMenuItem[] = [...extensionMenuItems];

        if (onShowSetupChecklist && !showSetupCard) {
          menuItems.push({
            label: intl.formatMessage(messages.showSetupChecklist),
            onSelect: onShowSetupChecklist,
            testId: "show-setup-checklist",
            icon: <ListChecks size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
          });
        }

        if (canManageProductTypes && product?.productType?.id) {
          menuItems.push({
            label: intl.formatMessage(messages.openProductTypeSettings),
            onSelect: () => navigate(productTypeUrl(product.productType.id)),
            testId: "open-product-type-settings",
            icon: <Shapes size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
          });
        }

        if (product?.id) {
          menuItems.push({
            label: intl.formatMessage(messages.openGraphiQL),
            onSelect: openPlaygroundURL,
            testId: "graphiql-redirect",
            icon: <GraphqlIcon />,
          });
        }

        if (product) {
          menuItems.push({
            label: intl.formatMessage(messages.deleteProduct),
            onSelect: onDelete,
            testId: "delete-product",
            color: "critical1",
            icon: <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
          });
        }

        const handleMakeAvailable = () => {
          const opts = getMakeAvailableChannelOpts();
          const channelIds =
            data.channels.updateChannels
              ?.filter(listing => !(data.channels.removeChannels ?? []).includes(listing.channelId))
              .map(listing => listing.channelId) ?? [];

          channelIds.forEach(channelId => {
            handlers.changeChannels(channelId, opts);
          });
          scrollToProductSetupTarget("availability");
        };

        const entityType = getReferenceAttributeEntityTypeFromAttribute(
          assignReferencesAttributeId,
          data.attributes,
        );

        const productTaxes = (
          <ProductTaxes
            value={data.taxClassId}
            disabled={disabled}
            onChange={handlers.selectTaxClass}
            taxClassDisplayName={selectedTaxClass}
            taxClasses={taxClasses}
            onFetchMore={fetchMoreTaxClasses}
          />
        );

        return (
          <>
            <DetailPageLayout>
              <TopNav
                href={backLinkProductUrl}
                hrefIcon={<TopNavDestinationIcon.products />}
                hrefTitle={intl.formatMessage(topNavDestinationMessages.allProducts)}
                title={<ProductDetailsTitle product={product} loading={loading} />}
                actionsGap={3}
              >
                <TopNav.MetadataButton
                  onClick={onShowMetadata}
                  disabled={!product}
                  data-test-id="show-product-metadata"
                  title={intl.formatMessage(messages.editProductMetadata)}
                  ripple={rippleProductMetadata}
                />
                {canTranslate && (
                  <TranslationsButton
                    onClick={() =>
                      navigate(createTranslateProductUrl(lastUsedLocaleOrFallback, productId))
                    }
                  />
                )}
                {menuItems.length > 0 && (
                  <TopNav.Menu
                    items={
                      disabled || !product
                        ? menuItems.map(item => ({ ...item, disabled: true }))
                        : menuItems
                    }
                    dataTestId="menu"
                  />
                )}
              </TopNav>

              <DetailPageLayout.Content paddingBottom={10}>
                {showSetupCard ? (
                  <ProductSetupCard
                    readiness={setupReadiness}
                    disabled={disabled}
                    onDismiss={onDismissSetupCard}
                    onManageChannels={() => setChannelPickerOpen(true)}
                    onFinishChannelSetup={() => {
                      if (setupReadiness.setupChannelId) {
                        navigate(channelUrl(setupReadiness.setupChannelId, { action: "setup" }));

                        return;
                      }

                      setChannelPickerOpen(true);
                    }}
                    onMakeAvailable={handleMakeAvailable}
                    isShippingRequired={
                      diagnosticsForCard.isShippingRequired ??
                      product?.productType?.isShippingRequired ??
                      true
                    }
                    productAttributeCount={data.attributes.length}
                    variantAttributeCount={product?.productType.variantAttributes?.length ?? 0}
                    onOpenProductType={
                      canManageProductTypes && product?.productType?.id
                        ? () => navigate(productTypeUrl(product.productType.id))
                        : undefined
                    }
                  />
                ) : null}
                {saveSteps.length > 0 && onDismissSaveSteps ? (
                  <ProductSaveStepsBanner steps={saveSteps} onDismiss={onDismissSaveSteps} />
                ) : null}
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
                  onImagesDelete={onImagesDelete}
                  onImageReorder={onImageReorder}
                  onImageUpload={onImageUpload}
                  onImagesUploadComplete={onImagesUploadComplete}
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
                <Box data-test-id="product-variants">
                  <ProductVariants
                    productId={productId}
                    productTypeId={product?.productType.id ?? ""}
                    productName={product?.name}
                    errors={variantListErrors}
                    channels={listings}
                    limits={limits}
                    variants={variants}
                    variantsSearch={variantsSearch}
                    onVariantsSearchChange={onVariantsSearchChange}
                    variantsPageInfo={variantsPageInfo}
                    onVariantsNextPage={onVariantsNextPage}
                    onVariantsPreviousPage={onVariantsPreviousPage}
                    variantsRangeLabel={variantsRangeLabel}
                    variantsTotalCount={variantsTotalCount}
                    variantsLoading={variantsLoading}
                    pendingVariantDeleteCount={pendingVariantDeleteCount}
                    variantAttributes={product?.productType.variantAttributes}
                    selectionVariantAttributes={product?.productType.selectionVariantAttributes}
                    nonSelectionVariantAttributes={
                      product?.productType.nonSelectionVariantAttributes
                    }
                    hasVariants={hasVariants ?? false}
                    onAttributeValuesSearch={onAttributeValuesSearch}
                    onChange={handlers.changeVariants}
                    onStageVariantRemovals={handlers.stageVariantRemovals}
                    onRowClick={onVariantShow}
                    onStageVariantCreates={handlers.stageVariantCreates}
                    stagedVariantCreates={stagedVariantCreates}
                    onRemoveStagedVariantCreates={handlers.removeStagedVariantCreates}
                    onClearStagedVariantCreates={handlers.clearStagedVariantCreates}
                    onReplaceStagedVariantCreates={handlers.replaceStagedVariantCreates}
                  />
                </Box>
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
              </DetailPageLayout.Content>
              <DetailPageLayout.RightSidebar>
                <ProductOrganization
                  canChangeType={false}
                  hideProductType
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
                <AvailabilityCard
                  diagnostics={diagnosticsForCard}
                  totalChannelsCount={channels?.length ?? 0}
                  onManageClick={() => setChannelPickerOpen(true)}
                  onChannelChange={handlers.changeChannels}
                  disabled={disabled}
                  formChannelData={data.channels.updateChannels}
                  removeChannels={data.channels.removeChannels}
                  channels={channels}
                  errors={channelsErrors}
                  productId={product?.id}
                  variantsCatalogError={Boolean(doctorVariantsError)}
                />
                {showProductDetailsWidgets ? (
                  <>
                    {productTaxes}
                    <CardSpacer />
                    <Divider />
                    <Box paddingBottom={52}>
                      <AppWidgets
                        extensions={PRODUCT_DETAILS_WIDGETS}
                        params={{
                          productId: productId,
                          productSlug: product?.slug,
                        }}
                      />
                    </Box>
                  </>
                ) : (
                  <Box paddingBottom={52}>{productTaxes}</Box>
                )}
              </DetailPageLayout.RightSidebar>

              <Savebar>
                <Savebar.Spacer />
                <ProductSaveCompositionHint composition={saveComposition} />
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
                  onFilterChange={onFilterChange}
                  initialConstraints={initialConstraints}
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
          </>
        );
      }}
    </ProductUpdateForm>
  );
};

ProductUpdatePage.displayName = "ProductUpdatePage";
export default ProductUpdatePage;
