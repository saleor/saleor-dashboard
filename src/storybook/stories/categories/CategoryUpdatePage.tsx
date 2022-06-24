import placeholderImage from "@assets/images/placeholder255x255.png";
import { ProductErrorCode } from "@saleor/graphql";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { storiesOf } from "@storybook/react";
import React from "react";

import CategoryUpdatePage, {
  CategoryPageTab,
  CategoryUpdatePageProps,
} from "../../../categories/components/CategoryUpdatePage";
import { category as categoryFixture } from "../../../categories/fixtures";
import { listActionsProps } from "../../../fixtures";
import Decorator from "../../Decorator";

const category = categoryFixture(placeholderImage);

const updateProps: Omit<CategoryUpdatePageProps, "classes"> = {
  category,
  categoryId: "123",
  changeTab: undefined,
  currentTab: CategoryPageTab.categories,
  disabled: false,
  errors: [],
  addProductHref: "",
  onDelete: () => undefined,
  onImageDelete: () => undefined,
  onImageUpload: () => undefined,
  onSubmit: () => undefined,
  productListToolbar: null,
  products: mapEdgesToItems(category.products),
  saveButtonBarState: "default",
  subcategories: mapEdgesToItems(category.children),
  subcategoryListToolbar: null,
  ...listActionsProps,
};

storiesOf("Views / Categories / Update category", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <CategoryUpdatePage {...updateProps} />)
  .add("products", () => (
    <CategoryUpdatePage
      {...updateProps}
      currentTab={CategoryPageTab.products}
    />
  ))
  .add("no background", () => (
    <CategoryUpdatePage
      {...updateProps}
      category={{
        ...category,
        backgroundImage: null,
      }}
    />
  ))
  .add("no subcategories", () => (
    <CategoryUpdatePage {...updateProps} subcategories={[]} />
  ))
  .add("no products", () => (
    <CategoryUpdatePage
      {...updateProps}
      products={[]}
      currentTab={CategoryPageTab.products}
    />
  ))
  .add("loading", () => (
    <CategoryUpdatePage
      {...updateProps}
      subcategories={undefined}
      disabled={true}
      products={undefined}
      category={undefined}
    />
  ))
  .add("form errors", () => (
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
  ));
