import placeholderImage from "@assets/images/placeholder255x255.png";
import { Omit } from "@material-ui/core";
import { ProductErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import CategoryUpdatePage, {
  CategoryPageTab,
  CategoryUpdatePageProps
} from "../../../categories/components/CategoryUpdatePage";
import { category as categoryFixture } from "../../../categories/fixtures";
import { listActionsProps } from "../../../fixtures";
import Decorator from "../../Decorator";

const category = categoryFixture(placeholderImage);

const channelChoices = category.products.edges[0].node.channelListings.map(
  listing => ({
    label: listing.channel.name,
    value: listing.channel.id
  })
);

const updateProps: Omit<CategoryUpdatePageProps, "classes"> = {
  category,
  changeTab: undefined,
  channelChoices,
  channelsCount: 2,
  currentTab: CategoryPageTab.categories,
  disabled: false,
  errors: [],
  onAddCategory: undefined,
  onAddProduct: undefined,
  onBack: () => undefined,
  onCategoryClick: () => undefined,
  onDelete: () => undefined,
  onImageDelete: () => undefined,
  onImageUpload: () => undefined,
  onNextPage: undefined,
  onPreviousPage: undefined,
  onProductClick: () => undefined,
  onSubmit: () => undefined,
  pageInfo: {
    hasNextPage: true,
    hasPreviousPage: true
  },
  productListToolbar: null,
  products: category.products.edges.map(edge => edge.node),
  saveButtonBarState: "default",
  selectedChannelId: "123",
  subcategories: category.children.edges.map(edge => edge.node),
  subcategoryListToolbar: null,
  ...listActionsProps
};

storiesOf("Views / Categories / Update category", module)
  .addDecorator(Decorator)
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
        backgroundImage: null
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
          field: "name"
        },
        {
          code: ProductErrorCode.REQUIRED,
          field: "descriptionJson"
        }
      ].map(err => ({
        __typename: "ProductError",
        ...err
      }))}
    />
  ));
