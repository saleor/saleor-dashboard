import AppHeader from "@saleor/components/AppHeader";
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
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import { TaxTypeFragment } from "@saleor/fragments/types/TaxTypeFragment";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { getChoices } from "@saleor/products/utils/data";
import { SearchCategories_search_edges_node } from "@saleor/searches/types/SearchCategories";
import { SearchCollections_search_edges_node } from "@saleor/searches/types/SearchCollections";
import { SearchProductTypes_search_edges_node } from "@saleor/searches/types/SearchProductTypes";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import { ContentState, convertToRaw } from "draft-js";
import React from "react";
import { useIntl } from "react-intl";

import { FetchMoreProps } from "../../../types";
import ProductAttributes from "../ProductAttributes";
import ProductDetailsForm from "../ProductDetailsForm";
import ProductOrganization from "../ProductOrganization";
import ProductPricing from "../ProductPricing";
import ProductShipping from "../ProductShipping/ProductShipping";
import ProductStocks from "../ProductStocks";
import ProductTaxes from "../ProductTaxes";
import ProductCreateForm, {
  ProductCreateData,
  ProductCreateFormData
} from "./form";

interface ProductCreatePageProps {
  errors: ProductErrorWithAttributesFragment[];
  collections: SearchCollections_search_edges_node[];
  categories: SearchCategories_search_edges_node[];
  currency: string;
  disabled: boolean;
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
  onBack?();
  onSubmit?(data: ProductCreateData);
}

export const ProductCreatePage: React.FC<ProductCreatePageProps> = ({
  currency,
  disabled,
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
  onWarehouseConfigure
}: ProductCreatePageProps) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  // Ensures that it will not change after component rerenders, because it
  // generates different block keys and it causes editor to lose its content.
  const initialDescription = React.useRef(
    convertToRaw(ContentState.createFromText(""))
  );

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
      taxTypes={taxTypeChoices}
      warehouses={warehouses}
    >
      {({ change, data, handlers, hasChanged, submit }) => {
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
                  disabled={disabled}
                  errors={errors}
                  initialDescription={initialDescription.current}
                  onChange={change}
                />
                <CardSpacer />
                {data.attributes.length > 0 && (
                  <ProductAttributes
                    attributes={data.attributes}
                    disabled={disabled}
                    errors={errors}
                    onChange={handlers.selectAttribute}
                    onMultiChange={handlers.selectAttributeMultiple}
                  />
                )}
                <CardSpacer />
                {isSimpleProduct && (
                  <>
                    <ProductShipping
                      data={data}
                      disabled={disabled}
                      errors={errors}
                      weightUnit={weightUnit}
                      onChange={change}
                    />
                    <ProductPricing
                      currency={currency}
                      data={data}
                      disabled={disabled}
                      errors={errors}
                      onChange={change}
                    />
                    <CardSpacer />
                    <ProductStocks
                      data={data}
                      disabled={disabled}
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
                  loading={disabled}
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
                  disabled={disabled}
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
                  data={data}
                  errors={errors}
                  disabled={disabled}
                  messages={{
                    hiddenLabel: intl.formatMessage({
                      defaultMessage: "Not published",
                      description: "product label"
                    }),
                    hiddenSecondLabel: intl.formatMessage(
                      {
                        defaultMessage: "will become published on {date}",
                        description: "product publication date label"
                      },
                      {
                        date: localizeDate(data.publicationDate, "L")
                      }
                    ),
                    visibleLabel: intl.formatMessage({
                      defaultMessage: "Published",
                      description: "product label"
                    })
                  }}
                  onChange={change}
                />
                <CardSpacer />
                <ProductTaxes
                  data={data}
                  disabled={disabled}
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
              disabled={disabled || !onSubmit || !hasChanged}
            />
          </Container>
        );
      }}
    </ProductCreateForm>
  );
};
ProductCreatePage.displayName = "ProductCreatePage";
export default ProductCreatePage;
