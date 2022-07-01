import placeholderImage from "@assets/images/placeholder255x255.png";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ProductVariantMediaSelectDialog from "../../../products/components/ProductVariantImageSelectDialog";
import {
  variantMedia as variantImagesFixture,
  variantProductImages as variantProductImagesFixture,
} from "../../../products/fixtures";

const variantImages = variantImagesFixture(placeholderImage);
const variantProductImages = variantProductImagesFixture(placeholderImage);

storiesOf("Products / ProductVariantImageSelectDialog", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <ProductVariantMediaSelectDialog
      media={variantProductImages}
      selectedMedia={variantImages.map(image => image.id)}
      onClose={() => undefined}
      onMediaSelect={() => undefined}
      open={true}
    />
  ));
