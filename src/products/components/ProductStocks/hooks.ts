import { useState } from "react";
import { ZodError } from "zod";

import { SKU_ERROR_MESSAGE } from "./constants";
import { containsDot, parseSkuSchema } from "./tools";

export const useValidateSku = () => {
  const [error, setError] = useState<string | null>(null);

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

  const handleValidateSku = (skuValue: string) => {
    try {
      if (containsDot(skuValue)) {
        throw new Error(SKU_ERROR_MESSAGE.invalidType);
      }

      const result = parseSkuSchema(skuValue);

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
