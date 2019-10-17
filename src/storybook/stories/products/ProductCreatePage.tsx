import { storiesOf } from "@storybook/react";
import React from "react";

import { fetchMoreProps } from "@saleor/fixtures";
import ProductCreatePage, {
  ProductCreatePageSubmitData
} from "../../../products/components/ProductCreatePage";
import { product as productFixture } from "../../../products/fixtures";
import { productTypes } from "../../../productTypes/fixtures";
import Decorator from "../../Decorator";
import { formError } from "../../misc";

const product = productFixture("");

storiesOf("Views / Products / Create product", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <ProductCreatePage
      currency="USD"
      disabled={false}
      errors={[]}
      header="Add product"
      collections={product.collections}
      fetchCategories={() => undefined}
      fetchCollections={() => undefined}
      fetchProductTypes={() => undefined}
      fetchMoreCategories={fetchMoreProps}
      fetchMoreCollections={fetchMoreProps}
      fetchMoreProductTypes={fetchMoreProps}
      productTypes={productTypes}
      categories={[product.category]}
      onBack={() => undefined}
      onSubmit={() => undefined}
      saveButtonBarState="default"
    />
  ))
  .add("When loading", () => (
    <ProductCreatePage
      currency="USD"
      disabled={true}
      errors={[]}
      header="Add product"
      collections={product.collections}
      fetchCategories={() => undefined}
      fetchCollections={() => undefined}
      fetchProductTypes={() => undefined}
      fetchMoreCategories={fetchMoreProps}
      fetchMoreCollections={fetchMoreProps}
      fetchMoreProductTypes={fetchMoreProps}
      productTypes={productTypes}
      categories={[product.category]}
      onBack={() => undefined}
      onSubmit={() => undefined}
      saveButtonBarState="default"
    />
  ))
  .add("form errors", () => (
    <ProductCreatePage
      currency="USD"
      disabled={false}
      errors={(["name", "productType", "category", "sku"] as Array<
        keyof ProductCreatePageSubmitData
      >).map(formError)}
      header="Add product"
      collections={product.collections}
      fetchCategories={() => undefined}
      fetchCollections={() => undefined}
      fetchProductTypes={() => undefined}
      fetchMoreCategories={fetchMoreProps}
      fetchMoreCollections={fetchMoreProps}
      fetchMoreProductTypes={fetchMoreProps}
      productTypes={productTypes}
      categories={[product.category]}
      onBack={() => undefined}
      onSubmit={() => undefined}
      saveButtonBarState="default"
    />
  ));
