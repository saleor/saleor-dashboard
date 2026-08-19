import { type ApolloClient } from "@apollo/client";
import {
  BULK_PUBLISH_MAX_VARIANTS_PER_PRODUCT,
  BULK_PUBLISH_VARIANT_PAGE_SIZE,
} from "@dashboard/channels/components/BulkPublishToChannelDialog/types";
import {
  BulkPublishProductVariantsDocument,
  type BulkPublishProductVariantsQuery,
  type BulkPublishProductVariantsQueryVariables,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export type BulkPublishVariantNode = {
  id: string;
  channelListings: Array<{
    id: string;
    channel: { id: string };
    price: { amount: number } | null;
  }> | null;
  stocks: Array<{
    id: string;
    warehouse: { id: string };
  }> | null;
};

class BulkPublishVariantsFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BulkPublishVariantsFetchError";
  }
}

export const fetchAllBulkPublishProductVariants = async (
  apolloClient: ApolloClient<object>,
  productId: string,
): Promise<BulkPublishVariantNode[]> => {
  const collected: BulkPublishVariantNode[] = [];
  let after: string | null | undefined = undefined;
  let hasNextPage = true;

  while (hasNextPage && collected.length < BULK_PUBLISH_MAX_VARIANTS_PER_PRODUCT) {
    const remaining = BULK_PUBLISH_MAX_VARIANTS_PER_PRODUCT - collected.length;
    const variables: BulkPublishProductVariantsQueryVariables = {
      id: productId,
      first: Math.min(BULK_PUBLISH_VARIANT_PAGE_SIZE, remaining),
      after: after ?? null,
    };
    const result = await apolloClient.query<BulkPublishProductVariantsQuery>({
      query: BulkPublishProductVariantsDocument,
      variables,
      fetchPolicy: "network-only",
    });

    if (result.error) {
      throw new BulkPublishVariantsFetchError(result.error.message);
    }

    const product = result.data?.product;

    if (!product) {
      throw new BulkPublishVariantsFetchError("Product not found while loading variants");
    }

    const connection = product.productVariants;
    const page = mapEdgesToItems(connection) ?? [];

    collected.push(...page);

    hasNextPage = connection?.pageInfo.hasNextPage ?? false;

    const nextAfter = connection?.pageInfo.endCursor;

    if (hasNextPage) {
      if (!nextAfter || nextAfter === after) {
        throw new BulkPublishVariantsFetchError(
          "Pagination cursor did not advance while loading variants",
        );
      }

      if (page.length === 0) {
        throw new BulkPublishVariantsFetchError(
          "Empty page returned while more variants were expected",
        );
      }
    }

    after = nextAfter;
  }

  return collected;
};
