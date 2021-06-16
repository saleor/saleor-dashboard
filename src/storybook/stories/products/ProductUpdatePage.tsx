import placeholderImage from "@assets/images/placeholder255x255.png";
import { channelsList } from "@saleor/channels/fixtures";
import { createChannelsData } from "@saleor/channels/utils";
import { collections } from "@saleor/collections/fixtures";
import {
  fetchMoreProps,
  limits,
  limitsReached,
  listActionsProps
} from "@saleor/fixtures";
import ProductUpdatePage, {
  ProductUpdatePageProps
} from "@saleor/products/components/ProductUpdatePage";
import { product as productFixture } from "@saleor/products/fixtures";
import { ProductUpdatePageFormData } from "@saleor/products/utils/data";
import { ProductErrorCode } from "@saleor/types/globalTypes";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../Decorator";
import { taxTypes } from "../taxes/fixtures";

const product = productFixture(placeholderImage);
const channels = createChannelsData(channelsList);

const props: ProductUpdatePageProps = {
  ...listActionsProps,
  allChannelsCount: 5,
  onChannelsChange: () => undefined,
  currentChannels: [],
  isSimpleProduct: false,
  categories: [product.category],
  channelsWithVariantsData: {
    channel1: {
      selectedVariantsIds: ["variantA"],
      variantsIdsToRemove: ["variantB"],
      variantsIdsToAdd: []
    }
  },
  setChannelsData: () => undefined,
  channelsData: channels,
  channelsErrors: [],
  collections,
  defaultWeightUnit: "kg",
  disabled: false,
  errors: [],
  fetchCategories: () => undefined,
  fetchCollections: () => undefined,
  fetchAttributeValues: () => undefined,
  fetchMoreCategories: fetchMoreProps,
  fetchMoreCollections: fetchMoreProps,
  fetchMoreAttributeValues: fetchMoreProps,
  hasChannelChanged: false,
  header: product.name,
  media: product.media,
  limits,
  onAssignReferencesClick: () => undefined,
  onBack: () => undefined,
  onCloseDialog: () => undefined,
  onDelete: () => undefined,
  onImageDelete: () => undefined,
  onImageUpload: () => undefined,
  onMediaUrlUpload: () => undefined,
  onSetDefaultVariant: () => undefined,
  onSubmit: () => undefined,
  onVariantAdd: () => undefined,
  onVariantReorder: () => undefined,
  onVariantShow: () => undefined,
  onVariantsAdd: () => undefined,
  onWarehouseConfigure: () => undefined,
  openChannelsModal: () => undefined,
  placeholderImage,
  product,
  referencePages: [],
  referenceProducts: [],
  saveButtonBarState: "default",
  selectedChannelId: "123",
  taxTypes,
  variants: product.variants,
  warehouses: warehouseList,
  attributeValues: []
};

storiesOf("Views / Products / Product edit", module)
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
          hasVariants: false
        }
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
          hasVariants: false
        },
        variants: [
          {
            ...product.variants[0],
            stocks: []
          }
        ]
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
          hasVariants: false
        },
        variants: [
          {
            ...product.variants[0],
            stocks: []
          }
        ]
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
        "attributes",
        "category",
        "chargeTaxes",
        "collections",
        "name",
        "publicationDate",
        "seoDescription",
        "seoTitle",
        "sku",
        "stockQuantity"
      ] as Array<keyof ProductUpdatePageFormData | "attributes">).map(
        field => ({
          __typename: "ProductError",
          attributes:
            field === "attributes"
              ? [product.attributes[0].attribute.id]
              : null,
          code: ProductErrorCode.INVALID,
          field
        })
      )}
    />
  ))
  .add("with channels", () => (
    <ProductUpdatePage {...props} currentChannels={channels} />
  ))
  .add("no limits", () => <ProductUpdatePage {...props} limits={undefined} />)
  .add("limits reached", () => (
    <ProductUpdatePage {...props} limits={limitsReached} />
  ));
