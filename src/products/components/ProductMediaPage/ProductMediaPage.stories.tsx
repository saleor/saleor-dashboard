// @ts-strict-ignore
import placeholder from "@assets/images/placeholder1080x1080.png";
import { ProductMediaType } from "@dashboard/graphql";
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

export default {
  title: "Products / Product image details",
};

export const WhenLoadedData = () => (
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
);

export const WhenLoadingData = () => (
  <ProductMediaPage
    productId=""
    product="Example product"
    disabled={true}
    onDelete={undefined}
    onRowClick={() => undefined}
    onSubmit={() => undefined}
    saveButtonBarState="default"
  />
);
