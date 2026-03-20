import { useApolloClient } from "@apollo/client";
import { ProductListAttributeDocument, type ProductListAttributeQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useCallback, useEffect, useRef, useState } from "react";

type ProductNode = NonNullable<ProductListAttributeQuery["products"]>["edges"][number]["node"];
type AssignedAttribute = NonNullable<ProductNode["assignedAttribute"]>;

interface AttributeSlug {
  id: string;
  slug: string;
}

interface UseProductListAttributesOpts {
  productIds: string[];
  visibleAttributeSlugs: AttributeSlug[];
}

export function useProductListAttributes({
  productIds,
  visibleAttributeSlugs,
}: UseProductListAttributesOpts) {
  const client = useApolloClient();
  // Map<productId, Map<attributeId, AssignedAttribute>>
  const [attributeMap, setAttributeMap] = useState(
    new Map<string, Map<string, AssignedAttribute>>(),
  );
  const [loading, setLoading] = useState(false);
  const activeKeyRef = useRef("");

  useEffect(() => {
    if (visibleAttributeSlugs.length === 0 || productIds.length === 0) {
      return;
    }

    const key = `${productIds.join(",")}_${visibleAttributeSlugs.map(a => a.slug).join(",")}`;

    if (key === activeKeyRef.current) {
      return;
    }

    activeKeyRef.current = key;

    setLoading(true);

    // Fire one query per visible attribute slug (in parallel)
    Promise.all(
      visibleAttributeSlugs.map(attr =>
        client
          .query<ProductListAttributeQuery>({
            query: ProductListAttributeDocument,
            variables: { ids: productIds, slug: attr.slug },
          })
          .then(result => ({
            attributeId: attr.id,
            products: mapEdgesToItems(result.data?.products) ?? [],
          })),
      ),
    )
      .then(results => {
        // Only apply results if this is still the active request
        if (key !== activeKeyRef.current) return;

        const map = new Map<string, Map<string, AssignedAttribute>>();

        for (const { attributeId, products } of results) {
          for (const product of products) {
            if (!map.has(product.id)) {
              map.set(product.id, new Map());
            }

            if (product.assignedAttribute) {
              map.get(product.id)!.set(attributeId, product.assignedAttribute);
            }
          }
        }

        setAttributeMap(map);
        setLoading(false);
      })
      .catch(() => {
        if (key !== activeKeyRef.current) return;

        setLoading(false);
      });
  }, [productIds, visibleAttributeSlugs, client]);

  const getAssignedAttribute = useCallback(
    (productId: string, attributeId: string) => {
      return attributeMap.get(productId)?.get(attributeId);
    },
    [attributeMap],
  );

  return { getAssignedAttribute, attributesLoading: loading };
}
