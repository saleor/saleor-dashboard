import { ProductDiagnosticData } from "./types";

/**
 * Minimal input type declaring only the fields used by mapProductToDiagnosticData.
 * This makes the function's contract explicit and simplifies testing.
 */
export interface ProductDiagnosticInput {
  id: string;
  name: string;
  productType: {
    isShippingRequired: boolean;
  };
  channelListings?: Array<{
    channel: {
      id: string;
      name: string;
      slug: string;
    };
    isPublished: boolean;
    publishedAt?: string | null;
    isAvailableForPurchase: boolean | null;
    availableForPurchaseAt?: string | null;
    visibleInListings: boolean;
  }> | null;
  variants?: Array<{
    id: string;
    name: string;
    channelListings?: Array<{
      channel: {
        id: string;
      };
      price: {
        amount: number;
      } | null;
    }> | null;
    stocks?: Array<{
      warehouse: {
        id: string;
      };
      quantity: number;
    }> | null;
  }> | null;
}

/**
 * Maps the product data to the diagnostic data structure.
 * Accepts ProductDiagnosticInput which is a subset of ProductDetailsQuery["product"].
 */
export function mapProductToDiagnosticData(
  product: ProductDiagnosticInput | null | undefined,
): ProductDiagnosticData | null {
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    isShippingRequired: product.productType.isShippingRequired,
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
