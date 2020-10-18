import { ChannelData } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import { AvailabilityCard } from "@saleor/components/AvailabilityCard";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata, { MetadataFormData } from "@saleor/components/Metadata";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import SeoForm from "@saleor/components/SeoForm";
import { ProductChannelListingErrorFragment } from "@saleor/fragments/types/ProductChannelListingErrorFragment";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import { TaxTypeFragment } from "@saleor/fragments/types/TaxTypeFragment";
import useFormset from "@saleor/hooks/useFormset";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import ProductVariantPrice from "@saleor/products/components/ProductVariantPrice";
import {
  getAttributeInputFromProductType,
  getChoices,
  ProductType
} from "@saleor/products/utils/data";
import {
  validateCostPrice,
  validatePrice
} from "@saleor/products/utils/validation";
import { SearchCategories_search_edges_node } from "@saleor/searches/types/SearchCategories";
import { SearchCollections_search_edges_node } from "@saleor/searches/types/SearchCollections";
import { SearchProductTypes_search_edges_node_productAttributes } from "@saleor/searches/types/SearchProductTypes";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import createMultiAutocompleteSelectHandler from "@saleor/utils/handlers/multiAutocompleteSelectChangeHandler";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import { ContentState, convertToRaw, RawDraftContentState } from "draft-js";
import React from "react";
import { useIntl } from "react-intl";

import { FetchMoreProps } from "../../../types";
import {
  createAttributeChangeHandler,
  createAttributeMultiChangeHandler,
  createChannelsChangeHandler,
  createChannelsPriceChangeHandler,
  createProductTypeSelectHandler
} from "../../utils/handlers";
import ProductAttributes, {
  ProductAttributeInput,
  ProductAttributeInputData
} from "../ProductAttributes";
import ProductDetailsForm from "../ProductDetailsForm";
import ProductOrganization from "../ProductOrganization";
import ProductShipping from "../ProductShipping/ProductShipping";
import ProductStocks, { ProductStockInput } from "../ProductStocks";
import ProductTaxes from "../ProductTaxes";

interface FormData extends MetadataFormData {
  basePrice: number;
  category: string;
  changeTaxCode: boolean;
  channelListing: ChannelData[];
  chargeTaxes: boolean;
  collections: string[];
  description: RawDraftContentState;
  name: string;
  slug: string;
  productType: string;
  seoDescription: string;
  seoTitle: string;
  sku: string;
  stockQuantity: number;
  taxCode: string;
  trackInventory: boolean;
  weight: string;
}
export interface ProductCreatePageSubmitData extends FormData {
  attributes: ProductAttributeInput[];
  stocks: ProductStockInput[];
}

interface ProductCreatePageProps {
  errors: ProductErrorWithAttributesFragment[];
  channelsErrors: ProductChannelListingErrorFragment[];
  allChannelsCount: number;
  currentChannels: ChannelData[];
  collections: SearchCollections_search_edges_node[];
  categories: SearchCategories_search_edges_node[];
  currency: string;
  disabled: boolean;
  fetchMoreCategories: FetchMoreProps;
  fetchMoreCollections: FetchMoreProps;
  fetchMoreProductTypes: FetchMoreProps;
  initial?: Partial<FormData>;
  productTypes?: Array<{
    id: string;
    name: string;
    hasVariants: boolean;
    productAttributes: SearchProductTypes_search_edges_node_productAttributes[];
  }>;
  hasChannelChanged: boolean;
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
  onSubmit?(data: ProductCreatePageSubmitData);
}

export const ProductCreatePage: React.FC<ProductCreatePageProps> = ({
  allChannelsCount,
  channelsErrors,
  currentChannels = [],
  disabled,
  categories: categoryChoiceList,
  collections: collectionChoiceList,
  errors,
  fetchCategories,
  fetchCollections,
  fetchMoreCategories,
  fetchMoreCollections,
  fetchMoreProductTypes,
  hasChannelChanged,
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

  const initialProductType = productTypeChoiceList?.find(
    productType => initial?.productType === productType.id
  );

  // Form values
  const {
    change: changeAttributeData,
    data: attributes,
    set: setAttributeData
  } = useFormset<ProductAttributeInputData>(
    initial?.productType
      ? getAttributeInputFromProductType(initialProductType)
      : []
  );
  const {
    add: addStock,
    change: changeStockData,
    data: stocks,
    remove: removeStock
  } = useFormset<null, string>([]);

  // Ensures that it will not change after component rerenders, because it
  // generates different block keys and it causes editor to lose its content.
  const initialDescription = React.useRef(
    convertToRaw(ContentState.createFromText(""))
  );

  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const initialData: FormData = {
    ...(initial || {}),
    basePrice: 0,
    category: "",
    changeTaxCode: false,
    channelListing: currentChannels,
    chargeTaxes: false,
    collections: [],
    description: {} as any,
    metadata: [],
    name: "",
    privateMetadata: [],
    productType: "",
    seoDescription: "",
    seoTitle: "",
    sku: null,
    slug: "",
    stockQuantity: null,
    taxCode: null,
    trackInventory: false,
    weight: ""
  };
  // Display values
  const [selectedCategory, setSelectedCategory] = useStateFromProps(
    initial?.category || ""
  );

  const [selectedCollections, setSelectedCollections] = useStateFromProps<
    MultiAutocompleteChoiceType[]
  >([]);

  const [productType, setProductType] = useStateFromProps<ProductType>(
    initialProductType || null
  );
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

  const handleSubmit = (data: FormData) =>
    onSubmit({
      ...data,
      attributes,
      stocks
    });
  return (
    <Form onSubmit={handleSubmit} initial={initialData} confirmLeave>
      {({ change, data, hasChanged, submit, triggerChange, toggleValue }) => {
        const handleCollectionSelect = createMultiAutocompleteSelectHandler(
          toggleValue,
          setSelectedCollections,
          selectedCollections,
          collections
        );
        const handleCategorySelect = createSingleAutocompleteSelectHandler(
          change,
          setSelectedCategory,
          categories
        );
        const handleAttributeChange = createAttributeChangeHandler(
          changeAttributeData,
          triggerChange
        );
        const handleAttributeMultiChange = createAttributeMultiChangeHandler(
          changeAttributeData,
          attributes,
          triggerChange
        );

        const handleProductTypeSelect = createProductTypeSelectHandler(
          change,
          setAttributeData,
          setProductType,
          productTypeChoiceList
        );
        const handleTaxTypeSelect = createSingleAutocompleteSelectHandler(
          change,
          setSelectedTaxType,
          taxTypeChoices
        );

        const changeMetadata = makeMetadataChangeHandler(change);

        const handleChannelsChange = createChannelsChangeHandler(
          data.channelListing,
          onChannelsChange,
          triggerChange
        );
        const handleChannelPriceChange = createChannelsPriceChangeHandler(
          data.channelListing,
          onChannelsChange,
          triggerChange
        );
        const productTypeChoice = productTypeChoiceList?.find(
          choice => choice.id === data.productType
        );
        const formDisabled =
          !productTypeChoice?.hasVariants &&
          (!data.sku ||
            data.channelListing.some(
              channel =>
                validatePrice(channel.price) ||
                validateCostPrice(channel.costPrice)
            ));

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
                  disabled={disabled}
                  errors={errors}
                  initialDescription={initialDescription.current}
                  onChange={change}
                />
                <CardSpacer />
                {attributes.length > 0 && (
                  <ProductAttributes
                    attributes={attributes}
                    disabled={disabled}
                    errors={errors}
                    onChange={handleAttributeChange}
                    onMultiChange={handleAttributeMultiChange}
                  />
                )}
                <CardSpacer />
                {!!productType && !productType.hasVariants && (
                  <>
                    <ProductShipping
                      data={data}
                      disabled={disabled}
                      errors={errors}
                      weightUnit={weightUnit}
                      onChange={change}
                    />
                    <ProductVariantPrice
                      ProductVariantChannelListings={data.channelListing}
                      errors={channelsErrors}
                      loading={disabled}
                      onChange={handleChannelPriceChange}
                    />
                    <CardSpacer />
                    <ProductStocks
                      data={data}
                      disabled={disabled}
                      hasVariants={false}
                      onFormDataChange={change}
                      errors={errors}
                      stocks={stocks}
                      warehouses={warehouses}
                      onChange={(id, value) => {
                        triggerChange();
                        changeStockData(id, value);
                      }}
                      onWarehouseStockAdd={id => {
                        triggerChange();
                        addStock({
                          data: null,
                          id,
                          label: warehouses.find(
                            warehouse => warehouse.id === id
                          ).name,
                          value: "0"
                        });
                      }}
                      onWarehouseStockDelete={id => {
                        triggerChange();
                        removeStock(id);
                      }}
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
                  loading={disabled}
                  onChange={change}
                />
                <CardSpacer />
                <Metadata data={data} onChange={changeMetadata} />
              </div>
              <div>
                <ProductOrganization
                  canChangeType={true}
                  categories={categories}
                  categoryInputDisplayValue={selectedCategory}
                  collections={collections}
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  fetchCategories={fetchCategories}
                  fetchCollections={fetchCollections}
                  fetchMoreCategories={fetchMoreCategories}
                  fetchMoreCollections={fetchMoreCollections}
                  fetchMoreProductTypes={fetchMoreProductTypes}
                  fetchProductTypes={fetchProductTypes}
                  productType={productType}
                  productTypeInputDisplayValue={productType?.name || ""}
                  productTypes={productTypes}
                  onCategoryChange={handleCategorySelect}
                  onCollectionChange={handleCollectionSelect}
                  onProductTypeChange={handleProductTypeSelect}
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
                  selectedChannelsCount={data.channelListing.length}
                  allChannelsCount={allChannelsCount}
                  channels={data.channelListing}
                  disabled={disabled}
                  onChange={handleChannelsChange}
                  openModal={openChannelsModal}
                />
                <CardSpacer />
                <ProductTaxes
                  data={data}
                  disabled={disabled}
                  onChange={change}
                  onTaxTypeChange={handleTaxTypeSelect}
                  selectedTaxTypeDisplayName={selectedTaxType}
                  taxTypes={taxTypes}
                />
              </div>
            </Grid>
            <SaveButtonBar
              onCancel={onBack}
              onSave={submit}
              state={saveButtonBarState}
              disabled={
                disabled ||
                !onSubmit ||
                formDisabled ||
                (!hasChanged && !hasChannelChanged)
              }
            />
          </Container>
        );
      }}
    </Form>
  );
};
ProductCreatePage.displayName = "ProductCreatePage";
export default ProductCreatePage;
