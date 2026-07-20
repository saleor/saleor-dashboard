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

/**
 * Walks every page of product variants so the generator can skip combinations
 * that already exist — including those not on the current datagrid page.
 */
export async function fetchAllExistingVariantsForGenerator(
  apolloClient: ApolloClient<object>,
  productId: string,
  selectionAttributeIds: Set<string>,
): Promise<ExistingVariantData> {
  const collected: ExistingVariantData = [];
  let after: string | null | undefined = undefined;
  let hasNextPage = true;

  while (hasNextPage) {
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

    const connection = result.data?.product?.productVariants;
    const page = mapEdgesToItems(connection) ?? [];

    collected.push(
      ...page.map(variant => ({
        attributes: (variant.attributes ?? []).map(attr => ({
          attribute: { id: attr.attribute.id },
          values: attr.values.map(v => ({ slug: v.slug })),
        })),
      })),
    );

    hasNextPage = connection?.pageInfo.hasNextPage ?? false;
    after = connection?.pageInfo.endCursor;
  }

  return toExistingVariantData(collected, selectionAttributeIds);
}
