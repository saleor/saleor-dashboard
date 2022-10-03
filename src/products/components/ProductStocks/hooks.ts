import { useJutroDoctorClient } from "@saleor/graphql/client";
import { useValidateSkuLazyQuery } from "@saleor/graphql/saleorDashboard";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { ZodError } from "zod";

import { ONE_SECOND, SKU_ERROR_MESSAGE } from "./constants";
import { useSku } from "./context";
import { containsDot, parseSkuSchema } from "./tools";

export const useValidateSku = () => {
  const [error, setError] = useState<string | null>(null);
  const { setLoading, setValidity } = useSku();
  const { client } = useJutroDoctorClient();

  const [
    validateSku,
    { error: apiError, called: apiCalled, loading: apiLoading, data: apiData },
  ] = useValidateSkuLazyQuery({
    client,
  });

  useEffect(() => {
    if (!apiCalled || !apiError) {
      return;
    }

    setValidity(false);
    setError(SKU_ERROR_MESSAGE.sthWentWrong);
  }, [apiCalled, apiError, setValidity]);

  useEffect(() => {
    if (apiCalled && !apiLoading) {
      setLoading(false);

      return;
    }

    if (apiCalled && apiLoading) {
      setLoading(true);
    }
  }, [apiCalled, apiLoading, setLoading]);

  useEffect(() => {
    if (apiCalled && apiData?.validateSku && !apiLoading) {
      setValidity(true);
      setError(null);

      return;
    }

    if (apiCalled && !apiData?.validateSku && !apiLoading) {
      setValidity(false);
      setError(SKU_ERROR_MESSAGE.skuIsInvalid);
    }
  }, [apiCalled, apiData, apiLoading, setValidity]);

  const debouncedValidateSku = useCallback(
    debounce((skuValue: string) => {
      setLoading(false);

      validateSku({
        variables: {
          sku: skuValue,
        },
      });
    }, ONE_SECOND),
    [],
  );

  const handleValidateSku = async (skuValue: string) => {
    try {
      if (containsDot(skuValue)) {
        throw new Error(SKU_ERROR_MESSAGE.invalidType);
      }

      parseSkuSchema(skuValue);

      setLoading(true);

      debouncedValidateSku(skuValue);

      setError(null);
    } catch (error) {
      setLoading(false);

      if (error instanceof ZodError) {
        setError(error.errors[0].message);

        return;
      }

      setError(error.message);
    }
  };

  return { error, handleValidateSku };
};
