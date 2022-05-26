import { Card } from "@material-ui/core";
import {
  categoryAddUrl,
  categoryListUrl,
  categoryUrl,
} from "@saleor/categories/urls";
import { Backlink } from "@saleor/components/Backlink";
import { Button } from "@saleor/components/Button";
import { CardSpacer } from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import Metadata from "@saleor/components/Metadata/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import SeoForm from "@saleor/components/SeoForm";
import { Tab, TabContainer } from "@saleor/components/Tab";
import { CategoryDetailsQuery, ProductErrorFragment } from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { RelayToFlat, TabListActions } from "../../../types";
import CategoryDetailsForm from "../../components/CategoryDetailsForm";
import CategoryList from "../../components/CategoryList";
import CategoryBackground from "../CategoryBackground";
import CategoryProducts from "../CategoryProducts";
import CategoryUpdateForm, { CategoryUpdateData } from "./form";

export enum CategoryPageTab {
  categories = "categories",
  products = "products",
}

export interface CategoryUpdatePageProps
  extends TabListActions<"productListToolbar" | "subcategoryListToolbar"> {
  categoryId: string;
  changeTab: (index: CategoryPageTab) => void;
  currentTab: CategoryPageTab;
  errors: ProductErrorFragment[];
  disabled: boolean;
  category: CategoryDetailsQuery["category"];
  products: RelayToFlat<CategoryDetailsQuery["category"]["products"]>;
  subcategories: RelayToFlat<CategoryDetailsQuery["category"]["children"]>;
  saveButtonBarState: ConfirmButtonTransitionState;
  addProductHref: string;
  onImageDelete: () => void;
  onSubmit: (data: CategoryUpdateData) => SubmitPromise;
  onImageUpload(file: File);
  onDelete();
}

const CategoriesTab = Tab(CategoryPageTab.categories);
const ProductsTab = Tab(CategoryPageTab.products);

export const CategoryUpdatePage: React.FC<CategoryUpdatePageProps> = ({
  categoryId,
  changeTab,
  currentTab,
  category,
  disabled,
  errors,
  products,
  saveButtonBarState,
  subcategories,
  onDelete,
  onSubmit,
  onImageDelete,
  onImageUpload,
  isChecked,
  productListToolbar,
  selected,
  subcategoryListToolbar,
  toggle,
  toggleAll,
}: CategoryUpdatePageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const backHref = category?.parent?.id
    ? categoryUrl(category?.parent?.id)
    : categoryListUrl();

  return (
    <CategoryUpdateForm
      category={category}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ data, change, handlers, submit, isSaveDisabled }) => (
        <Container>
          <Backlink href={backHref}>
            {intl.formatMessage(sectionNames.categories)}
          </Backlink>
          <PageHeader title={category?.name} />
          <CategoryDetailsForm
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
              id: "wQdR8M",
              defaultMessage:
                "Add search engine title and description to make this category easier to find",
            })}
            errors={errors}
            title={data.seoTitle}
            titlePlaceholder={data.name}
            description={data.seoDescription}
            descriptionPlaceholder={data.name}
            slug={data.slug}
            slugPlaceholder={data.name}
            loading={!category}
            onChange={change}
            disabled={disabled}
          />
          <CardSpacer />
          <Metadata data={data} onChange={handlers.changeMetadata} />
          <CardSpacer />
          <TabContainer>
            <CategoriesTab
              isActive={currentTab === CategoryPageTab.categories}
              changeTab={changeTab}
            >
              <FormattedMessage
                id="JDz5h8"
                defaultMessage="Subcategories"
                description="number of subcategories in category"
              />
            </CategoriesTab>
            <ProductsTab
              testId="products-tab"
              isActive={currentTab === CategoryPageTab.products}
              changeTab={changeTab}
            >
              <FormattedMessage
                id="V+fkAO"
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
                  id: "NivJal",
                  defaultMessage: "All Subcategories",
                  description: "section header",
                })}
                toolbar={
                  <Button
                    variant="tertiary"
                    href={categoryAddUrl(categoryId)}
                    data-test-id="create-subcategory"
                  >
                    <FormattedMessage
                      id="UycVMp"
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
                selected={selected}
                sort={undefined}
                toggle={toggle}
                toggleAll={toggleAll}
                toolbar={subcategoryListToolbar}
                onSort={() => undefined}
              />
            </Card>
          )}
          {currentTab === CategoryPageTab.products && (
            <CategoryProducts
              categoryId={category?.id}
              categoryName={category?.name}
              products={products}
              disabled={disabled}
              toggle={toggle}
              toggleAll={toggleAll}
              selected={selected}
              isChecked={isChecked}
              toolbar={productListToolbar}
            />
          )}
          <Savebar
            onCancel={() => navigate(backHref)}
            onDelete={onDelete}
            onSubmit={submit}
            state={saveButtonBarState}
            disabled={isSaveDisabled}
          />
        </Container>
      )}
    </CategoryUpdateForm>
  );
};
CategoryUpdatePage.displayName = "CategoryUpdatePage";
export default CategoryUpdatePage;
