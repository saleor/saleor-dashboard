// @ts-strict-ignore
import {
  getReferenceAttributeEntityTypeFromAttribute,
  mergeAttributeValues,
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
import {
  extensionMountPoints,
  mapToMenuItemsForProductDetails,
  useExtensions,
} from "@dashboard/extensions/hooks/useExtensions";
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
import { productUrl as createTranslateProductUrl } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { Box, Button, Option, TranslationsIcon } from "@saleor/macaw-ui-next";
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

/**
 * @interface ProductUpdatePageProps
 * @property {ChannelFragment[]} channels - 产品可用的渠道。
 * @property {string} productId - 正在更新的产品的 ID。
 * @property {ProductChannelListingErrorFragment[]} channelsErrors - 与渠道列表相关的错误。
 * @property {ProductVariantListError[]} variantListErrors - 与变体列表相关的错误。
 * @property {UseProductUpdateHandlerError[]} errors - 来自更新处理程序的错误。
 * @property {RelayToFlat<SearchCollectionsQuery["search"]>} collections - 可用的集合。
 * @property {RelayToFlat<SearchCategoriesQuery["search"]>} categories - 可用的类别。
 * @property {RelayToFlat<SearchAttributeValuesQuery["attribute"]["choices"]>} attributeValues - 可用的属性值。
 * @property {boolean} disabled - 表单是否被禁用。
 * @property {FetchMoreProps} fetchMoreCategories - 用于获取更多类别的属性。
 * @property {FetchMoreProps} fetchMoreCollections - 用于获取更多集合的属性。
 * @property {boolean} [isMediaUrlModalVisible] - 媒体 URL 模态框是否可见。
 * @property {RefreshLimitsQuery["shop"]["limits"]} limits - 商店的限制。
 * @property {ProductDetailsVariantFragment[]} variants - 产品的变体。
 * @property {ProductFragment["media"]} media - 产品的媒体。
 * @property {ProductDetailsQuery["product"]} product - 正在更新的产品。
 * @property {string} header - 页面的标题文本。
 * @property {ConfirmButtonTransitionState} saveButtonBarState - 保存按钮的状态。
 * @property {TaxClassBaseFragment[]} taxClasses - 可用的税种。
 * @property {FetchMoreProps} fetchMoreTaxClasses - 用于获取更多税种的属性。
 * @property {RelayToFlat<SearchPagesQuery["search"]>} [referencePages] - 可用的参考页面。
 * @property {RelayToFlat<SearchProductsQuery["search"]>} [referenceProducts] - 可用的参考产品。
 * @property {string} [assignReferencesAttributeId] - 要分配参考的属性的 ID。
 * @property {FetchMoreProps} [fetchMoreReferencePages] - 用于获取更多参考页面的属性。
 * @property {FetchMoreProps} [fetchMoreReferenceProducts] - 用于获取更多参考产品的属性。
 * @property {FetchMoreProps} [fetchMoreAttributeValues] - 用于获取更多属性值的属性。
 * @property {boolean} isSimpleProduct - 产品是否为简单产品。
 * @property {(query: string) => void} fetchCategories - 获取类别的函数。
 * @property {(query: string) => void} fetchCollections - 获取集合的函数。
 * @property {(data: string) => void} [fetchReferencePages] - 获取参考页面的函数。
 * @property {(data: string) => void} [fetchReferenceProducts] - 获取参考产品的函数。
 * @property {(query: string, attributeId: string) => void} fetchAttributeValues - 获取属性值的函数。
 * @property {() => Promise<any>} refetch - 重新获取产品数据的函数。
 * @property {(id: string, query: string) => Promise<Option[]>} onAttributeValuesSearch - 搜索属性值的函数。
 * @property {(attribute: AttributeInput) => void} onAssignReferencesClick - 单击分配参考按钮的回调。
 * @property {() => void} onCloseDialog - 关闭对话框的回调。
 * @property {(id: string) => () => void} onImageDelete - 删除图像的回调。
 * @property {(data: ProductUpdateSubmitData) => SubmitPromise} onSubmit - 提交表单的回调。
 * @property {(id: string) => void} onVariantShow - 显示变体的回调。
 * @property {() => void} onAttributeSelectBlur - 属性选择模糊时的回调。
 * @property {() => any} onDelete - 删除产品的回调。
 * @property {(event: { oldIndex: number; newIndex: number }) => any} [onImageReorder] - 重新排序图像的回调。
 * @property {(file: File) => any} onImageUpload - 上传图像的回调。
 * @property {(mediaUrl: string) => any} onMediaUrlUpload - 上传媒体 URL 的回调。
 * @property {() => any} [onSeoClick] - 单击 SEO 表单的回调。
 *
 * ProductUpdatePage 组件的属性。
 */
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

/**
 * ProductUpdatePage 组件，用于显示更新产品的页面。
 *
 * 此组件是用于编辑产品的所有表单和部分的容器。
 * 它处理整个页面的状态和逻辑，包括获取数据、
 * 处理用户输入和提交表单。
 *
 * @param {ProductUpdatePageProps} props - ProductUpdatePage 组件的属性。
 * @returns {React.ReactElement} 一个显示产品更新页面的 React 元素。
 */
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
  const { lastUsedLocaleOrFallback } = useCachedLocales();
  const { user } = useUser();
  const canTranslate = user && hasPermission(PermissionEnum.MANAGE_TRANSLATIONS, user);
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
              {canTranslate && (
                <Button
                  marginRight={3}
                  variant="secondary"
                  icon={<TranslationsIcon />}
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
