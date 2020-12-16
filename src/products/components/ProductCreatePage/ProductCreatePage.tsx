import { ChannelData } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import Attributes from "@saleor/components/Attributes";
import AvailabilityCard from "@saleor/components/AvailabilityCard";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import SeoForm from "@saleor/components/SeoForm";
import { ProductChannelListingErrorFragment } from "@saleor/fragments/types/ProductChannelListingErrorFragment";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import { TaxTypeFragment } from "@saleor/fragments/types/TaxTypeFragment";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import ProductVariantPrice from "@saleor/products/components/ProductVariantPrice";
import { getChoices } from "@saleor/products/utils/data";
import { SearchCategories_search_edges_node } from "@saleor/searches/types/SearchCategories";
import { SearchCollections_search_edges_node } from "@saleor/searches/types/SearchCollections";
import { SearchProductTypes_search_edges_node } from "@saleor/searches/types/SearchProductTypes";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import React from "react";
import { useIntl } from "react-intl";

import { FetchMoreProps } from "../../../types";
import ProductDetailsForm from "../ProductDetailsForm";
import ProductOrganization from "../ProductOrganization";
import ProductShipping from "../ProductShipping/ProductShipping";
import ProductStocks from "../ProductStocks";
import ProductTaxes from "../ProductTaxes";
import ProductCreateForm, {
  ProductCreateData,
  ProductCreateFormData
} from "./form";

interface ProductCreatePageProps {
  errors: ProductErrorWithAttributesFragment[];
  channelsErrors: ProductChannelListingErrorFragment[];
  allChannelsCount: number;
  currentChannels: ChannelData[];
  collections: SearchCollections_search_edges_node[];
  categories: SearchCategories_search_edges_node[];
  loading: boolean;
  fetchMoreCategories: FetchMoreProps;
  fetchMoreCollections: FetchMoreProps;
  fetchMoreProductTypes: FetchMoreProps;
  initial?: Partial<ProductCreateFormData>;
  productTypes?: SearchProductTypes_search_edges_node[];
  header: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  weightUnit: string;
  warehouses: SearchWarehouses_search_edges_node[];
  taxTypes: TaxTypeFragment[];
  fetchCategories: (data: string) => void;
  fetchCollections: (data: string) => void;
  fetchProductTypes: (data: string) => void;
  onWarehouseConfigure: () => void;
  openChannelsModal: () => void;
  onChannelsChange: (data: ChannelData[]) => void;
  onBack?();
  onSubmit?(data: ProductCreateData);
}

export const ProductCreatePage: React.FC<ProductCreatePageProps> = ({
  allChannelsCount,
  channelsErrors,
  currentChannels,
  loading,
  categories: categoryChoiceList,
  collections: collectionChoiceList,
  errors,
  fetchCategories,
  fetchCollections,
  fetchMoreCategories,
  fetchMoreCollections,
  fetchMoreProductTypes,
  header,
  initial,
  productTypes: productTypeChoiceList,
  saveButtonBarState,
  warehouses,
  taxTypes,
  onBack,
  fetchProductTypes,
  weightUnit,
  onSubmit,
  onChannelsChange,
  onWarehouseConfigure,
  openChannelsModal
}: ProductCreatePageProps) => {
  const intl = useIntl();

  // Display values
  const [selectedCategory, setSelectedCategory] = useStateFromProps(
    initial?.category || ""
  );

  const [selectedCollections, setSelectedCollections] = useStateFromProps<
    MultiAutocompleteChoiceType[]
  >([]);

  const [selectedTaxType, setSelectedTaxType] = useStateFromProps(
    initial?.taxCode || null
  );

  const categories = getChoices(categoryChoiceList);
  const collections = getChoices(collectionChoiceList);
  const productTypes = getChoices(productTypeChoiceList);
  const taxTypeChoices =
    taxTypes?.map(taxType => ({
      label: taxType.description,
      value: taxType.taxCode
    })) || [];

  return (
    <ProductCreateForm
      onSubmit={onSubmit}
      initial={initial}
      categories={categories}
      collections={collections}
      productTypes={productTypeChoiceList}
      selectedCollections={selectedCollections}
      setSelectedCategory={setSelectedCategory}
      setSelectedCollections={setSelectedCollections}
      setSelectedTaxType={setSelectedTaxType}
      setChannels={onChannelsChange}
      taxTypes={taxTypeChoices}
      warehouses={warehouses}
      currentChannels={currentChannels}
      productTypeChoiceList={productTypeChoiceList}
    >
      {({
        change,
        data,
        disabled: formDisabled,
        handlers,
        hasChanged,
        submit
      }) => {
        // Comparing explicitly to false because `hasVariants` can be undefined
        const isSimpleProduct = data.productType?.hasVariants === false;

        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.products)}
            </AppHeader>
            <PageHeader title={header} />
            <Grid>
              <div>
                <ProductDetailsForm
                  data={data}
                  disabled={loading}
                  errors={errors}
                  onChange={change}
                  onDescriptionChange={handlers.changeDescription}
                />
                <CardSpacer />
                {data.attributes.length > 0 && (
                  <Attributes
                    attributes={data.attributes}
                    loading={loading}
                    disabled={loading}
                    errors={errors}
                    onChange={handlers.selectAttribute}
                    onMultiChange={handlers.selectAttributeMultiple}
                    onFileChange={handlers.selectAttributeFile}
                  />
                )}
                <CardSpacer />
                {isSimpleProduct && (
                  <>
                    <ProductShipping
                      data={data}
                      disabled={loading}
                      errors={errors}
                      weightUnit={weightUnit}
                      onChange={change}
                    />
                    <CardSpacer />
                    <ProductVariantPrice
                      ProductVariantChannelListings={data.channelListings}
                      errors={channelsErrors}
                      loading={loading}
                      onChange={handlers.changeChannelPrice}
                    />
                    <CardSpacer />
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
                    <CardSpacer />
                  </>
                )}
                <SeoForm
                  allowEmptySlug={true}
                  helperText={intl.formatMessage({
                    defaultMessage:
                      "Add search engine title and description to make this product easier to find"
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
                <CardSpacer />
                <Metadata data={data} onChange={handlers.changeMetadata} />
              </div>
              <div>
                <ProductOrganization
                  canChangeType={true}
                  categories={categories}
                  categoryInputDisplayValue={selectedCategory}
                  collections={collections}
                  data={data}
                  disabled={loading}
                  errors={errors}
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
                <CardSpacer />
                <AvailabilityCard
                  messages={{
                    hiddenLabel: intl.formatMessage({
                      defaultMessage: "Not published",
                      description: "product label"
                    }),

                    visibleLabel: intl.formatMessage({
                      defaultMessage: "Published",
                      description: "product label"
                    })
                  }}
                  errors={channelsErrors}
                  selectedChannelsCount={data.channelListings.length}
                  allChannelsCount={allChannelsCount}
                  channels={data.channelListings}
                  disabled={loading}
                  onChange={handlers.changeChannels}
                  openModal={openChannelsModal}
                />
                <CardSpacer />
                <ProductTaxes
                  data={data}
                  disabled={loading}
                  onChange={change}
                  onTaxTypeChange={handlers.selectTaxRate}
                  selectedTaxTypeDisplayName={selectedTaxType}
                  taxTypes={taxTypes}
                />
              </div>
            </Grid>
            <SaveButtonBar
              onCancel={onBack}
              onSave={submit}
              state={saveButtonBarState}
              disabled={loading || !onSubmit || formDisabled || !hasChanged}
            />
          </Container>
        );
      }}
    </ProductCreateForm>
  );
};
ProductCreatePage.displayName = "ProductCreatePage";
export default ProductCreatePage;
