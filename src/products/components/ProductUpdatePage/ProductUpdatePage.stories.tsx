import placeholderImage from "@assets/images/placeholder255x255.png";
import { channelsList } from "@saleor/channels/fixtures";
import { collections } from "@saleor/collections/fixtures";
import { fetchMoreProps, limits, limitsReached } from "@saleor/fixtures";
import { ProductErrorCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { taxClasses } from "@saleor/taxes/fixtures";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import { product as productFixture } from "../../fixtures";
import ProductUpdatePage, { ProductUpdatePageProps } from "./ProductUpdatePage";
import { ProductUpdateFormData } from "./types";

const product = productFixture(placeholderImage);

const props: ProductUpdatePageProps = {
  channels: channelsList,
  variantListErrors: [
    {
      __typename: "DatagridError",
      variantId: product.variants[0].id,
      type: "channel",
      channelIds: [channelsList[1].id],
      error: ProductErrorCode.ALREADY_EXISTS,
    },
  ],
  productId: "123",
  isSimpleProduct: false,
  categories: [product.category],
  channelsErrors: [],
  collections,
  disabled: false,
  errors: [],
  fetchCategories: () => undefined,
  fetchCollections: () => undefined,
  fetchAttributeValues: () => undefined,
  onAttributeSelectBlur: () => undefined,
  fetchMoreCategories: fetchMoreProps,
  fetchMoreCollections: fetchMoreProps,
  fetchMoreAttributeValues: fetchMoreProps,
  header: product.name,
  media: product.media,
  limits,
  onAttributeValuesSearch: () => Promise.resolve([]),
  onAssignReferencesClick: () => undefined,
  onCloseDialog: () => undefined,
  onDelete: () => undefined,
  onImageDelete: () => undefined,
  onImageUpload: () => undefined,
  onMediaUrlUpload: () => undefined,
  onSubmit: () => undefined,
  onVariantShow: () => undefined,
  refetch: () => undefined,
  placeholderImage,
  product,
  referencePages: [],
  referenceProducts: [],
  saveButtonBarState: "default",
  taxClasses,
  fetchMoreTaxClasses: undefined,
  variants: product.variants,
  warehouses: warehouseList,
  attributeValues: [],
};

storiesOf("Products / Product edit", module)
  .addDecorator(Decorator)
  .add("when data is fully loaded", () => <ProductUpdatePage {...props} />)
  .add("when product has no images", () => (
    <ProductUpdatePage {...props} media={[]} />
  ))
  .add("when product has no variants", () => (
    <ProductUpdatePage
      {...props}
      product={{
        ...product,
        productType: { ...product.productType, hasVariants: false },
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
      media={undefined}
    />
  ))
  .add("no variants", () => (
    <ProductUpdatePage
      {...props}
      product={{
        ...props.product,
        productType: {
          ...product.productType,
          hasVariants: false,
        },
      }}
    />
  ))
  .add("no stock and no variants", () => (
    <ProductUpdatePage
      {...props}
      product={{
        ...product,

        productType: {
          ...product.productType,
          hasVariants: false,
        },
        variants: [
          {
            ...product.variants[0],
            stocks: [],
          },
        ],
      }}
    />
  ))
  .add("no stock, no variants and no warehouses", () => (
    <ProductUpdatePage
      {...props}
      warehouses={[]}
      product={{
        ...product,
        productType: {
          ...product.productType,
          hasVariants: false,
        },
        variants: [
          {
            ...product.variants[0],
            stocks: [],
          },
        ],
      }}
    />
  ))
  .add("no product attributes", () => (
    <ProductUpdatePage
      {...props}
      product={{
        ...props.product,
        attributes: [],
      }}
    />
  ))
  .add("form errors", () => (
    <ProductUpdatePage
      {...props}
      errors={([
        "attributes",
        "category",
        "chargeTaxes",
        "collections",
        "name",
        "publicationDate",
        "seoDescription",
        "seoTitle",
        "sku",
        "stockQuantity",
      ] as Array<keyof ProductUpdateFormData | "attributes">).map(field => ({
        __typename: "ProductError",
        attributes:
          field === "attributes" ? [product.attributes[0].attribute.id] : null,
        code: ProductErrorCode.INVALID,
        field,
        message: "Attributes invalid",
      }))}
    />
  ))
  .add("no limits", () => <ProductUpdatePage {...props} limits={undefined} />)
  .add("limits reached", () => (
    <ProductUpdatePage {...props} limits={limitsReached} />
  ));
