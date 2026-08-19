import { useApolloClient } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  fetchProductDoctorVariants,
  type ProductDoctorVariant,
  ProductDoctorVariantsFetchError,
} from "../fetchProductDoctorVariants";

interface UseProductDoctorVariantsProps {
  productId: string;
  skip?: boolean;
}

interface UseProductDoctorVariantsResult {
  variants: ProductDoctorVariant[];
  totalCount: number | null;
  loading: boolean;
  error: Error | null;
  /** True only after a successful full walk. */
  complete: boolean;
  refetch: () => Promise<void>;
}

export const useProductDoctorVariants = ({
  productId,
  skip = false,
}: UseProductDoctorVariantsProps): UseProductDoctorVariantsResult => {
  const apolloClient = useApolloClient();
  const [variants, setVariants] = useState<ProductDoctorVariant[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(!skip && Boolean(productId));
  const [error, setError] = useState<Error | null>(null);
  const [complete, setComplete] = useState(false);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    if (skip || !productId) {
      setVariants([]);
      setTotalCount(null);
      setLoading(false);
      setError(null);
      setComplete(false);

      return;
    }

    const requestId = requestIdRef.current + 1;

    requestIdRef.current = requestId;
    setLoading(true);
    setError(null);
    setComplete(false);

    try {
      const result = await fetchProductDoctorVariants(apolloClient, productId);

      if (requestIdRef.current !== requestId) {
        return;
      }

      setVariants(result.variants);
      setTotalCount(result.totalCount);
      setComplete(true);
    } catch (err) {
      if (requestIdRef.current !== requestId) {
        return;
      }

      const nextError =
        err instanceof ProductDoctorVariantsFetchError
          ? err
          : new ProductDoctorVariantsFetchError(
              err instanceof Error ? err.message : "Failed to load Product Doctor variants",
            );

      setVariants([]);
      setTotalCount(null);
      setComplete(false);
      setError(nextError);
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [apolloClient, productId, skip]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    variants,
    totalCount,
    loading,
    error,
    complete,
    refetch: load,
  };
};
