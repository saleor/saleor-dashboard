import { OutputData } from "@editorjs/editorjs";
import { ChannelData } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import Attributes, { AttributeInput } from "@saleor/components/Attributes";
import AvailabilityCard from "@saleor/components/AvailabilityCard";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
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
import { SubmitPromise } from "@saleor/hooks/useForm";
import { FormsetData } from "@saleor/hooks/useFormset";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import ProductVariantPrice from "@saleor/products/components/ProductVariantPrice";
import { SearchCategories_search_edges_node } from "@saleor/searches/types/SearchCategories";
import { SearchCollections_search_edges_node } from "@saleor/searches/types/SearchCollections";
import {
  ChannelProps,
  FetchMoreProps,
  ListActions,
  ReorderAction
} from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import {
  ProductDetails_product,
  ProductDetails_product_images,
  ProductDetails_product_variants
} from "../../types/ProductDetails";
import { getChoices, ProductUpdatePageFormData } from "../../utils/data";
import ProductDetailsForm from "../ProductDetailsForm";
import ProductImages from "../ProductImages";
import ProductOrganization from "../ProductOrganization";
import ProductShipping from "../ProductShipping/ProductShipping";
import ProductStocks, { ProductStockInput } from "../ProductStocks";
import ProductTaxes from "../ProductTaxes";
import ProductVariants from "../ProductVariants";
import ProductUpdateForm from "./form";

export interface ProductUpdatePageProps extends ListActions, ChannelProps {
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
  onSubmit: (data: ProductUpdatePageSubmitData) => SubmitPromise;
  openChannelsModal: () => void;
  onChannelsChange: (data: ChannelData[]) => void;
  onBack?();
  onDelete();
  onImageEdit?(id: string);
  onImageReorder?(event: { oldIndex: number; newIndex: number });
  onImageUpload(file: File);
  onSeoClick?();
  onVariantAdd?();
  onSetDefaultVariant(variant: ProductDetails_product_variants);
  onWarehouseConfigure();
}

export interface ProductUpdatePageSubmitData
  extends ProductUpdatePageFormData,
    ChannelProps {
  addStocks: ProductStockInput[];
  attributes: AttributeInput[];
  attributesWithNewFileValue: FormsetData<null, File>;
  collections: string[];
  description: OutputData;
  removeStocks: string[];
  updateStocks: ProductStockInput[];
}

export const ProductUpdatePage: React.FC<ProductUpdatePageProps> = ({
  defaultWeightUnit,
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
  selectedChannelId,
  toggle,
  toggleAll,
  toolbar
}) => {
  const intl = useIntl();

  const [selectedCategory, setSelectedCategory] = useStateFromProps(
    product?.category?.name || ""
  );

  const [selectedCollections, setSelectedCollections] = useStateFromProps(
    getChoices(maybe(() => product.collections, []))
  );

  const [selectedTaxType, setSelectedTaxType] = useStateFromProps(
    product?.taxType.description
  );

  const categories = getChoices(categoryChoiceList);
  const collections = getChoices(collectionChoiceList);
  const hasVariants = product?.productType?.hasVariants;
  const taxTypeChoices =
    taxTypes?.map(taxType => ({
      label: taxType.description,
      value: taxType.taxCode
    })) || [];

  return (
    <ProductUpdateForm
      onSubmit={onSubmit}
      product={product}
      categories={categories}
      collections={collections}
      selectedCollections={selectedCollections}
      setSelectedCategory={setSelectedCategory}
      setSelectedCollections={setSelectedCollections}
      setSelectedTaxType={setSelectedTaxType}
      setChannels={onChannelsChange}
      taxTypes={taxTypeChoices}
      warehouses={warehouses}
      currentChannels={currentChannels}
      hasVariants={hasVariants}
    >
      {({
        change,
        data,
        disabled: formDisabled,
        handlers,
        hasChanged,
        submit
      }) => (
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
                  onDescriptionChange={handlers.changeDescription}
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
                {data.attributes.length > 0 && (
                  <Attributes
                    attributes={data.attributes}
                    errors={errors}
                    loading={disabled}
                    disabled={disabled}
                    onChange={handlers.selectAttribute}
                    onMultiChange={handlers.selectAttributeMultiple}
                    onFileChange={handlers.selectAttributeFile}
                  />
                )}
                <CardSpacer />
                {!!product?.productType && !hasVariants && (
                  <>
                    <ProductVariantPrice
                      ProductVariantChannelListings={data.channelListings}
                      errors={channelsErrors}
                      loading={disabled}
                      onChange={handlers.changeChannelPrice}
                    />
                    <CardSpacer />
                  </>
                )}
                {hasVariants ? (
                  <ProductVariants
                    disabled={disabled}
                    variants={variants}
                    product={product}
                    onRowClick={onVariantShow}
                    onVariantAdd={onVariantAdd}
                    onVariantsAdd={onVariantsAdd}
                    onVariantReorder={onVariantReorder}
                    onSetDefaultVariant={onSetDefaultVariant}
                    toolbar={toolbar}
                    isChecked={isChecked}
                    selected={selected}
                    selectedChannelId={selectedChannelId}
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
                      stocks={data.stocks}
                      warehouses={warehouses}
                      onChange={handlers.changeStock}
                      onFormDataChange={change}
                      onWarehouseStockAdd={handlers.addStock}
                      onWarehouseStockDelete={handlers.deleteStock}
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
                  descriptionPlaceholder={""} // TODO: cast description to string
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
                <Metadata data={data} onChange={handlers.changeMetadata} />
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
                  onCategoryChange={handlers.selectCategory}
                  onCollectionChange={handlers.selectCollection}
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
                  disabled={disabled}
                  onChange={handlers.changeChannels}
                  openModal={openChannelsModal}
                />
                <CardSpacer />
                <ProductTaxes
                  data={data}
                  disabled={disabled}
                  selectedTaxTypeDisplayName={selectedTaxType}
                  taxTypes={taxTypes}
                  onChange={change}
                  onTaxTypeChange={handlers.selectTaxRate}
                />
              </div>
            </Grid>
            <SaveButtonBar
              onCancel={onBack}
              onDelete={onDelete}
              onSave={submit}
              state={saveButtonBarState}
              disabled={
                disabled || formDisabled || (!hasChanged && !hasChannelChanged)
              }
            />
          </Container>
        </>
      )}
    </ProductUpdateForm>
  );
};
ProductUpdatePage.displayName = "ProductUpdatePage";
export default ProductUpdatePage;
