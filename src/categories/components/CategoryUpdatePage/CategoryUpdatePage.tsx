import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import AppHeader from "@saleor/components/AppHeader";
import { CardSpacer } from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Metadata from "@saleor/components/Metadata/Metadata";
import { MetadataFormData } from "@saleor/components/Metadata/types";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import SeoForm from "@saleor/components/SeoForm";
import { Tab, TabContainer } from "@saleor/components/Tab";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { sectionNames } from "@saleor/intl";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import { RawDraftContentState } from "draft-js";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { TabListActions } from "../../../types";
import CategoryDetailsForm from "../../components/CategoryDetailsForm";
import CategoryList from "../../components/CategoryList";
import {
  CategoryDetails_category,
  CategoryDetails_category_children_edges_node,
  CategoryDetails_category_products_edges_node
} from "../../types/CategoryDetails";
import CategoryBackground from "../CategoryBackground";
import CategoryProducts from "../CategoryProducts";

export interface FormData extends MetadataFormData {
  backgroundImageAlt: string;
  description: RawDraftContentState;
  name: string;
  seoTitle: string;
  seoDescription: string;
}

export enum CategoryPageTab {
  categories = "categories",
  products = "products"
}

export interface CategoryUpdatePageProps
  extends TabListActions<"productListToolbar" | "subcategoryListToolbar"> {
  changeTab: (index: CategoryPageTab) => void;
  currentTab: CategoryPageTab;
  errors: ProductErrorFragment[];
  disabled: boolean;
  category: CategoryDetails_category;
  products: CategoryDetails_category_products_edges_node[];
  subcategories: CategoryDetails_category_children_edges_node[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  saveButtonBarState: ConfirmButtonTransitionState;
  onImageDelete: () => void;
  onSubmit: (data: FormData) => void;
  onImageUpload(file: File);
  onNextPage();
  onPreviousPage();
  onProductClick(id: string): () => void;
  onAddProduct();
  onBack();
  onDelete();
  onAddCategory();
  onCategoryClick(id: string): () => void;
}

const CategoriesTab = Tab(CategoryPageTab.categories);
const ProductsTab = Tab(CategoryPageTab.products);

export const CategoryUpdatePage: React.FC<CategoryUpdatePageProps> = ({
  changeTab,
  currentTab,
  category,
  disabled,
  errors,
  pageInfo,
  products,
  saveButtonBarState,
  subcategories,
  onAddCategory,
  onAddProduct,
  onBack,
  onCategoryClick,
  onDelete,
  onNextPage,
  onPreviousPage,
  onProductClick,
  onSubmit,
  onImageDelete,
  onImageUpload,
  isChecked,
  productListToolbar,
  selected,
  subcategoryListToolbar,
  toggle,
  toggleAll
}: CategoryUpdatePageProps) => {
  const intl = useIntl();
  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const initialData: FormData = category
    ? {
        backgroundImageAlt: maybe(() => category.backgroundImage.alt, ""),
        description: maybe(() => JSON.parse(category.descriptionJson)),
        metadata: category?.metadata?.map(mapMetadataItemToInput),
        name: category.name || "",
        privateMetadata: category?.privateMetadata?.map(mapMetadataItemToInput),
        seoDescription: category.seoDescription || "",
        seoTitle: category.seoTitle || ""
      }
    : {
        backgroundImageAlt: "",
        description: "",
        metadata: undefined,
        name: "",
        privateMetadata: undefined,
        seoDescription: "",
        seoTitle: ""
      };

  const handleSubmit = (data: FormData) => {
    const metadata = isMetadataModified ? data.metadata : undefined;
    const privateMetadata = isPrivateMetadataModified
      ? data.privateMetadata
      : undefined;

    onSubmit({
      ...data,
      metadata,
      privateMetadata
    });
  };

  return (
    <Form onSubmit={handleSubmit} initial={initialData} confirmLeave>
      {({ data, change, submit, hasChanged }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.categories)}
            </AppHeader>
            <PageHeader title={category ? category.name : undefined} />
            <CategoryDetailsForm
              category={category}
              data={data}
              disabled={disabled}
              errors={errors}
              onChange={change}
            />
            <CardSpacer />
            <CategoryBackground
              data={data}
              onImageUpload={onImageUpload}
              onImageDelete={onImageDelete}
              image={maybe(() => category.backgroundImage)}
              onChange={change}
            />
            <CardSpacer />
            <SeoForm
              helperText={intl.formatMessage({
                defaultMessage:
                  "Add search engine title and description to make this category easier to find"
              })}
              title={data.seoTitle}
              titlePlaceholder={data.name}
              description={data.seoDescription}
              descriptionPlaceholder={data.name}
              loading={!category}
              onChange={change}
              disabled={disabled}
            />
            <CardSpacer />
            <Metadata data={data} onChange={changeMetadata} />
            <CardSpacer />
            <TabContainer>
              <CategoriesTab
                isActive={currentTab === CategoryPageTab.categories}
                changeTab={changeTab}
              >
                <FormattedMessage
                  defaultMessage="Subcategories"
                  description="number of subcategories in category"
                />
              </CategoriesTab>
              <ProductsTab
                isActive={currentTab === CategoryPageTab.products}
                changeTab={changeTab}
              >
                <FormattedMessage
                  defaultMessage="Products"
                  description="number of products in category"
                />
              </ProductsTab>
            </TabContainer>
            <CardSpacer />
            {currentTab === CategoryPageTab.categories && (
              <Card>
                <CardTitle
                  title={intl.formatMessage({
                    defaultMessage: "All Subcategories",
                    description: "section header"
                  })}
                  toolbar={
                    <Button
                      color="primary"
                      variant="text"
                      onClick={onAddCategory}
                    >
                      <FormattedMessage
                        defaultMessage="Create subcategory"
                        description="button"
                      />
                    </Button>
                  }
                />
                <CategoryList
                  categories={subcategories}
                  disabled={disabled}
                  isChecked={isChecked}
                  isRoot={false}
                  pageInfo={pageInfo}
                  selected={selected}
                  sort={undefined}
                  toggle={toggle}
                  toggleAll={toggleAll}
                  toolbar={subcategoryListToolbar}
                  onNextPage={onNextPage}
                  onPreviousPage={onPreviousPage}
                  onRowClick={onCategoryClick}
                  onSort={() => undefined}
                />
              </Card>
            )}
            {currentTab === CategoryPageTab.products && (
              <CategoryProducts
                categoryName={maybe(() => category.name)}
                products={products}
                disabled={disabled}
                pageInfo={pageInfo}
                onNextPage={onNextPage}
                onPreviousPage={onPreviousPage}
                onRowClick={onProductClick}
                onAdd={onAddProduct}
                toggle={toggle}
                toggleAll={toggleAll}
                selected={selected}
                isChecked={isChecked}
                toolbar={productListToolbar}
              />
            )}
            <SaveButtonBar
              onCancel={onBack}
              onDelete={onDelete}
              onSave={submit}
              state={saveButtonBarState}
              disabled={disabled || !hasChanged}
            />
          </Container>
        );
      }}
    </Form>
  );
};
CategoryUpdatePage.displayName = "CategoryUpdatePage";
export default CategoryUpdatePage;
