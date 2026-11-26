import { type ApolloClient } from "@apollo/client";
import {
  ProductDoctorShippingZonesDocument,
  type ProductDoctorShippingZonesQuery,
  type ProductDoctorShippingZonesQueryVariables,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

const PAGE_SIZE = 100;

/** Hard stop so a huge shipping setup cannot hang the product page forever. */
export const MAX_PRODUCT_DOCTOR_SHIPPING_ZONE_PAGES = 50;

export class ProductDoctorShippingZonesFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductDoctorShippingZonesFetchError";
  }
}

export type ProductDoctorShippingZone = NonNullable<
  NonNullable<ProductDoctorShippingZonesQuery["shippingZones"]>["edges"][number]
>["node"];

/**
 * Walks every page of shipping zones linked to `channelIds`.
 *
 * Returns `null` when the API hides shipping zones from the user (no
 * MANAGE_SHIPPING). Throws on any other failure: callers must not treat a
 * partial list as complete, because a missing zone reads as "no shipping".
 */
export async function fetchProductDoctorShippingZones(
  apolloClient: ApolloClient<object>,
  channelIds: string[],
): Promise<ProductDoctorShippingZone[] | null> {
  const collected: ProductDoctorShippingZone[] = [];
  let after: string | null = null;
  let hasNextPage = true;
  let pagesFetched = 0;

  while (hasNextPage) {
    if (pagesFetched >= MAX_PRODUCT_DOCTOR_SHIPPING_ZONE_PAGES) {
      throw new ProductDoctorShippingZonesFetchError(
        `Exceeded ${MAX_PRODUCT_DOCTOR_SHIPPING_ZONE_PAGES} pages while loading Product Doctor shipping zones`,
      );
    }

    const variables: ProductDoctorShippingZonesQueryVariables = {
      channels: channelIds,
      first: PAGE_SIZE,
      after,
    };
    // errorPolicy "all" lets a permission error surface as `shippingZones: null`.
    const result = await apolloClient.query<ProductDoctorShippingZonesQuery>({
      query: ProductDoctorShippingZonesDocument,
      variables,
      fetchPolicy: "network-only",
      errorPolicy: "all",
    });

    const connection = result.data?.shippingZones;

    if (!connection) {
      if (pagesFetched === 0 && result.errors?.length) {
        return null;
      }

      throw new ProductDoctorShippingZonesFetchError(
        result.errors?.map(e => e.message).join(", ") ||
          "Shipping zones missing while loading Product Doctor shipping zones",
      );
    }

    const page = mapEdgesToItems(connection) ?? [];

    collected.push(...page);
    pagesFetched += 1;
    hasNextPage = connection.pageInfo.hasNextPage;

    const nextAfter = connection.pageInfo.endCursor;

    if (hasNextPage) {
      if (!nextAfter || nextAfter === after) {
        throw new ProductDoctorShippingZonesFetchError(
          "Pagination cursor did not advance while loading Product Doctor shipping zones",
        );
      }

      if (page.length === 0) {
        throw new ProductDoctorShippingZonesFetchError(
          "Empty page returned while more Product Doctor shipping zones were expected",
        );
      }
    }

    after = nextAfter;
  }

  return collected;
}
