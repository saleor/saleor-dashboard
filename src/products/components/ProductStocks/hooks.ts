import { useValidateSkuLazyQuery } from "@saleor/graphql/saleorDashboard";
import debounce from "lodash/debounce";
import { useCallback, useState } from "react";
import { ZodError } from "zod";

import { SKU_ERROR_MESSAGE } from "./constants";
import { useSku } from "./context";
import { containsDot, parseSkuSchema } from "./tools";

export const useValidateSku = () => {
  const [error, setError] = useState<string | null>(null);
  const { setLoading, setValidity } = useSku();

  const [validateSku] = useValidateSkuLazyQuery();

  const isSkuValid = (skuValue: string) => {
    try {
      if (containsDot(skuValue)) {
        throw new Error();
      }

      parseSkuSchema(skuValue);

      return true;
    } catch {
      return false;
    }
  };

  const debouncedValidateSku = useCallback(
    debounce(async (skuValue: string) => {
      try {
        setLoading(true);

        const { error: apiError, data } = (await validateSku({
          variables: {
            sku: skuValue,
          },
        })) as any;

        setLoading(false);

        if (apiError) {
          setValidity(false);
          setError(SKU_ERROR_MESSAGE.sthWentWrong);

          return;
        }

        if (!data.validateSku) {
          setValidity(false);
          setError(SKU_ERROR_MESSAGE.skuIsInvalid);

          return;
        }

        setValidity(true);
        setError(null);
      } catch {
        setValidity(false);
        setError(SKU_ERROR_MESSAGE.sthWentWrong);
      }
    }, 1000),
    [],
  );

  const handleValidateSku = async (skuValue: string) => {
    try {
      if (containsDot(skuValue)) {
        throw new Error(SKU_ERROR_MESSAGE.invalidType);
      }

      const result = parseSkuSchema(skuValue);

      debouncedValidateSku(skuValue);

      setError(null);

      return result;
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.errors[0].message);

        return;
      }

      setError(error.message);
    }
  };

  return { error, handleValidateSku, isSkuValid };
};
