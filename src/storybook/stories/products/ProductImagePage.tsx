import placeholder from "@assets/images/placeholder1080x1080.png";
import { storiesOf } from "@storybook/react";
import React from "react";

import ProductImagePage from "../../../products/components/ProductImagePage";
import Decorator from "../../Decorator";

const image = { alt: "Lorem ipsum", id: "", url: placeholder };
const images = (Array(8) as any)
  .fill({ id: "img", url: placeholder })
  .map((image, imageIndex) => ({ ...image, id: image.id + imageIndex }));

storiesOf("Views / Products / Product image details", module)
  .addDecorator(Decorator)
  .add("when loaded data", () => (
    <ProductImagePage
      product="Example product"
      disabled={false}
      image={image}
      images={images}
      onBack={() => undefined}
      onDelete={undefined}
      onRowClick={() => undefined}
      onSubmit={() => undefined}
      saveButtonBarState="default"
    />
  ))
  .add("when loading data", () => (
    <ProductImagePage
      product="Example product"
      disabled={true}
      onBack={() => undefined}
      onDelete={undefined}
      onRowClick={() => undefined}
      onSubmit={() => undefined}
      saveButtonBarState="default"
    />
  ));
