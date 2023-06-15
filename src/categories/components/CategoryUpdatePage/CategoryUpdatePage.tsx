import {
  categoryAddUrl,
  categoryListUrl,
  categoryUrl,
} from "@dashboard/categories/urls";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Button } from "@dashboard/components/Button";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import CardTitle from "@dashboard/components/CardTitle";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata/Metadata";
import Savebar from "@dashboard/components/Savebar";
import { SeoForm } from "@dashboard/components/SeoForm";
import { Tab, TabContainer } from "@dashboard/components/Tab";
import { CategoryDetailsQuery, ProductErrorFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Card } from "@material-ui/core";
import { Box, sprinkles } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { RelayToFlat } from "../../../types";
import CategoryDetailsForm from "../../components/CategoryDetailsForm";
import CategoryBackground from "../CategoryBackground";
import { CategoryDeleteButton } from "../CategoryDeleteButton";
import { CategoryListDatagrid } from "../CategoryListDatagrid";
import { CategoryProductListDatagrid } from "../CategoryProductListDatagrid";
import CategoryUpdateForm, { CategoryUpdateData } from "./form";

export enum CategoryPageTab {
  categories = "categories",
  products = "products",
}

export interface CategoryUpdatePageProps {
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
  onCategoriesDelete: () => void;
  onProductsDelete: () => void;
  onSelectProductsIds: (ids: number[], clearSelection: () => void) => void;
  onSelectCategoriesIds: (ids: number[], clearSelection: () => void) => void;
  setBulkDeleteButtonRef: (ref: HTMLButtonElement) => void;
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
  onSelectCategoriesIds,
  setBulkDeleteButtonRef,
  onCategoriesDelete,
  onProductsDelete,
  onSelectProductsIds,
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
        <DetailPageLayout gridTemplateColumns={1}>
          <TopNav href={backHref} title={category?.name} />
          <DetailPageLayout.Content>
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
            <TabContainer className={sprinkles({ paddingX: 9 })}>
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

                <CategoryListDatagrid
                  categories={subcategories}
                  disabled={disabled}
                  onSelectCategoriesIds={onSelectCategoriesIds}
                  selectionActionButton={
                    <Box paddingRight={5}>
                      <CategoryDeleteButton
                        ref={setBulkDeleteButtonRef}
                        onClick={onCategoriesDelete}
                      >
                        <FormattedMessage
                          defaultMessage="Bulk categories delete"
                          id="ZN5IZl"
                        />
                      </CategoryDeleteButton>
                    </Box>
                  }
                />
              </Card>
            )}
            {currentTab === CategoryPageTab.products && (
              <CategoryProductListDatagrid
                products={products}
                disabled={disabled}
                onSelectProductsIds={onSelectProductsIds}
                selectionActionButton={
                  <Box paddingRight={5}>
                    <CategoryDeleteButton
                      ref={setBulkDeleteButtonRef}
                      onClick={onProductsDelete}
                    >
                      <FormattedMessage
                        defaultMessage="Bulk products delete"
                        id="cxOmce"
                      />
                    </CategoryDeleteButton>
                  </Box>
                }
              />
            )}
            <Savebar
              onCancel={() => navigate(backHref)}
              onDelete={onDelete}
              onSubmit={submit}
              state={saveButtonBarState}
              disabled={isSaveDisabled}
            />
          </DetailPageLayout.Content>
        </DetailPageLayout>
      )}
    </CategoryUpdateForm>
  );
};
CategoryUpdatePage.displayName = "CategoryUpdatePage";
export default CategoryUpdatePage;
