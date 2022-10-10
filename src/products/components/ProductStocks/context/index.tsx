/* eslint-disable @typescript-eslint/no-empty-function */
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

import { initialState, reducer, State } from "./reducer";

interface ProductSkuProviderProps {
  children: React.ReactNode;
}

type ProductSkuContextProps = State & {
  setLoading: (isLoading: boolean) => void;
  setValidity: (isValid: boolean) => void;
};

const ProductSkuContext = createContext<ProductSkuContextProps>({
  ...initialState,
  setLoading: () => {},
  setValidity: () => {},
});

export const ProductSkuProvider = ({ children }: ProductSkuProviderProps) => {
  const [{ isLoading, isValid }, dispatch] = useReducer(reducer, initialState);

  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: "sku/isLoading", payload: isLoading });
  }, []);

  const setValidity = useCallback((isValid: boolean) => {
    dispatch({ type: "sku/isValid", payload: isValid });
  }, []);

  const memoizedValue = useMemo<ProductSkuContextProps>(
    () => ({ isLoading, isValid, setLoading, setValidity }),
    [isLoading, isValid, setLoading, setValidity],
  );

  return (
    <ProductSkuContext.Provider value={memoizedValue}>
      {children}
    </ProductSkuContext.Provider>
  );
};

export const useSku = () => {
  const context = useContext(ProductSkuContext);

  if (!context) {
    throw new Error("useSku must be used within a ProductSkuProvider");
  }

  return context;
};
