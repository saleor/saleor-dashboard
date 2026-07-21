import { type ApolloClient } from "@apollo/client";
import {
  ProductVariantGeneratorExistingVariantsDocument,
  type ProductVariantGeneratorExistingVariantsQuery,
  type ProductVariantGeneratorExistingVariantsQueryVariables,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { type ExistingVariantData } from "./types";
import { toExistingVariantData } from "./utils";

const PAGE_SIZE = 100;

/** Hard stop so a stuck cursor or huge catalog cannot hang the modal forever. */
export const MAX_EXISTING_VARIANT_PAGES = 50;

export class ExistingVariantsFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExistingVariantsFetchError";
  }
}

/**
 * Walks every page of product variants so the generator can skip combinations
 * that already exist — including those not on the current datagrid page.
 *
 * Fails closed: throws if the product is missing, pagination stalls, or the
 * page cap is hit — callers must not treat an empty list as "no variants".
 */
export async function fetchAllExistingVariantsForGenerator(
  apolloClient: ApolloClient<object>,
  productId: string,
  selectionAttributeIds: Set<string>,
): Promise<ExistingVariantData> {
  const collected: ExistingVariantData = [];
  let after: string | null | undefined = undefined;
  let hasNextPage = true;
  let pagesFetched = 0;

  while (hasNextPage) {
    if (pagesFetched >= MAX_EXISTING_VARIANT_PAGES) {
      throw new ExistingVariantsFetchError(
        `Exceeded ${MAX_EXISTING_VARIANT_PAGES} pages while loading existing variants`,
      );
    }

    const variables: ProductVariantGeneratorExistingVariantsQueryVariables = {
      id: productId,
      first: PAGE_SIZE,
      after: after ?? null,
    };
    const result = await apolloClient.query<ProductVariantGeneratorExistingVariantsQuery>({
      query: ProductVariantGeneratorExistingVariantsDocument,
      variables,
      fetchPolicy: "network-only",
    });

    if (result.error) {
      throw new ExistingVariantsFetchError(result.error.message);
    }

    const product = result.data?.product;

    if (!product) {
      throw new ExistingVariantsFetchError("Product not found while loading existing variants");
    }

    const connection = product.productVariants;
    const page = mapEdgesToItems(connection) ?? [];

    collected.push(
      ...page.map(variant => ({
        attributes: (variant.attributes ?? []).map(attr => ({
          attribute: { id: attr.attribute.id },
          values: attr.values.map(v => ({ slug: v.slug })),
        })),
      })),
    );

    pagesFetched += 1;
    hasNextPage = connection?.pageInfo.hasNextPage ?? false;

    const nextAfter = connection?.pageInfo.endCursor;

    if (hasNextPage) {
      if (!nextAfter || nextAfter === after) {
        throw new ExistingVariantsFetchError(
          "Pagination cursor did not advance while loading existing variants",
        );
      }

      if (page.length === 0) {
        throw new ExistingVariantsFetchError(
          "Empty page returned while more existing variants were expected",
        );
      }
    }

    after = nextAfter;
  }

  return toExistingVariantData(collected, selectionAttributeIds);
}
