import { ProductVariantDetailsQuery } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { productVariantEditUrl } from "@dashboard/products/urls";
import { useEffect } from "react";

/** Silently replace URL when user visits productVariant redirect URL
 * This prevent us from fetching data two times:
 * 1) to get productVariant.product.id -> in order to generate correct URL
 * 2) to display data in ProductVariant details page */
export const useHandleProductVariantSilentRedirect = ({
  data,
  urlVariantId,
  urlProductId,
}: {
  data: ProductVariantDetailsQuery;
  urlVariantId: string;
  urlProductId: string | undefined;
}) => {
  const navigate = useNavigator();

  useEffect(() => {
    /** urlProductId is defined when user opens regular productVariant URL:
     * `/product/123/variant/456/`
     * it is undefined when user opens productVariant redirect URL:
     * `/product/variant/456/ */
    if (data?.productVariant?.product?.id && !urlProductId) {
      const productId = data.productVariant.product.id;

      // Use window.history.replaceState for silent URL replacement
      // This doesn't trigger a re-render or data refetch
      window.history.replaceState(null, "", productVariantEditUrl(productId, urlVariantId));
    }
  }, [data, urlVariantId, urlProductId]);
};
