import { ExtensionsGroups } from "@dashboard/extensions/types";
import { useEffect, useRef, useState } from "react";

export const useAppStoreExtensions = (appStoreUrl: string) => {
  const cache = useRef(new Map<string, ExtensionsGroups>());

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExtensionsGroups>({
    payment: [],
    cms: [],
    taxes: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (cache.current.has(appStoreUrl)) {
        return {
          data: cache.current.get(appStoreUrl),
          loading: false,
          error: null,
        };
      }

      try {
        setLoading(true);

        const response = await fetch(appStoreUrl);

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();

        cache.current.set(appStoreUrl, data);

        setData(data.extensions);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appStoreUrl]);

  return {
    error,
    loading,
    data,
  };
};
