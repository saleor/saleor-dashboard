// @ts-strict-ignore
import placeholderImage from "@assets/images/placeholder255x255.png";
import { channelsList } from "@dashboard/channels/fixtures";
import { collections } from "@dashboard/collections/fixtures";
import { fetchMoreProps, limits, limitsReached } from "@dashboard/fixtures";
import {
  ProductErrorCode,
  ProductVariantBulkErrorCode,
} from "@dashboard/graphql";
import { taxClasses } from "@dashboard/taxes/fixtures";
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
      error: ProductVariantBulkErrorCode.PRODUCT_NOT_ASSIGNED_TO_CHANNEL,
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
  product,
  referencePages: [],
  referenceProducts: [],
  saveButtonBarState: "default",
  taxClasses,
  fetchMoreTaxClasses: undefined,
  variants: product.variants,
  attributeValues: [],
};

export default {
  title: "Products / Product edit",
};

export const WhenDataIsFullyLoaded = () => <ProductUpdatePage {...props} />;

export const WhenProductHasNoImages = () => (
  <ProductUpdatePage {...props} media={[]} />
);

export const WhenProductHasNoVariants = () => (
  <ProductUpdatePage
    {...props}
    product={{
      ...product,
      productType: { ...product.productType, hasVariants: false },
    }}
  />
);

export const WhenLoadingData = () => (
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
);

export const NoVariants = () => (
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
);

export const NoStockAndNoVariants = () => (
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
);

export const NoStockNoVariantsAndNoWarehouses = () => (
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
);

export const NoProductAttributes = () => (
  <ProductUpdatePage
    {...props}
    product={{
      ...props.product,
      attributes: [],
    }}
  />
);

export const FormErrors = () => (
  <ProductUpdatePage
    {...props}
    errors={(
      [
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
      ] as Array<keyof ProductUpdateFormData | "attributes">
    ).map(field => ({
      __typename: "ProductError",
      attributes:
        field === "attributes" ? [product.attributes[0].attribute.id] : null,
      code: ProductErrorCode.INVALID,
      field,
      message: "Attributes invalid",
    }))}
  />
);

export const NoLimits = () => (
  <ProductUpdatePage {...props} limits={undefined} />
);

export const LimitsReached = () => (
  <ProductUpdatePage {...props} limits={limitsReached} />
);
