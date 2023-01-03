import { GetV2SaleorAppsResponse } from "@saleor/new-apps/marketplace.types";
import { useEffect, useReducer, useRef } from "react";

interface State {
  data?: GetV2SaleorAppsResponse.SaleorApp[];
  error?: Error;
}

interface Cache {
  [url: string]: GetV2SaleorAppsResponse.SaleorApp[];
}

// discriminated union type
type Action =
  | { type: "loading" }
  | { type: "fetched"; payload: GetV2SaleorAppsResponse.SaleorApp[] }
  | { type: "error"; payload: Error };

/**
 * Hook used to fetch apps list available under given marketplace url.
 * @param marketplaceUrl - url from which fetch data with apps list
 * @returns state object containing data with apps list or fetch error
 */
function useMarketplaceApps(marketplaceUrl?: string): State {
  const cache = useRef<Cache>({});

  // Used to prevent state update if the component is unmounted
  const cancelRequest = useRef<boolean>(false);

  const initialState: State = {
    error: undefined,
    data: undefined,
  };

  // Keep state logic separated
  const fetchReducer = (state: State, action: Action): State => {
    switch (action.type) {
      case "loading":
        return { ...initialState };
      case "fetched":
        return {
          ...initialState,
          data: action.payload,
          error: undefined,
        };
      case "error":
        return { ...initialState, error: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    // Do nothing if the url is not given
    if (!marketplaceUrl) {
      return;
    }

    cancelRequest.current = false;

    const fetchData = async () => {
      dispatch({ type: "loading" });

      // If a cache exists for this url, return it
      if (cache.current[marketplaceUrl]) {
        dispatch({ type: "fetched", payload: cache.current[marketplaceUrl] });
        return;
      }

      try {
        const response = await fetch(marketplaceUrl);
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = (await response.json()) as GetV2SaleorAppsResponse.SaleorApp[];
        cache.current[marketplaceUrl] = data;
        if (cancelRequest.current) {
          return;
        }

        dispatch({ type: "fetched", payload: data });
      } catch (error) {
        if (cancelRequest.current) {
          return;
        }

        dispatch({ type: "error", payload: error as Error });
      }
    };

    void fetchData();

    // Use the cleanup function for avoiding a possibly...
    // ...state update after the component was unmounted
    return () => {
      cancelRequest.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketplaceUrl]);

  return state;
}

export default useMarketplaceApps;
