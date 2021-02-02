import placeholder from "@assets/images/placeholder1080x1080.png";
import { storiesOf } from "@storybook/react";
import React from "react";

import ProductMediaPage from "../../../products/components/ProductMediaPage";
import Decorator from "../../Decorator";

const media_obj = { alt: "Lorem ipsum", id: "", url: placeholder };
const media = (Array(8) as any)
  .fill({ id: "img", url: placeholder })
  .map((image, imageIndex) => ({ ...image, id: image.id + imageIndex }));

storiesOf("Views / Products / Product image details", module)
  .addDecorator(Decorator)
  .add("when loaded data", () => (
    <ProductMediaPage
      product="Example product"
      disabled={false}
      media_obj={media_obj}
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
