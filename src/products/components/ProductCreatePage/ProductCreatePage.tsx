// @ts-strict-ignore
import {
  getReferenceAttributeEntityTypeFromAttribute,
  mergeAttributeValues,
} from "@dashboard/attributes/utils/data";
import CannotDefineChannelsAvailabilityCard from "@dashboard/channels/components/CannotDefineChannelsAvailabilityCard/CannotDefineChannelsAvailabilityCard";
import { ChannelData } from "@dashboard/channels/utils";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import AssignAttributeValueDialog from "@dashboard/components/AssignAttributeValueDialog";
import { Container } from "@dashboard/components/AssignContainerDialog";
import { AttributeInput, Attributes } from "@dashboard/components/Attributes";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata";
import Savebar from "@dashboard/components/Savebar";
import { SeoForm } from "@dashboard/components/SeoForm";
import {
  PermissionEnum,
  ProductChannelListingErrorFragment,
  ProductErrorWithAttributesFragment,
  ProductTypeQuery,
  SearchAttributeValuesQuery,
  SearchCategoriesQuery,
  SearchCollectionsQuery,
  SearchPagesQuery,
  SearchProductsQuery,
  SearchProductTypesQuery,
  SearchWarehousesQuery,
  TaxClassBaseFragment,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { ProductOrganization } from "@dashboard/products/components/ProductOrganization/ProductOrganization";
import { ProductVariantPrice } from "@dashboard/products/components/ProductVariantPrice";
import { ProductCreateUrlQueryParams, productListUrl } from "@dashboard/products/urls";
import { getChoices } from "@dashboard/products/utils/data";
import { Box, Option } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { FetchMoreProps, RelayToFlat } from "../../../types";
import { ProductDetailsForm } from "../ProductDetailsForm";
import { ProductShipping } from "../ProductShipping";
import { ProductStocks } from "../ProductStocks";
import ProductTaxes from "../ProductTaxes";
import ProductCreateForm, {
  ProductCreateData,
  ProductCreateFormData,
  ProductCreateHandlers,
} from "./form";

interface ProductCreatePageProps {
  errors: ProductErrorWithAttributesFragment[];
  channelsErrors: ProductChannelListingErrorFragment[];
  allChannelsCount: number;
  currentChannels: ChannelData[];
  collections: RelayToFlat<SearchCollectionsQuery["search"]>;
  categories: RelayToFlat<SearchCategoriesQuery["search"]>;
  attributeValues: RelayToFlat<SearchAttributeValuesQuery["attribute"]["choices"]>;
  loading: boolean;
  fetchMoreCategories: FetchMoreProps;
  fetchMoreCollections: FetchMoreProps;
  fetchMoreProductTypes: FetchMoreProps;
  fetchMoreAttributeValues?: FetchMoreProps;
  initial?: Partial<ProductCreateFormData>;
  productTypes?: RelayToFlat<SearchProductTypesQuery["search"]>;
  referencePages?: RelayToFlat<SearchPagesQuery["search"]>;
  referenceProducts?: RelayToFlat<SearchProductsQuery["search"]>;
  header: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  weightUnit: string;
  warehouses: RelayToFlat<SearchWarehousesQuery["search"]>;
  taxClasses: TaxClassBaseFragment[];
  fetchMoreTaxClasses: FetchMoreProps;
  selectedProductType?: ProductTypeQuery["productType"];
  fetchCategories: (data: string) => void;
  fetchCollections: (data: string) => void;
  fetchProductTypes: (data: string) => void;
  fetchAttributeValues: (query: string, attributeId: string) => void;
  onWarehouseConfigure: () => void;
  openChannelsModal: () => void;
  onChannelsChange: (data: ChannelData[]) => void;
  assignReferencesAttributeId?: string;
  onAssignReferencesClick: (attribute: AttributeInput) => void;
  fetchReferencePages?: (data: string) => void;
  fetchReferenceProducts?: (data: string) => void;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchMoreReferenceProducts?: FetchMoreProps;
  onAttributeSelectBlur: () => void;
  onCloseDialog: (currentParams?: ProductCreateUrlQueryParams) => void;
  onSelectProductType: (productTypeId: string) => void;
  onSubmit?: (data: ProductCreateData) => any;
}

export const ProductCreatePage: React.FC<ProductCreatePageProps> = ({
  allChannelsCount,
  channelsErrors,
  currentChannels,
  loading,
  categories: categoryChoiceList,
  collections: collectionChoiceList,
  attributeValues,
  errors: apiErrors,
  fetchCategories,
  fetchCollections,
  fetchMoreCategories,
  fetchMoreCollections,
  fetchMoreProductTypes,
  header,
  initial,
  productTypes: productTypeChoiceList,
  referencePages = [],
  referenceProducts = [],
  saveButtonBarState,
  warehouses,
  taxClasses,
  fetchMoreTaxClasses,
  selectedProductType,
  fetchProductTypes,
  weightUnit,
  onSubmit,
  onChannelsChange,
  onWarehouseConfigure,
  openChannelsModal,
  assignReferencesAttributeId,
  onAssignReferencesClick,
  fetchReferencePages,
  fetchMoreReferencePages,
  fetchReferenceProducts,
  fetchMoreReferenceProducts,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  onCloseDialog,
  onSelectProductType,
  onAttributeSelectBlur,
}: ProductCreatePageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const closeDialog = () => {
    onCloseDialog({ "product-type-id": selectedProductType.id });
  };
  // Display values
  const [selectedCategory, setSelectedCategory] = useStateFromProps(initial?.category || "");
  const [selectedCollections, setSelectedCollections] = useStateFromProps<Option[]>([]);
  const [selectedTaxClass, setSelectedTaxClass] = useStateFromProps(initial?.taxClassId ?? "");
  const categories = getChoices(categoryChoiceList);
  const collections = getChoices(collectionChoiceList);
  const productTypes = getChoices(productTypeChoiceList);
  const taxClassChoices =
    taxClasses?.map(taxClass => ({
      label: taxClass.name,
      value: taxClass.id,
    })) ?? [];
  const canOpenAssignReferencesAttributeDialog = !!assignReferencesAttributeId;
  const handleAssignReferenceAttribute = (
    attributeValues: Container[],
    data: ProductCreateData,
    handlers: ProductCreateHandlers,
  ) => {
    handlers.selectAttributeReference(
      assignReferencesAttributeId,
      mergeAttributeValues(
        assignReferencesAttributeId,
        attributeValues.map(({ id }) => id),
        data.attributes,
      ),
    );
    handlers.selectAttributeReferenceMetadata(
      assignReferencesAttributeId,
      attributeValues.map(({ id, name }) => ({ value: id, label: name })),
    );
    closeDialog();
  };

  return (
    <ProductCreateForm
      onSubmit={onSubmit}
      initial={initial}
      selectedProductType={selectedProductType}
      onSelectProductType={onSelectProductType}
      categories={categories}
      collections={collections}
      productTypes={productTypeChoiceList}
      referencePages={referencePages}
      referenceProducts={referenceProducts}
      selectedCollections={selectedCollections}
      setSelectedCategory={setSelectedCategory}
      setSelectedCollections={setSelectedCollections}
      setSelectedTaxClass={setSelectedTaxClass}
      setChannels={onChannelsChange}
      taxClasses={taxClassChoices}
      warehouses={warehouses}
      currentChannels={currentChannels}
      fetchReferencePages={fetchReferencePages}
      fetchMoreReferencePages={fetchMoreReferencePages}
      fetchReferenceProducts={fetchReferenceProducts}
      fetchMoreReferenceProducts={fetchMoreReferenceProducts}
      assignReferencesAttributeId={assignReferencesAttributeId}
      loading={loading}
    >
      {({
        change,
        data,
        validationErrors,
        handlers,
        submit,
        isSaveDisabled,
        attributeRichTextGetters,
      }) => {
        // Comparing explicitly to false because `hasVariants` can be undefined
        const isSimpleProduct = !data.productType?.hasVariants;
        const errors = [...apiErrors, ...validationErrors];
        const entityType = getReferenceAttributeEntityTypeFromAttribute(
          assignReferencesAttributeId,
          data.attributes,
        );
        return (
          <DetailPageLayout>
            <TopNav href={productListUrl()} title={header} />
            <DetailPageLayout.Content>
              <ProductDetailsForm
                data={data}
                disabled={loading}
                errors={errors}
                onChange={change}
              />
              {data.attributes.length > 0 && (
                <Attributes
                  attributes={data.attributes}
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
              )}
              {isSimpleProduct && (
                <>
                  <ProductShipping
                    data={data}
                    disabled={loading}
                    errors={errors}
                    weightUnit={weightUnit}
                    onChange={change}
                  />
                  <ProductVariantPrice
                    productVariantChannelListings={data.channelListings}
                    errors={[...errors, ...channelsErrors]}
                    loading={loading}
                    onChange={handlers.changeChannelPrice}
                  />
                  <ProductStocks
                    data={data}
                    disabled={loading}
                    hasVariants={false}
                    onFormDataChange={change}
                    errors={errors}
                    stocks={data.stocks}
                    warehouses={warehouses}
                    onChange={handlers.changeStock}
                    onWarehouseStockAdd={handlers.addStock}
                    onWarehouseStockDelete={handlers.deleteStock}
                    onWarehouseConfigure={onWarehouseConfigure}
                  />
                </>
              )}
              <SeoForm
                allowEmptySlug={true}
                helperText={intl.formatMessage({
                  id: "LKoIB1",
                  defaultMessage:
                    "Add search engine title and description to make this product easier to find",
                })}
                title={data.seoTitle}
                slug={data.slug}
                slugPlaceholder={data.name}
                titlePlaceholder={data.name}
                description={data.seoDescription}
                descriptionPlaceholder={data.seoTitle}
                loading={loading}
                onChange={change}
              />
              <Metadata data={data} onChange={handlers.changeMetadata} />
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <ProductOrganization
                canChangeType={true}
                categories={categories}
                categoryInputDisplayValue={selectedCategory}
                collections={collections}
                data={data}
                disabled={loading}
                errors={[...errors, ...channelsErrors]}
                fetchCategories={fetchCategories}
                fetchCollections={fetchCollections}
                fetchMoreCategories={fetchMoreCategories}
                fetchMoreCollections={fetchMoreCollections}
                fetchMoreProductTypes={fetchMoreProductTypes}
                fetchProductTypes={fetchProductTypes}
                productType={data.productType}
                productTypeInputDisplayValue={data.productType?.name || ""}
                productTypes={productTypes}
                onCategoryChange={handlers.selectCategory}
                onCollectionChange={handlers.selectCollection}
                onProductTypeChange={handlers.selectProductType}
                collectionsInputDisplayValue={selectedCollections}
              />
              {isSimpleProduct ? (
                <ChannelsAvailabilityCard
                  managePermissions={[PermissionEnum.MANAGE_PRODUCTS]}
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
                  allChannelsCount={allChannelsCount}
                  channels={data.channelListings || []}
                  disabled={loading}
                  onChange={handlers.changeChannels}
                  openModal={openChannelsModal}
                />
              ) : (
                <CannotDefineChannelsAvailabilityCard />
              )}
              <Box paddingBottom={52}>
                <ProductTaxes
                  value={data.taxClassId}
                  disabled={loading}
                  onChange={handlers.selectTaxClass}
                  taxClassDisplayName={selectedTaxClass}
                  taxClasses={taxClasses}
                  onFetchMore={fetchMoreTaxClasses}
                />
              </Box>
            </DetailPageLayout.RightSidebar>
            <Savebar
              onCancel={() => navigate(productListUrl())}
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
                attribute={data.attributes.find(({ id }) => id === assignReferencesAttributeId)}
                hasMore={handlers.fetchMoreReferences?.hasMore}
                open={canOpenAssignReferencesAttributeDialog}
                onFetch={handlers.fetchReferences}
                onFetchMore={handlers.fetchMoreReferences?.onFetchMore}
                loading={handlers.fetchMoreReferences?.loading}
                onClose={closeDialog}
                onSubmit={attributeValues =>
                  handleAssignReferenceAttribute(attributeValues, data, handlers)
                }
              />
            )}
          </DetailPageLayout>
        );
      }}
    </ProductCreateForm>
  );
};
ProductCreatePage.displayName = "ProductCreatePage";
export default ProductCreatePage;
