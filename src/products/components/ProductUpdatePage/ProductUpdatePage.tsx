import { ChannelData } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import ChannelsAvailability from "@saleor/components/ChannelsAvailability";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import SeoForm from "@saleor/components/SeoForm";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import useFormset from "@saleor/hooks/useFormset";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import ProductVariantPrice from "@saleor/products/components/ProductVariantPrice";
import { ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_productChannelListingErrors } from "@saleor/products/types/ProductVariantChannelListingUpdate";
import { SearchCategories_search_edges_node } from "@saleor/searches/types/SearchCategories";
import { SearchCollections_search_edges_node } from "@saleor/searches/types/SearchCollections";
import { FetchMoreProps, ListActions } from "@saleor/types";
import createMultiAutocompleteSelectHandler from "@saleor/utils/handlers/multiAutocompleteSelectChangeHandler";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
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
  getSelectedAttributesFromProduct,
  getStockInputFromProduct,
  ProductAttributeValueChoices,
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
import ProductStocks, { ProductStockInput } from "../ProductStocks";
import ProductVariants from "../ProductVariants";

export interface ProductUpdatePageProps extends ListActions {
  channelsErrors: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_productChannelListingErrors[];
  errors: ProductErrorFragment[];
  allChannelsCount: number;
  currentChannels: ChannelData[];
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
  fetchCategories: (query: string) => void;
  fetchCollections: (query: string) => void;
  onVariantsAdd: () => void;
  onVariantShow: (id: string) => () => void;
  onImageDelete: (id: string) => () => void;
  openChannelsModal: () => void;
  onBack?();
  onDelete();
  onImageEdit?(id: string);
  onImageReorder?(event: { oldIndex: number; newIndex: number });
  onImageUpload(file: File);
  onSeoClick?();
  onSubmit?(data: ProductUpdatePageSubmitData);
  onVariantAdd?();
}

export interface ProductUpdatePageSubmitData extends ProductUpdatePageFormData {
  attributes: ProductAttributeInput[];
  collections: string[];
  addStocks: ProductStockInput[];
  updateStocks: ProductStockInput[];
  removeStocks: string[];
}

export const ProductUpdatePage: React.FC<ProductUpdatePageProps> = ({
  disabled,
  categories: categoryChoiceList,
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
  onBack,
  onDelete,
  onImageDelete,
  onImageEdit,
  onImageReorder,
  onImageUpload,
  openChannelsModal,
  onSeoClick,
  onSubmit,
  onVariantAdd,
  onVariantsAdd,
  onVariantShow,
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

  const [selectedAttributes, setSelectedAttributes] = useStateFromProps<
    ProductAttributeValueChoices[]
  >(getSelectedAttributesFromProduct(product));

  const [selectedCategory, setSelectedCategory] = useStateFromProps(
    maybe(() => product.category.name, "")
  );

  const [selectedCollections, setSelectedCollections] = useStateFromProps(
    getChoices(maybe(() => product.collections, []))
  );

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

  const handleSubmit = (data: ProductUpdatePageFormData) => {
    const dataStocks = stocks.map(stock => stock.id);
    const variantStocks =
      product.variants[0]?.stocks.map(stock => stock.warehouse.id) || [];
    const stockDiff = diff(variantStocks, dataStocks);
    onSubmit({
      ...data,
      addStocks: stocks.filter(stock =>
        stockDiff.added.some(addedStock => addedStock === stock.id)
      ),
      attributes,
      removeStocks: stockDiff.removed,
      updateStocks: stocks.filter(
        stock => !stockDiff.added.some(addedStock => addedStock === stock.id)
      )
    });
  };

  return (
    <Form onSubmit={handleSubmit} initial={initialData} confirmLeave>
      {({
        change,
        data,
        hasChanged,
        set,
        submit,
        triggerChange,
        toggleValue
      }) => {
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
          setSelectedAttributes,
          selectedAttributes,
          attributes,
          triggerChange
        );
        const handleAttributeMultiChange = createAttributeMultiChangeHandler(
          changeAttributeData,
          setSelectedAttributes,
          selectedAttributes,
          attributes,
          triggerChange
        );
        const handleChannelChange = createChannelsChangeHandler(
          data,
          set,
          triggerChange
        );
        const handleChannelPriceChange = createChannelsPriceChangeHandler(
          data,
          set,
          triggerChange
        );

        const formDisabled =
          !data.sku || data.channelListing?.some(channel => channel.price < 0);

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
                      fallbackPrice={
                        product?.variants?.length
                          ? product.variants[0].pricing.price.gross
                          : undefined
                      }
                      onRowClick={onVariantShow}
                      onVariantAdd={onVariantAdd}
                      onVariantsAdd={onVariantsAdd}
                      toolbar={toolbar}
                      isChecked={isChecked}
                      selected={selected}
                      toggle={toggle}
                      toggleAll={toggleAll}
                    />
                  ) : (
                    <ProductStocks
                      data={data}
                      disabled={disabled}
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
                    />
                  )}
                  <CardSpacer />
                  <SeoForm
                    title={data.seoTitle}
                    titlePlaceholder={data.name}
                    description={data.seoDescription}
                    descriptionPlaceholder={maybe(() =>
                      convertFromRaw(data.description)
                        .getPlainText()
                        .slice(0, 300)
                    )}
                    loading={disabled}
                    onClick={onSeoClick}
                    onChange={change}
                    helperText={intl.formatMessage({
                      defaultMessage:
                        "Add search engine title and description to make this product easier to find"
                    })}
                  />
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
                  <ChannelsAvailability
                    selectedChannelsCount={data.channelListing.length}
                    allChannelsCount={allChannelsCount}
                    channels={data.channelListing}
                    disabled={disabled}
                    onChange={handleChannelChange}
                    openModal={openChannelsModal}
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
