import { storiesOf } from "@storybook/react";
import React from "react";

import placeholderImage from "@assets/images/placeholder255x255.png";
import { collections } from "@saleor/collections/fixtures";
import { fetchMoreProps, listActionsProps } from "@saleor/fixtures";
import ProductUpdatePage, {
  ProductUpdatePageProps
} from "@saleor/products/components/ProductUpdatePage";
import { product as productFixture } from "@saleor/products/fixtures";
import { ProductUpdatePageFormData } from "@saleor/products/utils/data";
import { formError } from "@saleor/storybook/misc";
import Decorator from "../../Decorator";

const product = productFixture(placeholderImage);

const props: ProductUpdatePageProps = {
  ...listActionsProps,
  categories: [product.category],
  collections,
  disabled: false,
  errors: [],
  fetchCategories: () => undefined,
  fetchCollections: () => undefined,
  fetchMoreCategories: fetchMoreProps,
  fetchMoreCollections: fetchMoreProps,
  header: product.name,
  images: product.images,
  onBack: () => undefined,
  onDelete: () => undefined,
  onImageDelete: () => undefined,
  onImageUpload: () => undefined,
  onProductShow: () => undefined,
  onSubmit: () => undefined,
  onVariantAdd: () => undefined,
  onVariantShow: () => undefined,
  onVariantsAdd: () => undefined,
  placeholderImage,
  product,
  saveButtonBarState: "default",
  variants: product.variants
};

storiesOf("Views / Products / Product edit", module)
  .addDecorator(Decorator)
  .add("when data is fully loaded", () => <ProductUpdatePage {...props} />)
  .add("when product has no images", () => (
    <ProductUpdatePage {...props} images={[]} />
  ))
  .add("when product has no variants", () => (
    <ProductUpdatePage
      {...props}
      product={{
        ...product,
        productType: { ...product.productType, hasVariants: false }
      }}
    />
  ))
  .add("when loading data", () => (
    <ProductUpdatePage
      {...props}
      disabled={true}
      header={undefined}
      categories={[]}
      variants={undefined}
      product={undefined}
      collections={undefined}
      images={undefined}
    />
  ))
  .add("no variants", () => (
    <ProductUpdatePage
      {...props}
      product={{
        ...props.product,
        variants: []
      }}
    />
  ))
  .add("no product attributes", () => (
    <ProductUpdatePage
      {...props}
      product={{
        ...props.product,
        attributes: []
      }}
    />
  ))
  .add("form errors", () => (
    <ProductUpdatePage
      {...props}
      errors={([
        "basePrice",
        "category",
        "chargeTaxes",
        "collections",
        "description",
        "isPublished",
        "name",
        "publicationDate",
        "seoDescription",
        "seoTitle",
        "sku",
        "stockQuantity"
      ] as Array<keyof ProductUpdatePageFormData>).map(formError)}
    />
  ));
