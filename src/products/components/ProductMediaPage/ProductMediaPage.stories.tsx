import placeholder from "@assets/images/placeholder1080x1080.png";
import { ProductMediaType } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ProductMediaPage from "./ProductMediaPage";

const mediaObj = {
  alt: "Lorem ipsum",
  id: "",
  type: ProductMediaType.IMAGE,
  url: placeholder,
};
const media = (Array(8) as any)
  .fill({ id: "img", url: placeholder, oembedData: "{}" })
  .map((image, imageIndex) => ({ ...image, id: image.id + imageIndex }));

storiesOf("Products / Product image details", module)
  .addDecorator(Decorator)
  .add("when loaded data", () => (
    <ProductMediaPage
      productId=""
      product="Example product"
      disabled={false}
      mediaObj={mediaObj}
      media={media}
      onDelete={undefined}
      onRowClick={() => undefined}
      onSubmit={() => undefined}
      saveButtonBarState="default"
    />
  ))
  .add("when loading data", () => (
    <ProductMediaPage
      productId=""
      product="Example product"
      disabled={true}
      onDelete={undefined}
      onRowClick={() => undefined}
      onSubmit={() => undefined}
      saveButtonBarState="default"
    />
  ));
