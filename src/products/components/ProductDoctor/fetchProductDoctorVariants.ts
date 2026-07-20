import { type ApolloClient } from "@apollo/client";
import {
  ProductDoctorVariantsDocument,
  type ProductDoctorVariantsQuery,
  type ProductDoctorVariantsQueryVariables,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

const PAGE_SIZE = 100;

/** Hard stop so a huge catalog cannot hang the product page forever. */
export const MAX_PRODUCT_DOCTOR_VARIANT_PAGES = 50;

export class ProductDoctorVariantsFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductDoctorVariantsFetchError";
  }
}

export type ProductDoctorVariant = NonNullable<
  NonNullable<
    NonNullable<ProductDoctorVariantsQuery["product"]>["productVariants"]
  >["edges"][number]
>["node"];

export interface ProductDoctorVariantsResult {
  variants: ProductDoctorVariant[];
  totalCount: number | null;
}

/**
 * Walks every page of product variants for Product Doctor availability checks.
 *
 * Fails closed: throws if the product is missing, pagination stalls, or the
 * page cap is hit — callers must not treat a partial list as complete.
 */
export async function fetchProductDoctorVariants(
  apolloClient: ApolloClient<object>,
  productId: string,
): Promise<ProductDoctorVariantsResult> {
  const collected: ProductDoctorVariant[] = [];
  let after: string | null | undefined = undefined;
  let hasNextPage = true;
  let pagesFetched = 0;
  let totalCount: number | null = null;

  while (hasNextPage) {
    if (pagesFetched >= MAX_PRODUCT_DOCTOR_VARIANT_PAGES) {
      throw new ProductDoctorVariantsFetchError(
        `Exceeded ${MAX_PRODUCT_DOCTOR_VARIANT_PAGES} pages while loading Product Doctor variants`,
      );
    }

    const variables: ProductDoctorVariantsQueryVariables = {
      id: productId,
      first: PAGE_SIZE,
      after: after ?? null,
    };
    const result = await apolloClient.query<ProductDoctorVariantsQuery>({
      query: ProductDoctorVariantsDocument,
      variables,
      fetchPolicy: "network-only",
    });

    if (result.error) {
      throw new ProductDoctorVariantsFetchError(result.error.message);
    }

    const product = result.data?.product;

    if (!product) {
      throw new ProductDoctorVariantsFetchError(
        "Product not found while loading Product Doctor variants",
      );
    }

    const connection = product.productVariants;
    const page = mapEdgesToItems(connection) ?? [];

    if (totalCount === null) {
      totalCount = connection?.totalCount ?? null;
    }

    collected.push(...page);
    pagesFetched += 1;
    hasNextPage = connection?.pageInfo.hasNextPage ?? false;

    const nextAfter = connection?.pageInfo.endCursor;

    if (hasNextPage) {
      if (!nextAfter || nextAfter === after) {
        throw new ProductDoctorVariantsFetchError(
          "Pagination cursor did not advance while loading Product Doctor variants",
        );
      }

      if (page.length === 0) {
        throw new ProductDoctorVariantsFetchError(
          "Empty page returned while more Product Doctor variants were expected",
        );
      }
    }

    after = nextAfter;
  }

  return {
    variants: collected,
    totalCount: totalCount ?? collected.length,
  };
}
