import {
  AttributeEntityTypeEnum,
  useProductReferenceListDetailsQuery,
  useVariantReferenceListDetailsQuery,
} from "@dashboard/graphql";
import { useMemo } from "react";

import { type ReferenceListValue } from "./referenceValueAppearance";
import { stabilizeReferenceIds } from "./stabilizeReferenceIds";

export interface ProductReferenceDetails {
  id: string;
  categoryName?: string | null;
  productTypeName?: string | null;
  thumbnailUrl?: string | null;
  productName?: string | null;
  variantName?: string | null;
}

const DETAILS_PAGE_SIZE = 100;

export const mapProductReferenceDetails = (
  data:
    | {
        products?: {
          edges: Array<{
            node: {
              id: string;
              thumbnail?: { url?: string | null } | null;
              category?: { name?: string | null } | null;
              productType?: { name?: string | null } | null;
            };
          }>;
        } | null;
      }
    | undefined,
): Map<string, ProductReferenceDetails> =>
  new Map(
    (data?.products?.edges ?? []).map(({ node }) => [
      node.id,
      {
        id: node.id,
        categoryName: node.category?.name,
        productTypeName: node.productType?.name,
        thumbnailUrl: node.thumbnail?.url,
      } satisfies ProductReferenceDetails,
    ]),
  );

export const mapVariantReferenceDetails = (
  data:
    | {
        productVariants?: {
          edges: Array<{
            node: {
              id: string;
              name: string;
              product?: {
                name?: string | null;
                thumbnail?: { url?: string | null } | null;
              } | null;
            };
          }>;
        } | null;
      }
    | undefined,
): Map<string, ProductReferenceDetails> =>
  new Map(
    (data?.productVariants?.edges ?? []).map(({ node }) => [
      node.id,
      {
        id: node.id,
        variantName: node.name,
        productName: node.product?.name,
        thumbnailUrl: node.product?.thumbnail?.url,
      } satisfies ProductReferenceDetails,
    ]),
  );

export const mergeReferenceDetails = (
  values: ReferenceListValue[],
  details: Map<string, ProductReferenceDetails>,
): ReferenceListValue[] => {
  if (details.size === 0) {
    return values;
  }

  return values.map(value => {
    const detail = details.get(value.value);

    if (!detail) {
      return value;
    }

    return {
      ...value,
      label: detail.variantName ?? value.label,
      caption: detail.productName ?? value.caption,
      thumbnailUrl: value.thumbnailUrl ?? detail.thumbnailUrl ?? undefined,
    };
  });
};

export const useProductReferenceDetails = ({
  ids,
  entityType,
  skip: skipProp = false,
}: {
  ids: string[];
  entityType?: AttributeEntityTypeEnum | null;
  skip?: boolean;
}): Map<string, ProductReferenceDetails> => {
  const detailIds = stabilizeReferenceIds(ids, DETAILS_PAGE_SIZE);
  const skipEmpty = skipProp || detailIds.length === 0;
  const { data: productData } = useProductReferenceListDetailsQuery({
    variables: { ids: detailIds, first: Math.max(detailIds.length, 1) },
    skip: skipEmpty || entityType !== AttributeEntityTypeEnum.PRODUCT,
  });
  const { data: variantData } = useVariantReferenceListDetailsQuery({
    variables: { ids: detailIds, first: Math.max(detailIds.length, 1) },
    skip: skipEmpty || entityType !== AttributeEntityTypeEnum.PRODUCT_VARIANT,
  });

  return useMemo(() => {
    if (entityType === AttributeEntityTypeEnum.PRODUCT_VARIANT) {
      return mapVariantReferenceDetails(variantData);
    }

    return mapProductReferenceDetails(productData);
  }, [entityType, productData, variantData]);
};
