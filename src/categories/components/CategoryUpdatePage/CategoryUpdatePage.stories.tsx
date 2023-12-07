import placeholderImage from "@assets/images/placeholder255x255.png";
import { category as categoryFixture } from "@dashboard/categories/fixtures";
import { listActionsProps } from "@dashboard/fixtures";
import { ProductErrorCode } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import CategoryUpdatePage, {
  CategoryPageTab,
  CategoryUpdatePageProps,
} from "./CategoryUpdatePage";

const category = categoryFixture(placeholderImage);

const updateProps: Omit<CategoryUpdatePageProps, "classes"> = {
  category,
  categoryId: "123",
  changeTab: () => {},
  currentTab: CategoryPageTab.categories,
  disabled: false,
  errors: [],
  addProductHref: "",
  onDelete: () => undefined,
  onImageDelete: () => undefined,
  onImageUpload: () => undefined,
  onSubmit: async () => undefined,
  products: mapEdgesToItems(category!.products) || [],
  saveButtonBarState: "default",
  subcategories: mapEdgesToItems(category!.children) || [],
  onCategoriesDelete: () => undefined,
  onProductsDelete: () => undefined,
  onSelectCategoriesIds: () => undefined,
  onSelectProductsIds: () => undefined,
  ...listActionsProps,
};

export default {
  title: "Categories / Update category",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <CategoryUpdatePage {...updateProps} />;

export const Products = () => (
  <CategoryUpdatePage {...updateProps} currentTab={CategoryPageTab.products} />
);

export const NoBackground = () => (
  <CategoryUpdatePage
    {...updateProps}
    category={{
      ...category!,
      backgroundImage: null,
    }}
  />
);

export const NoSubcategories = () => (
  <CategoryUpdatePage {...updateProps} subcategories={[]} />
);

export const NoProducts = () => (
  <CategoryUpdatePage
    {...updateProps}
    products={[]}
    currentTab={CategoryPageTab.products}
  />
);

export const Loading = () => (
  <CategoryUpdatePage
    {...updateProps}
    subcategories={undefined}
    disabled={true}
    products={undefined}
    category={undefined}
  />
);

export const FormErrors = () => (
  <CategoryUpdatePage
    {...updateProps}
    errors={[
      {
        code: ProductErrorCode.REQUIRED,
        field: "name",
        message: "Product field name required",
      },
      {
        code: ProductErrorCode.REQUIRED,
        field: "description",
        message: "Product field description required",
      },
    ].map(err => ({
      __typename: "ProductError",
      ...err,
    }))}
  />
);
