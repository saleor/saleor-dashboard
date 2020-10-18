import { ChannelData } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import { AvailabilityCard } from "@saleor/components/AvailabilityCard";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import SeoForm from "@saleor/components/SeoForm";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { ProductChannelListingErrorFragment } from "@saleor/fragments/types/ProductChannelListingErrorFragment";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import { TaxTypeFragment } from "@saleor/fragments/types/TaxTypeFragment";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import useFormset from "@saleor/hooks/useFormset";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import ProductVariantPrice from "@saleor/products/components/ProductVariantPrice";
import {
  validateCostPrice,
  validatePrice
} from "@saleor/products/utils/validation";
import { SearchCategories_search_edges_node } from "@saleor/searches/types/SearchCategories";
import { SearchCollections_search_edges_node } from "@saleor/searches/types/SearchCollections";
import { FetchMoreProps, ListActions, ReorderAction } from "@saleor/types";
import createMultiAutocompleteSelectHandler from "@saleor/utils/handlers/multiAutocompleteSelectChangeHandler";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import { convertFromRaw, RawDraftContentState } from "draft-js";
import { diff } from "fast-array-diff";
import React from "react";
import { useIntl } from "react-intl";

import {
  ProductDetails_product,
  ProductDetails_product_images,
  ProductDetails_product_variants
} from "../../types/ProductDetails";
import {
  getAttributeInputFromProduct,
  getChoices,
  getProductUpdatePageFormData,
  getStockInputFromProduct,
  ProductUpdatePageFormData
} from "../../utils/data";
import {
  createAttributeChangeHandler,
  createAttributeMultiChangeHandler,
  createChannelsChangeHandler,
  createChannelsPriceChangeHandler
} from "../../utils/handlers";
import ProductAttributes, { ProductAttributeInput } from "../ProductAttributes";
import ProductDetailsForm from "../ProductDetailsForm";
import ProductImages from "../ProductImages";
import ProductOrganization from "../ProductOrganization";
import ProductShipping from "../ProductShipping/ProductShipping";
import ProductStocks, { ProductStockInput } from "../ProductStocks";
import ProductTaxes from "../ProductTaxes";
import ProductVariants from "../ProductVariants";

export interface ProductUpdatePageProps extends ListActions {
  defaultWeightUnit: string;
  errors: ProductErrorWithAttributesFragment[];
  channelsErrors: ProductChannelListingErrorFragment[];
  allChannelsCount: number;
  currentChannels: ChannelData[];
  channelChoices: SingleAutocompleteChoiceType[];
  placeholderImage: string;
  collections: SearchCollections_search_edges_node[];
  categories: SearchCategories_search_edges_node[];
  disabled: boolean;
  fetchMoreCategories: FetchMoreProps;
  fetchMoreCollections: FetchMoreProps;
  variants: ProductDetails_product_variants[];
  images: ProductDetails_product_images[];
  hasChannelChanged: boolean;
  product: ProductDetails_product;
  header: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  warehouses: WarehouseFragment[];
  taxTypes: TaxTypeFragment[];
  fetchCategories: (query: string) => void;
  fetchCollections: (query: string) => void;
  onVariantsAdd: () => void;
  onVariantShow: (id: string) => () => void;
  onVariantReorder: ReorderAction;
  onImageDelete: (id: string) => () => void;
  openChannelsModal: () => void;
  onChannelsChange: (data: ChannelData[]) => void;
  onBack?();
  onDelete();
  onImageEdit?(id: string);
  onImageReorder?(event: { oldIndex: number; newIndex: number });
  onImageUpload(file: File);
  onSeoClick?();
  onSubmit?(data: ProductUpdatePageSubmitData);
  onVariantAdd?();
  onSetDefaultVariant(variant: ProductDetails_product_variants);
  onWarehouseConfigure();
}

export interface ProductUpdatePageSubmitData extends ProductUpdatePageFormData {
  attributes: ProductAttributeInput[];
  collections: string[];
  addStocks: ProductStockInput[];
  updateStocks: ProductStockInput[];
  removeStocks: string[];
}

export const ProductUpdatePage: React.FC<ProductUpdatePageProps> = ({
  defaultWeightUnit,
  disabled,
  categories: categoryChoiceList,
  channelChoices,
  channelsErrors,
  allChannelsCount,
  currentChannels = [],
  collections: collectionChoiceList,
  errors,
  fetchCategories,
  fetchCollections,
  fetchMoreCategories,
  fetchMoreCollections,
  images,
  hasChannelChanged,
  header,
  placeholderImage,
  product,
  saveButtonBarState,
  variants,
  warehouses,
  taxTypes,
  onBack,
  onDelete,
  onImageDelete,
  onImageEdit,
  onImageReorder,
  onImageUpload,
  onChannelsChange,
  openChannelsModal,
  onSeoClick,
  onSubmit,
  onVariantAdd,
  onVariantsAdd,
  onSetDefaultVariant,
  onVariantShow,
  onVariantReorder,
  onWarehouseConfigure,
  isChecked,
  selected,
  toggle,
  toggleAll,
  toolbar
}) => {
  const intl = useIntl();
  const attributeInput = React.useMemo(
    () => getAttributeInputFromProduct(product),
    [product]
  );
  const stockInput = React.useMemo(() => getStockInputFromProduct(product), [
    product
  ]);
  const { change: changeAttributeData, data: attributes } = useFormset(
    attributeInput
  );
  const {
    add: addStock,
    change: changeStockData,
    data: stocks,
    remove: removeStock
  } = useFormset(stockInput);

  const [selectedCategory, setSelectedCategory] = useStateFromProps(
    maybe(() => product.category.name, "")
  );

  const [selectedCollections, setSelectedCollections] = useStateFromProps(
    getChoices(maybe(() => product.collections, []))
  );

  const [selectedTaxType, setSelectedTaxType] = useStateFromProps(
    product?.taxType.description
  );

  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const initialData = getProductUpdatePageFormData(
    product,
    variants,
    currentChannels
  );
  const initialDescription = maybe<RawDraftContentState>(() =>
    JSON.parse(product.descriptionJson)
  );
  const categories = getChoices(categoryChoiceList);
  const collections = getChoices(collectionChoiceList);
  const hasVariants = maybe(() => product.productType.hasVariants, false);
  const taxTypeChoices =
    taxTypes?.map(taxType => ({
      label: taxType.description,
      value: taxType.taxCode
    })) || [];

  const handleSubmit = (data: ProductUpdatePageFormData) => {
    const metadata = isMetadataModified ? data.metadata : undefined;
    const privateMetadata = isPrivateMetadataModified
      ? data.privateMetadata
      : undefined;

    if (product.productType.hasVariants) {
      onSubmit({
        ...data,
        addStocks: [],
        attributes,
        metadata,
        privateMetadata,
        removeStocks: [],
        updateStocks: []
      });
    } else {
      const dataStocks = stocks.map(stock => stock.id);
      const variantStocks = product.variants[0]?.stocks.map(
        stock => stock.warehouse.id
      );
      const stockDiff = diff(variantStocks, dataStocks);

      onSubmit({
        ...data,
        addStocks: stocks.filter(stock =>
          stockDiff.added.some(addedStock => addedStock === stock.id)
        ),
        attributes,
        metadata,
        privateMetadata,
        removeStocks: stockDiff.removed,
        updateStocks: stocks.filter(
          stock => !stockDiff.added.some(addedStock => addedStock === stock.id)
        )
      });
    }
  };

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
        const changeMetadata = makeMetadataChangeHandler(change);
        const handleTaxTypeSelect = createSingleAutocompleteSelectHandler(
          change,
          setSelectedTaxType,
          taxTypeChoices
        );
        const handleChannelChange = createChannelsChangeHandler(
          data.channelListing,
          onChannelsChange,
          triggerChange
        );
        const handleChannelPriceChange = createChannelsPriceChangeHandler(
          data.channelListing,
          onChannelsChange,
          triggerChange
        );

        const formDisabled =
          !product?.productType.hasVariants &&
          (!data.sku ||
            data.channelListing.some(
              channel =>
                validatePrice(channel.price) ||
                validateCostPrice(channel.costPrice)
            ));

        return (
          <>
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
                    initialDescription={initialDescription}
                    onChange={change}
                  />
                  <CardSpacer />
                  <ProductImages
                    images={images}
                    placeholderImage={placeholderImage}
                    onImageDelete={onImageDelete}
                    onImageReorder={onImageReorder}
                    onImageEdit={onImageEdit}
                    onImageUpload={onImageUpload}
                  />
                  <CardSpacer />
                  {attributes.length > 0 && (
                    <ProductAttributes
                      attributes={attributes}
                      errors={errors}
                      disabled={disabled}
                      onChange={handleAttributeChange}
                      onMultiChange={handleAttributeMultiChange}
                    />
                  )}
                  <CardSpacer />
                  {!!product?.productType && !hasVariants && (
                    <>
                      <ProductVariantPrice
                        ProductVariantChannelListings={data.channelListing}
                        errors={channelsErrors}
                        loading={disabled}
                        onChange={handleChannelPriceChange}
                      />
                      <CardSpacer />
                    </>
                  )}
                  {hasVariants ? (
                    <ProductVariants
                      disabled={disabled}
                      variants={variants}
                      channelChoices={channelChoices}
                      product={product}
                      onRowClick={onVariantShow}
                      onVariantAdd={onVariantAdd}
                      onVariantsAdd={onVariantsAdd}
                      onVariantReorder={onVariantReorder}
                      onSetDefaultVariant={onSetDefaultVariant}
                      toolbar={toolbar}
                      isChecked={isChecked}
                      selected={selected}
                      toggle={toggle}
                      toggleAll={toggleAll}
                    />
                  ) : (
                    <>
                      <ProductShipping
                        data={data}
                        disabled={disabled}
                        errors={errors}
                        weightUnit={product?.weight?.unit || defaultWeightUnit}
                        onChange={change}
                      />
                      <CardSpacer />
                      <ProductStocks
                        data={data}
                        disabled={disabled}
                        hasVariants={false}
                        errors={errors}
                        stocks={stocks}
                        warehouses={warehouses}
                        onChange={(id, value) => {
                          triggerChange();
                          changeStockData(id, value);
                        }}
                        onFormDataChange={change}
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
                    </>
                  )}
                  <CardSpacer />
                  <SeoForm
                    errors={errors}
                    title={data.seoTitle}
                    titlePlaceholder={data.name}
                    description={data.seoDescription}
                    descriptionPlaceholder={maybe(() =>
                      convertFromRaw(data.description)
                        .getPlainText()
                        .slice(0, 300)
                    )}
                    slug={data.slug}
                    slugPlaceholder={data.name}
                    loading={disabled}
                    onClick={onSeoClick}
                    onChange={change}
                    helperText={intl.formatMessage({
                      defaultMessage:
                        "Add search engine title and description to make this product easier to find"
                    })}
                  />
                  <CardSpacer />
                  <Metadata data={data} onChange={changeMetadata} />
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
                    errors={errors}
                    fetchCategories={fetchCategories}
                    fetchCollections={fetchCollections}
                    fetchMoreCategories={fetchMoreCategories}
                    fetchMoreCollections={fetchMoreCollections}
                    productType={product?.productType}
                    onCategoryChange={handleCategorySelect}
                    onCollectionChange={handleCollectionSelect}
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
                    onChange={handleChannelChange}
                    openModal={openChannelsModal}
                  />
                  <CardSpacer />
                  <ProductTaxes
                    data={data}
                    disabled={disabled}
                    selectedTaxTypeDisplayName={selectedTaxType}
                    taxTypes={taxTypes}
                    onChange={change}
                    onTaxTypeChange={handleTaxTypeSelect}
                  />
                </div>
              </Grid>
              <SaveButtonBar
                onCancel={onBack}
                onDelete={onDelete}
                onSave={submit}
                state={saveButtonBarState}
                disabled={
                  disabled ||
                  formDisabled ||
                  (!hasChanged && !hasChannelChanged)
                }
              />
            </Container>
          </>
        );
      }}
    </Form>
  );
};
ProductUpdatePage.displayName = "ProductUpdatePage";
export default ProductUpdatePage;
