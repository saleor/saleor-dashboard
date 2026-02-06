import { ProductDetailsQuery } from "@dashboard/graphql";

import { ProductDiagnosticData } from "./types";

/**
 * Maps the product data from ProductDetailsQuery to the diagnostic data structure
 */
export function mapProductToDiagnosticData(
  product: ProductDetailsQuery["product"] | null | undefined,
): ProductDiagnosticData | null {
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    // Default to true (shippable) if not specified - safer for diagnostics
    isShippingRequired: product.productType?.isShippingRequired ?? true,
    channelListings:
      product.channelListings?.map(listing => ({
        channel: {
          id: listing.channel.id,
          name: listing.channel.name,
          slug: listing.channel.slug,
        },
        isPublished: listing.isPublished,
        publishedAt: listing.publishedAt ?? null,
        isAvailableForPurchase: listing.isAvailableForPurchase,
        availableForPurchaseAt: listing.availableForPurchaseAt ?? null,
        visibleInListings: listing.visibleInListings,
      })) ?? [],
    variants:
      product.variants?.map(variant => ({
        id: variant.id,
        name: variant.name,
        channelListings:
          variant.channelListings?.map(listing => ({
            channel: {
              id: listing.channel.id,
            },
            price: listing.price,
          })) ?? [],
        stocks:
          variant.stocks?.map(stock => ({
            warehouse: {
              id: stock.warehouse.id,
            },
            quantity: stock.quantity,
          })) ?? [],
      })) ?? [],
  };
}
