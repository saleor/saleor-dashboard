import {
  defineCategoryFactory,
  defineChannelFactory,
  defineCollectionFactory,
  defineImageFactory,
  defineMoneyFactory,
  definePageFactory,
  defineProductChannelListingFactory,
  defineProductFactory,
  defineProductTypeFactory,
  defineProductVariantChannelListingFactory,
  defineProductVariantFactory,
} from "@dashboard/graphql/fabbrica.generated";
import { dynamic } from "@mizdra/graphql-codegen-typescript-fabbrica/helper";

export const ChannelFactory = defineChannelFactory({
  defaultFields: {
    __typename: "Channel",
    id: dynamic(({ seq }) => `channel-${seq}`),
    name: "Default Channel",
    slug: "default-channel",
    currencyCode: "USD",
    isActive: true,
  },
});

export const ProductTypeFactory = defineProductTypeFactory({
  defaultFields: {
    __typename: "ProductType",
    id: dynamic(({ seq }) => `product-type-${seq}`),
    name: dynamic(
      ({ seq }) => ["Simple Product", "Digital Product", "Configurable Product"][seq % 3]!,
    ),
    slug: dynamic(({ seq }) => `product-type-${seq}`),
  },
});

export const ImageFactory = defineImageFactory({
  defaultFields: {
    __typename: "Image",
    url: dynamic(({ seq }) => `https://placehold.co/64x64?text=${seq}`),
    alt: dynamic(({ seq }) => `Image ${seq}`),
  },
});

export const MoneyFactory = defineMoneyFactory({
  defaultFields: {
    __typename: "Money",
    amount: dynamic(({ seq }) => 10 + seq * 5),
    currency: "USD",
  },
});

export const ProductChannelListingFactory = defineProductChannelListingFactory({
  defaultFields: {
    __typename: "ProductChannelListing",
    id: dynamic(({ seq }) => `listing-${seq}`),
    isPublished: true,
    publishedAt: "2024-01-01",
    isAvailableForPurchase: true,
    availableForPurchaseAt: "2024-01-01",
    visibleInListings: true,
    channel: dynamic(() => ChannelFactory.build()),
  },
});

export const ProductVariantChannelListingFactory = defineProductVariantChannelListingFactory({
  defaultFields: {
    __typename: "ProductVariantChannelListing",
    channel: dynamic(() => ChannelFactory.build()),
    price: dynamic(() => MoneyFactory.build()),
  },
});

export const ProductVariantFactory = defineProductVariantFactory({
  defaultFields: {
    __typename: "ProductVariant",
    id: dynamic(({ seq }) => `variant-${seq}`),
    name: dynamic(({ seq }) => ["S", "M", "L", "XL", "Blue", "Red", "Green"][seq % 7]!),
    sku: dynamic(({ seq }) => `SKU-${1000 + seq}`),
    channelListings: dynamic(async () => [await ProductVariantChannelListingFactory.build()]),
    product: dynamic(async () => ({
      __typename: "Product" as const,
      id: "product-0",
      name: "Parent Product",
      thumbnail: null,
      productType: await ProductTypeFactory.build(),
    })),
  },
});

export const ProductFactory = defineProductFactory({
  defaultFields: {
    __typename: "Product",
    id: dynamic(({ seq }) => `product-${seq}`),
    name: dynamic(
      ({ seq }) =>
        [
          "Cotton T-Shirt",
          "Denim Jacket",
          "Running Shoes",
          "Leather Wallet",
          "Wireless Headphones",
          "Organic Coffee Beans",
          "Yoga Mat",
          "Stainless Steel Water Bottle",
        ][seq % 8]!,
    ),
    productType: dynamic(() => ProductTypeFactory.build()),
    thumbnail: dynamic(() => ImageFactory.build()),
    channelListings: dynamic(async () => [await ProductChannelListingFactory.build()]),
    variants: dynamic(async () => ProductVariantFactory.buildList(2)),
    collections: [],
  },
});

export const CategoryFactory = defineCategoryFactory({
  defaultFields: {
    __typename: "Category",
    id: dynamic(({ seq }) => `category-${seq}`),
    name: dynamic(
      ({ seq }) =>
        [
          "Apparel",
          "Electronics",
          "Home & Garden",
          "Sports & Outdoors",
          "Books & Media",
          "Health & Beauty",
          "Toys & Games",
          "Food & Beverages",
        ][seq % 8]!,
    ),
  },
});

export const CollectionFactory = defineCollectionFactory({
  defaultFields: {
    __typename: "Collection",
    id: dynamic(({ seq }) => `collection-${seq}`),
    name: dynamic(
      ({ seq }) =>
        [
          "Summer Sale 2024",
          "New Arrivals",
          "Best Sellers",
          "Featured Products",
          "Clearance",
          "Gift Guide",
          "Staff Picks",
          "Eco-Friendly",
        ][seq % 8]!,
    ),
  },
});

export const PageFactory = definePageFactory({
  defaultFields: {
    __typename: "Page",
    id: dynamic(({ seq }) => `page-${seq}`),
    title: dynamic(
      ({ seq }) =>
        [
          "About Us",
          "Return Policy",
          "Shipping Information",
          "Size Guide",
          "Terms of Service",
          "Privacy Policy",
          "Contact Us",
          "FAQ",
        ][seq % 8]!,
    ),
  },
});
