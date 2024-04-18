import { AppstoreApi } from "@dashboard/apps/appstore.types";
import { useEffect, useReducer, useRef } from "react";

interface State {
  data?: AppstoreApi.SaleorApp[];
  error?: Error;
}

type Cache = Record<string, AppstoreApi.SaleorApp[]>;

// discriminated union type
type Action =
  | { type: "loading" }
  | { type: "fetched"; payload: AppstoreApi.SaleorApp[] }
  | { type: "error"; payload: Error };

function useAppstoreApps(appstoreUrl?: string): State {
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
    if (!appstoreUrl) {
      return;
    }

    cancelRequest.current = false;

    const fetchData = async () => {
      dispatch({ type: "loading" });

      // If a cache exists for this url, return it
      if (cache.current[appstoreUrl]) {
        dispatch({ type: "fetched", payload: cache.current[appstoreUrl] });
        return;
      }

      try {
        const response = await fetch(appstoreUrl);
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = (await response.json()) as AppstoreApi.SaleorApp[];
        cache.current[appstoreUrl] = data;
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
  }, [appstoreUrl]);

  return state;
}

export default useAppstoreApps;
