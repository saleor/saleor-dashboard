import placeholder from "@assets/images/placeholder1080x1080.png";
import { ProductMediaType } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import ProductMediaPage from "../../../products/components/ProductMediaPage";
import Decorator from "../../Decorator";

const mediaObj = {
  alt: "Lorem ipsum",
  id: "",
  type: ProductMediaType.IMAGE,
  url: placeholder
};
const media = (Array(8) as any)
  .fill({ id: "img", url: placeholder, oembedData: "{}" })
  .map((image, imageIndex) => ({ ...image, id: image.id + imageIndex }));

storiesOf("Views / Products / Product image details", module)
  .addDecorator(Decorator)
  .add("when loaded data", () => (
    <ProductMediaPage
      product="Example product"
      disabled={false}
      mediaObj={mediaObj}
      media={media}
      onBack={() => undefined}
      onDelete={undefined}
      onRowClick={() => undefined}
      onSubmit={() => undefined}
      saveButtonBarState="default"
    />
  ))
  .add("when loading data", () => (
    <ProductMediaPage
      product="Example product"
      disabled={true}
      onBack={() => undefined}
      onDelete={undefined}
      onRowClick={() => undefined}
      onSubmit={() => undefined}
      saveButtonBarState="default"
    />
  ));
